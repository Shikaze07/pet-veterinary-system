"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Plus, Loader2, Stethoscope } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"

const consultationSchema = z.object({
  petId: z.string().min(1, "Please select a pet"),
  date: z.string().min(1, "Date is required"),
  symptoms: z.string().min(3, "Symptoms must be at least 3 characters"),
  diagnosis: z.string().min(3, "Diagnosis must be at least 3 characters"),
  treatment: z.string().min(3, "Treatment plan must be at least 3 characters"),
})

const selectCls = "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-950"

export function AddConsultationModal({ pets = [] }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      petId: "",
      date: new Date().toISOString().split("T")[0],
      symptoms: "",
      diagnosis: "",
      treatment: "",
    },
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to log consultation")
      }

      toast.success("Consultation recorded successfully")
      reset()
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 shadow-sm font-medium">
          <Plus className="h-4 w-4" />
          Log Consultation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Stethoscope className="h-4 w-4" />
            </div>
            <DialogTitle className="text-xl font-bold font-outfit text-slate-900">
              Log Consultation
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-500 font-inter">
            Record clinical examination findings, diagnoses, and care instructions for a pet.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <Field>
            <FieldLabel htmlFor="petId">Patient (Pet) *</FieldLabel>
            <select id="petId" className={selectCls} {...register("petId")}>
              <option value="">Select a pet…</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.species}) {p.owner ? `— Owner: ${p.owner.firstName} ${p.owner.lastName}` : ""}
                </option>
              ))}
            </select>
            {errors.petId && <FieldError>{errors.petId.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="date">Consultation Date *</FieldLabel>
            <Input
              id="date"
              type="date"
              {...register("date")}
              className="w-full"
            />
            {errors.date && <FieldError>{errors.date.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="symptoms">Observed Symptoms / Chief Complaint *</FieldLabel>
            <Textarea
              id="symptoms"
              rows={3}
              placeholder="e.g. Lethargy, persistent scratching behind ears, loss of appetite..."
              {...register("symptoms")}
            />
            {errors.symptoms && <FieldError>{errors.symptoms.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="diagnosis">Clinical Diagnosis *</FieldLabel>
            <Input
              id="diagnosis"
              placeholder="e.g. Acute Otitis Externa, Allergic Dermatitis..."
              {...register("diagnosis")}
            />
            {errors.diagnosis && <FieldError>{errors.diagnosis.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="treatment">Prescribed Treatment & Care Plan *</FieldLabel>
            <Textarea
              id="treatment"
              rows={3}
              placeholder="e.g. Clean ears daily, administer topical antibiotic drops 2x daily for 7 days..."
              {...register("treatment")}
            />
            {errors.treatment && <FieldError>{errors.treatment.message}</FieldError>}
          </Field>

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-1.5"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Consultation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
