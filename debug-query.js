const { PrismaClient } = require("./generated/prisma")
const prisma = new PrismaClient()

async function test() {
    try {
        const search = ""
        const where = search 
            ? {
                OR: [
                    { user: { firstName: { contains: search } } },
                    { user: { lastName: { contains: search } } },
                    { user: { email: { contains: search } } },
                    { user: { phone: { contains: search } } },
                ]
            }
            : {}

        const owners = await prisma.owner.findMany({
            where,
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        middleName: true,
                        email: true,
                        phone: true,
                    }
                },
                pets: {
                    select: {
                        id: true,
                        name: true,
                        species: true,
                    }
                }
            },
            orderBy: {
                user: {
                    lastName: "asc"
                }
            }
        })
        console.log("Found owners:", owners.length)
    } catch (error) {
        console.error("Database query failed:", error)
    } finally {
        await prisma.$disconnect()
    }
}

test()
