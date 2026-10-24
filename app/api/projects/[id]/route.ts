import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { projectSchema } from "@/lib/validations/models";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...project,
        stack: JSON.parse(project.stack || "[]"),
        highlights: JSON.parse(project.highlights || "[]"),
      },
    });
  } catch (error) {
    console.error("[Project API GET Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

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
    const validated = projectSchema.partial().safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.project.update({
      where: { id: params.id },
      data: validated.data,
    });

    try {
      revalidateTag("projects");
      revalidatePath("/work");
      revalidatePath(`/work/${updated.slug}`);
      revalidatePath("/");
    } catch {}

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        stack: JSON.parse(updated.stack || "[]"),
        highlights: JSON.parse(updated.highlights || "[]"),
      },
    });
  } catch (error) {
    console.error("[Project API PUT Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
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

    await prisma.project.delete({
      where: { id: params.id },
    });

    try {
      revalidateTag("projects");
      revalidatePath("/work");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.error("[Project API DELETE Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
