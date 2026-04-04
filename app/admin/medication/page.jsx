import { Suspense } from "react"
import { MedicationManagementClient } from "./medication-client"
import { MedicationToolbar } from "./medication-toolbar"
import prisma from "@/lib/prisma"

async function getMedications(page, pageSize, search) {
  const skip = (page - 1) * pageSize;
  try {
    const where = search
      ? { OR: [{ name: { contains: search } }, { brand: { contains: search } }, { category: { contains: search } }] }
      : {};
    const [medications, total] = await Promise.all([
      prisma.medication.findMany({ where, skip, take: pageSize, orderBy: { name: "asc" } }),
      prisma.medication.count({ where }),
    ]);
    return { medications: JSON.parse(JSON.stringify(medications)), total, page, pageSize };
  } catch (error) {
    console.error("Database fetch error (medication):", error);
    return { medications: [], total: 0, page, pageSize };
  }
}

async function MedicationTable({ page, pageSize, search }) {
  const { medications, total } = await getMedications(page, pageSize, search)
  return <MedicationManagementClient medications={medications} total={total} page={page} pageSize={pageSize} />
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

export default async function MedicationPage({ searchParams }) {
  const params = await searchParams
  const pageNum = parseInt(params.page || "1", 10)
  const pageSizeNum = parseInt(params.pageSize || "10", 10)
  const search = params.search || ""

  return (
    <div className="container mx-auto px-10 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Pharmacy Inventory</h1>
        <p className="text-slate-500 font-inter">
          Manage medications, track stock levels, and set reorder alerts.
        </p>
      </div>

      <MedicationToolbar />

      <Suspense fallback={<TableSkeleton />}>
        <MedicationTable page={pageNum} pageSize={pageSizeNum} search={search} />
      </Suspense>
    </div>
  )
}
