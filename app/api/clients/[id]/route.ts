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

        const user = await prisma.user.update({
            where: { id },
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                email: data.email,
                phone: data.phone,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
                client: {
                    update: {
                        address: data.address,
                        pets: {
                            upsert: (data.pets || []).map((pet: any) => ({
                                where: { id: pet.id || -1 },
                                create: {
                                    name: pet.name,
                                    species: pet.species,
                                    breed: pet.breed,
                                    age: pet.age ? parseInt(pet.age) : null,
                                    gender: pet.gender,
                                },
                                update: {
                                    name: pet.name,
                                    species: pet.species,
                                    breed: pet.breed,
                                    age: pet.age ? parseInt(pet.age) : null,
                                    gender: pet.gender,
                                }
                            }))
                        }
                    },
                },
            },
            include: {
                client: {
                    include: {
                        pets: true,
                    },
                },
            },
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("Error updating client:", error)
        return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params
        const id = parseInt(idParam)
        const { status } = await request.json()

        const user = await prisma.user.update({
            where: { id },
            data: { status },
        })

        return NextResponse.json(user)
    } catch (error) {
        console.error("Error patching client:", error)
        return NextResponse.json({ error: "Failed to patch client" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params
        const id = parseInt(idParam)

        // Delete the associated Client record first if necessary, 
        // but Prisma @relation usually handles this if configured or via manual delete.
        // In our schema, Client has userId as unique relation. 
        // We can delete the user and it might cascade if configured, but let's be safe.
        
        await prisma.client.deleteMany({
            where: { userId: id }
        })

        await prisma.user.delete({
            where: { id },
        })

        return NextResponse.json({ message: "Client deleted successfully" })
    } catch (error) {
        console.error("Error deleting client:", error)
        return NextResponse.json({ 
            error: "Failed to delete client. They may have related pets or appointments." 
        }, { status: 500 })
    }
}
