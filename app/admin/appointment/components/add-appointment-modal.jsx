"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Plus, Loader2, Calendar as CalendarIcon } from "lucide-react"

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

const appointmentSchema = z.object({
  petId: z.string().min(1, "Pet is required"),
  ownerId: z.string().min(1, "Owner is required"),
  date: z.string().min(1, "Date and time are required"),
  reason: z.string().min(1, "Reason for appointment is required"),
  notes: z.string().optional(),
})

export function AddAppointmentModal() {
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
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: "",
      reason: "",
      notes: "",
    },
  })

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

  // Automatically set ownerId when petId changes
  useEffect(() => {
    if (petIdValue) {
      const selectedPet = pets.find(p => p.id === petIdValue)
      if (selectedPet && selectedPet.owner) {
        setValue("ownerId", selectedPet.owner.id, { shouldValidate: true })
      }
    }
  }, [petIdValue, pets, setValue])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to schedule appointment")
      }

      toast.success("Appointment scheduled successfully")
      setOpen(false)
      reset()
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
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Schedule Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">New Appointment</DialogTitle>
          <DialogDescription>
            Schedule a visit for a pet. Selecting a pet will automatically link their owner.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <Field>
            <FieldLabel htmlFor="petId">Select Patient (Pet) *</FieldLabel>
            <Combobox
              options={petOptions}
              value={petIdValue}
              onValueChange={(value) => setValue("petId", value, { shouldValidate: true })}
              placeholder={isLoadingPets ? "Loading pets..." : "Search pet or owner..."}
              searchPlaceholder="Search by name, species or owner..."
              emptyMessage="No pets found."
              disabled={isSubmitting || isLoadingPets}
            />
            <input type="hidden" {...register("ownerId")} />
            <FieldError errors={[errors.petId, errors.ownerId]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="date">Appointment Date & Time *</FieldLabel>
            <Input
              id="date"
              type="datetime-local"
              {...register("date")}
              disabled={isSubmitting}
            />
            <FieldError errors={[errors.date]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="reason">Reason for Visit *</FieldLabel>
            <Input
              id="reason"
              placeholder="e.g. Annual Checkup, Vaccination, Surgery"
              {...register("reason")}
              disabled={isSubmitting}
            />
            <FieldError errors={[errors.reason]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="notes">Special Notes</FieldLabel>
            <Textarea
              id="notes"
              placeholder="Any specific concerns or preparations needed?"
              {...register("notes")}
              disabled={isSubmitting}
            />
            <FieldError errors={[errors.notes]} />
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
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Visit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
