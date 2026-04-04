"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useCallback } from "react"

export function AppointmentManagementClient({
  appointments,
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
      if (value === null) {
        params.delete(name)
      } else {
        params.set(name, value)
      }
      
      if (name !== 'page') {
        params.set('page', '1')
      }
      return params.toString()
    },
    [searchParams]
  )

  const handlePageChange = (newPage) => {
    router.push(`/admin/appointment?${createQueryString("page", newPage.toString())}`)
  }

  const handlePageSizeChange = (newPageSize) => {
    router.push(`/admin/appointment?${createQueryString("pageSize", newPageSize.toString())}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end pr-2">
         <div className="text-sm text-slate-500 font-medium">
            {total} scheduled visits
          </div>
      </div>
      <DataTable
        columns={columns}
        data={appointments}
        pageCount={pageCount}
        pageIndex={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  )
}
