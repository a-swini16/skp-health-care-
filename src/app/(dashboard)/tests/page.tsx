"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Microscope, Plus, Settings2 } from "lucide-react"
import { toast } from "sonner"
import { getTestsAction, getDepartmentsAction } from "@/app/actions/test.actions"
import { LabTest, Department } from "@/types/test"

export default function TestManagementPage() {
  const [tests, setTests] = React.useState<LabTest[]>([])
  const [departments, setDepartments] = React.useState<Department[]>([])
  const [showAddForm, setShowAddForm] = React.useState(false)
  const [newTestName, setNewTestName] = React.useState("")
  const [newTestPrice, setNewTestPrice] = React.useState("")
  
  React.useEffect(() => {
    async function load() {
      const [testsData, deptData] = await Promise.all([
        getTestsAction(),
        getDepartmentsAction()
      ])
      setTests(testsData)
      setDepartments(deptData)
    }
    load()
  }, [])

  // Group tests by department
  const grouped = departments.map(dept => ({
    ...dept,
    tests: tests.filter(t => t.departmentId === dept.id)
  })).filter(g => g.tests.length > 0 || true) // Keep all depts for now

  const uncategorized = tests.filter(t => !t.departmentId)

  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTestName || !newTestPrice) return
    const newTest: LabTest = {
      id: Math.random().toString(),
      name: newTestName,
      price: Number(newTestPrice) || 0,
      departmentId: "",
      code: `TST-${Math.floor(Math.random() * 1000)}`,
      turnAroundTimeHours: 24,
      isActive: true,
      description: "Custom test",
      sampleType: "Blood",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setTests([newTest, ...tests])
    setNewTestName("")
    setNewTestPrice("")
    setShowAddForm(false)
    toast.success("Test added successfully!")
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Test Management</h2>
          <p className="text-muted-foreground">
            Configure laboratory tests, parameters, packages, and reference ranges.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast("Departments configuration coming soon!")}>
            <Settings2 className="mr-2 h-4 w-4" /> Departments
          </Button>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" /> {showAddForm ? 'Cancel' : 'New Test'}
          </Button>
        </div>
      </div>

      {showAddForm && (
        <Card className="mb-6 shadow-sm border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Add New Test</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddTest} className="flex gap-4 items-end">
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Test Name</label>
                <input required type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newTestName} onChange={e => setNewTestName(e.target.value)} placeholder="e.g., Complete Blood Count" />
              </div>
              <div className="space-y-2 w-32">
                <label className="text-sm font-medium">Price (₹)</label>
                <input required type="number" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newTestPrice} onChange={e => setNewTestPrice(e.target.value)} placeholder="0.00" />
              </div>
              <Button type="submit">Save Test</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {grouped.map(dept => (
          <Card key={dept.id} className="shadow-sm border-muted">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{dept.name}</CardTitle>
                <Badge>{dept.tests.length} Tests</Badge>
              </div>
              <CardDescription>{dept.description || "No description"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dept.tests.slice(0, 3).map(test => (
                  <div key={test.id} className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="font-medium truncate pr-2">{test.name}</span>
                    <span className="text-muted-foreground whitespace-nowrap">₹{test.price}</span>
                  </div>
                ))}
                {dept.tests.length === 0 && (
                  <div className="text-sm text-muted-foreground text-center py-4">No tests in this department</div>
                )}
                {dept.tests.length > 3 && (
                  <div className="text-xs text-muted-foreground text-center">
                    + {dept.tests.length - 3} more tests
                  </div>
                )}
                <Button variant="ghost" className="w-full text-xs text-primary h-8" onClick={() => toast("Manage tests coming soon")}>
                  Manage Tests <Microscope className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {uncategorized.length > 0 && (
          <Card className="shadow-sm border-muted">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">Uncategorized</CardTitle>
                <Badge variant="secondary">{uncategorized.length} Tests</Badge>
              </div>
              <CardDescription>Tests without a department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uncategorized.slice(0, 3).map(test => (
                  <div key={test.id} className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="font-medium truncate pr-2">{test.name}</span>
                    <span className="text-muted-foreground whitespace-nowrap">₹{test.price}</span>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-xs text-primary h-8" onClick={() => toast("Manage tests coming soon")}>
                  Manage Tests <Microscope className="ml-2 h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Packages Card */}
        <Card className="shadow-sm border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg text-primary">Health Packages</CardTitle>
              <Badge className="bg-primary">Manage</Badge>
            </div>
            <CardDescription>Bundled tests at discounted rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-center py-4 text-muted-foreground">
                Combine tests into packages
              </div>
              <Button className="w-full h-8 text-xs" onClick={() => toast("Packages coming soon")}>
                Manage Packages
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
