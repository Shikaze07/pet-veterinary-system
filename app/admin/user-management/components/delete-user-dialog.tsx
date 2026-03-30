"use client"

import * as React from "react"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DeleteUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
}

export function DeleteUserDialog({ open, onOpenChange, onConfirm }: DeleteUserDialogProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="sm:max-w-none h-auto">
                <SheetHeader>
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        <SheetTitle className="text-destructive">Confirm Deletion</SheetTitle>
                    </div>
                    <SheetDescription>
                        Are you sure you want to delete this user? This action cannot be undone. 
                        If the user has related records (clients, pets, appointments), the deletion might fail.
                    </SheetDescription>
                </SheetHeader>
                <SheetFooter className="flex flex-row gap-4 justify-end pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        Delete User
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
