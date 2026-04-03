import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { ownerId, petId, date, reason, notes, status } = body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ownerId,
        petId,
        date: new Date(date),
        reason,
        notes: notes || null,
        status: status || undefined,
      },
      include: {
        pet: true,
        owner: true,
      }
    });

    return NextResponse.json({ appointment });
  } catch (error) {
    console.error("[PUT /api/admin/appointments/[id]]", error);
    return NextResponse.json(
      { error: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.appointment.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("[DELETE /api/admin/appointments/[id]]", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
