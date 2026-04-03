import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") ?? "10", 10);
    const search = searchParams.get("search") ?? "";
    const skip = (page - 1) * pageSize;

    const where = search 
      ? {
          OR: [
            { name: { contains: search } },
            { brand: { contains: search } },
            { category: { contains: search } },
          ]
        }
      : {};

    const [medications, total] = await Promise.all([
      prisma.medication.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { name: "asc" },
      }),
      prisma.medication.count({ where }),
    ]);

    return NextResponse.json({ medications, total, page, pageSize });
  } catch (error) {
    console.error("[GET /api/admin/medications]", error);
    return NextResponse.json(
      { error: "Failed to fetch medications" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, brand, category, stock, minStock, price } = body;

    if (!name || stock === undefined || minStock === undefined || price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const medication = await prisma.medication.create({
      data: {
        name,
        brand: brand || null,
        category: category || null,
        stock: parseInt(stock),
        minStock: parseInt(minStock),
        price: parseFloat(price),
      },
    });

    return NextResponse.json({ medication }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/medications]", error);
    return NextResponse.json(
      { error: "Failed to create medication" },
      { status: 500 }
    );
  }
}
