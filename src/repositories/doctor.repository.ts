import { supabase } from "@/lib/supabase/client"
import { Doctor, CreateDoctorDTO } from "@/types/doctor"

export interface IDoctorRepository {
  findAll(): Promise<Doctor[]>
  findById(id: string): Promise<Doctor | null>
  create(doctor: CreateDoctorDTO): Promise<Doctor>
  update(id: string, doctor: Partial<CreateDoctorDTO>): Promise<Doctor>
  delete(id: string): Promise<boolean>
}

export class SupabaseDoctorRepository implements IDoctorRepository {
  async findAll(): Promise<Doctor[]> {
    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return data.map(this.mapToDomain)
  }

  async findById(id: string): Promise<Doctor | null> {
    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw new Error(error.message)
    return this.mapToDomain(data)
  }

  async create(doctor: CreateDoctorDTO): Promise<Doctor> {
    const { data, error } = await supabase
      .from("doctors")
      .insert([{
        name: doctor.name,
        specialization: doctor.specialization,
        clinic_name: doctor.clinicName,
        phone: doctor.phone,
        email: doctor.email,
        commission_percentage: doctor.commissionPercentage || 0
      }])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.mapToDomain(data)
  }

  async update(id: string, doctor: Partial<CreateDoctorDTO>): Promise<Doctor> {
    const updateData: any = { updated_at: new Date().toISOString() }
    if (doctor.name) updateData.name = doctor.name
    if (doctor.specialization !== undefined) updateData.specialization = doctor.specialization
    if (doctor.clinicName !== undefined) updateData.clinic_name = doctor.clinicName
    if (doctor.phone !== undefined) updateData.phone = doctor.phone
    if (doctor.email !== undefined) updateData.email = doctor.email
    if (doctor.commissionPercentage !== undefined) updateData.commission_percentage = doctor.commissionPercentage

    const { data, error } = await supabase
      .from("doctors")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.mapToDomain(data)
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("doctors")
      .delete()
      .eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  private mapToDomain(row: any): Doctor {
    if (!row) return row;
    return {
      id: row.id,
      name: row.name,
      specialization: row.specialization,
      clinicName: row.clinic_name,
      phone: row.phone,
      email: row.email,
      commissionPercentage: Number(row.commission_percentage),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }
}
