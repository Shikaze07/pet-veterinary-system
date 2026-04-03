import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);
    const search = searchParams.get("search") ?? "";
    const filter = searchParams.get("filter") ?? ""; // e.g. "today"
    const skip = (page - 1) * pageSize;

    let where = search 
      ? {
          OR: [
            { reason: { contains: search } },
            { pet: { name: { contains: search } } },
            { owner: { firstName: { contains: search } } },
            { owner: { lastName: { contains: search } } },
          ]
        }
      : {};

    if (filter === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      where = {
        ...where,
        date: {
          gte: today,
          lt: tomorrow,
        }
      };
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          pet: true,
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            }
          }
        },
        orderBy: { date: "asc" },
      }),
      prisma.appointment.count({ where }),
    ]);

    return NextResponse.json({ appointments, total, page, pageSize });
  } catch (error) {
    console.error("[GET /api/admin/appointments]", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { ownerId, petId, date, reason, notes } = body;

    if (!ownerId || !petId || !date || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        ownerId,
        petId,
        date: new Date(date),
        reason,
        notes: notes || null,
        status: "PENDING",
      },
      include: {
        pet: true,
        owner: true,
      }
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/appointments]", error);
    return NextResponse.json(
      { error: "Failed to schedule appointment" },
      { status: 500 }
    );
  }
}
