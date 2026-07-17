"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Package, AlertTriangle, List, ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import { getInventoryItemsAction, getInventoryCategoriesAction } from "@/app/actions/inventory.actions"
import { InventoryItem, InventoryCategory } from "@/types/inventory"

export default function InventoryPage() {
  const [items, setItems] = React.useState<InventoryItem[]>([])
  const [categories, setCategories] = React.useState<InventoryCategory[]>([])
  const [loading, setLoading] = React.useState(true)
  const [showAddForm, setShowAddForm] = React.useState(false)
  const [newItemName, setNewItemName] = React.useState("")
  const [newItemStock, setNewItemStock] = React.useState("")

  React.useEffect(() => {
    async function load() {
      const [itemsData, catsData] = await Promise.all([
        getInventoryItemsAction(),
        getInventoryCategoriesAction()
      ])
      setItems(itemsData)
      setCategories(catsData)
      setLoading(false)
    }
    load()
  }, [])

  const lowStockItems = items.filter(item => item.currentStock <= item.minStockLevel)

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName || !newItemStock) return
    const newItem: InventoryItem = {
      id: Math.random().toString(),
      name: newItemName,
      minStockLevel: 10,
      currentStock: Number(newItemStock) || 0,
      unit: 'pcs',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setItems([newItem, ...items])
    setNewItemName("")
    setNewItemStock("")
    setShowAddForm(false)
    toast.success("Item added successfully!")
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">Manage reagents, consumables, and stock levels.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast("Categories coming soon")}>
            <List className="mr-2 h-4 w-4" /> Categories
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" /> {showAddForm ? 'Cancel' : 'Add Item'}
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="mb-6 shadow-sm border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Add New Inventory Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddItem} className="flex gap-4 items-end">
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Item Name</label>
                <input required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="e.g., Blood Collection Tubes" />
              </div>
              <div className="space-y-2 w-32">
                <label className="text-sm font-medium">Initial Stock</label>
                <input required type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newItemStock} onChange={e => setNewItemStock(e.target.value)} placeholder="0" />
              </div>
              <Button type="submit">Save Item</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1 border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-orange-700 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" /> Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm">Loading...</p>
            ) : lowStockItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">All items are sufficiently stocked.</p>
            ) : (
              <div className="space-y-3 mt-2">
                {lowStockItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm border-b border-orange-200 pb-2">
                    <span className="font-medium text-orange-900">{item.name}</span>
                    <Badge variant="destructive">{item.currentStock} / {item.minStockLevel}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle>Current Stock</CardTitle>
              <CardDescription>All items across categories</CardDescription>
            </div>
            <Button variant="secondary" size="sm" onClick={() => toast("Purchases coming soon")}>
              <ShoppingCart className="mr-2 h-4 w-4" /> New Purchase
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {loading ? (
              <div className="py-8 text-center text-muted-foreground">Loading inventory...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left font-medium p-3 text-muted-foreground">Item Name</th>
                      <th className="text-left font-medium p-3 text-muted-foreground">Category</th>
                      <th className="text-right font-medium p-3 text-muted-foreground">Stock</th>
                      <th className="text-right font-medium p-3 text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-muted-foreground">
                          No inventory items found. Add items or check database connection.
                        </td>
                      </tr>
                    ) : (
                      items.map(item => (
                        <tr key={item.id}>
                          <td className="p-3 font-medium">
                            {item.name}
                            {item.sku && <div className="text-xs text-muted-foreground font-normal">SKU: {item.sku}</div>}
                          </td>
                          <td className="p-3 text-muted-foreground">{item.category?.name || 'Uncategorized'}</td>
                          <td className="p-3 text-right">
                            <span className="font-mono font-medium">{item.currentStock}</span>
                            <span className="text-xs text-muted-foreground ml-1">{item.unit}</span>
                          </td>
                          <td className="p-3 text-right">
                            {item.currentStock <= item.minStockLevel ? (
                              <Badge variant="destructive">Low Stock</Badge>
                            ) : (
                              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">In Stock</Badge>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
