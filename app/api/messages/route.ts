import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const isAuthed = await verifyAdmin(req);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const messages = await prisma.contactMessage.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: messages.length,
      unreadCount: messages.filter((m) => m.status === "unread").length,
      data: messages,
    });
  } catch (error) {
    console.error("[Messages API GET Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contact inquiries" },
      { status: 500 }
    );
  }
}
