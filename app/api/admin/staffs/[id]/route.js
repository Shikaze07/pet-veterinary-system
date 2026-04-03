import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(request, { params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { firstName, middleName, lastName, email, password, phone, address, role } =
      body;

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
      role,
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

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[PUT /api/admin/staffs/[id]]", error);
    return NextResponse.json(
      { error: "Failed to update staff member" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.error("[DELETE /api/admin/staffs/[id]]", error);
    return NextResponse.json(
      { error: "Failed to delete staff member" },
      { status: 500 }
    );
  }
}
