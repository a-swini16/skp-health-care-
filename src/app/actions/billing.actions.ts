"use server"

import { CreateOrderDTO, Order } from "@/types/billing"
import { billingService } from "@/services/billing.service"
import { revalidatePath } from "next/cache"

export async function createOrderAction(data: CreateOrderDTO): Promise<{ success: boolean; data?: Order; error?: string }> {
  try {
    const order = await billingService.createOrder(data)
    revalidatePath("/billing")
    revalidatePath("/sample-tracking")
    return { success: true, data: order }
  } catch (error: any) {
    console.error("Failed to create order:", error)
    return { success: false, error: error.message || "Failed to create order" }
  }
}

export async function getOrdersAction(): Promise<Order[]> {
  try {
    return await billingService.getAllOrders()
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return []
  }
}
