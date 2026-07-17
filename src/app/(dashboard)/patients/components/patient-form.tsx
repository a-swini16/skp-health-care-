"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreatePatientDTO } from "@/types/patient"

import { createPatientAction, updatePatientAction } from "@/app/actions/patient.actions"
import { Patient } from "@/types/patient"

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email().optional().or(z.literal("")),
  bloodGroup: z.string().optional(),
})

export function PatientForm({ onSuccess, patient }: { onSuccess?: () => void, patient?: Patient }) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreatePatientDTO>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: patient?.firstName || "",
      lastName: patient?.lastName || "",
      dob: patient?.dob ? new Date(patient.dob).toISOString().substring(0, 10) : "",
      gender: (patient?.gender as any) || "male",
      phone: patient?.phone || "",
      email: patient?.email || "",
      bloodGroup: patient?.bloodGroup || "",
    },
  })

  async function onSubmit(values: CreatePatientDTO) {
    let res;
    if (patient) {
      res = await updatePatientAction(patient.id, values)
    } else {
      res = await createPatientAction(values)
    }
    if (res.success) {
      if (onSuccess) onSuccess()
    } else {
      setError("root", { message: res.error || "Failed to register patient" })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errors.root && <div className="text-sm font-medium text-destructive bg-destructive/10 p-2 rounded-md">{errors.root.message}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" placeholder="John" {...register("firstName")} />
          {errors.firstName && <p className="text-[0.8rem] text-destructive">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" placeholder="Doe" {...register("lastName")} />
          {errors.lastName && <p className="text-[0.8rem] text-destructive">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" type="date" {...register("dob")} />
          {errors.dob && <p className="text-[0.8rem] text-destructive">{errors.dob.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <select 
            id="gender" 
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            {...register("gender")}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" placeholder="+91 9876543210" {...register("phone")} />
          {errors.phone && <p className="text-[0.8rem] text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bloodGroup">Blood Group</Label>
        <Input id="bloodGroup" placeholder="O+" {...register("bloodGroup")} />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : (patient ? "Save Changes" : "Register Patient")}
      </Button>
    </form>
  )
}
