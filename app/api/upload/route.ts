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

    // 5. Generate secure random filename
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

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
