"use client"

import { Badge } from "@/components/ui/badge"
import { EditOwnerModal } from "./components/edit-owner-modal"
import { DeleteOwnerDialog } from "./components/delete-owner-dialog"

export const columns = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "middleName",
    header: "Middle Name",
    cell: ({ row }) => row.original.middleName || "N/A",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone || "N/A",
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => row.original.address || "N/A",
  },
  {
    accessorKey: "pets",
    header: "Pets",
    cell: ({ row }) => {
      const pets = row.original.pets || []
      if (pets.length === 0) return <span className="text-slate-400 italic">No pets</span>

      return (
        <div className="flex flex-wrap gap-1">
          {pets.map((pet) => (
            <Badge key={pet.id} variant="outline" className="text-[10px]">
              {pet.name}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const owner = row.original

      return (
        <div className="flex items-center gap-2">
          <EditOwnerModal owner={owner} />
          <DeleteOwnerDialog 
            ownerId={owner.id} 
            ownerName={`${owner.firstName} ${owner.lastName}`} 
          />
        </div>
      )
    },
  },
]
