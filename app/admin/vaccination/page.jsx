import { Suspense } from "react"
import { VaccinationManagementClient } from "./vaccination-client"
import { VaccinationToolbar } from "./vaccination-toolbar"
import prisma from "@/lib/prisma"

async function getVaccinations(page, pageSize, search) {
  const skip = (page - 1) * pageSize;
  try {
    const where = search
      ? { OR: [{ vaccineName: { contains: search } }, { pet: { name: { contains: search } } }] }
      : {};
    const [vaccinations, total] = await Promise.all([
      prisma.vaccination.findMany({
        where, skip, take: pageSize,
        include: { pet: { include: { owner: { select: { id: true, firstName: true, lastName: true, email: true } } } } },
        orderBy: { dateGiven: "desc" },
      }),
      prisma.vaccination.count({ where }),
    ]);
    return { vaccinations: JSON.parse(JSON.stringify(vaccinations)), total, page, pageSize };
  } catch (error) {
    console.error("Database fetch error (vaccination):", error);
    return { vaccinations: [], total: 0, page, pageSize };
  }
}

async function VaccinationTable({ page, pageSize, search }) {
  const { vaccinations, total } = await getVaccinations(page, pageSize, search)
  return <VaccinationManagementClient vaccinations={vaccinations} total={total} page={page} pageSize={pageSize} />
}

function TableSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex gap-4 px-4 py-3 bg-slate-50 border-b border-slate-200">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-4 w-1/4 rounded bg-slate-200 animate-pulse" />)}
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3 border-b border-slate-100 last:border-0">
          {Array.from({ length: 4 }).map((_, j) => <div key={j} className="h-4 w-1/4 rounded bg-slate-100 animate-pulse" />)}
        </div>
      ))}
    </div>
  )
}

export default async function VaccinationPage({ searchParams }) {
  const params = await searchParams
  const pageNum = parseInt(params.page || "1", 10)
  const pageSizeNum = parseInt(params.pageSize || "10", 10)
  const search = params.search || ""

  return (
    <div className="container mx-auto px-10 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Vaccination Records</h1>
        <p className="text-slate-500 font-inter">
          Track pet immunizations and schedule upcoming boosters.
        </p>
      </div>

      <VaccinationToolbar />

      <Suspense fallback={<TableSkeleton />}>
        <VaccinationTable page={pageNum} pageSize={pageSizeNum} search={search} />
      </Suspense>
    </div>
  )
}
