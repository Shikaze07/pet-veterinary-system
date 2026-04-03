"use client"

import { EditMedicationModal } from "./components/edit-medication-modal"
import { DeleteMedicationDialog } from "./components/delete-medication-dialog"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

export const columns = [
  {
    accessorKey: "name",
    header: "Medication Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-slate-900">{row.original.name}</span>
        <span className="text-xs text-slate-500">{row.original.brand || "Generics"}</span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal border-slate-200">
        {row.original.category || "Uncategorized"}
      </Badge>
    ),
  },
  {
    accessorKey: "stock",
    header: "Inventory",
    cell: ({ row }) => {
      const stock = row.original.stock
      const minStock = row.original.minStock
      const isLowStock = stock <= minStock

      return (
        <div className="flex items-center gap-2">
          <span className={`font-mono font-medium ${isLowStock ? "text-red-600" : "text-slate-700"}`}>
            {stock}
          </span>
          {isLowStock && (
            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
              <AlertTriangle className="h-3 w-3" />
              Low
            </div>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "minStock",
    header: "Min. Threshold",
    cell: ({ row }) => <span className="text-slate-500 font-mono">{row.original.minStock}</span>,
  },
  {
    accessorKey: "price",
    header: "Unit Price",
    cell: ({ row }) => {
      const amount = parseFloat(row.original.price)
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
      const medication = row.original

      return (
        <div className="flex items-center gap-2">
          <EditMedicationModal medication={medication} />
          <DeleteMedicationDialog 
            medicationId={medication.id} 
            medicationName={medication.name} 
          />
        </div>
      )
    },
  },
]
