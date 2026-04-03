import { MedicationManagementClient } from "./medication-client"
import prisma from "@/lib/prisma"

async function getMedications(page, pageSize, search) {
  const skip = (page - 1) * pageSize;

  try {
    const where = search 
      ? {
          OR: [
            { name: { contains: search } },
            { brand: { contains: search } },
            { category: { contains: search } },
          ]
        }
      : {};

    const [medications, total] = await Promise.all([
      prisma.medication.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { name: "asc" },
      }),
      prisma.medication.count({ where }),
    ]);

    return {
      medications: JSON.parse(JSON.stringify(medications)),
      total,
      page,
      pageSize
    };
  } catch (error) {
    console.error("Database fetch error (medication):", error);
    return { medications: [], total: 0, page, pageSize };
  }
}

export default async function MedicationPage({ searchParams }) {
  const params = await searchParams
  const pageNum = parseInt(params.page || "1", 10)
  const pageSizeNum = parseInt(params.pageSize || "10", 10)
  const search = params.search || ""

  const { medications, total, page, pageSize } = await getMedications(pageNum, pageSizeNum, search)

  return (
    <div className="container mx-auto px-10 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Pharmacy Inventory</h1>
        <p className="text-slate-500 font-inter">
          Manage medications, track stock levels, and set reorder alerts.
        </p>
      </div>

      <MedicationManagementClient
        medications={medications}
        total={total}
        page={page}
        pageSize={pageSize}
      />
    </div>
  )
}
