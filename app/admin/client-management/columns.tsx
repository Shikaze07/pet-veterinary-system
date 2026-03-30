"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import {
    MoreHorizontal,
    Pencil,
    Trash,
    UserCircle,
    Mail,
    Phone,
    MapPin,
    CheckCircle2,
    XCircle
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { User, Role, Status } from "@/generated/prisma/client"

export const columns: ColumnDef<User>[] = [
    {
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        id: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 font-medium">
                <UserCircle className="h-4 w-4 text-muted-foreground" />
                {row.getValue("name")}
            </div>
        ),
    },
    {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => <span className="font-medium">{row.getValue("username")}</span>,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {row.getValue("email")}
            </div>
        ),
    },
    {
        id: "age",
        header: "Age",
        cell: ({ row }) => {
            const dateOfBirth = row.original.dateOfBirth
            if (!dateOfBirth) return <span className="text-muted-foreground italic">N/A</span>
            
            const dob = new Date(dateOfBirth)
            const today = new Date()
            let age = today.getFullYear() - dob.getFullYear()
            const m = today.getMonth() - dob.getMonth()
            if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
                age--
            }
            return <Badge variant="outline">{age} yrs</Badge>
        },
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                {row.original.phone || "No phone"}
            </div>
        ),
    },
    {
        id: "address",
        header: "Address",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-muted-foreground max-w-[200px] truncate">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                {(row.original as any).client?.address || "No address"}
            </div>
        ),
    },
    {
        id: "pets",
        header: "Pets",
        cell: ({ row, table }) => {
            const petCount = (row.original as any).client?.pets?.length || 0
            const { onManagePets } = table.options.meta as any
            
            return (
                <div className="flex items-center gap-2">
                    <Badge variant={petCount > 0 ? "secondary" : "outline"} className="cursor-pointer" onClick={() => onManagePets(row.original)}>
                        {petCount} {petCount === 1 ? "Pet" : "Pets"}
                    </Badge>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as Status
            const isActive = status === "ACTIVE"
            return (
                <Badge
                    variant="outline"
                    className={`gap-1.5 font-medium px-2 py-0.5 ${
                        isActive 
                        ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" 
                        : "bg-rose-500/15 text-rose-600 border-rose-500/20"
                    }`}
                >
                    {isActive ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                    {status}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const user = row.original
            const { onEdit, onDelete, onToggleStatus } = table.options.meta as any

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(user)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleStatus(user)}>
                            {user.status === "ACTIVE" ? (
                                <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Deactivate
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Activate
                                </>
                            )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(user.id)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
