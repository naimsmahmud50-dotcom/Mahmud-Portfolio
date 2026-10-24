import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validations/models";
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
    const validated = testimonialSchema.partial().safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.testimonial.update({
      where: { id: params.id },
      data: validated.data,
    });

    try {
      revalidateTag("testimonials");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Testimonial API PUT Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update testimonial" },
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

    await prisma.testimonial.delete({
      where: { id: params.id },
    });

    try {
      revalidateTag("testimonials");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true, message: "Testimonial deleted" });
  } catch (error) {
    console.error("[Testimonial API DELETE Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
