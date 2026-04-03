import { EditUserModal } from "./components/edit-user-modal"
import { DeleteUserDialog } from "./components/delete-user-dialog"

export const columns = [
    {
        accessorKey: "firstName",
        header: "First Name",
    },
    {
        accessorKey: "middleName",
        header: "Middle Name",
        cell: ({ row }) => row.original.middleName || "N/A",
    },
    {
        accessorKey: "lastName",
        header: "Last Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => row.original.phone || "N/A",
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => row.original.address || "N/A",
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.original.role
            const label = role === "ADMIN" ? "Owner" : "Client"
            const colorClass = role === "ADMIN" ? "text-blue-600" : "text-green-600"

            return (
                <div className={`font-medium ${colorClass}`}>
                    {label}
                </div>
            )
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const user = row.original

            return (
                <div className="flex items-center gap-2">
                    <EditUserModal user={user} />
                    <DeleteUserDialog userId={user.id} userName={`${user.firstName} ${user.lastName}`} />
                </div>
            )
        },
    },
]
