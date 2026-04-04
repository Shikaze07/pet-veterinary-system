import { Suspense } from "react"
import { OwnerManagementClient } from "./owner-client"
import { OwnerToolbar } from "./owner-toolbar"
import prisma from "@/lib/prisma"

async function getOwners(page, pageSize, search) {
  const skip = (page - 1) * pageSize;
  try {
    const where = {
      role: "OWNER",
      ...(search ? {
        OR: [
          { firstName: { contains: search } },
          { lastName: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
        ]
      } : {})
    };
    const [owners, total] = await Promise.all([
      prisma.user.findMany({
        where, skip, take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, firstName: true, middleName: true, lastName: true,
          email: true, phone: true, role: true, address: true, createdAt: true,
          pets: { select: { id: true, name: true, species: true } }
        },
      }),
      prisma.user.count({ where }),
    ]);
    return { owners: JSON.parse(JSON.stringify(owners)), total, page, pageSize };
  } catch (error) {
    console.error("Database fetch error (owner):", error);
    return { owners: [], total: 0, page, pageSize };
  }
}

async function OwnerTable({ page, pageSize, search }) {
  const { owners, total } = await getOwners(page, pageSize, search)
  return <OwnerManagementClient owners={owners} total={total} page={page} pageSize={pageSize} />
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

export default async function OwnerPage({ searchParams }) {
  const params = await searchParams
  const pageNum = parseInt(params.page || "1", 10)
  const pageSizeNum = parseInt(params.pageSize || "10", 10)
  const search = params.search || ""

  return (
    <div className="container mx-auto px-10 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Owner Management</h1>
        <p className="text-slate-500 font-inter">
          Manage pet owner profiles, contact information, and view their registered pets.
        </p>
      </div>

      <OwnerToolbar />

      <Suspense fallback={<TableSkeleton />}>
        <OwnerTable page={pageNum} pageSize={pageSizeNum} search={search} />
      </Suspense>
    </div>
  )
}
