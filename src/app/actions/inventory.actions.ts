"use server"

import { supabase } from "@/lib/supabase/client"
import { InventoryItem, InventoryCategory, InventoryVendor, InventoryPurchase } from "@/types/inventory"
import { revalidatePath } from "next/cache"

export async function getInventoryItemsAction(): Promise<InventoryItem[]> {
  try {
    const { data, error } = await supabase.from("inventory_items").select(`*, category:inventory_categories(*)`)
    if (error) {
      console.warn("Inventory items fetch error (table might not exist yet):", error.message)
      return []
    }
    return data.map(d => ({
      id: d.id,
      categoryId: d.category_id,
      name: d.name,
      sku: d.sku,
      unit: d.unit,
      minStockLevel: Number(d.min_stock_level),
      currentStock: Number(d.current_stock),
      category: d.category ? { id: d.category.id, name: d.category.name, createdAt: d.category.created_at, updatedAt: d.category.updated_at } : undefined,
      createdAt: d.created_at,
      updatedAt: d.updated_at
    }))
  } catch (err) {
    return []
  }
}

export async function getInventoryCategoriesAction(): Promise<InventoryCategory[]> {
  try {
    const { data, error } = await supabase.from("inventory_categories").select("*")
    if (error) return []
    return data.map(d => ({
      id: d.id,
      name: d.name,
      description: d.description,
      createdAt: d.created_at,
      updatedAt: d.updated_at
    }))
  } catch (err) {
    return []
  }
}
