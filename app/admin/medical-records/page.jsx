import { Suspense } from "react"
import { MedicalRecordsClient } from "./medical-records-client"
import { MedicalRecordsToolbar } from "./medical-records-toolbar"
import prisma from "@/lib/prisma"
import {
  PawPrint,
  BriefcaseMedical,
  Syringe,
  Calendar,
} from "lucide-react"

async function getStats() {
  try {
    const [totalPets, totalConsultations, totalVaccinations, totalAppointments, speciesList] =
      await Promise.all([
        prisma.pet.count(),
        prisma.consultation.count(),
        prisma.vaccination.count(),
        prisma.appointment.count(),
        prisma.pet.findMany({
          select: { species: true },
          distinct: ["species"],
          where: { species: { not: "" } },
        }),
      ])

    const availableSpecies = speciesList
      .map((item) => item.species)
      .filter(Boolean)

    return {
      totalPets,
      totalConsultations,
      totalVaccinations,
      totalAppointments,
      availableSpecies,
    }
  } catch (error) {
    console.error("Database fetch error (medical records stats):", error)
    return {
      totalPets: 0,
      totalConsultations: 0,
      totalVaccinations: 0,
      totalAppointments: 0,
      availableSpecies: [],
    }
  }
}

async function getMedicalRecords(page, pageSize, search, species) {
  const skip = (page - 1) * pageSize

  try {
    const andConditions = []

    if (search) {
      andConditions.push({
        OR: [
          { name: { contains: search } },
          { breed: { contains: search } },
          { species: { contains: search } },
          { owner: { firstName: { contains: search } } },
          { owner: { lastName: { contains: search } } },
          { owner: { phone: { contains: search } } },
        ],
      })
    }

    if (species && species !== "all") {
      andConditions.push({
        species: { equals: species },
      })
    }

    const where = andConditions.length > 0 ? { AND: andConditions } : {}

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
              middleName: true,
              lastName: true,
              email: true,
              phone: true,
              address: true,
            },
          },
          consultations: {
            orderBy: { date: "desc" },
          },
          vaccinations: {
            orderBy: { dateGiven: "desc" },
          },
          appointments: {
            orderBy: { date: "desc" },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.pet.count({ where }),
    ])

    return {
      pets: JSON.parse(JSON.stringify(pets)),
      total,
      page,
      pageSize,
    }
  } catch (error) {
    console.error("Database fetch error (medical records):", error)
    return { pets: [], total: 0, page, pageSize }
  }
}

async function MedicalRecordsTable({ page, pageSize, search, species }) {
  const { pets, total } = await getMedicalRecords(page, pageSize, search, species)

  return (
    <MedicalRecordsClient
      pets={pets}
      total={total}
      page={page}
      pageSize={pageSize}
    />
  )
}

function TableSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
      <div className="flex gap-4 px-4 py-3.5 bg-slate-50/75 border-b border-slate-200">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 flex-1 rounded bg-slate-200 animate-pulse" />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3.5 border-b border-slate-100 last:border-0">
          {Array.from({ length: 5 }).map((_, j) => (
            <div key={j} className="h-4 flex-1 rounded bg-slate-100 animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  )
}

export default async function MedicalRecordsPage({ searchParams }) {
  const params = await searchParams
  const pageNum = parseInt(params.page || "1", 10)
  const pageSizeNum = parseInt(params.pageSize || "10", 10)
  const search = params.search || ""
  const species = params.species || "all"

  const {
    totalPets,
    totalConsultations,
    totalVaccinations,
    totalAppointments,
    availableSpecies,
  } = await getStats()

  return (
    <div className="container mx-auto px-6 lg:px-10 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">
          Medical Records
        </h1>
        <p className="text-slate-500 font-inter text-sm">
          Comprehensive patient charts, clinical consultation logs, and immunization records.
        </p>
      </div>

      {/* Metric Cards - Primary Green Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Patients */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-primary/40 transition-colors flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Patient Charts
            </span>
            <p className="text-2xl font-bold font-outfit text-slate-900 tabular-nums">
              {totalPets}
            </p>
            <p className="text-xs text-slate-400">Registered animals</p>
          </div>
          <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <PawPrint className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2: Consultations Logged */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-primary/40 transition-colors flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Consultations
            </span>
            <p className="text-2xl font-bold font-outfit text-slate-900 tabular-nums">
              {totalConsultations}
            </p>
            <p className="text-xs text-slate-400">Examinations recorded</p>
          </div>
          <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <BriefcaseMedical className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3: Vaccinations Logged */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-primary/40 transition-colors flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Vaccinations
            </span>
            <p className="text-2xl font-bold font-outfit text-slate-900 tabular-nums">
              {totalVaccinations}
            </p>
            <p className="text-xs text-slate-400">Administered immunizations</p>
          </div>
          <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Syringe className="h-5 w-5" />
          </div>
        </div>

        {/* Card 4: Clinical Visits / Appointments */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-primary/40 transition-colors flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Clinic Visits
            </span>
            <p className="text-2xl font-bold font-outfit text-slate-900 tabular-nums">
              {totalAppointments}
            </p>
            <p className="text-xs text-slate-400">Scheduled & completed logs</p>
          </div>
          <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <MedicalRecordsToolbar availableSpecies={availableSpecies} />

      {/* Main Medical Records Data Table */}
      <Suspense fallback={<TableSkeleton />}>
        <MedicalRecordsTable
          page={pageNum}
          pageSize={pageSizeNum}
          search={search}
          species={species}
        />
      </Suspense>
    </div>
  )
}
