"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Plus, Loader2, Syringe } from "lucide-react"

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

const vaccinationSchema = z.object({
  petId: z.string().min(1, "Pet is required"),
  vaccineName: z.string().min(2, "Vaccine name is required"),
  dateGiven: z.string().min(1, "Date given is required"),
  nextDue: z.string().optional(),
  notes: z.string().optional(),
})

export function AddVaccinationQuickModal({ pet, buttonVariant = "default", buttonText = "Log Vaccination", onAdded }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vaccinationSchema),
    defaultValues: {
      petId: pet?.id || "",
      vaccineName: "",
      dateGiven: new Date().toISOString().split("T")[0],
      nextDue: "",
      notes: "",
    },
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/vaccinations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to log vaccination")
      }

      toast.success("Vaccination recorded successfully")
      reset()
      setOpen(false)
      if (onAdded) onAdded()
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
        {buttonVariant === "outline" ? (
          <Button variant="outline" size="sm" className="gap-1.5 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground font-medium">
            <Plus className="h-3.5 w-3.5" />
            {buttonText}
          </Button>
        ) : buttonVariant === "ghost" ? (
          <Button variant="ghost" size="sm" className="gap-1.5 hover:bg-primary/10 text-primary text-xs font-medium">
            <Plus className="h-3.5 w-3.5" />
            {buttonText}
          </Button>
        ) : (
          <Button size="sm" className="gap-1.5 shadow-sm font-medium">
            <Syringe className="h-3.5 w-3.5" />
            {buttonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Syringe className="h-4 w-4" />
            </div>
            <DialogTitle className="text-xl font-bold font-outfit text-slate-900">
              Log Vaccination Record
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-500 font-inter">
            Document administered vaccines and scheduled boosters for{" "}
            <span className="font-semibold text-primary">{pet?.name || "Patient"}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <input type="hidden" {...register("petId")} value={pet?.id} />

          <Field>
            <FieldLabel htmlFor="vaccineName">Vaccine Name / Type *</FieldLabel>
            <Input
              id="vaccineName"
              placeholder="e.g. Rabies, DHPP, Bordetella, FVRCP..."
              {...register("vaccineName")}
            />
            {errors.vaccineName && <FieldError>{errors.vaccineName.message}</FieldError>}
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="dateGiven">Date Administered *</FieldLabel>
              <Input
                id="dateGiven"
                type="date"
                {...register("dateGiven")}
              />
              {errors.dateGiven && <FieldError>{errors.dateGiven.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="nextDue">Next Booster Due (Optional)</FieldLabel>
              <Input
                id="nextDue"
                type="date"
                {...register("nextDue")}
              />
              {errors.nextDue && <FieldError>{errors.nextDue.message}</FieldError>}
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="notes">Clinical Notes / Batch / Reaction (Optional)</FieldLabel>
            <Textarea
              id="notes"
              rows={3}
              placeholder="e.g. Lot #A12498, administered sub-Q left shoulder. Patient tolerated procedure well."
              {...register("notes")}
            />
            {errors.notes && <FieldError>{errors.notes.message}</FieldError>}
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
              Save Immunization
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
