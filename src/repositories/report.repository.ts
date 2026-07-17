import { supabase } from "@/lib/supabase/client"
import { Report, SaveResultDTO } from "@/types/report"
import { OrderItem } from "@/types/billing"
import { TestParameter } from "@/types/test"

export interface IReportRepository {
  saveResult(data: SaveResultDTO): Promise<void>
  getPendingReports(): Promise<any[]>
  getOrderItemsForReport(orderId: string): Promise<any[]>
}

export class SupabaseReportRepository implements IReportRepository {
  
  async getPendingReports(): Promise<any[]> {
    // We get samples that are in 'processing' status to enter results
    const { data, error } = await supabase
      .from("samples")
      .select(`
        *,
        order:orders(
          *,
          patient:patients(*)
        )
      `)
      .in("status", ["processing", "completed"])
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return data
  }

  async getOrderItemsForReport(orderId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from("order_items")
      .select(`
        *,
        test:tests(
          *,
          parameters:test_parameters(*)
        )
      `)
      .eq("order_id", orderId)
    
    if (error) throw new Error(error.message)
    return data
  }

  async saveResult(data: SaveResultDTO): Promise<void> {
    const { error } = await supabase
      .from("results")
      .upsert({
        order_id: data.orderId,
        test_id: data.testId,
        parameter_id: data.parameterId,
        value: data.value,
        is_critical: data.isCritical
      }, { onConflict: "order_id,test_id,parameter_id" })

    if (error) throw new Error(error.message)
  }
}
