"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useCallback } from "react"

export function PetManagementClient({
  pets,
  total,
  page,
  pageSize,
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const pageCount = Math.ceil(total / pageSize)

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      if (name !== 'page') {
        params.set('page', '1') // Reset to first page on size change
      }
      return params.toString()
    },
    [searchParams]
  )

  const handlePageChange = (newPage) => {
    router.push(`/admin/pet?${createQueryString("page", newPage.toString())}`)
  }

  const handlePageSizeChange = (newPageSize) => {
    router.push(`/admin/pet?${createQueryString("pageSize", newPageSize.toString())}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end pr-2">
         <div className="text-sm text-slate-500 font-medium">
            Total {total} pets registered
          </div>
      </div>
      <DataTable
        columns={columns}
        data={pets}
        pageCount={pageCount}
        pageIndex={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  )
}
