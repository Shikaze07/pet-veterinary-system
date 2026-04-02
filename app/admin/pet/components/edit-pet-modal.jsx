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

const petSchema = z.object({
  name: z.string().min(1, "Name is required"),
  species: z.string().min(1, "Species is required"),
  breed: z.string().optional(),
  gender: z.string().optional(),
  ageValue: z.union([z.string(), z.number()]).optional(),
  ageUnit: z.string().optional(),
  weight: z.union([z.string(), z.number()]).optional().transform(v => (v === "" || v === null) ? null : parseFloat(v)),
  color: z.string().optional(),
})

export function EditPetModal({ pet }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: pet.name,
      species: pet.species,
      breed: pet.breed || "",
      gender: pet.gender || "Male",
      ageValue: pet.age || "",
      ageUnit: "years",
      weight: pet.weight || "",
      color: pet.color || "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        name: pet.name,
        species: pet.species,
        breed: pet.breed || "",
        gender: pet.gender || "Male",
        ageValue: pet.age || "",
        ageUnit: "years",
        weight: pet.weight || "",
        color: pet.color || "",
      })
    }
  }, [open, pet, reset])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // Convert ageValue + ageUnit into a stored age (in years)
      let age = null
      if (data.ageValue && data.ageValue !== "") {
        const val = parseFloat(data.ageValue)
        age = data.ageUnit === "months" ? parseFloat((val / 12).toFixed(4)) : parseFloat(val)
      }
      const payload = { ...data, age }
      delete payload.ageValue
      delete payload.ageUnit

      const response = await fetch(`/api/admin/pets/${pet.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to update pet")
      }

      toast.success("Pet updated successfully")
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
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit pet</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Edit Pet Record</DialogTitle>
          <DialogDescription className="text-slate-500">
            Update the information for <span className="font-semibold text-slate-900">{pet.name}</span>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="edit-name">Pet Name *</FieldLabel>
              <Input
                id="edit-name"
                placeholder="Buddy"
                {...register("name")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-species">Species *</FieldLabel>
              <Select
                onValueChange={(value) => setValue("species", value)}
                defaultValue={pet.species}
                disabled={isSubmitting}
              >
                <SelectTrigger id="edit-species">
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dog">Dog</SelectItem>
                  <SelectItem value="Cat">Cat</SelectItem>
                  <SelectItem value="Bird">Bird</SelectItem>
                  <SelectItem value="Rabbit">Rabbit</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[errors.species]} />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="edit-breed">Breed (Optional)</FieldLabel>
              <Input
                id="edit-breed"
                placeholder="Golden Retriever"
                {...register("breed")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.breed]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-gender">Gender</FieldLabel>
              <Select
                onValueChange={(value) => setValue("gender", value)}
                defaultValue={pet.gender || "Male"}
                disabled={isSubmitting}
              >
                <SelectTrigger id="edit-gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[errors.gender]} />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field className="col-span-1">
              <FieldLabel htmlFor="edit-ageValue">Age</FieldLabel>
              <Input
                id="edit-ageValue"
                type="number"
                placeholder="3"
                {...register("ageValue")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.ageValue]} />
            </Field>
            <Field className="col-span-1">
              <FieldLabel htmlFor="edit-ageUnit">Unit</FieldLabel>
              <Select
                onValueChange={(value) => setValue("ageUnit", value)}
                defaultValue="years"
                disabled={isSubmitting}
              >
                <SelectTrigger id="edit-ageUnit">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="years">Years</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[errors.ageUnit]} />
            </Field>
            <Field className="col-span-1">
              <FieldLabel htmlFor="edit-weight">Weight (kg)</FieldLabel>
              <Input
                id="edit-weight"
                type="number"
                step="0.1"
                placeholder="12.5"
                {...register("weight")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.weight]} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="edit-color">Color / Markings</FieldLabel>
            <Textarea
              id="edit-color"
              placeholder="e.g. Brown with white spots on the chest and paws..."
              className="resize-none"
              rows={3}
              {...register("color")}
              disabled={isSubmitting}
            />
            <FieldError errors={[errors.color]} />
          </Field>

          <DialogFooter className="pt-6 sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false)
              }}
              disabled={isSubmitting}
              className="px-6 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
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
