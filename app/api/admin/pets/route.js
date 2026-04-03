import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10)
    const search = searchParams.get("search") || ""

    const skip = (page - 1) * pageSize

    try {
        const where = search 
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { species: { contains: search, mode: 'insensitive' } },
                    { breed: { contains: search, mode: 'insensitive' } },
                ]
            }
            : {}

        const [pets, total] = await Promise.all([
            prisma.pet.findMany({
                where,
                skip,
                take: pageSize,
                include: {
                    owner: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                },
                orderBy: { name: "asc" },
            }),
            prisma.pet.count({ where }),
        ])

        return NextResponse.json({
            pets,
            total,
            page,
            pageSize,
        })
    } catch (error) {
        console.error("Fetch pets error:", error)
        return NextResponse.json(
            { error: "Failed to fetch pets" },
            { status: 500 }
        )
    }
}

export async function POST(request) {
    try {
        const body = await request.json()
        const { name, species, breed, gender, age, weight, color, ownerId } = body

        if (!name || !species) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const pet = await prisma.pet.create({
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
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            }
        })

        return NextResponse.json(pet, { status: 201 })
    } catch (error) {
        console.error("Create pet error:", error)
        return NextResponse.json(
            { error: "Failed to create pet" },
            { status: 500 }
        )
    }
}
