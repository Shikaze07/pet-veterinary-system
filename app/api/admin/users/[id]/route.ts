import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { firstName, middleName, lastName, email, phone, address, role, password } =
      body;

    // Check for existing user
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      firstName,
      middleName: middleName || null,
      lastName,
      email,
      phone: phone || null,
      address: address || null,
      role,
    };

    // If password is provided, hash it
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
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

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("[PUT /api/admin/users/[id]]", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    // Check for existing user
    const existing = await prisma.user.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Transaction to delete user
    await prisma.$transaction(async (tx) => {
        // Since we merged, we need to handle associated records if not cascaded in DB.
        // In our schema, Pet has ownerId pointing to User.
        const petCount = await tx.pet.count({ where: { ownerId: id } });
        if (petCount > 0) {
            throw new Error("Cannot delete user: Associated pets found. Delete pets first.");
        }

        await tx.user.delete({ where: { id } });
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("[DELETE /api/admin/users/[id]]", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
