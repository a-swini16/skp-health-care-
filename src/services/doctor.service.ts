import { IDoctorRepository, SupabaseDoctorRepository } from "@/repositories/doctor.repository"
import { Doctor, CreateDoctorDTO } from "@/types/doctor"

export class DoctorService {
  constructor(private readonly repository: IDoctorRepository) {}

  async getAllDoctors(): Promise<Doctor[]> {
    return this.repository.findAll()
  }

  async getDoctorById(id: string): Promise<Doctor | null> {
    return this.repository.findById(id)
  }

  async createDoctor(data: CreateDoctorDTO): Promise<Doctor> {
    return this.repository.create(data)
  }

  async updateDoctor(id: string, data: Partial<CreateDoctorDTO>): Promise<Doctor> {
    return this.repository.update(id, data)
  }

  async deleteDoctor(id: string): Promise<boolean> {
    return this.repository.delete(id)
  }
}

const doctorRepository = new SupabaseDoctorRepository()
export const doctorService = new DoctorService(doctorRepository)
