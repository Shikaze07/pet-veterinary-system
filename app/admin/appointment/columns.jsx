"use client"

import { EditAppointmentModal } from "./components/edit-appointment-modal"
import { DeleteAppointmentDialog } from "./components/delete-appointment-dialog"
import { StatusBadge } from "./components/status-badge"
import { Calendar, Clock, User, Dog } from "lucide-react"

export const columns = [
  {
    accessorKey: "date",
    header: "Schedule",
    cell: ({ row }) => {
      const date = new Date(row.original.date)
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-900 font-semibold">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            {date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {date.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "pet",
    header: "Patient",
    cell: ({ row }) => {
      const pet = row.original.pet
      const owner = row.original.owner
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-900 font-medium">
            <Dog className="h-3.5 w-3.5 text-slate-400" />
            {pet?.name || "N/A"}
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <User className="h-3.5 w-3.5 text-slate-400" />
            {owner ? `${owner.firstName} ${owner.lastName}` : "No Owner"}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <div className="max-w-[200px] whitespace-normal text-sm text-slate-600 line-clamp-2">
        {row.original.reason}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const appointment = row.original

      return (
        <div className="flex items-center gap-2">
          <EditAppointmentModal appointment={appointment} />
          <DeleteAppointmentDialog 
            appointmentId={appointment.id} 
            petName={appointment.pet?.name || "this appointment"} 
          />
        </div>
      )
    },
  },
]
