"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useDebounce } from "use-debounce"
import { AddConsultationModal } from "./components/add-consultation-modal"

export function ConsultationToolbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")
  const [debouncedSearch] = useDebounce(searchValue, 500)

  useEffect(() => {
    const currentSearch = searchParams.get("search") || ""
    if (debouncedSearch !== currentSearch) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("search", debouncedSearch)
      params.set("page", "1")
      router.push(`/admin/consultation?${params.toString()}`)
    }
  }, [debouncedSearch, router, searchParams])

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border shadow-sm">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search symptoms, diagnosis, or pet..."
          className="pl-10"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <AddConsultationModal />
    </div>
  )
}
