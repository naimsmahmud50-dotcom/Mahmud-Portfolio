import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { aboutSchema } from "@/lib/validations/models";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const about = await prisma.about.findUnique({
      where: { id: "default" },
    });
    return NextResponse.json({ success: true, data: about });
  } catch (error) {
    console.error("[About API GET Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch about content" },
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
    const validated = aboutSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const updated = await prisma.about.upsert({
      where: { id: "default" },
      update: validated.data,
      create: { id: "default", ...validated.data },
    });

    try {
      revalidateTag("about");
      revalidatePath("/");
      revalidatePath("/about");
    } catch {}

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[About API PUT Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update about content" },
      { status: 500 }
    );
  }
}
