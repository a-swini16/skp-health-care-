export interface Doctor {
  id: string
  name: string
  specialization?: string
  clinicName?: string
  phone?: string
  email?: string
  commissionPercentage: number
  createdAt: string
  updatedAt: string
}

export interface CreateDoctorDTO {
  name: string
  specialization?: string
  clinicName?: string
  phone?: string
  email?: string
  commissionPercentage?: number
}
