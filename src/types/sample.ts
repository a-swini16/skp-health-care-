import { Order } from "./billing"

export type SampleStatus = 'pending_collection' | 'collected' | 'received' | 'processing' | 'completed' | 'rejected' | 'retest'

export interface Sample {
  id: string
  orderId: string
  barcode: string
  sampleType: string
  status: SampleStatus
  collectedAt?: string
  receivedAt?: string
  notes?: string
  createdAt: string
  updatedAt?: string
  order?: Order // Joined relation
}
