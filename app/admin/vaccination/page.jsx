import { VaccinationManagementClient } from "./vaccination-client"
import prisma from "@/lib/prisma"

async function getVaccinations(page, pageSize, search) {
  const skip = (page - 1) * pageSize;

  try {
    const where = search 
      ? {
          OR: [
            { vaccineName: { contains: search } },
            { pet: { name: { contains: search } } },
          ]
        }
      : {};

    const [vaccinations, total] = await Promise.all([
      prisma.vaccination.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          pet: {
            include: {
              owner: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                }
              }
            }
          }
        },
        orderBy: { dateGiven: "desc" },
      }),
      prisma.vaccination.count({ where }),
    ]);

    return {
      vaccinations: JSON.parse(JSON.stringify(vaccinations)),
      total,
      page,
      pageSize
    };
  } catch (error) {
    console.error("Database fetch error (vaccination):", error);
    return { vaccinations: [], total: 0, page, pageSize };
  }
}

export default async function VaccinationPage({ searchParams }) {
  const params = await searchParams
  const pageNum = parseInt(params.page || "1", 10)
  const pageSizeNum = parseInt(params.pageSize || "10", 10)
  const search = params.search || ""

  const { vaccinations, total, page, pageSize } = await getVaccinations(pageNum, pageSizeNum, search)

  return (
    <div className="container mx-auto px-10 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Vaccination Records</h1>
        <p className="text-slate-500 font-inter">
          Track pet immunizations and schedule upcoming boosters.
        </p>
      </div>

      <VaccinationManagementClient
        vaccinations={vaccinations}
        total={total}
        page={page}
        pageSize={pageSize}
      />
    </div>
  )
}
