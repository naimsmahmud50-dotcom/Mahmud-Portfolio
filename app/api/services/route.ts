import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { serviceSchema } from "@/lib/validations/models";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    });

    const formatted = services.map((s) => ({
      ...s,
      deliverables: JSON.parse(s.deliverables || "[]"),
    }));

    return NextResponse.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error("[Services API GET Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
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
    const validated = serviceSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const created = await prisma.service.create({
      data: validated.data,
    });

    try {
      revalidateTag("services");
      revalidatePath("/services");
      revalidatePath("/");
    } catch {}

    return NextResponse.json(
      {
        success: true,
        data: {
          ...created,
          deliverables: JSON.parse(created.deliverables),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Services API POST Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create service" },
      { status: 500 }
    );
  }
}
