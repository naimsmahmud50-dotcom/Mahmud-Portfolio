import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { heroSchema } from "@/lib/validations/models";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const hero = await prisma.hero.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json({ success: true, data: hero });
  } catch (error) {
    console.error("[Hero API GET Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hero content" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const isAuthed = await verifyAdmin(req);
    if (!isAuthed) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validated = heroSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.hero.upsert({
      where: { id: "default" },
      update: validated.data,
      create: { id: "default", ...validated.data },
    });

    try {
      revalidateTag("hero");
      revalidatePath("/");
    } catch {}

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[Hero API PUT Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update hero content" },
      { status: 500 }
    );
  }
}
