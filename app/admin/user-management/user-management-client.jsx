"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { AddUserModal } from "./components/add-user-modal"

export function UserManagementClient({
    users,
    total,
    page,
    pageSize,
}) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const pageCount = Math.ceil(total / pageSize)

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", newPage.toString())
        router.push(`/admin/user-management?${params.toString()}`)
    }

    const handlePageSizeChange = (newPageSize) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("pageSize", newPageSize.toString())
        params.set("page", "1") // Reset to first page when page size changes
        router.push(`/admin/user-management?${params.toString()}`)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500 font-medium">
                    Total {total} users discovered
                </div>
                <AddUserModal />
            </div>

            <DataTable
                columns={columns}
                data={users}
                pageCount={pageCount}
                pageIndex={page}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />
        </div>
    )
}
