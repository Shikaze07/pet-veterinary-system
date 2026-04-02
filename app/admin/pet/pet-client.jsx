"use client"

import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { AddPetModal } from "./components/add-pet-modal"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"

export function PetClient({
    initialData,
    total,
    page,
    pageSize,
    search: initialSearch
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchTerm, setSearchTerm] = useState(initialSearch)

    const pageCount = Math.ceil(total / pageSize)

    const createQueryString = useCallback(
        (params) => {
            const newSearchParams = new URLSearchParams(searchParams.toString())
            for (const [key, value] of Object.entries(params)) {
                if (value === null) {
                    newSearchParams.delete(key)
                } else {
                    newSearchParams.set(key, value)
                }
            }
            return newSearchParams.toString()
        },
        [searchParams]
    )

    const debouncedSearch = useDebouncedCallback((value) => {
        router.push(`/admin/pet?${createQueryString({ search: value || null, page: "1" })}`)
    }, 500)

    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchTerm(value)
        debouncedSearch(value)
    }

    const handlePageChange = (newPage) => {
        router.push(`/admin/pet?${createQueryString({ page: newPage.toString() })}`)
    }

    const handlePageSizeChange = (newPageSize) => {
        router.push(`/admin/pet?${createQueryString({ pageSize: newPageSize.toString(), page: "1" })}`)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search pets by name, species, or breed..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="pl-10 h-10 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all rounded-lg"
                    />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="hidden md:block text-sm text-slate-500 font-medium">
                        Total {total} pets discovered
                    </div>
                    <AddPetModal />
                </div>
            </div>
            
            <DataTable
                columns={columns}
                data={initialData}
                pageCount={pageCount}
                pageIndex={page}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />
        </div>
    )
}
