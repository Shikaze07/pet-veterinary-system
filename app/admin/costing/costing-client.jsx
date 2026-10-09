"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { PlusIcon, Trash2Icon, StethoscopeIcon, PillIcon, SyringeIcon, TagIcon, AlertCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Combobox } from "@/components/ui/combobox"

const CATEGORY_META = {
  CONSULTATION: { label: "Consultation", icon: StethoscopeIcon, placeholder: "e.g. General check-up", color: "bg-blue-50 text-blue-700" },
  MEDICATION: { label: "Medicine", icon: PillIcon, placeholder: "e.g. Amoxicillin 250mg", color: "bg-emerald-50 text-emerald-700" },
  VACCINATION: { label: "Vaccination", icon: SyringeIcon, placeholder: "e.g. Anti-rabies", color: "bg-violet-50 text-violet-700" },
  OTHER: { label: "Other", icon: TagIcon, placeholder: "e.g. Grooming", color: "bg-slate-100 text-slate-700" },
}

const peso = (n) => `₱${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const newItem = (category = "CONSULTATION") => ({ category, description: "", quantity: 1, price: "", medicationId: null })
const selectCls = "h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-950"
const lineTotal = (i) => (parseInt(i.quantity, 10) || 0) * (parseFloat(i.price) || 0)

export function CostingClient({ costings, owners, medications }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [ownerId, setOwnerId] = useState("")
  const [petId, setPetId] = useState("")
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState([newItem("CONSULTATION")])

  const pets = useMemo(() => owners.find((o) => o.id === ownerId)?.pets ?? [], [owners, ownerId])
  const total = items.reduce((s, i) => s + lineTotal(i), 0)

  // Validate items for stock limits and valid values
  const validationErrors = useMemo(() => {
    return items.map((item) => {
      const q = parseInt(item.quantity, 10)
      const p = parseFloat(item.price)

      if (!item.description || !item.description.trim()) {
        return "Description is required"
      }
      if (isNaN(q) || q < 1) {
        return "Quantity must be at least 1"
      }
      if (isNaN(p) || p < 0 || item.price === "") {
        return "Price must be a valid amount"
      }

      if (item.medicationId) {
        const med = medications.find((m) => m.id === item.medicationId)
        if (med && q > med.stock) {
          return `Stock limit exceeded! Maximum available: ${med.stock}`
        }
      }

      return null
    })
  }, [items, medications])

  const hasErrors = validationErrors.some((e) => e !== null)
  const canSave = ownerId && items.length > 0 && !hasErrors

  const updateItem = (idx, patch) => setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)))

  const pickMedication = (idx, medId) => {
    if (!medId) {
      updateItem(idx, { medicationId: null })
      return
    }
    const med = medications.find((m) => m.id === medId)
    if (med) {
      updateItem(idx, {
        medicationId: med.id,
        description: med.name,
        price: med.price,
      })
    }
  }

  const reset = () => {
    setOwnerId("")
    setPetId("")
    setNotes("")
    setItems([newItem("CONSULTATION")])
  }

  const save = async () => {
    if (!canSave) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/costings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, petId, notes, items }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save costing")
      toast.success("Costing recorded successfully")
      setOpen(false)
      reset()
      router.refresh()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    if (!confirm("Delete this costing record? Associated medicine stocks will be restored.")) return
    try {
      const res = await fetch(`/api/admin/costings/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete")
      }
      toast.success("Costing deleted")
      router.refresh()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const grandTotal = costings.reduce((s, c) => s + c.totalAmount, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500 font-medium">
          {costings.length} records · Total recorded {peso(grandTotal)}
        </div>
        <Button onClick={() => setOpen(true)}><PlusIcon className="size-4 mr-1" /> New Costing</Button>
      </div>

      <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-600 font-medium">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Pet</th>
              <th className="px-4 py-3">Breakdown</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {costings.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">No costing records yet.</td></tr>
            )}
            {costings.map((c) => (
              <tr key={c.id} className="border-t border-slate-100 align-top hover:bg-slate-50/50">
                <td className="px-4 py-3 whitespace-nowrap text-slate-600">{new Date(c.date).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{c.owner?.firstName} {c.owner?.lastName}</td>
                <td className="px-4 py-3 text-slate-700">{c.pet?.name ?? "—"}</td>
                <td className="px-4 py-3 space-y-1.5">
                  {c.items.map((i) => {
                    const m = CATEGORY_META[i.category] || CATEGORY_META.OTHER
                    return (
                      <div key={i.id} className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className={`text-[10px] ${m.color}`}>{m.label}</Badge>
                        <span className="font-medium text-slate-800">{i.description}</span>
                        <span className="text-xs text-slate-500">× {i.quantity}</span>
                        <span className="text-xs text-slate-500">({peso(i.total)})</span>
                      </div>
                    )
                  })}
                  {c.notes && <p className="text-xs italic text-slate-400 mt-1">Note: {c.notes}</p>}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-slate-900">{peso(c.totalAmount)}</td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => remove(c.id)}>
                    <Trash2Icon className="size-4 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Costing</DialogTitle>
            <DialogDescription>Select client and pet, then add items for consultation, medicine, or vaccination.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-700">1. Client &amp; Pet</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Client <span className="text-red-500">*</span></label>
                  <select className={selectCls} value={ownerId} onChange={(e) => { setOwnerId(e.target.value); setPetId("") }}>
                    <option value="">Select client…</option>
                    {owners.map((o) => <option key={o.id} value={o.id}>{o.firstName} {o.lastName}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600">Pet (Optional)</label>
                  <select className={selectCls} value={petId} onChange={(e) => setPetId(e.target.value)} disabled={!ownerId}>
                    <option value="">{ownerId ? "Select pet (optional)…" : "Select a client first"}</option>
                    {pets.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">2. Charges &amp; Items</h3>
                  <p className="text-xs text-slate-500">Add services, medicines, or vaccinations</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(CATEGORY_META).map(([key, m]) => (
                    <Button key={key} type="button" variant="outline" size="sm" className="h-8 text-xs font-medium" onClick={() => setItems((p) => [...p, newItem(key)])}>
                      <m.icon className="size-3.5 mr-1" /> Add {m.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {items.map((it, idx) => {
                  const m = CATEGORY_META[it.category] || CATEGORY_META.OTHER
                  const errorMsg = validationErrors[idx]
                  const linkedMed = it.medicationId ? medications.find((med) => med.id === it.medicationId) : null

                  return (
                    <div
                      key={idx}
                      className={`rounded-xl border p-4 space-y-3 transition-all ${
                        errorMsg ? "border-red-300 bg-red-50/20 shadow-2xs" : "border-slate-200 bg-slate-50/40 hover:bg-white hover:border-slate-300 shadow-2xs"
                      }`}
                    >
                      {/* Card Header: Category & Subtotal & Delete */}
                      <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-400">#{idx + 1}</span>
                          <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium ${m.color}`}>
                            <m.icon className="size-3.5" /> {m.label}
                          </span>
                          {linkedMed && (
                            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              In Stock: {linkedMed.stock}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block">Item Total</span>
                            <span className="text-sm font-bold text-slate-900">{peso(lineTotal(it))}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                            disabled={items.length === 1}
                            onClick={() => setItems((p) => p.filter((_, i) => i !== idx))}
                            title="Remove item"
                          >
                            <Trash2Icon className="size-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Full-width Description / Combobox */}
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700 block">
                          {it.category === "MEDICATION" || it.category === "VACCINATION"
                            ? "Inventory Item"
                            : "Service / Charge Description"}
                          <span className="text-red-500 ml-0.5">*</span>
                        </label>
                        {it.category === "MEDICATION" || it.category === "VACCINATION" ? (
                          <Combobox
                            options={medications.map((med) => ({
                              value: med.id,
                              label: `${med.name} — ${peso(med.price)} (Stock: ${med.stock})`,
                              searchTerms: med.name,
                            }))}
                            value={it.medicationId || ""}
                            onValueChange={(v) => pickMedication(idx, v)}
                            placeholder={`Search ${m.label.toLowerCase()} in inventory...`}
                            searchPlaceholder="Search inventory..."
                            emptyMessage="No matching item in inventory."
                            className="w-full bg-white"
                          />
                        ) : (
                          <Input
                            placeholder={m.placeholder}
                            value={it.description}
                            onChange={(e) => updateItem(idx, { description: e.target.value })}
                            className="w-full bg-white"
                          />
                        )}
                      </div>

                      {/* Separate Quantity & Unit Price Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-medium text-slate-700">Quantity <span className="text-red-500">*</span></label>
                            {linkedMed && (
                              <span className="text-[11px] text-slate-500">Max available: {linkedMed.stock}</span>
                            )}
                          </div>
                          <Input
                            type="number"
                            min="1"
                            max={linkedMed ? linkedMed.stock : undefined}
                            placeholder="e.g. 1"
                            value={it.quantity}
                            className={`bg-white ${errorMsg && errorMsg.includes("Stock") ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                            onChange={(e) => updateItem(idx, { quantity: e.target.value })}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-700">Unit Price (₱) <span className="text-red-500">*</span></label>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={it.price}
                            className="bg-white"
                            onChange={(e) => updateItem(idx, { price: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Error Banner */}
                      {errorMsg && (
                        <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-200">
                          <AlertCircleIcon className="size-4 shrink-0" />
                          <span>{errorMsg}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-700">3. Notes</h3>
              <Textarea placeholder="Optional notes (e.g. follow-up required, discount reason)" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </section>
          </div>

          <DialogFooter className="items-center sm:justify-between border-t border-slate-100 pt-3">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500">Total Charges ({items.length} {items.length === 1 ? "item" : "items"})</span>
              <span className="text-xl font-bold text-slate-900">{peso(total)}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} disabled={saving || !canSave}>
                {saving ? "Saving…" : "Save Costing"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
