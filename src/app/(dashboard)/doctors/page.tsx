"use client"

import * as React from "react"
import { DataTable } from "./components/data-table"
import { getColumns } from "./components/columns"
import { DoctorForm } from "./components/doctor-form"
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

import { getDoctorsAction } from "@/app/actions/doctor.actions"
import { Doctor } from "@/types/doctor"

export default function DoctorsPage() {
  const [open, setOpen] = React.useState(false)
  const [data, setData] = React.useState<Doctor[]>([])
  const [loading, setLoading] = React.useState(true)
  const [editingDoctor, setEditingDoctor] = React.useState<Doctor | undefined>()

  React.useEffect(() => {
    async function load() {
      setLoading(true)
      const doctors = await getDoctorsAction()
      setData(doctors)
      setLoading(false)
    }
    load()
  }, [open])

  const handleEdit = (doc: Doctor) => {
    setEditingDoctor(doc)
    setOpen(true)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setEditingDoctor(undefined)
    }
    setOpen(newOpen)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Referring Doctors</h2>
          <p className="text-muted-foreground">
            Manage your referring doctors, clinics, and commission structures.
          </p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger render={
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Doctor
            </Button>
          } />
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingDoctor ? "Edit Doctor" : "Register New Doctor"}</DialogTitle>
              <DialogDescription>
                {editingDoctor ? "Update the doctor details below." : "Enter the doctor details. Click register when you're done."}
              </DialogDescription>
            </DialogHeader>
            <DoctorForm doctor={editingDoctor} onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mt-4">
        <DataTable columns={getColumns({ onEdit: handleEdit })} data={data} />
      </div>
    </div>
  )
}
