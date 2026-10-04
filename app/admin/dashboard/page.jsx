import Link from "next/link"
import prisma from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  PawPrint,
  Calendar,
  Stethoscope,
  Syringe,
  Pill,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Plus,
  Activity,
  FileText,
  AlertTriangle,
  Wallet,
} from "lucide-react"

export const dynamic = "force-dynamic"

const peso = (n) => `₱${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

async function getRevenue() {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  try {
    const [all, month, today, items] = await Promise.all([
      prisma.costing.aggregate({ _sum: { totalAmount: true }, _count: true }),
      prisma.costing.aggregate({ _sum: { totalAmount: true }, where: { date: { gte: startOfMonth } } }),
      prisma.costing.aggregate({ _sum: { totalAmount: true }, where: { date: { gte: startOfToday } } }),
      prisma.costingItem.groupBy({ by: ["category"], _sum: { total: true }, where: { costing: { date: { gte: startOfMonth } } } }),
    ])
    return {
      total: all._sum.totalAmount || 0,
      count: all._count || 0,
      month: month._sum.totalAmount || 0,
      today: today._sum.totalAmount || 0,
      byCategory: items.map((i) => ({ category: i.category, total: i._sum.total || 0 })).sort((a, b) => b.total - a.total),
    }
  } catch (error) {
    console.error("Revenue fetch error:", error)
    return { total: 0, count: 0, month: 0, today: 0, byCategory: [] }
  }
}

const CATEGORY_LABEL = { CONSULTATION: "Consultation", MEDICATION: "Medicine", VACCINATION: "Vaccination", OTHER: "Other" }

async function getDashboardData() {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

  try {
    const [
      totalPets,
      totalOwners,
      totalConsultations,
      totalVaccinations,
      totalAppointments,
      todayAppointments,
      upcomingAppointments,
      recentConsultations,
      vaccinationsWithDue,
      allMedications,
      allPetsForSpecies,
    ] = await Promise.all([
      prisma.pet.count(),
      prisma.user.count({ where: { role: "OWNER" } }),
      prisma.consultation.count(),
      prisma.vaccination.count(),
      prisma.appointment.count(),
      prisma.appointment.count({
        where: {
          date: { gte: startOfToday, lte: endOfToday },
        },
      }),
      prisma.appointment.findMany({
        where: {
          date: { gte: startOfToday },
        },
        take: 5,
        orderBy: { date: "asc" },
        include: {
          pet: true,
          owner: {
            select: {
              firstName: true,
              lastName: true,
              phone: true,
              email: true,
            },
          },
        },
      }),
      prisma.consultation.findMany({
        take: 5,
        orderBy: { date: "desc" },
        include: {
          pet: {
            include: {
              owner: {
                select: {
                  firstName: true,
                  lastName: true,
                  phone: true,
                },
              },
            },
          },
        },
      }),
      prisma.vaccination.findMany({
        where: {
          nextDue: { not: null },
        },
        take: 6,
        orderBy: { nextDue: "asc" },
        include: {
          pet: {
            include: {
              owner: {
                select: {
                  firstName: true,
                  lastName: true,
                  phone: true,
                },
              },
            },
          },
        },
      }),
      prisma.medication.findMany({
        orderBy: { stock: "asc" },
        take: 6,
      }),
      prisma.pet.findMany({
        select: { species: true },
      }),
    ])

    // Calculate species breakdown
    const speciesMap = {}
    allPetsForSpecies.forEach((p) => {
      const sp = (p.species || "Other").trim()
      const formatted = sp.charAt(0).toUpperCase() + sp.slice(1).toLowerCase()
      speciesMap[formatted] = (speciesMap[formatted] || 0) + 1
    })

    const speciesBreakdown = Object.entries(speciesMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // Low stock count
    const lowStockMeds = allMedications.filter((m) => m.stock <= m.minStock)

    return {
      stats: {
        totalPets,
        totalOwners,
        totalConsultations,
        totalVaccinations,
        totalAppointments,
        todayAppointments,
        lowStockCount: lowStockMeds.length,
      },
      upcomingAppointments: JSON.parse(JSON.stringify(upcomingAppointments)),
      recentConsultations: JSON.parse(JSON.stringify(recentConsultations)),
      upcomingVaccinations: JSON.parse(JSON.stringify(vaccinationsWithDue)),
      medications: JSON.parse(JSON.stringify(allMedications)),
      speciesBreakdown,
    }
  } catch (error) {
    console.error("Dashboard data fetch error:", error)
    return {
      stats: {
        totalPets: 0,
        totalOwners: 0,
        totalConsultations: 0,
        totalVaccinations: 0,
        totalAppointments: 0,
        todayAppointments: 0,
        lowStockCount: 0,
      },
      upcomingAppointments: [],
      recentConsultations: [],
      upcomingVaccinations: [],
      medications: [],
      speciesBreakdown: [],
    }
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData()
  const revenue = await getRevenue()
  const {
    stats,
    upcomingAppointments,
    recentConsultations,
    upcomingVaccinations,
    medications,
    speciesBreakdown,
  } = data

  const now = new Date()

  return (
    <div className="container mx-auto px-6 lg:px-10 space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
              <Activity className="h-5 w-5" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">
              Veterinary Clinic Dashboard
            </h1>
          </div>
          <p className="text-slate-500 font-inter text-sm">
            Live overview of patient care, daily appointments, medical consultations, and clinic inventory.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button asChild size="sm" variant="outline" className="gap-1.5 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground font-medium">
            <Link href="/admin/appointment">
              <Plus className="h-3.5 w-3.5" />
              <span>New Appointment</span>
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-1.5 shadow-sm font-medium">
            <Link href="/admin/medical-records">
              <Stethoscope className="h-3.5 w-3.5" />
              <span>Medical Records</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Top 4 Key Metric Cards in signature green theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Appointments */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-primary/40 transition-colors flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Today&apos;s Appointments
            </span>
            <p className="text-3xl font-bold font-outfit text-slate-900 tabular-nums">
              {stats.todayAppointments}
            </p>
            <p className="text-xs text-slate-400">
              {stats.totalAppointments} total visits on record
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Registered Patients */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-primary/40 transition-colors flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Patients (Pets)
            </span>
            <p className="text-3xl font-bold font-outfit text-slate-900 tabular-nums">
              {stats.totalPets}
            </p>
            <p className="text-xs text-slate-400">
              Across {stats.totalOwners} registered client owners
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <PawPrint className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Medical Consultations */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-primary/40 transition-colors flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Consultations Logged
            </span>
            <p className="text-3xl font-bold font-outfit text-slate-900 tabular-nums">
              {stats.totalConsultations}
            </p>
            <p className="text-xs text-slate-400">
              Clinical examinations & treatments
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Stethoscope className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Vaccinations / Boosters */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-primary/40 transition-colors flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Immunizations
            </span>
            <p className="text-3xl font-bold font-outfit text-slate-900 tabular-nums">
              {stats.totalVaccinations}
            </p>
            <p className="text-xs text-slate-400">
              Administered vaccines & boosters
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Syringe className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 font-outfit text-base">Revenue</h3>
              <p className="text-xs text-slate-500 font-inter">Based on recorded costings</p>
            </div>
          </div>
          <Button asChild variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary hover:bg-primary/10 text-xs font-medium">
            <Link href="/admin/costing">
              <span>View Costing</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:col-span-2">
            {[
              { label: "Today", value: revenue.today },
              { label: "This Month", value: revenue.month },
              { label: "All Time", value: revenue.total, sub: `${revenue.count} costing records` },
            ].map((r) => (
              <div key={r.label} className="p-4 rounded-lg border border-slate-100 bg-slate-50/50">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{r.label}</span>
                <p className="text-2xl font-bold font-outfit text-slate-900 tabular-nums mt-1">{peso(r.value)}</p>
                {r.sub && <p className="text-xs text-slate-400 mt-0.5">{r.sub}</p>}
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">This Month by Category</p>
            {revenue.byCategory.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No revenue recorded this month.</p>
            ) : (
              revenue.byCategory.map((c) => {
                const percent = Math.round((c.total / (revenue.month || 1)) * 100)
                return (
                  <div key={c.category} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-700">{CATEGORY_LABEL[c.category] || c.category}</span>
                      <span className="text-slate-500 tabular-nums">{peso(c.total)} ({percent}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Today & Upcoming Appointments Queue */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 font-outfit text-base">
                    Upcoming Appointments Schedule
                  </h3>
                  <p className="text-xs text-slate-500 font-inter">
                    Scheduled patient arrivals and checkups
                  </p>
                </div>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary hover:bg-primary/10 text-xs font-medium">
                <Link href="/admin/appointment">
                  <span>View All</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            <div className="p-4">
              {upcomingAppointments.length === 0 ? (
                <div className="py-10 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">No Upcoming Appointments</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
                      There are currently no upcoming clinic visits scheduled in the queue.
                    </p>
                  </div>
                  <Button asChild size="sm" variant="outline" className="gap-1.5 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                    <Link href="/admin/appointment">
                      <Plus className="h-3.5 w-3.5" />
                      <span>Book Appointment</span>
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {upcomingAppointments.map((apt) => {
                    const aptDate = new Date(apt.date)
                    const statusVariant =
                      apt.status === "CONFIRMED"
                        ? "bg-primary/10 text-primary border-primary/30"
                        : apt.status === "COMPLETED"
                        ? "bg-slate-100 text-slate-700 border-slate-300"
                        : apt.status === "CANCELLED"
                        ? "bg-destructive/10 text-destructive border-destructive/20"
                        : "bg-amber-50 text-amber-800 border-amber-300"

                    return (
                      <div
                        key={apt.id}
                        className="py-3.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 rounded-lg transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                            <PawPrint className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 text-sm">
                                {apt.pet?.name || "Patient"}
                              </span>
                              <Badge variant="outline" className="text-[11px] font-normal py-0 px-1.5 border-slate-200">
                                {apt.pet?.species || "Pet"}
                              </Badge>
                              <Badge variant="outline" className={`text-[10px] font-medium py-0 px-2 uppercase ${statusVariant}`}>
                                {apt.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5 font-medium">
                              Reason: {apt.reason}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Owner: {apt.owner?.firstName} {apt.owner?.lastName} • {apt.owner?.phone || "No phone"}
                            </p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col sm:items-end justify-between text-xs text-slate-500 font-medium shrink-0 pt-1 sm:pt-0">
                          <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            <span>
                              {aptDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {aptDate.toLocaleDateString(undefined, { month: "short", day: "numeric", weekday: "short" })}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Section: Recent Clinical Consultations */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 font-outfit text-base">
                    Recent Medical Consultations
                  </h3>
                  <p className="text-xs text-slate-500 font-inter">
                    Latest clinical diagnoses and treatment records
                  </p>
                </div>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1 text-primary hover:text-primary hover:bg-primary/10 text-xs font-medium">
                <Link href="/admin/consultation">
                  <span>View Consultations</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            <div className="p-4">
              {recentConsultations.length === 0 ? (
                <div className="py-10 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">No Consultations Recorded</p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
                      No clinical examinations on file. Record new consultations through Medical Records.
                    </p>
                  </div>
                  <Button asChild size="sm" variant="outline" className="gap-1.5 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground">
                    <Link href="/admin/medical-records">
                      <Plus className="h-3.5 w-3.5" />
                      <span>Log Consultation</span>
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentConsultations.map((c) => {
                    const cDate = new Date(c.date)
                    return (
                      <div
                        key={c.id}
                        className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-primary/40 transition-colors shadow-2xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-2 border-b border-slate-100 gap-1">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            <span className="font-semibold text-slate-900 text-sm">
                              {c.pet?.name || "Patient"}
                            </span>
                            <span className="text-xs text-slate-500">
                              ({c.pet?.species}{c.pet?.breed ? ` • ${c.pet.breed}` : ""})
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {cDate.toLocaleDateString()} at {cDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-0.5">
                              Diagnosis
                            </span>
                            <span className="font-semibold text-slate-800">
                              {c.diagnosis}
                            </span>
                          </div>
                          <div>
                            <span className="text-primary uppercase font-semibold text-[10px] block mb-0.5">
                              Treatment Plan
                            </span>
                            <span className="text-slate-600 line-clamp-1">
                              {c.treatment}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col wide on desktop) */}
        <div className="space-y-6">
          {/* Section: Vaccination Due / Boosters Monitor */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Syringe className="h-3.5 w-3.5" />
                </div>
                <h3 className="font-semibold text-slate-900 font-outfit text-sm">
                  Vaccination Due Alerts
                </h3>
              </div>
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-primary hover:bg-primary/10 px-2">
                <Link href="/admin/vaccination">
                  View All
                </Link>
              </Button>
            </div>

            <div className="p-4">
              {upcomingVaccinations.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-1.5 opacity-80" />
                  <p className="font-medium text-slate-700">All Immunizations Up to Date</p>
                  <p className="text-slate-400 mt-0.5">No immediate booster alerts.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {upcomingVaccinations.map((v) => {
                    const dueDate = new Date(v.nextDue)
                    const isOverdue = dueDate < now

                    return (
                      <div
                        key={v.id}
                        className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                            <span>{v.vaccineName}</span>
                            <span className="text-slate-400 font-normal">for</span>
                            <span className="text-primary">{v.pet?.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Due: {dueDate.toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={isOverdue ? "destructive" : "outline"}
                          className={`text-[10px] shrink-0 ${!isOverdue ? "border-amber-300 text-amber-800 bg-amber-50" : ""}`}
                        >
                          {isOverdue ? "Overdue" : "Due Soon"}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Section: Pharmacy Inventory Overview */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Pill className="h-3.5 w-3.5" />
                </div>
                <h3 className="font-semibold text-slate-900 font-outfit text-sm">
                  Pharmacy Inventory Status
                </h3>
              </div>
              <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-primary hover:bg-primary/10 px-2">
                <Link href="/admin/medication">
                  Manage
                </Link>
              </Button>
            </div>

            <div className="p-4">
              {medications.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500">
                  <Pill className="h-8 w-8 text-slate-300 mx-auto mb-1.5" />
                  <p className="font-medium text-slate-700">No Medications Logged</p>
                  <p className="text-slate-400 mt-0.5">Add pharmaceutical stock in Medication.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {medications.map((m) => {
                    const isLow = m.stock <= m.minStock
                    return (
                      <div
                        key={m.id}
                        className="p-2.5 rounded-lg border border-slate-100 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <div className="font-medium text-slate-900 flex items-center gap-1.5">
                            {m.name}
                            {isLow && (
                              <AlertTriangle className="h-3 w-3 text-amber-500" />
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">
                            {m.category || "General Medication"}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className={`font-semibold tabular-nums ${isLow ? "text-amber-600 font-bold" : "text-slate-900"}`}>
                            {m.stock} units
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Min: {m.minStock}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Section: Patient Demographics / Species Breakdown */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-2xs p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <PawPrint className="h-3.5 w-3.5" />
              </div>
              <h3 className="font-semibold text-slate-900 font-outfit text-sm">
                Patient Species Registry
              </h3>
            </div>

            {speciesBreakdown.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No registered animals yet.</p>
            ) : (
              <div className="space-y-3">
                {speciesBreakdown.map((item) => {
                  const percent = Math.round((item.count / (stats.totalPets || 1)) * 100)
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-700">{item.name}</span>
                        <span className="text-slate-500 font-mono">
                          {item.count} ({percent}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Clinic Quick Links */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2.5">
            <h4 className="font-semibold text-primary font-outfit text-xs uppercase tracking-wider">
              Quick Shortcuts
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/admin/pet"
                className="p-2 rounded-lg bg-white border border-primary/15 text-slate-800 hover:text-primary hover:border-primary font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <PawPrint className="h-3.5 w-3.5 text-primary" />
                <span>Pets Directory</span>
              </Link>
              <Link
                href="/admin/owner"
                className="p-2 rounded-lg bg-white border border-primary/15 text-slate-800 hover:text-primary hover:border-primary font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>Pet Owners</span>
              </Link>
              <Link
                href="/admin/medical-records"
                className="p-2 rounded-lg bg-white border border-primary/15 text-slate-800 hover:text-primary hover:border-primary font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span>EHR Records</span>
              </Link>
              <Link
                href="/admin/medication"
                className="p-2 rounded-lg bg-white border border-primary/15 text-slate-800 hover:text-primary hover:border-primary font-medium flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Pill className="h-3.5 w-3.5 text-primary" />
                <span>Pharmacy</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
