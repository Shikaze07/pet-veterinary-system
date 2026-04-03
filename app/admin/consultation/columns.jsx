"use client"

import { EditConsultationModal } from "./components/edit-consultation-modal"
import { DeleteConsultationDialog } from "./components/delete-consultation-dialog"

export const columns = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.date)
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
  },
  {
    accessorKey: "pet",
    header: "Pet",
    cell: ({ row }) => {
      const pet = row.original.pet
      if (!pet) return <span className="text-slate-400 italic">Deleted Pet</span>

      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{pet.name}</span>
          <span className="text-xs text-slate-500">{pet.species} - {pet.breed || "No Breed"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      const owner = row.original.pet?.owner
      if (!owner) return <span className="text-slate-400 italic">No Owner</span>

      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{`${owner.firstName} ${owner.lastName}`}</span>
          <span className="text-xs text-slate-500">{owner.phone || "No Phone"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "symptoms",
    header: "Symptoms",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.original.symptoms}>
        {row.original.symptoms}
      </div>
    ),
  },
  {
    accessorKey: "diagnosis",
    header: "Diagnosis",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate font-semibold" title={row.original.diagnosis}>
        {row.original.diagnosis}
      </div>
    ),
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }) => {
      const amount = parseFloat(row.original.cost)
      return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
      }).format(amount)
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const consultation = row.original

      return (
        <div className="flex items-center gap-2">
          <EditConsultationModal consultation={consultation} />
          <DeleteConsultationDialog 
            consultationId={consultation.id} 
            petName={consultation.pet?.name || "this consultation"} 
          />
        </div>
      )
    },
  },
]
