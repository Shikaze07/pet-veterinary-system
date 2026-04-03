"use client"

import { EditVaccinationModal } from "./components/edit-vaccination-modal"
import { DeleteVaccinationDialog } from "./components/delete-vaccination-dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

export const columns = [
  {
    accessorKey: "dateGiven",
    header: "Date Given",
    cell: ({ row }) => {
      const date = new Date(row.original.dateGiven)
      return date.toLocaleDateString()
    },
  },
  {
    accessorKey: "pet",
    header: "Patient",
    cell: ({ row }) => {
      const pet = row.original.pet
      if (!pet) return <span className="text-slate-400 italic">Deleted Pet</span>

      return (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{pet.name}</span>
          <span className="text-xs text-slate-500">
            {pet.owner ? `${pet.owner.firstName} ${pet.owner.lastName}` : "No Owner"}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "vaccineName",
    header: "Vaccine",
    cell: ({ row }) => (
      <span className="font-medium text-slate-900">{row.original.vaccineName}</span>
    ),
  },
  {
    accessorKey: "nextDue",
    header: "Next Due Date",
    cell: ({ row }) => {
      if (!row.original.nextDue) return <span className="text-slate-400">-</span>
      
      const nextDue = new Date(row.original.nextDue)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const isOverdue = nextDue < today
      const isSoon = !isOverdue && (nextDue.getTime() - today.getTime()) / (1000 * 3600 * 24) <= 30

      return (
        <div className="flex items-center gap-2">
          <span className={isOverdue ? "text-red-600 font-medium" : "text-slate-700"}>
            {nextDue.toLocaleDateString()}
          </span>
          {isOverdue && (
            <Badge variant="destructive" className="text-[10px] uppercase font-bold px-1.5 py-0">
              Overdue
            </Badge>
          )}
          {isSoon && (
            <Badge variant="outline" className="text-[10px] uppercase font-bold px-1.5 py-0 border-amber-200 bg-amber-50 text-amber-700">
              Due Soon
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate text-slate-500 text-sm" title={row.original.notes}>
        {row.original.notes || "-"}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const vaccination = row.original

      return (
        <div className="flex items-center gap-2">
          <EditVaccinationModal vaccination={vaccination} />
          <DeleteVaccinationDialog 
            vaccinationId={vaccination.id} 
            petName={vaccination.pet?.name || "this record"} 
          />
        </div>
      )
    },
  },
]
