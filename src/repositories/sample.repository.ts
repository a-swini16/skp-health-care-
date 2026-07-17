import { supabase } from "@/lib/supabase/client"
import { Sample, SampleStatus } from "@/types/sample"

export interface ISampleRepository {
  getSamples(): Promise<Sample[]>
  updateSampleStatus(id: string, status: SampleStatus): Promise<Sample>
}

export class SupabaseSampleRepository implements ISampleRepository {
  async getSamples(): Promise<Sample[]> {
    const { data, error } = await supabase
      .from("samples")
      .select(`
        *,
        order:orders(
          *,
          patient:patients(*)
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    
    return data.map(s => ({
      id: s.id,
      orderId: s.order_id,
      barcode: s.barcode,
      sampleType: s.sample_type,
      status: s.status,
      collectedAt: s.collected_at,
      receivedAt: s.received_at,
      notes: s.notes,
      createdAt: s.created_at,
      order: s.order ? {
        id: s.order.id,
        orderNumber: s.order.order_number,
        patient: s.order.patient ? {
          uhid: s.order.patient.uhid,
          firstName: s.order.patient.first_name,
          lastName: s.order.patient.last_name,
        } : undefined
      } : undefined
    })) as Sample[]
  }

  async updateSampleStatus(id: string, status: SampleStatus): Promise<Sample> {
    const updateData: any = { status }
    if (status === 'collected') updateData.collected_at = new Date().toISOString()
    if (status === 'received') updateData.received_at = new Date().toISOString()

    const { data, error } = await supabase
      .from("samples")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    
    return {
      id: data.id,
      orderId: data.order_id,
      barcode: data.barcode,
      sampleType: data.sample_type,
      status: data.status,
      createdAt: data.created_at
    }
  }
}
