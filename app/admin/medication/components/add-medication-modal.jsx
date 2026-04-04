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
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"

const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  brand: z.string().optional(),
  category: z.string().optional(),
  stock: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Stock must be a positive number",
  }),
  minStock: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: "Minimum stock must be a positive number",
  }),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "Price must be a valid positive number",
  }),
})

export function AddMedicationModal() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      stock: "0",
      minStock: "5",
      price: "0",
    },
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/medications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to add medication")
      }

      toast.success("Medication added to inventory")
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
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Medication
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Medication</DialogTitle>
          <DialogDescription>
            Enter medication details and initial stock levels.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="name">Medication Name *</FieldLabel>
              <Input
                id="name"
                placeholder="Amoxicillin"
                {...register("name")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="brand">Brand / Generics</FieldLabel>
              <Input
                id="brand"
                placeholder="e.g. Pfizer, Generic"
                {...register("brand")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.brand]} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="category">Category</FieldLabel>
            <Input
              id="category"
              placeholder="e.g. Antibiotic, Painkiller, Vaccine"
              {...register("category")}
              disabled={isSubmitting}
            />
            <FieldError errors={[errors.category]} />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field>
              <FieldLabel htmlFor="stock">Current Stock *</FieldLabel>
              <Input
                id="stock"
                type="number"
                {...register("stock")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.stock]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="minStock">Min. Stock Alert *</FieldLabel>
              <Input
                id="minStock"
                type="number"
                {...register("minStock")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.minStock]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="price">Unit Price (PHP) *</FieldLabel>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.price]} />
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
                  Adding...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
