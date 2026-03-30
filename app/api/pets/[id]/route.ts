import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params
        const id = parseInt(idParam)
        const data = await request.json()

        const pet = await prisma.pet.update({
            where: { id },
            data: {
                name: data.name,
                species: data.species,
                breed: data.breed,
                age: data.age ? parseInt(data.age) : null,
                gender: data.gender,
            },
        })

        return NextResponse.json(pet)
    } catch (error) {
        console.error("Error updating pet:", error)
        return NextResponse.json({ error: "Failed to update pet" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params
        const id = parseInt(idParam)

        await prisma.pet.delete({
            where: { id },
        })

        return NextResponse.json({ message: "Pet deleted successfully" })
    } catch (error) {
        console.error("Error deleting pet:", error)
        return NextResponse.json({ 
            error: "Failed to delete pet. It may have related medical records or appointments." 
        }, { status: 500 })
    }
}
