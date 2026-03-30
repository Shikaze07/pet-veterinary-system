import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Role, Status } from "@/generated/prisma/client"

export async function GET() {
    try {
        const clients = await prisma.user.findMany({
            where: {
                role: Role.CLIENT,
            },
            include: {
                client: {
                    include: {
                        pets: true
                    }
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })
        return NextResponse.json(clients)
    } catch (error) {
        console.error("Error fetching clients:", error)
        return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const { firstName, lastName, username, email, password, phone, dateOfBirth, address, pets } = data

        if (!firstName || !lastName || !username || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                username,
                email,
                password: password || "Password123!",
                phone,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                role: Role.CLIENT,
                status: Status.ACTIVE,
                client: {
                    create: {
                        address,
                        pets: {
                            create: (pets || []).map((pet: any) => ({
                                name: pet.name,
                                species: pet.species,
                                breed: pet.breed,
                                age: pet.age ? parseInt(pet.age) : null,
                                gender: pet.gender,
                            }))
                        }
                    },
                },
            },
            include: {
                client: {
                    include: {
                        pets: true
                    }
                },
            },
        })

        return NextResponse.json(user)
    } catch (error: any) {
        console.error("Error creating client:", error)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Username or Email already exists" }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to create client" }, { status: 500 })
    }
}
