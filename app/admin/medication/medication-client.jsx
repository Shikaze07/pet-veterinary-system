"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { AddMedicationModal } from "./components/add-medication-modal"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useCallback, useEffect } from "react"
import { useDebounce } from "use-debounce"

export function MedicationManagementClient({
  medications,
  total,
  page,
  pageSize,
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")
  const [debouncedSearch] = useDebounce(searchValue, 500)

  const pageCount = Math.ceil(total / pageSize)

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      if (name !== 'page') {
        params.set('page', '1') // Reset to first page on search or size change
      }
      return params.toString()
    },
    [searchParams]
  )

  useEffect(() => {
    const currentSearch = searchParams.get("search") || ""
    if (debouncedSearch !== currentSearch) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("search", debouncedSearch)
      params.set("page", "1")
      router.push(`/admin/medication?${params.toString()}`)
    }
  }, [debouncedSearch, router, searchParams])

  const handlePageChange = (newPage) => {
    router.push(`/admin/medication?${createQueryString("page", newPage.toString())}`)
  }

  const handlePageSizeChange = (newPageSize) => {
    router.push(`/admin/medication?${createQueryString("pageSize", newPageSize.toString())}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search medications, brands, or categories..."
            className="pl-10"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500 font-medium">
            Total {total} items in inventory
          </div>
          <AddMedicationModal />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={medications}
        pageCount={pageCount}
        pageIndex={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  )
}
