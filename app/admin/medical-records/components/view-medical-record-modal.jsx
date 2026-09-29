"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Stethoscope,
  Syringe,
  Calendar,
  Printer,
  PawPrint,
  User,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Info,
} from "lucide-react"
import { AddConsultationQuickModal } from "./add-consultation-quick-modal"
import { AddVaccinationQuickModal } from "./add-vaccination-quick-modal"

export function ViewMedicalRecordModal({ pet }) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("consultations")

  if (!pet) return null

  const owner = pet.owner
  const consultations = pet.consultations || []
  const vaccinations = pet.vaccinations || []
  const appointments = pet.appointments || []

  // Check vaccination status
  const now = new Date()
  const hasOverdueVaccine = vaccinations.some(
    (v) => v.nextDue && new Date(v.nextDue) < now
  )

  const handlePrint = () => {
    const printContent = document.getElementById(`print-chart-${pet.id}`)
    if (!printContent) return

    const printWindow = window.open("", "_blank", "width=850,height=900")
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Medical Record - ${pet.name}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #0f172a; line-height: 1.5; }
            h1, h2, h3, h4 { margin: 0 0 8px 0; }
            .header { border-bottom: 2px solid #10b981; padding-bottom: 16px; margin-bottom: 20px; }
            .section { margin-bottom: 24px; }
            .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px; font-size: 14px; }
            .meta-item { border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; }
            .meta-label { font-weight: 600; color: #047857; font-size: 12px; text-transform: uppercase; }
            .meta-val { font-weight: 500; font-size: 15px; }
            table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
            th { background-color: #ecfdf5; color: #065f46; font-weight: 600; }
            .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 12px; color: #64748b; text-align: center; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="font-size: 24px; text-transform: uppercase; letter-spacing: 0.5px; color: #065f46;">Patient Medical Chart</h1>
            <p style="margin: 0; color: #64748b; font-size: 14px;">Clinical Electronic Health Record • Confidential Medical History</p>
          </div>

          <div class="section">
            <div class="meta-grid">
              <div class="meta-item">
                <div class="meta-label">Patient Details</div>
                <div class="meta-val">${pet.name} (${pet.species}${pet.breed ? ` - ${pet.breed}` : ""})</div>
                <div style="font-size: 13px; color: #475569;">Gender: ${pet.gender || "N/A"} • Age: ${pet.age !== null ? `${pet.age} yrs` : "N/A"} • Weight: ${pet.weight ? `${pet.weight} kg` : "N/A"}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">Owner Information</div>
                <div class="meta-val">${owner ? `${owner.firstName} ${owner.lastName}` : "No Owner Assigned"}</div>
                <div style="font-size: 13px; color: #475569;">Phone: ${owner?.phone || "N/A"} • Email: ${owner?.email || "N/A"}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3 style="font-size: 16px; border-bottom: 1px solid #10b981; padding-bottom: 4px; color: #065f46;">Clinical Consultations & Diagnoses</h3>
            ${
              consultations.length === 0
                ? "<p style='font-size: 13px; color: #64748b;'>No clinical consultations recorded.</p>"
                : `
                <table>
                  <thead>
                    <tr>
                      <th style="width: 18%;">Date</th>
                      <th style="width: 27%;">Symptoms</th>
                      <th style="width: 25%;">Diagnosis</th>
                      <th style="width: 30%;">Treatment & Care Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${consultations
                      .map(
                        (c) => `
                      <tr>
                        <td>${new Date(c.date).toLocaleDateString()}</td>
                        <td>${c.symptoms}</td>
                        <td><strong>${c.diagnosis}</strong></td>
                        <td>${c.treatment}</td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              `
            }
          </div>

          <div class="section">
            <h3 style="font-size: 16px; border-bottom: 1px solid #10b981; padding-bottom: 4px; color: #065f46;">Immunization & Vaccination Records</h3>
            ${
              vaccinations.length === 0
                ? "<p style='font-size: 13px; color: #64748b;'>No vaccinations recorded.</p>"
                : `
                <table>
                  <thead>
                    <tr>
                      <th>Vaccine Name</th>
                      <th>Date Given</th>
                      <th>Next Due Date</th>
                      <th>Notes / Batch</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${vaccinations
                      .map(
                        (v) => `
                      <tr>
                        <td><strong>${v.vaccineName}</strong></td>
                        <td>${new Date(v.dateGiven).toLocaleDateString()}</td>
                        <td>${v.nextDue ? new Date(v.nextDue).toLocaleDateString() : "None"}</td>
                        <td>${v.notes || "—"}</td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              `
            }
          </div>

          <div class="section">
            <h3 style="font-size: 16px; border-bottom: 1px solid #10b981; padding-bottom: 4px; color: #065f46;">Appointments & Clinic Visits History</h3>
            ${
              appointments.length === 0
                ? "<p style='font-size: 13px; color: #64748b;'>No appointment logs recorded.</p>"
                : `
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Reason for Visit</th>
                      <th>Status</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${appointments
                      .map(
                        (a) => `
                      <tr>
                        <td>${new Date(a.date).toLocaleDateString()} ${new Date(a.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                        <td>${a.reason}</td>
                        <td>${a.status}</td>
                        <td>${a.notes || "—"}</td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              `
            }
          </div>

          <div class="footer">
            Printed on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()} • Pet Veterinary System
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-2xs font-medium"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>View Record</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{pet.name} Medical Chart</DialogTitle>
        </DialogHeader>

        {/* Printable representation container */}
        <div id={`print-chart-${pet.id}`} className="hidden" />

        {/* Modal Header */}
        <div className="p-6 border-b bg-primary/5">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm shrink-0">
                <PawPrint className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold font-outfit text-slate-900 tracking-tight">
                    {pet.name}
                  </h2>
                  <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 font-mono text-xs">
                    {pet.species}
                  </Badge>
                  {pet.gender && (
                    <Badge variant="secondary" className="capitalize text-xs bg-slate-200 text-slate-800">
                      {pet.gender}
                    </Badge>
                  )}
                  {hasOverdueVaccine && (
                    <Badge variant="destructive" className="text-xs">
                      Vaccine Overdue
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-500 font-inter mt-0.5">
                  {pet.breed || "Standard Breed"} • Age: {pet.age !== null && pet.age !== undefined ? `${pet.age} yrs` : "N/A"} • Weight: {pet.weight ? `${pet.weight} kg` : "N/A"} • Color: {pet.color || "N/A"}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                  <span className="flex items-center gap-1 font-medium">
                    <User className="h-3.5 w-3.5 text-primary" />
                    {owner ? `${owner.firstName} ${owner.lastName}` : "No Owner Assigned"}
                  </span>
                  {owner?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {owner.phone}
                    </span>
                  )}
                  {owner?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {owner.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                <Printer className="h-4 w-4" />
                <span>Print Chart</span>
              </Button>
              <AddConsultationQuickModal
                pet={pet}
                buttonVariant="default"
                buttonText="Log Consultation"
              />
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-primary/10">
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-center shadow-2xs">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Consultations</span>
              <p className="text-xl font-bold font-outfit text-primary">{consultations.length}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-center shadow-2xs">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Vaccinations</span>
              <p className="text-xl font-bold font-outfit text-primary">{vaccinations.length}</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 text-center shadow-2xs">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Clinic Visits</span>
              <p className="text-xl font-bold font-outfit text-primary">{appointments.length}</p>
            </div>
          </div>
        </div>

        {/* Tabbed Medical Content */}
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <TabsList className="bg-slate-100 p-1 border border-slate-200">
                <TabsTrigger
                  value="consultations"
                  className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Stethoscope className="h-3.5 w-3.5" />
                  <span>Consultations ({consultations.length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="vaccinations"
                  className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Syringe className="h-3.5 w-3.5" />
                  <span>Vaccinations ({vaccinations.length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="appointments"
                  className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Visits ({appointments.length})</span>
                </TabsTrigger>
                <TabsTrigger
                  value="vitals"
                  className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Info className="h-3.5 w-3.5" />
                  <span>Patient Profile</span>
                </TabsTrigger>
              </TabsList>

              {activeTab === "vaccinations" && (
                <AddVaccinationQuickModal
                  pet={pet}
                  buttonVariant="outline"
                  buttonText="Log Vaccination"
                />
              )}
            </div>

            {/* TAB 1: CONSULTATIONS */}
            <TabsContent value="consultations" className="space-y-4">
              {consultations.length === 0 ? (
                <div className="p-8 text-center border rounded-xl border-dashed border-slate-300 bg-slate-50/50">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-semibold text-slate-800">No Consultations Recorded</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                    There are currently no recorded clinical consultations or examination notes for this patient.
                  </p>
                  <AddConsultationQuickModal
                    pet={pet}
                    buttonVariant="default"
                    buttonText="Log First Consultation"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  {consultations.map((item) => {
                    const cDate = new Date(item.date)
                    return (
                      <div
                        key={item.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-primary/40 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-slate-100 gap-1">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            <span className="font-bold text-slate-900 text-base font-outfit">
                              {item.diagnosis}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span>
                              {cDate.toLocaleDateString()} at {cDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-xs uppercase font-semibold tracking-wider text-slate-400 block mb-1">
                              Reported Symptoms / Chief Complaint
                            </span>
                            <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                              {item.symptoms}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs uppercase font-semibold tracking-wider text-primary block mb-1">
                              Prescribed Treatment & Care Plan
                            </span>
                            <p className="text-slate-700 bg-primary/5 p-2.5 rounded-lg border border-primary/20">
                              {item.treatment}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* TAB 2: VACCINATIONS */}
            <TabsContent value="vaccinations" className="space-y-4">
              {vaccinations.length === 0 ? (
                <div className="p-8 text-center border rounded-xl border-dashed border-slate-300 bg-slate-50/50">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                    <Syringe className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-semibold text-slate-800">No Immunizations Recorded</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                    There are no recorded vaccine administrations or scheduled boosters for this patient.
                  </p>
                  <AddVaccinationQuickModal
                    pet={pet}
                    buttonVariant="default"
                    buttonText="Log First Vaccination"
                  />
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-sm">
                    <thead className="bg-primary/5 border-b border-primary/10 text-xs font-semibold text-slate-700">
                      <tr>
                        <th className="px-4 py-3 text-left">Vaccine Name</th>
                        <th className="px-4 py-3 text-left">Date Administered</th>
                        <th className="px-4 py-3 text-left">Next Due Date</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Clinical Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {vaccinations.map((v) => {
                        const dateGiven = new Date(v.dateGiven)
                        const nextDueDate = v.nextDue ? new Date(v.nextDue) : null
                        const isOverdue = nextDueDate && nextDueDate < now
                        const isDueSoon =
                          nextDueDate &&
                          !isOverdue &&
                          (nextDueDate.getTime() - now.getTime()) / (1000 * 3600 * 24) <= 30

                        return (
                          <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-900">
                              {v.vaccineName}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {dateGiven.toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-slate-600">
                              {nextDueDate ? nextDueDate.toLocaleDateString() : "—"}
                            </td>
                            <td className="px-4 py-3">
                              {isOverdue ? (
                                <Badge variant="destructive" className="text-xs gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  Overdue
                                </Badge>
                              ) : isDueSoon ? (
                                <Badge variant="outline" className="border-amber-400 text-amber-700 bg-amber-50 text-xs gap-1">
                                  <Clock className="h-3 w-3" />
                                  Due Soon
                                </Badge>
                              ) : nextDueDate ? (
                                <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10 text-xs gap-1 font-medium">
                                  <CheckCircle2 className="h-3 w-3 text-primary" />
                                  Up to date
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-xs">
                                  Recorded
                                </Badge>
                              )}
                            </td>
                            <td className="px-4 py-3 text-slate-500 italic max-w-xs truncate">
                              {v.notes || "—"}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            {/* TAB 3: CLINIC VISITS & APPOINTMENTS */}
            <TabsContent value="appointments" className="space-y-4">
              {appointments.length === 0 ? (
                <div className="p-8 text-center border rounded-xl border-dashed border-slate-300 bg-slate-50/50">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-semibold text-slate-800">No Clinic Visits Logged</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No scheduled visits or appointment encounters on file for this patient.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {appointments.map((a) => {
                    const aptDate = new Date(a.date)
                    const statusVariant =
                      a.status === "COMPLETED"
                        ? "outline"
                        : a.status === "CONFIRMED"
                        ? "default"
                        : a.status === "CANCELLED"
                        ? "destructive"
                        : "secondary"

                    return (
                      <div
                        key={a.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-white hover:border-primary/30 transition-colors gap-2"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900 text-sm">{a.reason}</span>
                            <Badge variant={statusVariant} className="text-xs">
                              {a.status}
                            </Badge>
                          </div>
                          {a.notes && (
                            <p className="text-xs text-slate-500 italic">Notes: {a.notes}</p>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
                          {aptDate.toLocaleDateString()} at {aptDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* TAB 4: PATIENT PROFILE & VITALS */}
            <TabsContent value="vitals" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <h4 className="font-semibold text-slate-900 font-outfit mb-3 flex items-center gap-2">
                    <PawPrint className="h-4 w-4 text-primary" />
                    Patient Demographic Information
                  </h4>
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Patient Name</span>
                      <span className="font-medium text-slate-900">{pet.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Species</span>
                      <span className="font-medium text-slate-900">{pet.species}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Breed</span>
                      <span className="font-medium text-slate-900">{pet.breed || "Standard"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Biological Gender</span>
                      <span className="font-medium text-slate-900 capitalize">{pet.gender || "Unspecified"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Age</span>
                      <span className="font-medium text-slate-900">
                        {pet.age !== null && pet.age !== undefined ? `${pet.age} years old` : "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Recorded Weight</span>
                      <span className="font-medium text-slate-900">
                        {pet.weight ? `${pet.weight} kg` : "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Coat Color / Markings</span>
                      <span className="font-medium text-slate-900">{pet.color || "Not specified"}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <h4 className="font-semibold text-slate-900 font-outfit mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Owner & Contact Information
                  </h4>
                  {owner ? (
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Owner Name</span>
                        <span className="font-medium text-slate-900">
                          {owner.firstName} {owner.middleName ? `${owner.middleName} ` : ""}{owner.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Primary Phone</span>
                        <span className="font-medium text-slate-900">{owner.phone || "None registered"}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Email Address</span>
                        <span className="font-medium text-slate-900">{owner.email || "None registered"}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Physical Address</span>
                        <span className="font-medium text-slate-900 text-right max-w-xs">{owner.address || "None registered"}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm italic">No owner assigned to this patient.</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
