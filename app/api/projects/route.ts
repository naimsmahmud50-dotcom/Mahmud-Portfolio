import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { projectSchema } from "@/lib/validations/models";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter");
    const featured = searchParams.get("featured");

    const where: { filterCategory?: string; featured?: boolean } = {};
    if (filter && filter !== "all") {
      where.filterCategory = filter;
    }
    if (featured === "true") {
      where.featured = true;
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: { order: "asc" },
    });

    // Format parsed JSON fields for client convenience
    const formatted = projects.map((p) => ({
      ...p,
      stack: JSON.parse(p.stack || "[]"),
      highlights: JSON.parse(p.highlights || "[]"),
    }));

    return NextResponse.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error("[Projects API GET Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
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
    const validated = projectSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const created = await prisma.project.create({
      data: validated.data,
    });

    try {
      revalidateTag("projects");
      revalidatePath("/work");
      revalidatePath("/");
    } catch {}

    return NextResponse.json(
      {
        success: true,
        data: {
          ...created,
          stack: JSON.parse(created.stack),
          highlights: JSON.parse(created.highlights),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Projects API POST Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}
