"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useDebounce } from "use-debounce"
import { LogMedicalRecordModal } from "./components/log-medical-record-modal"

export function MedicalRecordsToolbar({ availableSpecies = [] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")
  const [speciesFilter, setSpeciesFilter] = useState(searchParams.get("species") || "all")
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "all")
  const [debouncedSearch] = useDebounce(searchValue, 400)

  useEffect(() => {
    const currentSearch = searchParams.get("search") || ""
    const currentSpecies = searchParams.get("species") || "all"

    const currentType = searchParams.get("type") || "all"

    if (debouncedSearch !== currentSearch || speciesFilter !== currentSpecies || typeFilter !== currentType) {
      const params = new URLSearchParams(searchParams.toString())

      if (debouncedSearch) {
        params.set("search", debouncedSearch)
      } else {
        params.delete("search")
      }

      if (speciesFilter && speciesFilter !== "all") {
        params.set("species", speciesFilter)
      } else {
        params.delete("species")
      }

      if (typeFilter && typeFilter !== "all") {
        params.set("type", typeFilter)
      } else {
        params.delete("type")
      }

      params.set("page", "1")
      router.push(`/admin/medical-records?${params.toString()}`)
    }
  }, [debouncedSearch, speciesFilter, typeFilter, router, searchParams])

  const clearFilters = () => {
    setSearchValue("")
    setSpeciesFilter("all")
    setTypeFilter("all")
    router.push("/admin/medical-records")
  }

  const hasActiveFilters = Boolean(searchValue || (speciesFilter && speciesFilter !== "all") || typeFilter !== "all")

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by patient, breed, or owner..."
            className="pl-9 bg-white border-slate-200 focus-visible:ring-slate-900"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-[170px]">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-white border-slate-200">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="consultation">Consultations</SelectItem>
              <SelectItem value="vaccination">Vaccinations</SelectItem>
              <SelectItem value="appointment">Appointments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-[180px]">
          <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
            <SelectTrigger className="bg-white border-slate-200">
              <SelectValue placeholder="All Species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Species</SelectItem>
              {availableSpecies.map((sp) => (
                <SelectItem key={sp} value={sp}>
                  {sp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-slate-500 hover:text-slate-900 gap-1 text-xs"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <LogMedicalRecordModal />
      </div>
    </div>
  )
}
