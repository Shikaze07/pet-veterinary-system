import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Role, Status } from "@/generated/prisma/enums"
import { User } from "@/generated/prisma/client"

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
        })
        return NextResponse.json(users)
    } catch (error) {
        console.error("Error fetching users:", error)
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const { firstName, lastName, username, email, password, phone, role, dateOfBirth } = data

        if (!firstName || !lastName || !username || !email || !role) {
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
                role,
                status: Status.ACTIVE,
                ...(role === Role.CLIENT ? {
                    client: {
                        create: {}
                    }
                } : {})
            },
        })

        return NextResponse.json(user, { status: 201 })
    } catch (error: any) {
        console.error("Error creating user:", error)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: "Email already exists" }, { status: 409 })
        }
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }
}
