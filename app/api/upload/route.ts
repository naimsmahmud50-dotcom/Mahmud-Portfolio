import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: Request) {
  try {
    // 1. Authenticate admin
    const isAuthed = await verifyAdmin(req);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    // 2. Parse form data
    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json(
        { success: false, error: "Invalid multipart form data" },
        { status: 400 }
      );
    }

    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No file provided in form data ('file' field required)" },
        { status: 400 }
      );
    }

    // 3. Validate size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the 5MB limit (${(file.size / 1024 / 1024).toFixed(2)} MB uploaded)`,
        },
        { status: 400 }
      );
    }

    // 4. Validate MIME type
    const mimeType = file.type.toLowerCase();
    const standardExt = ALLOWED_MIME_TYPES[mimeType];

    if (!standardExt) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type: ${mimeType}. Allowed formats: JPG, PNG, WebP, SVG, AVIF, GIF.`,
        },
        { status: 400 }
      );
    }

    // 5. Generate secure random filename and inspect magic bytes
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cryptographic & Format Magic Byte Verification
    let isValidContent = false;
    if (mimeType === "image/jpeg") {
      isValidContent = buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    } else if (mimeType === "image/png") {
      isValidContent = buffer.length > 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    } else if (mimeType === "image/gif") {
      isValidContent = buffer.length > 3 && buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;
    } else if (mimeType === "image/webp") {
      isValidContent = buffer.length >= 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP";
    } else if (mimeType === "image/avif") {
      isValidContent = buffer.length >= 12 && buffer.subarray(4, 8).toString("ascii") === "ftyp";
    } else if (mimeType === "image/svg+xml") {
      const svgText = buffer.toString("utf-8");
      const dangerousPatterns = /<script|onload|onerror|onclick|onmouseover|javascript:|<foreignObject|<iframe|<embed/i;
      isValidContent = !dangerousPatterns.test(svgText);
    }

    if (!isValidContent) {
      return NextResponse.json(
        {
          success: false,
          error: "Malicious or invalid image payload detected. File content does not match permitted image structure.",
        },
        { status: 400 }
      );
    }

    const safeUniqueName = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}${standardExt}`;
    const cleanFileName = path.basename(safeUniqueName);

    // 6. Write file to public/uploads
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, cleanFileName);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${cleanFileName}`;

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        filename: cleanFileName,
        size: file.size,
        mimeType,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Upload API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process file upload" },
      { status: 500 }
    );
  }
}
