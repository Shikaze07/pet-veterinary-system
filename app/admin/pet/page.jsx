import { PetClient } from "./pet-client"
import prisma from "@/lib/prisma"

async function getPetsData(page = 1, pageSize = 10, search = "") {
    const skip = (page - 1) * pageSize;

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
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    email: true
                                }
                            }
                        }
                    }
                },
                orderBy: { name: "asc" },
            }),
            prisma.pet.count({ where }),
        ]);

        return { 
            pets: JSON.parse(JSON.stringify(pets)), 
            total, 
            page, 
            pageSize 
        };
    } catch (error) {
        console.error("Database fetch error:", error);
        return { pets: [], total: 0, page, pageSize };
    }
}

export default async function PetPage({ searchParams }) {
    const params = await searchParams
    const pageNum = parseInt(params.page || "1", 10)
    const pageSizeNum = parseInt(params.pageSize || "10", 10)
    const search = params.search || ""

    const { pets, total, page, pageSize } = await getPetsData(pageNum, pageSizeNum, search)

    return (
        <div className="container mx-auto px-10 py-10 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pet Management</h1>
                <p className="text-slate-500">
                    Manage pets, owners, and their medical history from here.
                </p>
            </div>
            
            <PetClient 
                initialData={pets} 
                total={total} 
                page={page} 
                pageSize={pageSize} 
                search={search}
            />
        </div>
    )
}
