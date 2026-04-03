import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);
    const search = searchParams.get("search") ?? "";
    const skip = (page - 1) * pageSize;

    const where = {
      role: "OWNER",
      ...(search ? {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ]
      } : {})
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          email: true,
          phone: true,
          address: true,
          role: true,
          createdAt: true,
          pets: {
            select: {
              id: true,
              name: true,
              species: true,
            }
          }
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({ owners: users, total, page, pageSize });
  } catch (error) {
    console.error("[GET /api/admin/owners]", error);
    return NextResponse.json(
      { error: "Failed to fetch owners" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, middleName, lastName, email, password, phone, address } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for existing email
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists." },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        middleName: middleName || null,
        lastName,
        email,
        password: hashed,
        phone: phone || null,
        address: address || null,
        role: "OWNER",
      },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ owner: user }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/owners]", error);
    return NextResponse.json(
      { error: "Failed to create owner" },
      { status: 500 }
    );
  }
}
