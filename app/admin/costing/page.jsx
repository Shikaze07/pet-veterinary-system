import prisma from "@/lib/prisma"
import { CostingClient } from "./costing-client"

export const dynamic = "force-dynamic"

async function getData() {
  try {
    const [costings, owners, medications] = await Promise.all([
      prisma.costing.findMany({
        orderBy: { date: "desc" },
        include: { owner: true, pet: true, items: true },
      }),
      prisma.user.findMany({
        where: { role: "OWNER" },
        orderBy: { firstName: "asc" },
        select: { id: true, firstName: true, lastName: true, pets: { select: { id: true, name: true } } },
      }),
      prisma.medication.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, price: true, stock: true } }),
    ])
    return JSON.parse(JSON.stringify({ costings, owners, medications }))
  } catch (error) {
    console.error("Database fetch error (costing):", error)
    return { costings: [], owners: [], medications: [] }
  }
}

export default async function CostingPage() {
  const { costings, owners, medications } = await getData()
  return (
    <div className="container mx-auto px-10 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-outfit">Costing</h1>
        <p className="text-slate-500 font-inter">
          Record what each client is charged for consultations, medicine, and vaccinations.
        </p>
      </div>
      <CostingClient costings={costings} owners={owners} medications={medications} />
    </div>
  )
}
