import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const owners = await prisma.owner.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            },
            orderBy: {
                user: {
                    lastName: "asc"
                }
            }
        })

        const formattedOwners = owners.map(owner => ({
            id: owner.id,
            name: `${owner.user.firstName} ${owner.user.lastName}`,
            email: owner.user.email
        }))

        return NextResponse.json(formattedOwners)
    } catch (error) {
        console.error("Fetch owners error:", error)
        return NextResponse.json(
            { error: "Failed to fetch owners" },
            { status: 500 }
        )
    }
}
