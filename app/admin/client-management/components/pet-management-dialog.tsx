"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { User, Pet } from "@/generated/prisma/client"
import { Plus, Dog, Pencil, Trash, PawPrint, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { PetFormModal } from "./pet-form-modal"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PetManagementDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    user?: User
    onUpdate: () => void
}

export function PetManagementDialog({ open, onOpenChange, user, onUpdate }: PetManagementDialogProps) {
    const [pets, setPets] = React.useState<Pet[]>([])
    const [loading, setLoading] = React.useState(false)
    const [selectedPet, setSelectedPet] = React.useState<Pet | undefined>(undefined)
    const [isPetFormOpen, setIsPetFormOpen] = React.useState(false)
    const [petToDelete, setPetToDelete] = React.useState<number | null>(null)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

    const fetchPets = async () => {
        if (!user || !(user as any).client?.id) return
        setLoading(true)
        try {
            const response = await fetch(`/api/pets?clientId=${(user as any).client.id}`)
            if (!response.ok) throw new Error("Failed to fetch pets")
            const data = await response.json()
            setPets(data)
        } catch (error) {
            toast.error("Failed to fetch pets")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        if (open && user) {
            fetchPets()
        }
    }, [open, user])

    const handleDeleteClick = (petId: number) => {
        setPetToDelete(petId)
        setIsDeleteDialogOpen(true)
    }

    const confirmDeletePet = async () => {
        if (petToDelete === null) return
        
        try {
            // Optimistic update
            const petId = petToDelete
            const deletedPet = pets.find(p => p.id === petId)
            setPets(prev => prev.filter(p => p.id !== petId))
            setIsDeleteDialogOpen(false)

            const response = await fetch(`/api/pets/${petId}`, {
                method: "DELETE"
            })
            if (response.ok) {
                toast.success("Pet deleted successfully")
                onUpdate()
            } else {
                // Rollback
                if (deletedPet) setPets(prev => [...prev, deletedPet])
                toast.error("Failed to delete pet")
            }
        } catch (error) {
            toast.error("Error deleting pet")
        } finally {
            setPetToDelete(null)
        }
    }

    const clientName = user ? `${user.firstName} ${user.lastName}` : ""

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader className="pr-12 sm:pr-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <PawPrint className="h-5 w-5 text-primary" />
                                Pets for {clientName}
                            </DialogTitle>
                            <DialogDescription>
                                Manage registered pets and their information.
                            </DialogDescription>
                        </div>
                        <Button 
                            onClick={() => {
                                setSelectedPet(undefined)
                                setIsPetFormOpen(true)
                            }}
                            size="sm"
                            className="gap-2 w-full sm:w-auto"
                        >
                            <Plus className="h-4 w-4" />
                            Add Pet
                        </Button>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        </div>
                    ) : pets.length > 0 ? (
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                            {pets.map((pet) => (
                                <div key={pet.id} className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md group relative">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                            <div className="rounded-full bg-primary/10 p-2 mt-1 shrink-0">
                                                <Dog className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-lg truncate">{pet.name}</h4>
                                                <p className="text-sm text-muted-foreground truncate">{pet.species} • {pet.breed || "Mixed Breed"}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 sm:relative sm:top-0 sm:right-0">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 bg-background/80 backdrop-blur-sm sm:bg-transparent"
                                                onClick={() => {
                                                    setSelectedPet(pet)
                                                    setIsPetFormOpen(true)
                                                }}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 bg-background/80 backdrop-blur-sm sm:bg-transparent"
                                                onClick={() => handleDeleteClick(pet.id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                                        {pet.age !== null && (
                                            <Badge variant="outline" className="whitespace-nowrap">{pet.age} yrs old</Badge>
                                        )}
                                        {pet.gender && (
                                            <Badge variant="outline" className="whitespace-nowrap capitalize">{pet.gender}</Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 text-muted-foreground border-2 border-dashed rounded-xl">
                            <PawPrint className="h-12 w-12 opacity-10 mb-2" />
                            <p>No pets registered for this client.</p>
                        </div>
                    )}
                </div>

                {user && (user as any).client && (
                    <PetFormModal
                        open={isPetFormOpen}
                        onOpenChange={setIsPetFormOpen}
                        clientId={(user as any).client.id}
                        pet={selectedPet}
                        onSuccess={() => {
                            fetchPets()
                            onUpdate()
                        }}
                    />
                )}

                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the pet's records. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={confirmDeletePet}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete Pet
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DialogContent>
        </Dialog>
    )
}
