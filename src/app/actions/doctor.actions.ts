"use server"

import { doctorService } from "@/services/doctor.service"
import { CreateDoctorDTO, Doctor } from "@/types/doctor"
import { revalidatePath } from "next/cache"

export async function getDoctorsAction(): Promise<Doctor[]> {
  try {
    return await doctorService.getAllDoctors()
  } catch (error) {
    console.error("Failed to fetch doctors:", error)
    return []
  }
}

export async function getDoctorByIdAction(id: string): Promise<Doctor | null> {
  try {
    return await doctorService.getDoctorById(id)
  } catch (error) {
    console.error("Failed to fetch doctor:", error)
    return null
  }
}

export async function createDoctorAction(data: CreateDoctorDTO): Promise<{ success: boolean; data?: Doctor; error?: string }> {
  try {
    const doctor = await doctorService.createDoctor(data)
    revalidatePath("/doctors")
    return { success: true, data: doctor }
  } catch (error: any) {
    console.error("Failed to create doctor:", error)
    return { success: false, error: error.message || "Failed to create doctor" }
  }
}

export async function updateDoctorAction(id: string, data: Partial<CreateDoctorDTO>): Promise<{ success: boolean; data?: Doctor; error?: string }> {
  try {
    const doctor = await doctorService.updateDoctor(id, data)
    revalidatePath("/doctors")
    return { success: true, data: doctor }
  } catch (error: any) {
    console.error("Failed to update doctor:", error)
    return { success: false, error: error.message || "Failed to update doctor" }
  }
}

export async function deleteDoctorAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await doctorService.deleteDoctor(id)
    revalidatePath("/doctors")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete doctor:", error)
    return { success: false, error: error.message || "Failed to delete doctor" }
  }
}
