"use client"

import * as React from "react"
import { useForm, useFieldArray } from "react-hook-form"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { User } from "@/generated/prisma/browser"
import { Plus, Trash2, PawPrint, User as UserIcon, Info } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const petSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, "Pet name is required"),
    species: z.string().min(1, "Species is required"),
    breed: z.string().optional(),
    age: z.string().optional().or(z.literal("")),
    gender: z.string().optional(),
})

const clientSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    dateOfBirth: z.string().optional(),
    address: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
    pets: z.array(petSchema),
}).refine((data) => {
    if (data.password && data.password !== data.confirmPassword) {
        return false
    }
    return true
}, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

type ClientFormValues = z.infer<typeof clientSchema>

interface ClientFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: User
    onSuccess: () => void
}

export function ClientFormModal({ open, onOpenChange, user, onSuccess }: ClientFormModalProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const isEdit = !!user

    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ClientFormValues>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            address: "",
            password: "",
            confirmPassword: "",
            pets: [],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "pets",
    })

    React.useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                phone: user.phone || "",
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : "",
                address: (user as any).client?.address || "",
                password: "",
                confirmPassword: "",
                pets: (user as any).client?.pets?.map((pet: any) => ({
                    id: pet.id,
                    name: pet.name,
                    species: pet.species,
                    breed: pet.breed || "",
                    age: pet.age !== null ? pet.age.toString() : "",
                    gender: pet.gender || "Male",
                })) || [],
            })
        } else {
            reset({
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                phone: "",
                dateOfBirth: "",
                address: "",
                password: "",
                confirmPassword: "",
                pets: [],
            })
        }
    }, [user, reset])

    const onSubmit = async (data: ClientFormValues) => {
        setIsSubmitting(true)
        try {
            const url = isEdit ? `/api/clients/${user.id}` : "/api/clients"
            const method = isEdit ? "PUT" : "POST"

            const payload: any = { ...data }
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
                toast.success(isEdit ? "Client updated successfully" : "Client and Pets registered successfully")
                onSuccess()
                onOpenChange(false)
            } else {
                const error = await response.json()
                toast.error(error.error || "Something went wrong")
            }
        } catch (error) {
            toast.error("Failed to save client")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[95vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2 pr-12 sm:pr-6">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        {isEdit ? <UserIcon className="h-6 w-6 text-primary" /> : <Plus className="h-6 w-6 text-primary" />}
                        {isEdit ? "Edit Client" : "Register Client & Pets"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update the client's information and pets below." : "Collect information of the client and their pets in one go."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 px-6 overflow-y-auto pr-2">
                    <form id="unified-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-4">
                        {/* Client Information Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary font-semibold">
                                <UserIcon className="h-4 w-4" />
                                <h3>Client Information</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" {...register("firstName")} placeholder="John" />
                                    {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" {...register("lastName")} placeholder="Doe" />
                                    {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" {...register("username")} placeholder="johndoe123" />
                                    {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" {...register("email")} placeholder="john@example.com" />
                                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone (Optional)</Label>
                                    <Input id="phone" {...register("phone")} placeholder="+1 234 567 890" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                    <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea id="address" {...register("address")} placeholder="Enter client's address" className="min-h-[80px]" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">{isEdit ? "New Password" : "Password"}</Label>
                                    <Input id="password" type="password" {...register("password")} placeholder={isEdit ? "Leave blank" : "••••••••"} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input id="confirmPassword" type="password" {...register("confirmPassword")} placeholder="••••••••" />
                                    {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Pets Information Section */}
                        <div className="space-y-4 pb-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-primary font-semibold">
                                    <PawPrint className="h-4 w-4" />
                                    <h3>Pets Information</h3>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ name: "", species: "Dog", breed: "", age: "", gender: "Male" })}
                                    className="gap-2 border-primary/20 hover:bg-primary/5 hover:text-primary"
                                >
                                    <Plus className="h-3 w-3" />
                                    Add Pet
                                </Button>
                            </div>

                            {fields.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed rounded-xl bg-muted/30 text-muted-foreground text-center">
                                    <Info className="h-8 w-8 opacity-20 mb-2" />
                                    <p className="text-sm">No pets added yet.</p>
                                    <p className="text-xs">Click "Add Pet" to register pets along with the client.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="relative p-4 rounded-xl border bg-muted/20 space-y-4 group animate-in fade-in slide-in-from-top-1 duration-200">
                                            <input type="hidden" {...register(`pets.${index}.id` as const)} />
                                            <div className="flex items-center justify-between absolute -top-3 right-4">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-7 w-7 rounded-full shadow-md hover:scale-110 active:scale-90 transition-all"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pet Name</Label>
                                                    <Input {...register(`pets.${index}.name` as const)} placeholder="Buddy" className="bg-background" />
                                                    {errors.pets?.[index]?.name && (
                                                        <p className="text-xs text-destructive">{errors.pets[index]?.name?.message}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Species</Label>
                                                    <Input 
                                                        {...register(`pets.${index}.species` as const)} 
                                                        placeholder="Type or select..." 
                                                        list="species-list"
                                                        className="bg-background"
                                                    />
                                                    {errors.pets?.[index]?.species && (
                                                        <p className="text-xs text-destructive">{errors.pets[index]?.species?.message}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="space-y-2 col-span-1">
                                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Age</Label>
                                                    <Input type="number" {...register(`pets.${index}.age` as const)} placeholder="3" className="bg-background" />
                                                </div>
                                                <div className="space-y-2 col-span-1">
                                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Gender</Label>
                                                    <Select
                                                        defaultValue={field.gender}
                                                        onValueChange={(val) => setValue(`pets.${index}.gender` as const, val)}
                                                    >
                                                        <SelectTrigger className="bg-background">
                                                            <SelectValue placeholder="Male" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Male">Male</SelectItem>
                                                            <SelectItem value="Female">Female</SelectItem>
                                                            <SelectItem value="Unknown">Unknown</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2 col-span-1">
                                                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Breed</Label>
                                                    <Input {...register(`pets.${index}.breed` as const)} placeholder="Retriever" className="bg-background" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>
                    <datalist id="species-list">
                        <option value="Dog" />
                        <option value="Cat" />
                        <option value="Bird" />
                        <option value="Rabbit" />
                        <option value="Hamster" />
                        <option value="Guinea Pig" />
                        <option value="Turtle" />
                        <option value="Snake" />
                        <option value="Lizard" />
                        <option value="Fish" />
                    </datalist>
                </div>

                <DialogFooter className="p-6 border-t bg-muted/5">
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button form="unified-form" type="submit" disabled={isSubmitting} className="min-w-[120px]">
                        {isSubmitting ? "Processing..." : (isEdit ? "Update Client" : "Register All")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
