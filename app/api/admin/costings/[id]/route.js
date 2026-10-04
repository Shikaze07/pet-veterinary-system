import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const costing = await prisma.costing.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!costing) {
      return NextResponse.json({ error: "Costing record not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      // Restore medication stock if applicable
      for (const item of costing.items) {
        if (item.medicationId) {
          await tx.medication.update({
            where: { id: item.medicationId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      await tx.costing.delete({ where: { id } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/costings/[id]]", error);
    return NextResponse.json({ error: "Failed to delete costing" }, { status: 500 });
  }
}
