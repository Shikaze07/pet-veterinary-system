"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Plus, Loader2 } from "lucide-react"

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

const vaccinationSchema = z.object({
  petId: z.string().min(1, "Pet is required"),
  vaccineName: z.string().min(1, "Vaccine name is required"),
  dateGiven: z.string().min(1, "Date given is required"),
  nextDue: z.string().optional(),
  notes: z.string().optional(),
})

export function AddVaccinationModal() {
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
    resolver: zodResolver(vaccinationSchema),
    defaultValues: {
      dateGiven: new Date().toISOString().split("T")[0],
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
        throw new Error(error.error || "Failed to record vaccination")
      }

      toast.success("Vaccination record saved")
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
          Record Vaccination
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">New Vaccination Record</DialogTitle>
          <DialogDescription>
            Enter the vaccination details and schedule the next booster.
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
            <FieldError errors={[errors.petId]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="vaccineName">Vaccine Name *</FieldLabel>
            <Input
              id="vaccineName"
              placeholder="e.g. Anti-Rabies, DHPP"
              {...register("vaccineName")}
              disabled={isSubmitting}
            />
            <FieldError errors={[errors.vaccineName]} />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="dateGiven">Date Given *</FieldLabel>
              <Input
                id="dateGiven"
                type="date"
                {...register("dateGiven")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.dateGiven]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="nextDue">Next Due Date (Booster)</FieldLabel>
              <Input
                id="nextDue"
                type="date"
                {...register("nextDue")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.nextDue]} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="notes">Notes / Observations</FieldLabel>
            <Textarea
              id="notes"
              placeholder="Any reaction or specific vaccine serial number..."
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
                  Saving...
                </>
              ) : (
                "Save Record"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
