"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useCallback } from "react"

export function MedicalRecordsClient({
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
      if (name !== "page") {
        params.set("page", "1")
      }
      return params.toString()
    },
    [searchParams]
  )

  const handlePageChange = (newPage) => {
    router.push(`/admin/medical-records?${createQueryString("page", newPage.toString())}`)
  }

  const handlePageSizeChange = (newPageSize) => {
    router.push(`/admin/medical-records?${createQueryString("pageSize", newPageSize.toString())}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="text-xs text-slate-500">
          Showing active health records & clinical histories
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Total <span className="text-slate-900 font-bold">{total}</span> patient chart{total === 1 ? "" : "s"}
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
