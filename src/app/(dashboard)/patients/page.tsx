"use client"

import * as React from "react"
import { DataTable } from "./components/data-table"
import { columns } from "./components/columns"
import { PatientForm } from "./components/patient-form"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { getPatientsAction } from "@/app/actions/patient.actions"

export default function PatientsPage() {
  const [open, setOpen] = React.useState(false)
  const [data, setData] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    async function load() {
      setLoading(true)
      const patients = await getPatientsAction()
      setData(patients)
      setLoading(false)
    }
    load()
  }, [open]) // Reload when modal closes

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Patients</h2>
          <p className="text-muted-foreground">
            Manage your patients, view histories, and create new orders.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Patient
            </Button>
          } />
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Register New Patient</DialogTitle>
              <DialogDescription>
                Enter the patient details. Click register when you're done.
              </DialogDescription>
            </DialogHeader>
            <PatientForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex items-center space-x-2 mt-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search patients by name, UHID or phone..."
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mt-4">
        <DataTable columns={columns} data={data.filter(p => 
          p.firstName.toLowerCase().includes(search.toLowerCase()) || 
          p.lastName.toLowerCase().includes(search.toLowerCase()) || 
          p.uhid.toLowerCase().includes(search.toLowerCase()) ||
          p.phone.includes(search)
        )} />
      </div>
    </div>
  )
}
