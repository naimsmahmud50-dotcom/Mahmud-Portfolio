import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { experienceSchema } from "@/lib/validations/models";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { order: "asc" },
    });

    const formatted = experiences.map((exp) => ({
      ...exp,
      technologies: JSON.parse(exp.technologies || "[]"),
    }));

    return NextResponse.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error("[Experiences API GET Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch experience timeline" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const isAuthed = await verifyAdmin(req);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = experienceSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const created = await prisma.experience.create({
      data: validated.data,
    });

    try {
      revalidateTag("experiences");
      revalidatePath("/about");
    } catch {}

    return NextResponse.json(
      {
        success: true,
        data: {
          ...created,
          technologies: JSON.parse(created.technologies),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Experiences API POST Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create experience entry" },
      { status: 500 }
    );
  }
}
