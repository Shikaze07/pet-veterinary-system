import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request, { params }) {
    const { id: ownerId } = params
    
    try {
        const body = await request.json()
        const { petIds } = body

        if (!Array.isArray(petIds)) {
            return NextResponse.json(
                { error: "petIds must be an array" },
                { status: 400 }
            )
        }

        // Update all selected pets to have this ownerId
        await prisma.pet.updateMany({
            where: {
                id: { in: petIds }
            },
            data: {
                ownerId: ownerId
            }
        })

        return NextResponse.json({ message: "Pets assigned successfully" })
    } catch (error) {
        console.error("Assign pets error:", error)
        return NextResponse.json(
            { error: "Failed to assign pets" },
            { status: 500 }
        )
    }
}
