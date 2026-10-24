import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { skillSchema } from "@/lib/validations/models";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const skills = await prisma.skill.findMany({
      where: category ? { category } : undefined,
      orderBy: { order: "asc" },
    });

    return NextResponse.json({ success: true, count: skills.length, data: skills });
  } catch (error) {
    console.error("[Skills API GET Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch skills" },
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
    const validated = skillSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const created = await prisma.skill.create({
      data: validated.data,
    });

    try {
      revalidateTag("skills");
      revalidatePath("/about");
    } catch {}

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error("[Skills API POST Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create skill" },
      { status: 500 }
    );
  }
}
