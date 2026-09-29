import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);
    const search = searchParams.get("search") ?? "";
    const ownerId = searchParams.get("ownerId") ?? "";
    const petId = searchParams.get("petId") ?? "";
    const skip = (page - 1) * pageSize;

    const where = {
      ...(search ? {
        OR: [
          { vaccineName: { contains: search } },
          { pet: { name: { contains: search } } },
        ]
      } : {}),
      ...(petId ? { petId } : (ownerId ? { pet: { ownerId } } : {}))
    };

    const [vaccinations, total] = await Promise.all([
      prisma.vaccination.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          pet: {
            include: {
              owner: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                }
              }
            }
          }
        },
        orderBy: { dateGiven: "desc" },
      }),
      prisma.vaccination.count({ where }),
    ]);

    return NextResponse.json({ vaccinations, total, page, pageSize });
  } catch (error) {
    console.error("[GET /api/admin/vaccinations]", error);
    return NextResponse.json(
      { error: "Failed to fetch vaccinations" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { petId, vaccineName, dateGiven, nextDue, notes } = body;

    if (!petId || !vaccineName || !dateGiven) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const vaccination = await prisma.vaccination.create({
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
            owner: true
          }
        }
      }
    });

    return NextResponse.json({ vaccination }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/vaccinations]", error);
    return NextResponse.json(
      { error: "Failed to record vaccination" },
      { status: 500 }
    );
  }
}
