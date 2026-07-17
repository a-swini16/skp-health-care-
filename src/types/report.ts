import { Order } from "./billing"
import { TestParameter } from "./test"

export type ReportStatus = 'pending' | 'draft' | 'ready_for_approval' | 'approved' | 'published'

export interface Result {
  id: string
  orderId: string
  testId: string
  parameterId: string
  value: string
  isCritical: boolean
  parameter?: TestParameter
}

export interface Report {
  id: string
  orderId: string
  departmentId: string
  status: ReportStatus
  pdfUrl?: string
  comments?: string
  createdAt: string
  order?: Order
  results?: Result[]
}

export interface SaveResultDTO {
  orderId: string
  testId: string
  parameterId: string
  value: string
  isCritical: boolean
}
