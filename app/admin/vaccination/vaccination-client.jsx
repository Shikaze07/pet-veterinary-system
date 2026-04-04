"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useCallback } from "react"

export function VaccinationManagementClient({
  vaccinations,
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
    router.push(`/admin/vaccination?${createQueryString("page", newPage.toString())}`)
  }

  const handlePageSizeChange = (newPageSize) => {
    router.push(`/admin/vaccination?${createQueryString("pageSize", newPageSize.toString())}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end pr-2">
         <div className="text-sm text-slate-500 font-medium">
            Total {total} records
          </div>
      </div>
      <DataTable
        columns={columns}
        data={vaccinations}
        pageCount={pageCount}
        pageIndex={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  )
}
