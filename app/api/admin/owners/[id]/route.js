import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { firstName, middleName, lastName, email, password, phone, address } = body;

    // Validate email if it changed
    if (email) {
      const existing = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id },
        },
      });
      if (existing) {
        return NextResponse.json(
          { error: "A user with this email already exists." },
          { status: 409 }
        );
      }
    }

    const updateData = {
      firstName,
      middleName: middleName || null,
      lastName,
      email,
      phone: phone || null,
      address: address || null,
    };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ owner: user });
  } catch (error) {
    console.error("[PUT /api/admin/owners/[id]]", error);
    return NextResponse.json(
      { error: "Failed to update owner" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    // Check for associated pets
    const petCount = await prisma.pet.count({ where: { ownerId: id } });
    if (petCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete owner: Associated pets found. Delete pets first." },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Owner deleted successfully" });
  } catch (error) {
    console.error("[DELETE /api/admin/owners/[id]]", error);
    return NextResponse.json(
      { error: "Failed to delete owner" },
      { status: 500 }
    );
  }
}
