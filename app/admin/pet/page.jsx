import { Suspense } from "react"
import { PetManagementClient } from "./pet-client"
import { PetToolbar } from "./pet-toolbar"
import prisma from "@/lib/prisma"

async function getPets(page, pageSize, search) {
  const skip = (page - 1) * pageSize;
  try {
    const where = search
      ? { OR: [{ name: { contains: search } }, { species: { contains: search } }, { breed: { contains: search } }] }
      : {};
    const [pets, total] = await Promise.all([
      prisma.pet.findMany({
        where, skip, take: pageSize,
        include: { owner: { select: { id: true, firstName: true, lastName: true, email: true } } },
        orderBy: { name: "asc" },
      }),
      prisma.pet.count({ where }),
    ]);
    return { pets: JSON.parse(JSON.stringify(pets)), total, page, pageSize };
  } catch (error) {
    console.error("Database fetch error (pet):", error);
    return { pets: [], total: 0, page, pageSize };
  }
}

async function PetTable({ page, pageSize, search }) {
  const { pets, total } = await getPets(page, pageSize, search)
  return <PetManagementClient pets={pets} total={total} page={page} pageSize={pageSize} />
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

export default async function PetPage({ searchParams }) {
  const params = await searchParams
  const pageNum = parseInt(params.page || "1", 10)
  const pageSizeNum = parseInt(params.pageSize || "10", 10)
  const search = params.search || ""

  return (
    <div className="container mx-auto px-10 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Pet Management</h1>
        <p className="text-slate-500 font-inter">
          View and manage all pets registered in the clinic. Link pets to their owners and keep records up to date.
        </p>
      </div>

      <PetToolbar />

      <Suspense fallback={<TableSkeleton />}>
        <PetTable page={pageNum} pageSize={pageSizeNum} search={search} />
      </Suspense>
    </div>
  )
}
