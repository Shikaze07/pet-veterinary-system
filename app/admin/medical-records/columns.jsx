"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import { Stethoscope, Syringe, Calendar, EyeIcon } from "lucide-react"

const TYPE_META = {
  consultation: { label: "Consultation", icon: Stethoscope, cls: "bg-blue-50 text-blue-700 border-blue-200" },
  vaccination: { label: "Vaccination", icon: Syringe, cls: "bg-violet-50 text-violet-700 border-violet-200" },
  appointment: { label: "Appointment", icon: Calendar, cls: "bg-amber-50 text-amber-700 border-amber-200" },
}

const fmtDate = (d) => new Date(d).toLocaleDateString()

const APPT_STATUS = {
  PENDING: { label: "Pending", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  CONFIRMED: { label: "Confirmed", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  COMPLETED: { label: "Completed", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CANCELLED: { label: "Cancelled", cls: "bg-red-50 text-red-700 border-red-200" },
}

function getStatus(record) {
  if (record.type === "appointment") {
    return APPT_STATUS[record.status] || { label: record.status, cls: "bg-slate-100 text-slate-700" }
  }
  if (record.type === "vaccination") {
    if (!record.nextDue) return { label: "Administered", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" }
    const days = Math.ceil((new Date(record.nextDue) - new Date()) / 86400000)
    if (days < 0) return { label: "Booster Overdue", cls: "bg-red-50 text-red-700 border-red-200" }
    if (days <= 14) return { label: `Booster in ${days}d`, cls: "bg-amber-50 text-amber-700 border-amber-200" }
    return { label: "Up to date", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" }
  }
  return { label: "Completed", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" }
}

function Detail({ label, children }) {
  if (!children) return null
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-sm text-slate-900 whitespace-pre-wrap">{children}</div>
    </div>
  )
}

function ViewRecordModal({ record }) {
  const [open, setOpen] = useState(false)
  const { pet } = record
  const meta = TYPE_META[record.type]

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <EyeIcon className="size-4 mr-1" /> View
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{meta.label} · {pet.name}</DialogTitle>
            <DialogDescription>{fmtDate(record.date)}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Detail label="Pet">{`${pet.name} (${pet.species}${pet.breed ? ` - ${pet.breed}` : ""})`}</Detail>
              <Detail label="Owner">{pet.owner ? `${pet.owner.firstName} ${pet.owner.lastName}` : "No Owner"}</Detail>
            </div>
            {record.type === "consultation" && (
              <>
                <Detail label="Symptoms">{record.symptoms}</Detail>
                <Detail label="Diagnosis">{record.summary}</Detail>
                <Detail label="Treatment">{record.treatment}</Detail>
              </>
            )}
            {record.type === "vaccination" && (
              <>
                <Detail label="Vaccine">{record.summary}</Detail>
                <Detail label="Next due">{record.nextDue && fmtDate(record.nextDue)}</Detail>
                <Detail label="Notes">{record.notes}</Detail>
              </>
            )}
            {record.type === "appointment" && (
              <>
                <Detail label="Reason">{record.summary}</Detail>
                <Detail label="Status">{record.status}</Detail>
                <Detail label="Notes">{record.notes}</Detail>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export const columns = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <span className="text-sm whitespace-nowrap">{fmtDate(row.original.date)}</span>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const m = TYPE_META[row.original.type]
      return (
        <Badge variant="outline" className={`gap-1 text-[11px] ${m.cls}`}>
          <m.icon className="h-3 w-3" /> {m.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "pet",
    header: "Patient",
    cell: ({ row }) => {
      const pet = row.original.pet
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{pet.name}</span>
          <span className="text-xs text-slate-500">{pet.species}{pet.breed ? ` • ${pet.breed}` : ""}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      const owner = row.original.pet.owner
      if (!owner) return <span className="text-slate-400 italic text-xs">No Owner</span>
      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 text-sm">{owner.firstName} {owner.lastName}</span>
          <span className="text-xs text-slate-500">{owner.phone || owner.email || "No Contact"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "summary",
    header: "Details",
    cell: ({ row }) => (
      <span className="block max-w-[260px] truncate text-sm text-slate-900" title={row.original.summary}>
        {row.original.summary}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = getStatus(row.original)
      return <Badge variant="outline" className={`text-[11px] ${s.cls}`}>{s.label}</Badge>
    },
  },
  {
    id: "actions",
    header: "Actions",
    meta: {
      headerClassName: "text-right",
      cellClassName: "text-right",
    },
    cell: ({ row }) => (
      <div className="flex justify-end">
        <ViewRecordModal record={row.original} />
      </div>
    ),
  },
]
