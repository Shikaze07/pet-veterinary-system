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
import { Pet } from "@/generated/prisma/browser"

const petSchema = z.object({
    name: z.string().min(1, "Name is required"),
    species: z.string().min(1, "Species is required"),
    breed: z.string().optional(),
    age: z.string().optional().or(z.literal("")),
    gender: z.string().optional(),
})

type PetFormValues = z.infer<typeof petSchema>

interface PetFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    clientId: number
    pet?: Pet
    onSuccess: () => void
}

export function PetFormModal({ open, onOpenChange, clientId, pet, onSuccess }: PetFormModalProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const isEdit = !!pet

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PetFormValues>({
        resolver: zodResolver(petSchema),
        defaultValues: {
            name: "",
            species: "",
            breed: "",
            age: "",
            gender: "Unknown",
        },
    })

    const selectedSpecies = watch("species")
    const selectedGender = watch("gender")

    React.useEffect(() => {
        if (pet) {
            reset({
                name: pet.name,
                species: pet.species,
                breed: pet.breed || "",
                age: pet.age !== null ? pet.age.toString() : "",
                gender: pet.gender || "Unknown",
            })
        } else {
            reset({
                name: "",
                species: "",
                breed: "",
                age: "",
                gender: "Unknown",
            })
        }
    }, [pet, reset])

    const onSubmit = async (values: PetFormValues) => {
        setIsSubmitting(true)
        try {
            const url = isEdit ? `/api/pets/${pet.id}` : "/api/pets"
            const method = isEdit ? "PUT" : "POST"
            
            const payload = { 
                ...values,
                clientId,
                age: values.age ? parseInt(values.age) : null
            }

            const response = await fetch(url, {
                method,
                body: JSON.stringify(payload),
                headers: { "Content-Type": "application/json" },
            })

            if (response.ok) {
                toast.success(isEdit ? "Pet updated successfully" : "Pet registered successfully")
                onSuccess()
                onOpenChange(false)
            } else {
                const error = await response.json()
                toast.error(error.error || "Something went wrong")
            }
        } catch (error) {
            toast.error("Failed to save pet")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit Pet" : "Register New Pet"}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? "Update the pet's profile information." : "Enter the details to register a new pet."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Pet Name</Label>
                        <Input id="name" {...register("name")} placeholder="e.g. Buddy" />
                        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="species">Species</Label>
                            <Input 
                                id="species"
                                {...register("species")} 
                                placeholder="Dog, Cat, etc." 
                                list="pet-species-list"
                            />
                            <datalist id="pet-species-list">
                                <option value="Dog" />
                                <option value="Cat" />
                                <option value="Bird" />
                                <option value="Rabbit" />
                                <option value="Hamster" />
                                <option value="Other" />
                            </datalist>
                            {errors.species && <p className="text-xs text-destructive">{errors.species.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="breed">Breed (Optional)</Label>
                            <Input id="breed" {...register("breed")} placeholder="e.g. Golden Retriever" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="age">Age (Years)</Label>
                            <Input id="age" type="number" {...register("age")} placeholder="e.g. 3" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select 
                                value={selectedGender} 
                                onValueChange={(val) => setValue("gender", val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Unknown">Unknown</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? "Saving..." : (isEdit ? "Update Pet" : "Register Pet")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
