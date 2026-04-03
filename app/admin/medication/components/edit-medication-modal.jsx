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

export function EditMedicationModal({ medication }) {
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
      name: medication.name,
      brand: medication.brand || "",
      category: medication.category || "",
      stock: medication.stock.toString(),
      minStock: medication.minStock.toString(),
      price: medication.price.toString(),
    },
  })

  useEffect(() => {
    reset({
      name: medication.name,
      brand: medication.brand || "",
      category: medication.category || "",
      stock: medication.stock.toString(),
      minStock: medication.minStock.toString(),
      price: medication.price.toString(),
    })
  }, [medication, reset])

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/admin/medications/${medication.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update medication")
      }

      toast.success("Medication details updated")
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
          <span className="sr-only">Edit medication</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Medication</DialogTitle>
          <DialogDescription>
            Update medication information, pricing, or stock levels.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="edit-name">Medication Name *</FieldLabel>
              <Input
                id="edit-name"
                placeholder="Amoxicillin"
                {...register("name")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.name]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-brand">Brand / Generics</FieldLabel>
              <Input
                id="edit-brand"
                placeholder="e.g. Pfizer, Generic"
                {...register("brand")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.brand]} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="edit-category">Category</FieldLabel>
            <Input
              id="edit-category"
              placeholder="e.g. Antibiotic, Painkiller, Vaccine"
              {...register("category")}
              disabled={isSubmitting}
            />
            <FieldError errors={[errors.category]} />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field>
              <FieldLabel htmlFor="edit-stock">Current Stock *</FieldLabel>
              <Input
                id="edit-stock"
                type="number"
                {...register("stock")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.stock]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-minStock">Min. Stock Alert *</FieldLabel>
              <Input
                id="edit-minStock"
                type="number"
                {...register("minStock")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.minStock]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-price">Unit Price (PHP) *</FieldLabel>
              <Input
                id="edit-price"
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
                  Updating...
                </>
              ) : (
                "Update Details"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
