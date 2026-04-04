"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Plus, Loader2, Eye, EyeOff } from "lucide-react"

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

const ownerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  middleName: z.string().optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  phone: z.string().regex(/^09\d{9}$/, "Phone number must be 11 digits starting with 09"),
  address: z.string().min(5, "Home address is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export function AddOwnerModal() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
    },
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/admin/owners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create owner")
      }

      toast.success("Owner created successfully")
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
          Add Owner
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Owner</DialogTitle>
          <DialogDescription>
            Enter the details for the new pet owner. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field>
              <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
              <Input
                id="firstName"
                placeholder="John"
                {...register("firstName")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.firstName]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="middleName">Middle Name</FieldLabel>
              <Input
                id="middleName"
                placeholder="Quincy"
                {...register("middleName")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.middleName]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register("lastName")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.lastName]} />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="email">Email Address *</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                {...register("email")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.email]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Phone Number *</FieldLabel>
              <Input
                id="phone"
                placeholder="09123456789"
                {...register("phone")}
                disabled={isSubmitting}
              />
              <FieldError errors={[errors.phone]} />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="password">Password *</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  disabled={isSubmitting}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-10 px-3 py-2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
              <FieldError errors={[errors.password]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmPassword">Confirm Password *</FieldLabel>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  disabled={isSubmitting}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-10 px-3 py-2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
              <FieldError errors={[errors.confirmPassword]} />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="address">Home Address *</FieldLabel>
            <textarea
              id="address"
              placeholder="123 Main St, Anytown, AT 12345"
              {...register("address")}
              disabled={isSubmitting}
              className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <FieldError errors={[errors.address]} />
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
                  Creating...
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
