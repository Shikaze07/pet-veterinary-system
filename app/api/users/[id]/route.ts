import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)
        const data = await request.json()

        const user = await prisma.user.update({
            where: { id },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
                phone: data.phone,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
                role: data.role,
                status: data.status,
            },
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("Error updating user:", error)
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)
        const { status } = await request.json()

        const user = await prisma.user.update({
            where: { id },
            data: { status },
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("Error patching user:", error)
        return NextResponse.json({ error: "Failed to patch user" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id)

        await prisma.user.delete({
            where: { id },
        })

        return NextResponse.json({ message: "User deleted successfully" })
    } catch (error) {
        console.error("Error deleting user:", error)
        return NextResponse.json({ 
            error: "Failed to delete user. The user might have related records (pets, appointments)." 
        }, { status: 500 })
    }
}
