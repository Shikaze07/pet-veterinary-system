import { Suspense } from "react"
import { ConsultationManagementClient } from "./consultation-client"
import { ConsultationToolbar } from "./consultation-toolbar"
import prisma from "@/lib/prisma"

async function getConsultations(page, pageSize, search) {
  const skip = (page - 1) * pageSize;

  try {
    const where = search
      ? {
        OR: [
          { symptoms: { contains: search } },
          { diagnosis: { contains: search } },
          { pet: { name: { contains: search } } },
        ]
      }
      : {};

    const [consultations, total] = await Promise.all([
      prisma.consultation.findMany({
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
                  phone: true,
                }
              }
            }
          }
        },
        orderBy: { date: "desc" },
      }),
      prisma.consultation.count({ where }),
    ]);

    return {
      consultations: JSON.parse(JSON.stringify(consultations)),
      total,
      page,
      pageSize
    };
  } catch (error) {
    console.error("Database fetch error (consultation):", error);
    return { consultations: [], total: 0, page, pageSize };
  }
}

async function ConsultationTable({ page, pageSize, search }) {
  const { consultations, total } = await getConsultations(page, pageSize, search)
  return (
    <ConsultationManagementClient
      consultations={consultations}
      total={total}
      page={page}
      pageSize={pageSize}
    />
  )
}

function TableSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex gap-4 px-4 py-3 bg-slate-50 border-b border-slate-200">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 w-1/4 rounded bg-slate-200 animate-pulse" />
        ))}
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3 border-b border-slate-100 last:border-0">
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="h-4 w-1/4 rounded bg-slate-100 animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  )
}

export default async function ConsultationPage({ searchParams }) {
  const params = await searchParams
  const pageNum = parseInt(params.page || "1", 10)
  const pageSizeNum = parseInt(params.pageSize || "10", 10)
  const search = params.search || ""

  return (
    <div className="container mx-auto px-10 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Consultations</h1>
        <p className="text-slate-500 font-inter">
          Record and manage medical consultations for pets.
        </p>
      </div>

      <ConsultationToolbar />

      <Suspense fallback={<TableSkeleton />}>
        <ConsultationTable page={pageNum} pageSize={pageSizeNum} search={search} />
      </Suspense>
    </div>
  )
}
