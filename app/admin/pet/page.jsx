import { PetManagementClient } from "./pet-client"
import prisma from "@/lib/prisma"

async function getPets(page, pageSize, search) {
  const skip = (page - 1) * pageSize;

  try {
    const where = search 
      ? {
          OR: [
            { name: { contains: search } },
            { species: { contains: search } },
            { breed: { contains: search } },
          ]
        }
      : {};

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
    ]);

    return {
      pets: JSON.parse(JSON.stringify(pets)),
      total,
      page,
      pageSize
    };
  } catch (error) {
    console.error("Database fetch error (pet):", error);
    return { pets: [], total: 0, page, pageSize };
  }
}

export default async function PetPage({ searchParams }) {
  const params = await searchParams
  const pageNum = parseInt(params.page || "1", 10)
  const pageSizeNum = parseInt(params.pageSize || "10", 10)
  const search = params.search || ""

  const { pets, total, page, pageSize } = await getPets(pageNum, pageSizeNum, search)

  return (
    <div className="container mx-auto px-10 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Pet Management</h1>
        <p className="text-slate-500 font-inter">
          View and manage all pets registered in the clinic. Link pets to their owners and keep records up to date.
        </p>
      </div>

      <PetManagementClient
        pets={pets}
        total={total}
        page={page}
        pageSize={pageSize}
      />
    </div>
  )
}
