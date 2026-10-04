"use client"

import { useState } from "react"
import { EyeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"

function Row({ label, children }) {
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-sm text-slate-900 whitespace-pre-wrap">{children || "—"}</div>
    </div>
  )
}

export function ViewConsultationModal({ consultation }) {
  const [open, setOpen] = useState(false)
  const pet = consultation.pet
  const owner = pet?.owner

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <EyeIcon className="size-4 mr-1" /> View
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Consultation Record</DialogTitle>
            <DialogDescription>
              {new Date(consultation.date).toLocaleDateString()} {new Date(consultation.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Row label="Pet">{pet ? `${pet.name} (${pet.species}${pet.breed ? ` - ${pet.breed}` : ""})` : "Deleted Pet"}</Row>
              <Row label="Owner">{owner ? `${owner.firstName} ${owner.lastName}` : "No Owner"}</Row>
            </div>
            <Row label="Symptoms">{consultation.symptoms}</Row>
            <Row label="Diagnosis">{consultation.diagnosis}</Row>
            <Row label="Treatment">{consultation.treatment}</Row>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
