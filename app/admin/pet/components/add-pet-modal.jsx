"use client"

import { useState } from "react"
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
  ageValue: z.string().optional(),
  ageUnit: z.string().optional(),
  weight: z.string().optional().transform(v => v === "" ? null : parseFloat(v)),
  color: z.string().optional(),
})

export function AddPetModal() {
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
      name: "",
      species: "",
      gender: "Male",
      ageUnit: "years",
    },
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      // Convert ageValue + ageUnit into fractional years for the `age` field
      let age = null
      if (data.ageValue && data.ageValue !== "") {
        const val = parseFloat(data.ageValue)
        age = data.ageUnit === "months" ? parseFloat((val / 12).toFixed(4)) : parseFloat(val)
      }
      const payload = { ...data, age }
      delete payload.ageValue
      delete payload.ageUnit

      const response = await fetch("/api/admin/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error("Failed to create pet")
      }

      toast.success("Pet added successfully")
      setOpen(false)
      reset()
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
        <Button >
          <Plus className="h-4 w-4" />
          Add Pet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Add New Pet</DialogTitle>
          <DialogDescription className="text-slate-500">
            Create a new pet clinical record. Pets can be linked to owners later in the Owner module.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="name">Pet Name *</FieldLabel>
              <Input
                id="name"
                placeholder="Buddy"
                {...register("name")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="species">Species *</FieldLabel>
              <Select
                onValueChange={(value) => setValue("species", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="species">
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
              <FieldLabel htmlFor="breed">Breed (Optional)</FieldLabel>
              <Input
                id="breed"
                placeholder="Golden Retriever"
                {...register("breed")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.breed]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="gender">Gender</FieldLabel>
              <Select
                onValueChange={(value) => setValue("gender", value)}
                defaultValue="Male"
                disabled={isSubmitting}
              >
                <SelectTrigger id="gender">
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
              <FieldLabel htmlFor="ageValue">Age</FieldLabel>
              <Input
                id="ageValue"
                type="number"
                placeholder="3"
                {...register("ageValue")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.ageValue]} />
            </Field>
            <Field className="col-span-1">
              <FieldLabel htmlFor="ageUnit">Unit</FieldLabel>
              <Select
                onValueChange={(value) => setValue("ageUnit", value)}
                defaultValue="years"
                disabled={isSubmitting}
              >
                <SelectTrigger id="ageUnit">
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
              <FieldLabel htmlFor="weight">Weight (kg)</FieldLabel>
              <Input
                id="weight"
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
            <FieldLabel htmlFor="color">Color / Markings</FieldLabel>
            <Textarea
              id="color"
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
                reset()
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
                  Creating...
                </>
              ) : (
                "Create Pet Record"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
