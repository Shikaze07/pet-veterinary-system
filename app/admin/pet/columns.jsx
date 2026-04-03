"use client"

import { Badge } from "@/components/ui/badge"
import { EditPetModal } from "./components/edit-pet-modal"
import { DeletePetDialog } from "./components/delete-pet-dialog"

export const columns = [
  {
    accessorKey: "name",
    header: "Pet Name",
  },
  {
    accessorKey: "species",
    header: "Species",
  },
  {
    accessorKey: "breed",
    header: "Breed",
    cell: ({ row }) => row.original.breed || "N/A",
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => <span className="capitalize">{row.original.gender || "N/A"}</span>,
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }) => row.original.age !== null ? `${row.original.age}` : "N/A",
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      const owner = row.original.owner
      if (!owner) return <span className="text-slate-400 italic">No Owner</span>

      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900">{`${owner.firstName} ${owner.lastName}`}</span>
          <span className="text-xs text-slate-500">{owner.email}</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const pet = row.original

      return (
        <div className="flex items-center gap-2">
          <EditPetModal pet={pet} />
          <DeletePetDialog
            petId={pet.id}
            petName={pet.name}
          />
        </div>
      )
    },
  },
]
