"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { User, Role } from "@/generated/prisma/browser"

const userSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    role: z.nativeEnum(Role),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
}).refine((data) => {
    if (data.password && data.password !== data.confirmPassword) {
        return false
    }
    return true
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

type UserFormValues = z.infer<typeof userSchema>

interface UserFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: User
    onSuccess: () => void
}

export function UserFormModal({ open, onOpenChange, user, onSuccess }: UserFormModalProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const isEdit = !!user

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            role: Role.CLIENT,
            password: "",
            confirmPassword: "",
        },
    })

    const roleValue = watch("role")

    React.useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                phone: user.phone || "",
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
                role: user.role,
                password: "",
                confirmPassword: "",
            })
        } else {
            reset({
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                phone: "",
                dateOfBirth: "",
                role: Role.CLIENT,
                password: "",
                confirmPassword: "",
            })
        }
    }, [user, reset])

    const onSubmit = async (values: UserFormValues) => {
        setIsSubmitting(true)
        try {
            const url = isEdit ? `/api/users/${user.id}` : "/api/users"
            const method = isEdit ? "PUT" : "POST"
            
            // Remove empty password on edit
            const payload: any = { ...values }
            if (isEdit && !payload.password) {
                delete payload.password
            }
            delete payload.confirmPassword

            const response = await fetch(url, {
                method,
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            })

            if (response.ok) {
                toast.success(isEdit ? "User updated successfully" : "User created successfully")
                onSuccess()
                onOpenChange(false)
            } else {
                const error = await response.json()
                toast.error(error.error || "Something went wrong")
            }
        } catch (error) {
            toast.error("Failed to save user")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update the user's information below." : "Enter the details for the new user."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" {...register("firstName")} />
                            {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" {...register("lastName")} />
                            {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" {...register("username")} />
                            {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register("email")} />
                            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone (Optional)</Label>
                            <Input id="phone" {...register("phone")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">{isEdit ? "New Password" : "Password"}</Label>
                            <Input id="password" type="password" {...register("password")} placeholder={isEdit ? "Leave blank" : "••••••••"} />
                            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input id="confirmPassword" type="password" {...register("confirmPassword")} placeholder="••••••••" />
                            {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                            onValueChange={(value) => setValue("role", value as Role)}
                            value={roleValue}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                                <SelectItem value={Role.CLIENT}>Client</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter className="pt-4">
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Saving..." : (isEdit ? "Update User" : "Create User")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
