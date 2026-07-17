"use server"

import { CreatePatientDTO, Patient } from "@/types/patient"
import { PatientService } from "@/services/patient.service"
import { SupabasePatientRepository } from "@/repositories/patient.repository"
import { revalidatePath } from "next/cache"

// Instantiate the service with the Supabase implementation
// If you ever migrate to Spring Boot, you only change this one line to use SpringBootPatientRepository
const repository = new SupabasePatientRepository()
const patientService = new PatientService(repository)

export async function createPatientAction(data: CreatePatientDTO): Promise<{ success: boolean; data?: Patient; error?: string }> {
  try {
    const patient = await patientService.registerPatient(data)
    revalidatePath("/patients") // Refresh the patient list UI
    return { success: true, data: patient }
  } catch (error: any) {
    console.error("Failed to create patient:", error)
    return { success: false, error: error.message || "Failed to create patient" }
  }
}

export async function getPatientsAction(): Promise<Patient[]> {
  try {
    // For now, we fetch all. In a real app, you'd add pagination params.
    return await patientService.getAllPatients()
  } catch (error) {
    console.error("Failed to fetch patients:", error)
    return []
  }
}

export async function getPatientByIdAction(id: string): Promise<Patient | null> {
  try {
    return await patientService.getPatientById(id)
  } catch (error) {
    console.error("Failed to fetch patient:", error)
    return null
  }
}

export async function updatePatientAction(id: string, data: Partial<CreatePatientDTO>): Promise<{ success: boolean; data?: Patient; error?: string }> {
  try {
    const patient = await patientService.updatePatient(id, data)
    revalidatePath("/patients")
    return { success: true, data: patient }
  } catch (error: any) {
    console.error("Failed to update patient:", error)
    return { success: false, error: error.message || "Failed to update patient" }
  }
}

export async function deletePatientAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await patientService.deletePatient(id)
    revalidatePath("/patients")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete patient:", error)
    return { success: false, error: error.message || "Failed to delete patient" }
  }
}
