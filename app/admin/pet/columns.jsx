import { EditPetModal } from "./components/edit-pet-modal"
import { DeletePetDialog } from "./components/delete-pet-dialog"
import { Badge } from "@/components/ui/badge"

function formatAge(age) {
    if (age === null || age === undefined) return null
    const totalMonths = Math.round(age * 12)
    const years = Math.floor(totalMonths / 12)
    const months = totalMonths % 12

    if (years === 0 && months === 0) return "< 1 month"
    if (years === 0) return months === 1 ? "1 month" : `${months} months`
    if (months === 0) return years === 1 ? "1 year" : `${years} years`

    const yearStr = years === 1 ? "1 year" : `${years} years`
    const monthStr = months === 1 ? "1 month" : `${months} months`
    return `${yearStr} ${monthStr}`
}

export const columns = [
    {
        accessorKey: "name",
        header: "Pet Name",
        cell: ({ row }) => (
            <div className="font-semibold text-slate-900">{row.original.name}</div>
        )
    },
    {
        accessorKey: "species",
        header: "Species & Breed",
        cell: ({ row }) => {
            const pet = row.original
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700">{pet.species}</span>
                    <span className="text-xs text-slate-500">{pet.breed || "Unknown Breed"}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => {
            const gender = row.original.gender
            if (!gender) return <span className="text-slate-400">N/A</span>
            const color = gender.toLowerCase() === "male" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
            return <Badge className={`${color} border-none`}>{gender}</Badge>
        }
    },
    {
        accessorKey: "age",
        header: "Age",
        cell: ({ row }) => {
            const age = row.original.age
            const formatted = formatAge(age)
            if (!formatted) return <span className="text-slate-400">N/A</span>
            return <span className="text-sm text-slate-700">{formatted}</span>
        }
    },
    {
        accessorKey: "weight",
        header: "Weight",
        cell: ({ row }) => {
            const weight = row.original.weight
            return weight ? `${weight} kg` : <span className="text-slate-400">N/A</span>
        }
    },
    {
        accessorKey: "owner",
        header: "Owner",
        cell: ({ row }) => {
            const owner = row.original.owner
            if (!owner || !owner.user) return <span className="text-slate-400 italic">No Owner</span>
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-700">
                        {owner.user.firstName} {owner.user.lastName}
                    </span>
                    <span className="text-xs text-slate-400">{owner.user.email}</span>
                </div>
            )
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const pet = row.original

            return (
                <div className="flex items-center gap-2">
                    <EditPetModal pet={pet} />
                    <DeletePetDialog petId={pet.id} petName={pet.name} />
                </div>
            )
        },
    },
]
