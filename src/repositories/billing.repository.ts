import { supabase } from "@/lib/supabase/client"
import { Order, CreateOrderDTO } from "@/types/billing"

export interface IBillingRepository {
  createOrder(data: CreateOrderDTO, total: number, tax: number, subtotal: number): Promise<Order>
  getOrders(): Promise<Order[]>
  getOrderById(id: string): Promise<Order | null>
}

export class SupabaseBillingRepository implements IBillingRepository {
  async getOrders(): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        patient:patients(*)
      `)
      .order("created_at", { ascending: false })

    if (error) throw new Error(error.message)
    return data.map(this.mapToOrder)
  }

  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        patient:patients(*),
        items:order_items(
          *,
          test:tests(*)
        )
      `)
      .eq("id", id)
      .single()

    if (error) return null
    return this.mapToOrder(data)
  }

  async createOrder(data: CreateOrderDTO, total: number, tax: number, subtotal: number): Promise<Order> {
    // 1. Create the Order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        patient_id: data.patientId,
        subtotal: subtotal,
        tax_amount: tax,
        discount_amount: data.discountAmount,
        total_amount: total,
        paid_amount: data.paidAmount,
        payment_status: data.paidAmount >= total ? 'paid' : (data.paidAmount > 0 ? 'partial' : 'unpaid')
      })
      .select(`
        *,
        patient:patients(*)
      `)
      .single()

    if (orderError) throw new Error(orderError.message)

    // 2. Insert Order Items (Tests)
    // First, we need the prices for the selected tests. In a real scenario, the backend should fetch prices securely.
    const { data: tests, error: testError } = await supabase
      .from("tests")
      .select("id, price")
      .in("id", data.testIds)

    if (testError) throw new Error(testError.message)

    const orderItems = tests.map(t => ({
      order_id: order.id,
      test_id: t.id,
      price: t.price
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)
    if (itemsError) throw new Error(itemsError.message)

    // 3. Create Sample tracking entries for these tests
    // Group tests by sample_type in a real app. For now, create one generic sample.
    const { error: sampleError } = await supabase.from("samples").insert({
      order_id: order.id,
      barcode: `SMP-${Date.now()}`,
      sample_type: "Blood"
    })
    
    if (sampleError) throw new Error(sampleError.message)

    return this.mapToOrder(order)
  }

  private mapToOrder(data: any): Order {
    return {
      id: data.id,
      orderNumber: data.order_number,
      patientId: data.patient_id,
      doctorId: data.doctor_id,
      subtotal: Number(data.subtotal),
      taxAmount: Number(data.tax_amount),
      discountAmount: Number(data.discount_amount),
      totalAmount: Number(data.total_amount),
      paidAmount: Number(data.paid_amount),
      paymentStatus: data.payment_status,
      orderStatus: data.order_status,
      createdAt: data.created_at,
      patient: data.patient ? {
        id: data.patient.id,
        uhid: data.patient.uhid,
        firstName: data.patient.first_name,
        lastName: data.patient.last_name,
        phone: data.patient.phone,
        dob: data.patient.dob,
        gender: data.patient.gender
      } as any : undefined,
      items: data.items ? data.items.map((i: any) => ({
        id: i.id,
        testId: i.test_id,
        price: Number(i.price),
        test: i.test ? { name: i.test.name, code: i.test.code } : undefined
      })) : undefined
    }
  }
}
