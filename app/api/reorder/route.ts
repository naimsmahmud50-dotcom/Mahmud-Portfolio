import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface ReorderItem {
  id: string;
  order: number;
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

    const body = await req.json().catch(() => ({}));
    const { model, items } = body as { model: string; items: ReorderItem[] };

    if (!model || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid payload. 'model' and non-empty 'items' array required." },
        { status: 400 }
      );
    }

    // Execute bulk order update in transaction
    await prisma.$transaction(
      items.map((item) => {
        switch (model) {
          case "project":
            return prisma.project.update({
              where: { id: item.id },
              data: { order: item.order },
            });
          case "skill":
            return prisma.skill.update({
              where: { id: item.id },
              data: { order: item.order },
            });
          case "service":
            return prisma.service.update({
              where: { id: item.id },
              data: { order: item.order },
            });
          case "testimonial":
            return prisma.testimonial.update({
              where: { id: item.id },
              data: { order: item.order },
            });
          case "experience":
            return prisma.experience.update({
              where: { id: item.id },
              data: { order: item.order },
            });
          default:
            throw new Error(`Unsupported model for reordering: ${model}`);
        }
      })
    );

    // Revalidate caches
    try {
      if (model === "project") {
        revalidateTag("projects");
        revalidatePath("/work");
        revalidatePath("/");
      } else if (model === "service") {
        revalidateTag("services");
        revalidatePath("/services");
        revalidatePath("/");
      } else if (model === "skill" || model === "experience") {
        revalidateTag("skills");
        revalidateTag("experiences");
        revalidatePath("/about");
      } else if (model === "testimonial") {
        revalidateTag("testimonials");
        revalidatePath("/");
      }
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Successfully reordered ${items.length} items for ${model}`,
    });
  } catch (error: unknown) {
    console.error("[Reorder API Error]:", error);
    const message = error instanceof Error ? error.message : "Failed to reorder items";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
