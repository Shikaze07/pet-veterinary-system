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

const petSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  species: z.string().min(1, "Species is required"),
  breed: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]),
  age: z.string().optional(),
  weight: z.string().optional(),
  color: z.string().optional(),
  ownerId: z.string().min(1, "Owner is required"),
})

export function EditPetModal({ pet }) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [owners, setOwners] = useState([])
  const [isLoadingOwners, setIsLoadingOwners] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: pet.name,
      species: pet.species,
      breed: pet.breed || "",
      gender: pet.gender || "MALE",
      age: pet.age !== null ? pet.age.toString() : "",
      weight: pet.weight !== null ? pet.weight.toString() : "",
      color: pet.color || "",
      ownerId: pet.ownerId || "",
    },
  })

  const ownerIdValue = watch("ownerId")

  // Fetch owners for the dropdown
  useEffect(() => {
    if (open) {
      const fetchOwners = async () => {
        setIsLoadingOwners(true)
        try {
          const response = await fetch("/api/admin/owners?pageSize=500") 
          if (!response.ok) throw new Error("Failed to fetch owners")
          const data = await response.json()
          setOwners(data.owners || [])
        } catch (error) {
          toast.error("Could not load owners list")
        } finally {
          setIsLoadingOwners(false)
        }
      }
      fetchOwners()
    }
  }, [open])

  useEffect(() => {
    reset({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || "",
      gender: pet.gender || "MALE",
      age: pet.age !== null ? pet.age.toString() : "",
      weight: pet.weight !== null ? pet.weight.toString() : "",
      color: pet.color || "",
      ownerId: pet.ownerId || "",
    })
  }, [pet, reset])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/pets/${pet.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update pet")
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

  const ownerOptions = owners.map(owner => ({
    label: `${owner.firstName} ${owner.lastName}`,
    value: owner.id,
    searchTerms: owner.email
  }))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit pet</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Pet Details</DialogTitle>
          <DialogDescription>
            Update information for the registered pet.
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
              <FieldLabel htmlFor="edit-owner">Assigned Owner *</FieldLabel>
              <Combobox
                options={ownerOptions}
                value={ownerIdValue}
                onValueChange={(value) => setValue("ownerId", value, { shouldValidate: true })}
                placeholder={isLoadingOwners ? "Loading owners..." : "Search owners..."}
                searchPlaceholder="Search name or email..."
                emptyMessage="No owners found."
                disabled={isSubmitting || isLoadingOwners}
              />
              <FieldError errors={[errors.ownerId]} />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field>
              <FieldLabel htmlFor="edit-species">Species *</FieldLabel>
              <Input
                id="edit-species"
                placeholder="Canine, Feline, etc."
                {...register("species")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.species]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-breed">Breed</FieldLabel>
              <Input
                id="edit-breed"
                placeholder="Golden Retriever"
                {...register("breed")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.breed]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-gender">Gender *</FieldLabel>
              <Select
                onValueChange={(value) => setValue("gender", value)}
                defaultValue={pet.gender || "MALE"}
                disabled={isSubmitting}
              >
                <SelectTrigger id="edit-gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[errors.gender]} />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field>
              <FieldLabel htmlFor="edit-age">Age (Years)</FieldLabel>
              <Input
                id="edit-age"
                type="number"
                placeholder="2"
                {...register("age")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.age]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-weight">Weight (kg)</FieldLabel>
              <Input
                id="edit-weight"
                type="number"
                step="0.1"
                placeholder="15.5"
                {...register("weight")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.weight]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="edit-color">Color / Markings</FieldLabel>
              <Input
                id="edit-color"
                placeholder="Gold-white"
                {...register("color")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.color]} />
            </Field>
          </div>

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
                "Update Pet"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
