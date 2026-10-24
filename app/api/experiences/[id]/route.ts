import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { experienceSchema } from "@/lib/validations/models";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(
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
    const validated = experienceSchema.partial().safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.experience.update({
      where: { id: params.id },
      data: validated.data,
    });

    try {
      revalidateTag("experiences");
      revalidatePath("/about");
    } catch {}

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        technologies: JSON.parse(updated.technologies || "[]"),
      },
    });
  } catch (error) {
    console.error("[Experience API PUT Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update experience" },
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

    await prisma.experience.delete({
      where: { id: params.id },
    });

    try {
      revalidateTag("experiences");
      revalidatePath("/about");
    } catch {}

    return NextResponse.json({ success: true, message: "Experience deleted" });
  } catch (error) {
    console.error("[Experience API DELETE Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete experience" },
      { status: 500 }
    );
  }
}
