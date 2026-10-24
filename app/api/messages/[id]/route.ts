import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { contactMessageStatusSchema } from "@/lib/validations/models";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const isAuthed = await verifyAdmin(req);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = contactMessageStatusSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Invalid status value", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.contactMessage.update({
      where: { id: params.id },
      data: { status: validated.data.status },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Message API PATCH Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update inquiry status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const isAuthed = await verifyAdmin(req);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    await prisma.contactMessage.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Inquiry deleted" });
  } catch (error) {
    console.error("[Message API DELETE Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
