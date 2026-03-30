"use client"

import * as React from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { User } from "@/generated/prisma/client"
import { toast } from "sonner"
import { ClientFormModal } from "./components/client-form-modal"
import { DeleteClientDialog } from "./components/delete-client-dialog"
import { PetManagementDialog } from "./components/pet-management-dialog"
import { UserPlus, Users, ShieldCheck, UserX } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function ClientManagementPage() {
    const [data, setData] = React.useState<User[]>([])
    const [loading, setLoading] = React.useState(true)
    const [selectedClient, setSelectedClient] = React.useState<User | undefined>(undefined)
    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
    const [isPetManagementOpen, setIsPetManagementOpen] = React.useState(false)
    const [clientToDelete, setClientToDelete] = React.useState<number | null>(null)

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/clients")
            if (!response.ok) throw new Error("Failed to fetch")
            const clients = await response.json()
            setData(clients)
        } catch (error) {
            toast.error("Failed to fetch clients")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    const handleEdit = (client: User) => {
        setSelectedClient(client)
        setIsFormOpen(true)
    }

    const handleDelete = (id: number) => {
        setClientToDelete(id)
        setIsDeleteDialogOpen(true)
    }

    const handleManagePets = (client: User) => {
        setSelectedClient(client)
        setIsPetManagementOpen(true)
    }

    const handleToggleStatus = async (client: User) => {
        const newStatus = client.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
        try {
            const response = await fetch(`/api/clients/${client.id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
                headers: { "Content-Type": "application/json" }
            })
            if (response.ok) {
                toast.success(`Client ${newStatus.toLowerCase()}d successfully`)
                fetchData()
            } else {
                toast.error("Failed to update status")
            }
        } catch (error) {
            toast.error("Error updating status")
        }
    }

    const confirmDelete = async () => {
        if (!clientToDelete) return
        try {
            const response = await fetch(`/api/clients/${clientToDelete}`, {
                method: "DELETE"
            })
            if (response.ok) {
                toast.success("Client deleted successfully")
                fetchData()
            } else {
                const error = await response.json()
                toast.error(error.error || "Failed to delete client")
            }
        } catch (error) {
            toast.error("Error deleting client")
        } finally {
            setIsDeleteDialogOpen(false)
            setClientToDelete(null)
        }
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <Users className="h-6 w-6" />
                        <h2 className="text-3xl font-bold tracking-tight">Client & Pet Management</h2>
                    </div>
                    <p className="text-muted-foreground">
                        Manage your veterinary clients, their pets, contact information, and account status.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setSelectedClient(undefined)
                        setIsFormOpen(true)
                    }}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 gap-2 font-bold transition-all shadow-md active:scale-95"
                >
                    <UserPlus className="h-4 w-4" />
                    Add Client
                </button>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">Total Clients</h3>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{data.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Total registered clients</p>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">Active Clients</h3>
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">
                        {data.filter(u => u.status === "ACTIVE").length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Clients with active access</p>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">Inactive Clients</h3>
                        <UserX className="h-4 w-4 text-rose-500" />
                    </div>
                    <div className="text-2xl font-bold text-rose-600">
                        {data.filter(u => u.status === "INACTIVE").length}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Clients with restricted access</p>
                </div>
            </div>

            <div className="pt-4">
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            <p className="text-sm text-muted-foreground">Loading clients...</p>
                        </div>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={data}
                        meta={{
                            onEdit: handleEdit,
                            onDelete: handleDelete,
                            onToggleStatus: handleToggleStatus,
                            onManagePets: handleManagePets,
                        }}
                    />
                )}
            </div>

            <ClientFormModal
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                user={selectedClient}
                onSuccess={fetchData}
            />

            <PetManagementDialog
                open={isPetManagementOpen}
                onOpenChange={setIsPetManagementOpen}
                user={selectedClient}
                onUpdate={fetchData}
            />

            <DeleteClientDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
            />
        </div>
    )
}
