"use client"

import * as React from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { User, Status } from "@/generated/prisma/client"
import { toast } from "sonner"
import { UserFormModal } from "./components/user-form-modal"
import { DeleteUserDialog } from "./components/delete-user-dialog"
import { UserPlus, Users, ShieldCheck, UserX } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function UserManagementPage() {
    const [data, setData] = React.useState<User[]>([])
    const [loading, setLoading] = React.useState(true)
    const [selectedUser, setSelectedUser] = React.useState<User | undefined>(undefined)
    const [isFormOpen, setIsFormOpen] = React.useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
    const [userToDelete, setUserToDelete] = React.useState<number | null>(null)

    const fetchData = async () => {
        setLoading(true)
        try {
            const response = await fetch("/api/users")
            if (!response.ok) throw new Error("Failed to fetch")
            const users = await response.json()
            setData(users)
        } catch (error) {
            toast.error("Failed to fetch users")
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    const handleEdit = (user: User) => {
        setSelectedUser(user)
        setIsFormOpen(true)
    }

    const handleDelete = (id: number) => {
        setUserToDelete(id)
        setIsDeleteDialogOpen(true)
    }

    const handleToggleStatus = async (user: User) => {
        const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
        try {
            const response = await fetch(`/api/users/${user.id}`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus }),
                headers: { "Content-Type": "application/json" }
            })
            if (response.ok) {
                toast.success(`User ${newStatus.toLowerCase()}d successfully`)
                fetchData()
            } else {
                toast.error("Failed to update status")
            }
        } catch (error) {
            toast.error("Error updating status")
        }
    }

    const confirmDelete = async () => {
        if (!userToDelete) return
        try {
            const response = await fetch(`/api/users/${userToDelete}`, {
                method: "DELETE"
            })
            if (response.ok) {
                toast.success("User deleted successfully")
                fetchData()
            } else {
                const error = await response.json()
                toast.error(error.error || "Failed to delete user")
            }
        } catch (error) {
            toast.error("Error deleting user")
        } finally {
            setIsDeleteDialogOpen(false)
            setUserToDelete(null)
        }
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-primary mb-1">
                        <Users className="h-6 w-6" />
                        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                    </div>
                    <p className="text-muted-foreground">
                        Manage system users, their roles, and access status.
                    </p>
                </div>
                <button
                    onClick={() => {
                        setSelectedUser(undefined)
                        setIsFormOpen(true)
                    }}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 gap-2"
                >
                    <UserPlus className="h-4 w-4" />
                    Add User
                </button>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">Total Users</h3>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{data.length}</div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">Active Users</h3>
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">
                        {data.filter(u => u.status === "ACTIVE").length}
                    </div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-medium">Inactive Users</h3>
                        <UserX className="h-4 w-4 text-rose-500" />
                    </div>
                    <div className="text-2xl font-bold text-rose-600">
                        {data.filter(u => u.status === "INACTIVE").length}
                    </div>
                </div>
            </div>

            <div className="pt-4">
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <p>Loading users...</p>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={data}
                        meta={{
                            onEdit: handleEdit,
                            onDelete: handleDelete,
                            onToggleStatus: handleToggleStatus,
                        }}
                    />
                )}
            </div>

            <UserFormModal
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                user={selectedUser}
                onSuccess={fetchData}
            />

            <DeleteUserDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={confirmDelete}
            />
        </div>
    )
}
