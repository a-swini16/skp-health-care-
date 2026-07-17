"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Printer, FlaskConical, Users, Shield, Save } from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      toast.success("Settings saved successfully!")
      setIsSaving(false)
    }, 800)
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Settings</h2>
          <p className="text-muted-foreground">Manage your laboratory preferences and configurations.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="general" className="py-3"><Building2 className="mr-2 h-4 w-4" /> General</TabsTrigger>
          <TabsTrigger value="lab" className="py-3"><FlaskConical className="mr-2 h-4 w-4" /> Lab Config</TabsTrigger>
          <TabsTrigger value="printing" className="py-3"><Printer className="mr-2 h-4 w-4" /> Printing</TabsTrigger>
          <TabsTrigger value="users" className="py-3"><Users className="mr-2 h-4 w-4" /> Users</TabsTrigger>
          <TabsTrigger value="security" className="py-3"><Shield className="mr-2 h-4 w-4" /> Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Update your laboratory's public information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lab Name</label>
                  <Input defaultValue="SKP Healthcare" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">GSTIN</label>
                  <Input defaultValue="27AADCB2230M1Z2" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input defaultValue="+91 9876543210" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input defaultValue="info@skphealthcare.com" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <Input defaultValue="123 Medical Hub, City Center" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Configurations</CardTitle>
              <CardDescription>Set defaults for tests and workflows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Barcode Format</label>
                  <Input defaultValue="YYMMDD-SEQ" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sample Retention Days</label>
                  <Input type="number" defaultValue="7" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="printing" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Printing Preferences</CardTitle>
              <CardDescription>Configure receipt and barcode printer settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Barcode Printer IP</label>
                  <Input defaultValue="192.168.1.100" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Receipt Printer IP</label>
                  <Input defaultValue="192.168.1.101" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Paper Size</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>A4</option>
                    <option>Letter</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage staff accounts and permissions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">You have 3 active users. Use the Auth module for role management.</p>
              <Button variant="outline">Go to Authentication Module</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security & Compliance</CardTitle>
              <CardDescription>Audit logs and compliance settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Require 2FA for administrative roles.</p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <p className="font-medium">Data Backup</p>
                    <p className="text-sm text-muted-foreground">Last backup completed today at 02:00 AM.</p>
                  </div>
                  <Button variant="outline">Run Now</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
