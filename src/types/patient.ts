export interface Patient {
  id: string
  uhid: string
  firstName: string
  lastName: string
  dob: Date | string
  gender: "male" | "female" | "other"
  phone: string
  email?: string
  address?: string
  city?: string
  bloodGroup?: string
  createdAt?: Date | string
  updatedAt?: Date | string
}

export interface CreatePatientDTO {
  firstName: string
  lastName: string
  dob: string
  gender: "male" | "female" | "other"
  phone: string
  email?: string
  address?: string
  city?: string
  bloodGroup?: string
}
