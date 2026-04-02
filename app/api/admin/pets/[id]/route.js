import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(request, context) {
    const params = await context.params
    const { id } = params
    try {
        const body = await request.json()
        const { name, species, breed, gender, age, weight, color, ownerId } = body

        if (!name || !species) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const pet = await prisma.pet.update({
            where: { id },
            data: {
                name,
                species,
                breed,
                gender,
                age: age !== null && age !== undefined ? parseFloat(age) : null,
                weight: weight ? parseFloat(weight) : null,
                color,
                ownerId: ownerId || null,
            },
            include: {
                owner: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json(pet)
    } catch (error) {
        console.error("Update pet error:", error)
        return NextResponse.json(
            { error: "Failed to update pet" },
            { status: 500 }
        )
    }
}

export async function DELETE(request, context) {
    const params = await context.params
    const { id } = params
    try {
        await prisma.pet.delete({
            where: { id },
        })

        return NextResponse.json({ message: "Pet deleted successfully" })
    } catch (error) {
        console.error("Delete pet error:", error)
        return NextResponse.json(
            { error: "Failed to delete pet" },
            { status: 500 }
        )
    }
}
