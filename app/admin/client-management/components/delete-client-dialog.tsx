"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface DeleteClientDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
}

export function DeleteClientDialog({ open, onOpenChange, onConfirm }: DeleteClientDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-destructive mb-2">
                        <AlertTriangle className="h-5 w-5" />
                        <DialogTitle className="text-destructive">Confirm Deletion</DialogTitle>
                    </div>
                    <DialogDescription>
                        Are you sure you want to delete this client? This action cannot be undone. 
                        The deletion might fail if the client has related pets or appointments.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-row gap-4 justify-end pt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none">
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} className="flex-1 sm:flex-none">
                        Delete Client
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
