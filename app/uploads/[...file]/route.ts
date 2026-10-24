import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const MIME_LOOKUP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
};

export async function GET(
  _req: Request,
  { params }: { params: { file: string[] } }
) {
  try {
    const rawPath = Array.isArray(params.file) ? params.file.join("/") : params.file;
    // Security: Prevent path traversal attacks
    const cleanFileName = path.basename(rawPath);
    const filePath = path.join(process.cwd(), "public", "uploads", cleanFileName);

    const fileBuffer = await readFile(filePath);
    const ext = path.extname(cleanFileName).toLowerCase();
    const contentType = MIME_LOOKUP[ext] || "application/octet-stream";

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
