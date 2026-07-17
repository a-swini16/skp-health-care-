import { supabase } from "@/lib/supabase/client"
import { Patient, CreatePatientDTO } from "@/types/patient"

// 1. Define the Interface (Abstracts the DB)
export interface IPatientRepository {
  findById(id: string): Promise<Patient | null>
  findByUhid(uhid: string): Promise<Patient | null>
  findAll(): Promise<Patient[]>
  create(patient: CreatePatientDTO): Promise<Patient>
  update(id: string, patient: Partial<CreatePatientDTO>): Promise<Patient>
  delete(id: string): Promise<boolean>
}

// 2. Implement the Supabase Repository
export class SupabasePatientRepository implements IPatientRepository {
  
  async findById(id: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw new Error(error.message)
    return this.mapToDomain(data)
  }

  async findByUhid(uhid: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("uhid", uhid)
      .single()

    if (error) throw new Error(error.message)
    return this.mapToDomain(data)
  }

  async findAll(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return data.map(this.mapToDomain)
  }

  async create(patient: CreatePatientDTO): Promise<Patient> {
    // Generate a simple UHID for now. In a real system, this would use a sequence or edge function.
    const uniqueNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const uhid = `SKP2026${uniqueNum}`;

    const { data, error } = await supabase
      .from("patients")
      .insert([
        {
          uhid,
          first_name: patient.firstName,
          last_name: patient.lastName,
          dob: patient.dob,
          gender: patient.gender,
          phone: patient.phone,
          email: patient.email,
          address: patient.address,
          city: patient.city,
          blood_group: patient.bloodGroup,
        },
      ])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.mapToDomain(data)
  }

  async update(id: string, patient: Partial<CreatePatientDTO>): Promise<Patient> {
    const updateData: any = {}
    if (patient.firstName) updateData.first_name = patient.firstName
    if (patient.lastName) updateData.last_name = patient.lastName
    if (patient.dob) updateData.dob = patient.dob
    if (patient.gender) updateData.gender = patient.gender
    if (patient.phone) updateData.phone = patient.phone
    if (patient.email !== undefined) updateData.email = patient.email
    if (patient.address !== undefined) updateData.address = patient.address
    if (patient.city !== undefined) updateData.city = patient.city
    if (patient.bloodGroup !== undefined) updateData.blood_group = patient.bloodGroup

    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from("patients")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return this.mapToDomain(data)
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("patients")
      .delete()
      .eq("id", id)

    if (error) throw new Error(error.message)
    return true
  }

  // Mapper to convert DB snake_case to Domain camelCase
  private mapToDomain(row: any): Patient {
    if (!row) return row;
    return {
      id: row.id,
      uhid: row.uhid,
      firstName: row.first_name,
      lastName: row.last_name,
      dob: row.dob,
      gender: row.gender,
      phone: row.phone,
      email: row.email,
      address: row.address,
      city: row.city,
      bloodGroup: row.blood_group,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }
  }
}
