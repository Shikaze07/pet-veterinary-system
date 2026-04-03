"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { AddAppointmentModal } from "./components/add-appointment-modal"
import { Search, CalendarDays } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useCallback, useEffect } from "react"
import { useDebounce } from "use-debounce"

export function AppointmentManagementClient({
  appointments,
  total,
  page,
  pageSize,
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")
  const [debouncedSearch] = useDebounce(searchValue, 500)
  const [isTodayFilter, setIsTodayFilter] = useState(searchParams.get("filter") === "today")

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

  useEffect(() => {
    const currentSearch = searchParams.get("search") || ""
    if (debouncedSearch !== currentSearch) {
      router.push(`/admin/appointment?${createQueryString("search", debouncedSearch || null)}`)
    }
  }, [debouncedSearch, router, createQueryString, searchParams])

  const toggleTodayFilter = () => {
    const newVal = !isTodayFilter
    setIsTodayFilter(newVal)
    router.push(`/admin/appointment?${createQueryString("filter", newVal ? "today" : null)}`)
  }

  const handlePageChange = (newPage) => {
    router.push(`/admin/appointment?${createQueryString("page", newPage.toString())}`)
  }

  const handlePageSizeChange = (newPageSize) => {
    router.push(`/admin/appointment?${createQueryString("pageSize", newPageSize.toString())}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search pet, owner or reason..."
              className="pl-10"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <Button 
            variant={isTodayFilter ? "default" : "outline"}
            size="sm"
            onClick={toggleTodayFilter}
            className="gap-2 shrink-0"
          >
            <CalendarDays className="h-4 w-4" />
            {isTodayFilter ? "Showing Today" : "Show Today Only"}
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500 font-medium">
            {total} scheduled visits
          </div>
          <AddAppointmentModal />
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
