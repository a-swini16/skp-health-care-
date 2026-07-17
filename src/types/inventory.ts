export interface InventoryCategory {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface InventoryVendor {
  id: string
  name: string
  contactPerson?: string
  phone?: string
  email?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export interface InventoryItem {
  id: string
  categoryId?: string
  name: string
  sku?: string
  unit?: string
  minStockLevel: number
  currentStock: number
  category?: InventoryCategory
  createdAt: string
  updatedAt: string
}

export interface InventoryPurchase {
  id: string
  vendorId?: string
  itemId?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  purchaseDate: string
  createdAt: string
  item?: InventoryItem
  vendor?: InventoryVendor
}
