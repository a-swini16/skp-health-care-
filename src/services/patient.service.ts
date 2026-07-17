import { IPatientRepository, SupabasePatientRepository } from "@/repositories/patient.repository"
import { Patient, CreatePatientDTO } from "@/types/patient"

// The Service layer encapsulates business logic.
// It depends on the abstraction (IPatientRepository) rather than Supabase directly.
export class PatientService {
  constructor(private readonly repository: IPatientRepository) {}

  async getPatientById(id: string): Promise<Patient | null> {
    return this.repository.findById(id)
  }

  async getPatientByUhid(uhid: string): Promise<Patient | null> {
    if (!uhid.startsWith("SKP")) {
      throw new Error("Invalid UHID Format")
    }
    return this.repository.findByUhid(uhid)
  }

  async getAllPatients(): Promise<Patient[]> {
    return this.repository.findAll()
  }

  async registerPatient(data: CreatePatientDTO): Promise<Patient> {
    // Add business logic validation here if needed (e.g. format phone numbers)
    return this.repository.create(data)
  }

  async updatePatient(id: string, data: Partial<CreatePatientDTO>): Promise<Patient> {
    return this.repository.update(id, data)
  }

  async deletePatient(id: string): Promise<boolean> {
    return this.repository.delete(id)
  }
}

// Dependency Injection (simplified for frontend usage)
// To migrate to Spring Boot / NestJS API later, you would just create an 
// `ApiPatientRepository` that implements `IPatientRepository` by fetching from your API,
// and inject it here instead of `SupabasePatientRepository`.
const patientRepository = new SupabasePatientRepository()
export const patientService = new PatientService(patientRepository)
