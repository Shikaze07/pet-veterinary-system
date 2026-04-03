import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { petId, symptoms, diagnosis, treatment, cost, date } = body;

    const consultation = await prisma.consultation.update({
      where: { id },
      data: {
        petId,
        symptoms,
        diagnosis,
        treatment,
        cost: parseFloat(cost),
        date: date ? new Date(date) : undefined,
      },
      include: {
        pet: {
          include: {
            owner: true,
          }
        }
      }
    });

    return NextResponse.json({ consultation });
  } catch (error) {
    console.error("[PUT /api/admin/consultations/[id]]", error);
    return NextResponse.json(
      { error: "Failed to update consultation" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.consultation.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Consultation deleted successfully" });
  } catch (error) {
    console.error("[DELETE /api/admin/consultations/[id]]", error);
    return NextResponse.json(
      { error: "Failed to delete consultation" },
      { status: 500 }
    );
  }
}
