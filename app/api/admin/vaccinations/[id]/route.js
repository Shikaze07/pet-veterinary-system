import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { petId, vaccineName, dateGiven, nextDue, notes } = body;

    const vaccination = await prisma.vaccination.update({
      where: { id },
      data: {
        petId,
        vaccineName,
        dateGiven: new Date(dateGiven),
        nextDue: nextDue ? new Date(nextDue) : null,
        notes: notes || null,
      },
      include: {
        pet: {
          include: {
            owner: true,
          }
        }
      }
    });

    return NextResponse.json({ vaccination });
  } catch (error) {
    console.error("[PUT /api/admin/vaccinations/[id]]", error);
    return NextResponse.json(
      { error: "Failed to update vaccination" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.vaccination.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Vaccination deleted successfully" });
  } catch (error) {
    console.error("[DELETE /api/admin/vaccinations/[id]]", error);
    return NextResponse.json(
      { error: "Failed to delete vaccination" },
      { status: 500 }
    );
  }
}
