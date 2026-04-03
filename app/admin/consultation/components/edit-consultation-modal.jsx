"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Pencil, Loader2 } from "lucide-react"

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
import { Combobox } from "@/components/ui/combobox"

const consultationSchema = z.object({
  petId: z.string().min(1, "Pet is required"),
  symptoms: z.string().min(5, "Symptoms must be at least 5 characters"),
  diagnosis: z.string().min(5, "Diagnosis must be at least 5 characters"),
  treatment: z.string().min(5, "Treatment must be at least 5 characters"),
  cost: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "Cost must be a valid positive number",
  }),
  date: z.string().optional(),
})

export function EditConsultationModal({ consultation }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pets, setPets] = useState([])
  const [isLoadingPets, setIsLoadingPets] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      petId: consultation.petId,
      symptoms: consultation.symptoms,
      diagnosis: consultation.diagnosis,
      treatment: consultation.treatment,
      cost: consultation.cost.toString(),
      date: new Date(consultation.date).toISOString().split("T")[0],
    },
  })

  useEffect(() => {
    reset({
      petId: consultation.petId,
      symptoms: consultation.symptoms,
      diagnosis: consultation.diagnosis,
      treatment: consultation.treatment,
      cost: consultation.cost.toString(),
      date: new Date(consultation.date).toISOString().split("T")[0],
    })
  }, [consultation, reset])

  const petIdValue = watch("petId")

  // Fetch pets for the dropdown
  useEffect(() => {
    if (open) {
      const fetchPets = async () => {
        setIsLoadingPets(true)
        try {
          const response = await fetch("/api/admin/pets?pageSize=500")
          if (!response.ok) throw new Error("Failed to fetch pets")
          const data = await response.json()
          setPets(data.pets || [])
        } catch (error) {
          toast.error("Could not load pets list")
        } finally {
          setIsLoadingPets(false)
        }
      }
      fetchPets()
    }
  }, [open])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/consultations/${consultation.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update consultation")
      }

      toast.success("Consultation record updated successfully")
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const petOptions = pets.map(pet => ({
    label: `${pet.name} (${pet.owner?.firstName} ${pet.owner?.lastName})`,
    value: pet.id,
    searchTerms: `${pet.species} ${pet.breed || ""} ${pet.owner?.email || ""}`
  }))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit consultation</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Consultation Record</DialogTitle>
          <DialogDescription>
            Update the record for this consultation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="edit-petId">Select Patient (Pet) *</FieldLabel>
              <Combobox
                options={petOptions}
                value={petIdValue}
                onValueChange={(value) => setValue("petId", value, { shouldValidate: true })}
                placeholder={isLoadingPets ? "Loading pets..." : "Search pet or owner..."}
                searchPlaceholder="Search by name, species or owner..."
                emptyMessage="No pets found."
                disabled={isSubmitting || isLoadingPets}
              />
              <FieldError errors={[errors.petId]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-date">Consultation Date *</FieldLabel>
              <Input
                id="edit-date"
                type="date"
                {...register("date")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.date]} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="edit-symptoms">Symptoms *</FieldLabel>
            <Textarea
              id="edit-symptoms"
              placeholder="Describe the observed symptoms..."
              {...register("symptoms")}
              disabled={isSubmitting}
            />
            <FieldError errors={[errors.symptoms]} />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="edit-diagnosis">Diagnosis *</FieldLabel>
              <Textarea
                id="edit-diagnosis"
                placeholder="Medical diagnosis..."
                {...register("diagnosis")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.diagnosis]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-treatment">Treatment Plan *</FieldLabel>
              <Textarea
                id="edit-treatment"
                placeholder="Prescribed medications and procedures..."
                {...register("treatment")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.treatment]} />
            </Field>
          </div>

          <Field className="max-w-[200px]">
            <FieldLabel htmlFor="edit-cost">Total Cost (PHP) *</FieldLabel>
            <Input
              id="edit-cost"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("cost")}
              disabled={isSubmitting}
            />
            <FieldError errors={[errors.cost]} />
          </Field>

          <DialogFooter className="pt-6 sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
                reset()
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Record"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
