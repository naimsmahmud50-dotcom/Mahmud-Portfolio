import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const isAuthed = await verifyAdmin(req);
  if (!isAuthed) {
    return NextResponse.json(
      { success: false, authenticated: false, error: "Unauthorized session" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    user: {
      role: "admin",
      name: "Mahmud Hasan",
    },
  });
}
