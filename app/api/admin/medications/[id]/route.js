import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, brand, category, stock, minStock, price } = body;

    const medication = await prisma.medication.update({
      where: { id },
      data: {
        name,
        brand: brand || null,
        category: category || null,
        stock: parseInt(stock),
        minStock: parseInt(minStock),
        price: parseFloat(price),
      },
    });

    return NextResponse.json({ medication });
  } catch (error) {
    console.error("[PUT /api/admin/medications/[id]]", error);
    return NextResponse.json(
      { error: "Failed to update medication" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.medication.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Medication deleted successfully" });
  } catch (error) {
    console.error("[DELETE /api/admin/medications/[id]]", error);
    return NextResponse.json(
      { error: "Failed to delete medication" },
      { status: 500 }
    );
  }
}
