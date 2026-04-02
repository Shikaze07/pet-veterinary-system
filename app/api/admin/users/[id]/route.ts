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
    const { firstName, middleName, lastName, email, phone, role, password } =
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
      role,
    };

    // If password is provided, hash it
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Transaction to update user and handle Owner record
    const updatedUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          firstName: true,
          middleName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
      });

      // Handle Role change logic
      if (existing.role === "ADMIN" && role === "OWNER") {
        // Create associated Owner record if it doesn't exist
        const owner = await tx.owner.findUnique({ where: { userId: id } });
        if (!owner) {
          await tx.owner.create({ data: { userId: id } });
        }
      } else if (existing.role === "OWNER" && role === "ADMIN") {
        // We might want to keep the Owner record but it depends on system requirements.
        // For now, we'll keep it to prevent data loss (pets, etc).
      }

      return user;
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
      include: { owner: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Transaction to delete user and their Owner record
    // Note: Due to foreign key constraints, we might need to handle Pets/Appts if not cascaded.
    // Assuming cascade delete is set in schema or handled manually here.
    
    await prisma.$transaction(async (tx) => {
        // In this schema, we don't have explicit cascade in Prisma but DB might have it.
        // Let's be safe and try to delete associated records if they exist and aren't cascaded.
        // For now, based on schema.prisma, the Owner model has: pets, invoices, appointments.

        if (existing.owner) {
            // Check for pets or appointments that might block deletion
            const petCount = await tx.pet.count({ where: { ownerId: existing.owner.id } });
            if (petCount > 0) {
                throw new Error("Cannot delete user: Associated pets found. Delete pets first.");
            }
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
