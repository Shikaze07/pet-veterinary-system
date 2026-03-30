import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const clientId = searchParams.get("clientId")

        const pets = await prisma.pet.findMany({
            where: clientId ? { clientId: parseInt(clientId) } : {},
            include: {
                client: {
                    include: {
                        user: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return NextResponse.json(pets)
    } catch (error) {
        console.error("Error fetching pets:", error)
        return NextResponse.json({ error: "Failed to fetch pets" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const { clientId, name, species, breed, age, gender } = data

        if (!clientId || !name || !species) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const pet = await prisma.pet.create({
            data: {
                clientId: parseInt(clientId),
                name,
                species,
                breed,
                age: age ? parseInt(age) : null,
                gender,
            },
        })

        return NextResponse.json(pet)
    } catch (error) {
        console.error("Error creating pet:", error)
        return NextResponse.json({ error: "Failed to create pet" }, { status: 500 })
    }
}
