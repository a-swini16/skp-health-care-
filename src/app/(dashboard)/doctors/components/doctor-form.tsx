"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreateDoctorDTO, Doctor } from "@/types/doctor"
import { createDoctorAction, updateDoctorAction } from "@/app/actions/doctor.actions"

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  specialization: z.string().optional(),
  clinicName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  commissionPercentage: z.number().min(0).max(100).optional(),
})

export function DoctorForm({ onSuccess, doctor }: { onSuccess?: () => void, doctor?: Doctor }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateDoctorDTO>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: doctor?.name || "",
      specialization: doctor?.specialization || "",
      clinicName: doctor?.clinicName || "",
      phone: doctor?.phone || "",
      email: doctor?.email || "",
      commissionPercentage: doctor?.commissionPercentage || 0,
    },
  })

  async function onSubmit(values: CreateDoctorDTO) {
    let res;
    if (doctor) {
      res = await updateDoctorAction(doctor.id, values)
    } else {
      res = await createDoctorAction(values)
    }
    if (res.success) {
      if (onSuccess) onSuccess()
    } else {
      setError("root", { message: res.error || "Failed to save doctor" })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && <div className="text-sm font-medium text-destructive bg-destructive/10 p-2 rounded-md">{errors.root.message}</div>}
      
      <div className="space-y-2">
        <Label htmlFor="name">Doctor Name</Label>
        <Input id="name" placeholder="Dr. John Doe" {...register("name")} />
        {errors.name && <p className="text-[0.8rem] text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="specialization">Specialization</Label>
          <Input id="specialization" placeholder="Cardiologist" {...register("specialization")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clinicName">Clinic / Hospital</Label>
          <Input id="clinicName" placeholder="City Hospital" {...register("clinicName")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" placeholder="+91 9876543210" {...register("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="doctor@example.com" {...register("email")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="commissionPercentage">Commission (%)</Label>
        <Input id="commissionPercentage" type="number" step="0.1" min="0" max="100" {...register("commissionPercentage", { valueAsNumber: true })} />
        {errors.commissionPercentage && <p className="text-[0.8rem] text-destructive">{errors.commissionPercentage.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : (doctor ? "Save Changes" : "Register Doctor")}
      </Button>
    </form>
  )
}
