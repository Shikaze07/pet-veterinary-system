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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]),
})

export function EditAppointmentModal({ appointment }) {
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
      petId: appointment.petId,
      ownerId: appointment.ownerId,
      date: new Date(appointment.date).toISOString().slice(0, 16),
      reason: appointment.reason,
      notes: appointment.notes || "",
      status: appointment.status,
    },
  })

  useEffect(() => {
    reset({
      petId: appointment.petId,
      ownerId: appointment.ownerId,
      date: new Date(appointment.date).toISOString().slice(0, 16),
      reason: appointment.reason,
      notes: appointment.notes || "",
      status: appointment.status,
    })
  }, [appointment, reset])

  const petIdValue = watch("petId")
  const statusValue = watch("status")

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
    if (petIdValue && pets.length > 0) {
      const selectedPet = pets.find(p => p.id === petIdValue)
      if (selectedPet && selectedPet.owner) {
        setValue("ownerId", selectedPet.owner.id, { shouldValidate: true })
      }
    }
  }, [petIdValue, pets, setValue])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/appointments/${appointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update appointment")
      }

      toast.success("Appointment updated successfully")
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
          <span className="sr-only">Edit appointment</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Appointment</DialogTitle>
          <DialogDescription>
            Update visit details or modify the appointment status.
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
              <input type="hidden" {...register("ownerId")} />
              <FieldError errors={[errors.petId, errors.ownerId]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-status">Status *</FieldLabel>
              <Select
                value={statusValue}
                onValueChange={(value) => setValue("status", value, { shouldValidate: true })}
                disabled={isSubmitting}
              >
                <SelectTrigger id="edit-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                  <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                  <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[errors.status]} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="edit-date">Appointment Date & Time *</FieldLabel>
            <Input
              id="edit-date"
              type="datetime-local"
              {...register("date")}
              disabled={isSubmitting}
            />
            <FieldError errors={[errors.date]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="edit-reason">Reason for Visit *</FieldLabel>
            <Input
              id="edit-reason"
              placeholder="e.g. Annual Checkup, Vaccination, Surgery"
              {...register("reason")}
              disabled={isSubmitting}
            />
            <FieldError errors={[errors.reason]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="edit-notes">Special Notes</FieldLabel>
            <Textarea
              id="edit-notes"
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
                  Updating...
                </>
              ) : (
                "Update Appointment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
