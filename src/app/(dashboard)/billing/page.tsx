"use client"

import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Printer, Download, Plus, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getPatientsAction } from "@/app/actions/patient.actions"
import { getTestsAction } from "@/app/actions/test.actions"
import { createOrderAction } from "@/app/actions/billing.actions"
import { Patient } from "@/types/patient"
import { LabTest } from "@/types/test"
import { Order } from "@/types/billing"
import { toast } from "sonner"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { InvoiceTemplate } from "@/components/pdf-engine/templates/InvoiceTemplate"
import { generateQRCodeURI } from "@/components/pdf-engine/utils/barcode"

export default function BillingPage() {
  const [patients, setPatients] = React.useState<Patient[]>([])
  const [tests, setTests] = React.useState<LabTest[]>([])
  const [selectedPatientId, setSelectedPatientId] = React.useState("")
  const [selectedTestIds, setSelectedTestIds] = React.useState<string[]>([])
  const [discount, setDiscount] = React.useState(0)
  
  const [order, setOrder] = React.useState<Order | null>(null)
  const [qrUri, setQrUri] = React.useState<string>("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
    async function load() {
      const p = await getPatientsAction()
      const t = await getTestsAction()
      setPatients(p)
      setTests(t)
    }
    load()
  }, [])

  const selectedTestsData = tests.filter(t => selectedTestIds.includes(t.id))
  const subtotal = selectedTestsData.reduce((sum, t) => sum + t.price, 0)
  const tax = subtotal * 0.05 // 5% GST
  const total = subtotal + tax - discount

  const toggleTest = (id: string) => {
    setSelectedTestIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleGenerateBill = async () => {
    if (!selectedPatientId) return toast.error("Please select a patient")
    if (selectedTestIds.length === 0) return toast.error("Please select at least one test")

    setIsSubmitting(true)
    const res = await createOrderAction({
      patientId: selectedPatientId,
      testIds: selectedTestIds,
      discountAmount: discount,
      paidAmount: total
    })

    if (res.success && res.data) {
      toast.success("Bill generated successfully!")
      setOrder(res.data) // This will trigger the PDF view
      
      // Generate QR for Invoice
      generateQRCodeURI(`https://skphealthcare.com/invoice/${res.data.id}`).then(uri => setQrUri(uri))
    } else {
      toast.error(res.error)
    }
    setIsSubmitting(false)
  }

  const resetForm = () => {
    setOrder(null)
    setSelectedPatientId("")
    setSelectedTestIds([])
    setDiscount(0)
  }

  if (order) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-center">Invoice Generated Successfully!</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Order <strong>{order.orderNumber}</strong> has been created. The samples have been queued for collection in Sample Tracking.
        </p>
        <div className="flex gap-4 mt-4">
          {isMounted && (
            <PDFDownloadLink document={<InvoiceTemplate order={order} items={selectedTestsData} qrUri={qrUri} />} fileName={`${order.orderNumber}.pdf`}>
              {({ loading, error }) => (
                <Button size="lg" disabled={loading}>
                  <Download className="mr-2 h-5 w-5" /> {loading ? 'Preparing PDF...' : (error ? 'Error generating' : 'Download Invoice PDF')}
                </Button>
              )}
            </PDFDownloadLink>
          )}
          <Button variant="outline" size="lg" onClick={resetForm}>
            <Plus className="mr-2 h-5 w-5" /> Create New Bill
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">New Billing Order</h2>
          <p className="text-muted-foreground">Select patient and tests to generate a bill.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <h3 className="font-semibold text-lg">1. Select Patient</h3>
            </CardHeader>
            <CardContent className="pt-6">
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedPatientId}
                onChange={e => setSelectedPatientId(e.target.value)}
              >
                <option value="">-- Choose Patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName} (UHID: {p.uhid})</option>
                ))}
              </select>
              {patients.length === 0 && <p className="text-sm text-amber-600 mt-2">No patients found. Please register a patient first.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b">
              <h3 className="font-semibold text-lg">2. Select Tests</h3>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                {tests.map(t => (
                  <div key={t.id} 
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${selectedTestIds.includes(t.id) ? 'bg-primary/10 border-primary' : 'hover:bg-muted'}`}
                    onClick={() => toggleTest(t.id)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{t.name}</span>
                      <span className="text-muted-foreground">₹{t.price}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{t.code}</span>
                  </div>
                ))}
              </div>
              {tests.length === 0 && <p className="text-sm text-amber-600 mt-2">No tests found. Please seed the database.</p>}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader className="pb-3 border-b bg-muted/30">
              <h3 className="font-semibold text-lg">Order Summary</h3>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedTestsData.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No tests selected</p>
                ) : (
                  selectedTestsData.map(t => (
                    <div key={t.id} className="flex justify-between text-sm">
                      <span className="truncate pr-2">{t.name}</span>
                      <span>₹{t.price}</span>
                    </div>
                  ))
                )}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                  <span>Discount (₹)</span>
                  <div className="w-24">
                    <input 
                      type="number" 
                      className="w-full p-1 text-right border rounded-md h-8 bg-transparent" 
                      value={discount || ''} 
                      onChange={e => setDiscount(Number(e.target.value))}
                      min="0"
                      max={subtotal + tax}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total Due</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button className="w-full" size="lg" onClick={handleGenerateBill} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Generate Bill"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
