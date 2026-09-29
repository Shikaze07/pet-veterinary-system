import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { ownerId, petId, date, reason, notes, status } = body;

    if (ownerId && date && status !== "CANCELLED") {
      const appointmentDate = new Date(date);
      const startOfDay = new Date(appointmentDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(appointmentDate);
      endOfDay.setHours(23, 59, 59, 999);

      const existingAppointment = await prisma.appointment.findFirst({
        where: {
          id: { not: id },
          ownerId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: {
            not: "CANCELLED",
          },
        },
      });

      if (existingAppointment) {
        return NextResponse.json(
          { error: "This user already has an appointment scheduled on this date." },
          { status: 400 }
        );
      }
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        ownerId,
        petId,
        date: date ? new Date(date) : undefined,
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
