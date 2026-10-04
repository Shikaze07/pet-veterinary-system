"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Plus, Loader2, Stethoscope, Syringe } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Combobox } from "@/components/ui/combobox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const consultationSchema = z.object({
  petId: z.string().min(1, "Please select a patient / pet"),
  date: z.string().min(1, "Date is required"),
  symptoms: z.string().min(3, "Symptoms must be at least 3 characters"),
  diagnosis: z.string().min(3, "Diagnosis must be at least 3 characters"),
  treatment: z.string().min(3, "Treatment plan must be at least 3 characters"),
})

const vaccinationSchema = z.object({
  petId: z.string().min(1, "Please select a patient / pet"),
  vaccineName: z.string().min(2, "Vaccine name is required"),
  dateGiven: z.string().min(1, "Date given is required"),
  nextDue: z.string().optional(),
  notes: z.string().optional(),
})

export function LogMedicalRecordModal() {
  const [open, setOpen] = useState(false)
  const [entryType, setEntryType] = useState("consultation")
  const [pets, setPets] = useState([])
  const [isLoadingPets, setIsLoadingPets] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Form for Consultation
  const consultForm = useForm({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      petId: "",
      date: new Date().toISOString().split("T")[0],
      symptoms: "",
      diagnosis: "",
      treatment: "",
    },
  })

  // Form for Vaccination
  const vaccForm = useForm({
    resolver: zodResolver(vaccinationSchema),
    defaultValues: {
      petId: "",
      vaccineName: "",
      dateGiven: new Date().toISOString().split("T")[0],
      nextDue: "",
      notes: "",
    },
  })

  useEffect(() => {
    if (open) {
      const fetchPets = async () => {
        setIsLoadingPets(true)
        try {
          const res = await fetch("/api/admin/pets?pageSize=500")
          if (!res.ok) throw new Error("Failed to fetch pets")
          const data = await res.json()
          setPets(data.pets || [])
        } catch {
          toast.error("Could not load pets list")
        } finally {
          setIsLoadingPets(false)
        }
      }
      fetchPets()
    }
  }, [open])

  const petOptions = pets.map((p) => ({
    value: p.id,
    label: `${p.name} (${p.species}${p.breed ? ` - ${p.breed}` : ""})`,
    searchTerms: p.owner ? `${p.owner.firstName} ${p.owner.lastName}` : "",
  }))

  const onConsultSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const payload = { ...data }
      const res = await fetch("/api/admin/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to log consultation")
      }
      toast.success("Consultation recorded successfully")
      consultForm.reset()
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onVaccSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/admin/vaccinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to log vaccination")
      }
      toast.success("Vaccination recorded successfully")
      vaccForm.reset()
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-sm font-medium">
          <Plus className="h-4 w-4" />
          <span>New Medical Entry</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Stethoscope className="h-4 w-4" />
            </div>
            <DialogTitle className="text-xl font-bold font-outfit text-slate-900">
              Log Clinical Record
            </DialogTitle>
          </div>
          <DialogDescription className="text-slate-500 font-inter text-sm">
            Record a medical consultation or vaccination entry for a patient&apos;s permanent health chart.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={entryType} onValueChange={setEntryType} className="w-full mt-2">
          <TabsList className="grid grid-cols-2 bg-slate-100 p-1 border border-slate-200">
            <TabsTrigger
              value="consultation"
              className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
            >
              <Stethoscope className="h-4 w-4" />
              <span>Consultation</span>
            </TabsTrigger>
            <TabsTrigger
              value="vaccination"
              className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
            >
              <Syringe className="h-4 w-4" />
              <span>Vaccination</span>
            </TabsTrigger>
          </TabsList>

          {/* CONSULTATION TAB */}
          <TabsContent value="consultation">
            <form onSubmit={consultForm.handleSubmit(onConsultSubmit)} className="space-y-4 pt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Select Patient / Pet *</FieldLabel>
                  <Combobox
                    options={petOptions}
                    value={consultForm.watch("petId")}
                    onValueChange={(val) => consultForm.setValue("petId", val, { shouldValidate: true })}
                    placeholder={isLoadingPets ? "Loading patient records..." : "Search patient by name or owner..."}
                    searchPlaceholder="Search patient name or owner..."
                    disabled={isLoadingPets}
                  />
                  {consultForm.formState.errors.petId && (
                    <FieldError>{consultForm.formState.errors.petId.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="consult-date">Date of Examination *</FieldLabel>
                  <Input
                    id="consult-date"
                    type="date"
                    {...consultForm.register("date")}
                  />
                  {consultForm.formState.errors.date && (
                    <FieldError>{consultForm.formState.errors.date.message}</FieldError>
                  )}
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="consult-symptoms">Observed Symptoms / Reason for Visit *</FieldLabel>
                <Textarea
                  id="consult-symptoms"
                  rows={2}
                  placeholder="e.g. Coughing, lethargy, fever, red lesions on skin..."
                  {...consultForm.register("symptoms")}
                />
                {consultForm.formState.errors.symptoms && (
                  <FieldError>{consultForm.formState.errors.symptoms.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="consult-diag">Clinical Diagnosis *</FieldLabel>
                <Input
                  id="consult-diag"
                  placeholder="e.g. Upper Respiratory Infection, Flea Allergy Dermatitis..."
                  {...consultForm.register("diagnosis")}
                />
                {consultForm.formState.errors.diagnosis && (
                  <FieldError>{consultForm.formState.errors.diagnosis.message}</FieldError>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="consult-treatment">Treatment Plan & Medical Recommendations *</FieldLabel>
                <Textarea
                  id="consult-treatment"
                  rows={3}
                  placeholder="e.g. Prescribe Amoxicillin 250mg, recommend rest and plenty of hydration..."
                  {...consultForm.register("treatment")}
                />
                {consultForm.formState.errors.treatment && (
                  <FieldError>{consultForm.formState.errors.treatment.message}</FieldError>
                )}
              </Field>

              <DialogFooter className="pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-1.5"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Consultation
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          {/* VACCINATION TAB */}
          <TabsContent value="vaccination">
            <form onSubmit={vaccForm.handleSubmit(onVaccSubmit)} className="space-y-4 pt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Select Patient / Pet *</FieldLabel>
                  <Combobox
                    options={petOptions}
                    value={vaccForm.watch("petId")}
                    onValueChange={(val) => vaccForm.setValue("petId", val, { shouldValidate: true })}
                    placeholder={isLoadingPets ? "Loading patient records..." : "Search patient by name or owner..."}
                    searchPlaceholder="Search patient name or owner..."
                    disabled={isLoadingPets}
                  />
                  {vaccForm.formState.errors.petId && (
                    <FieldError>{vaccForm.formState.errors.petId.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="vacc-name">Vaccine Name *</FieldLabel>
                  <Input
                    id="vacc-name"
                    placeholder="e.g. Rabies, DHPP, Bordetella, FVRCP..."
                    {...vaccForm.register("vaccineName")}
                  />
                  {vaccForm.formState.errors.vaccineName && (
                    <FieldError>{vaccForm.formState.errors.vaccineName.message}</FieldError>
                  )}
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="vacc-date">Date Administered *</FieldLabel>
                  <Input
                    id="vacc-date"
                    type="date"
                    {...vaccForm.register("dateGiven")}
                  />
                  {vaccForm.formState.errors.dateGiven && (
                    <FieldError>{vaccForm.formState.errors.dateGiven.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="vacc-due">Next Due Date (Optional)</FieldLabel>
                  <Input
                    id="vacc-due"
                    type="date"
                    {...vaccForm.register("nextDue")}
                  />
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="vacc-notes">Clinical Notes / Lot Number (Optional)</FieldLabel>
                <Textarea
                  id="vacc-notes"
                  rows={2}
                  placeholder="e.g. Lot #92834-B, subcutaneous injection right hind leg..."
                  {...vaccForm.register("notes")}
                />
              </Field>

              <DialogFooter className="pt-3 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-1.5"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Immunization
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
