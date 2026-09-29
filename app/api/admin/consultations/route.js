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
          { symptoms: { contains: search } },
          { diagnosis: { contains: search } },
          { pet: { name: { contains: search } } },
        ]
      } : {}),
      ...(petId ? { petId } : (ownerId ? { pet: { ownerId } } : {}))
    };

    const [consultations, total] = await Promise.all([
      prisma.consultation.findMany({
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
        orderBy: { date: "desc" },
      }),
      prisma.consultation.count({ where }),
    ]);

    return NextResponse.json({ consultations, total, page, pageSize });
  } catch (error) {
    console.error("[GET /api/admin/consultations]", error);
    return NextResponse.json(
      { error: "Failed to fetch consultations" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { petId, symptoms, diagnosis, treatment, cost, date } = body;

    if (!petId || !symptoms || !diagnosis || cost === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const consultation = await prisma.consultation.create({
      data: {
        petId,
        symptoms,
        diagnosis,
        treatment,
        cost: parseFloat(cost),
        date: date ? new Date(date) : new Date(),
      },
      include: {
        pet: {
          include: {
            owner: true
          }
        }
      }
    });

    return NextResponse.json({ consultation }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/consultations]", error);
    return NextResponse.json(
      { error: "Failed to create consultation" },
      { status: 500 }
    );
  }
}
