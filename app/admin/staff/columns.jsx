"use client"

import { Badge } from "@/components/ui/badge"
import { EditStaffModal } from "./components/edit-staff-modal"
import { DeleteStaffDialog } from "./components/delete-staff-dialog"

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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role
      const variant = role === "ADMIN" ? "default" : "secondary"
      const label = role === "ADMIN" ? "Administrator" : "Veterinarian"

      return (
        <Badge variant={variant} className="capitalize font-medium">
          {label}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const staff = row.original

      return (
        <div className="flex items-center gap-2">
          <EditStaffModal staff={staff} />
          <DeleteStaffDialog 
            staffId={staff.id} 
            staffName={`${staff.firstName} ${staff.lastName}`} 
          />
        </div>
      )
    },
  },
]
