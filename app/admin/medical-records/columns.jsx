"use client"

import { Badge } from "@/components/ui/badge"
import { ViewMedicalRecordModal } from "./components/view-medical-record-modal"
import { AddConsultationQuickModal } from "./components/add-consultation-quick-modal"
import { AddVaccinationQuickModal } from "./components/add-vaccination-quick-modal"
import { PawPrint, AlertCircle, CheckCircle2, Stethoscope, Syringe, Calendar } from "lucide-react"

export const columns = [
  {
    accessorKey: "name",
    header: "Patient",
    cell: ({ row }) => {
      const pet = row.original
      return (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <PawPrint className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900">{pet.name}</span>
            <span className="text-xs text-slate-500">
              {pet.species} {pet.breed ? `• ${pet.breed}` : ""}
            </span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "vitals",
    header: "Vitals",
    cell: ({ row }) => {
      const pet = row.original
      const parts = []
      if (pet.gender) parts.push(pet.gender.toLowerCase())
      if (pet.age !== null && pet.age !== undefined) parts.push(`${pet.age}y`)
      if (pet.weight) parts.push(`${pet.weight}kg`)

      return (
        <span className="text-xs text-slate-700 capitalize">
          {parts.length > 0 ? parts.join(" • ") : "—"}
        </span>
      )
    },
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => {
      const owner = row.original.owner
      if (!owner) return <span className="text-slate-400 italic text-xs">No Owner</span>

      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 text-sm">
            {owner.firstName} {owner.lastName}
          </span>
          <span className="text-xs text-slate-500">{owner.phone || owner.email || "No Contact"}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "history",
    header: "Clinical Records",
    cell: ({ row }) => {
      const pet = row.original
      const cCount = pet.consultations?.length || 0
      const vCount = pet.vaccinations?.length || 0
      const aCount = pet.appointments?.length || 0

      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="outline" className="border-primary/30 text-slate-800 text-[11px] gap-1 px-1.5 py-0.5 bg-primary/5">
            <Stethoscope className="h-3 w-3 text-primary" />
            {cCount} Consult{cCount === 1 ? "" : "s"}
          </Badge>
          <Badge variant="outline" className="border-primary/30 text-slate-800 text-[11px] gap-1 px-1.5 py-0.5 bg-primary/5">
            <Syringe className="h-3 w-3 text-primary" />
            {vCount} Vaccine{vCount === 1 ? "" : "s"}
          </Badge>
          <Badge variant="secondary" className="text-slate-600 bg-slate-100 text-[11px] gap-1 px-1.5 py-0.5">
            <Calendar className="h-3 w-3 text-slate-400" />
            {aCount} Visit{aCount === 1 ? "" : "s"}
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "latestConsultation",
    header: "Latest Diagnosis",
    cell: ({ row }) => {
      const consultations = row.original.consultations || []
      if (consultations.length === 0) {
        return <span className="text-xs text-slate-400 italic">No consultations</span>
      }

      const latest = consultations[0]
      const date = new Date(latest.date)

      return (
        <div className="flex flex-col max-w-[200px]">
          <span className="text-sm font-medium text-slate-900 truncate" title={latest.diagnosis}>
            {latest.diagnosis}
          </span>
          <span className="text-[11px] text-slate-500">
            {date.toLocaleDateString()}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "immunizationStatus",
    header: "Immunization",
    cell: ({ row }) => {
      const vaccinations = row.original.vaccinations || []
      if (vaccinations.length === 0) {
        return (
          <Badge variant="secondary" className="text-xs text-slate-500 bg-slate-100">
            None Logged
          </Badge>
        )
      }

      const now = new Date()
      const hasOverdue = vaccinations.some(
        (v) => v.nextDue && new Date(v.nextDue) < now
      )

      if (hasOverdue) {
        return (
          <Badge variant="destructive" className="text-xs gap-1">
            <AlertCircle className="h-3 w-3" />
            Overdue
          </Badge>
        )
      }

      const hasNextDue = vaccinations.some((v) => v.nextDue)
      if (hasNextDue) {
        return (
          <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10 text-xs gap-1 font-medium">
            <CheckCircle2 className="h-3 w-3 text-primary" />
            Up to date
          </Badge>
        )
      }

      return (
        <Badge variant="outline" className="text-xs border-slate-300 text-slate-700">
          Recorded
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const pet = row.original

      return (
        <div className="flex items-center gap-1.5 justify-end">
          <ViewMedicalRecordModal pet={pet} />
          <AddConsultationQuickModal
            pet={pet}
            buttonVariant="ghost"
            buttonText="+ Consult"
          />
          <AddVaccinationQuickModal
            pet={pet}
            buttonVariant="ghost"
            buttonText="+ Vaccine"
          />
        </div>
      )
    },
  },
]
