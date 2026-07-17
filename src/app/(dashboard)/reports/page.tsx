"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle2, Download, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { getPendingWorklistAction, getReportDetailsAction, completeReportAction, saveTestResultAction } from "@/app/actions/report.actions"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { MedicalReportTemplate } from "@/components/pdf-engine/templates/MedicalReportTemplate"
import { generateBarcodeURI, generateQRCodeURI } from "@/components/pdf-engine/utils/barcode"
import { FlaskConical } from "lucide-react"

export default function ReportsPage() {
  const [worklist, setWorklist] = React.useState<any[]>([])
  const [selectedSample, setSelectedSample] = React.useState<any>(null)
  const [orderItems, setOrderItems] = React.useState<any[]>([])
  const [results, setResults] = React.useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)
  const [barcodeUri, setBarcodeUri] = React.useState<string>("")
  const [qrUri, setQrUri] = React.useState<string>("")

  React.useEffect(() => {
    setIsMounted(true)
    loadWorklist()
  }, [])

  async function loadWorklist() {
    const data = await getPendingWorklistAction()
    setWorklist(data)
  }

  const handleSelectSample = async (sample: any) => {
    setSelectedSample(sample)
    const items = await getReportDetailsAction(sample.order_id)
    setOrderItems(items)
    // Pre-fill results object with empty strings
    const initialResults: Record<string, string> = {}
    items.forEach(item => {
      item.test?.parameters?.forEach((p: any) => {
        initialResults[p.id] = ""
      })
    })
    setResults(initialResults)

    // Pre-generate URIs for PDF
    if (sample.barcode) setBarcodeUri(await generateBarcodeURI(sample.barcode))
    setQrUri(await generateQRCodeURI(`https://skphealthcare.com/verify/${sample.id}`))
  }

  const loadDemoSample = () => {
    const demoSample = {
      id: "demo-sample-123",
      order_id: "demo-order-123",
      barcode: "SKP-260623TLTL031",
      status: "processing",
      sample_type: "Blood",
      collected_at: new Date().toISOString(),
      order: {
        patient: {
          first_name: "HARAMANI",
          last_name: "SWAIN",
          gender: "female",
          dob: "1973-01-01",
          phone: "9937347755",
          uhid: "UHID-12345"
        },
        doctor: {
          name: "Bharat Bhusan Satpathy"
        }
      }
    }
    
    const demoItems = [
      {
        id: "item-1",
        test_id: "test-1",
        test: {
          name: "IMMUNOHISTOCHEMISTRY NO IHC 502/26",
          sample_type: "Tissue",
          parameters: [
            { id: "p1", name: "ER", is_numeric: false, unit: "", reference_range_female: "Positive in tumor cells (score 5+3)" },
            { id: "p2", name: "PR", is_numeric: false, unit: "", reference_range_female: "Positive in tumor cells (score 4+3)" },
            { id: "p3", name: "HER2/NEU", is_numeric: false, unit: "", reference_range_female: "Positive in tumor cells (score 3+)" },
            { id: "p4", name: "MIB1 INDEX", is_numeric: false, unit: "", reference_range_female: "~ 50 %" }
          ]
        }
      }
    ]

    setWorklist([demoSample])
    setSelectedSample(demoSample)
    setOrderItems(demoItems)
    setResults({ p1: "Positive", p2: "Positive", p3: "Positive", p4: "50%" })
    
    generateBarcodeURI(demoSample.barcode).then(uri => setBarcodeUri(uri))
    generateQRCodeURI(`https://skphealthcare.com/verify/${demoSample.id}`).then(uri => setQrUri(uri))
  }

  const handleResultChange = (paramId: string, value: string) => {
    setResults(prev => ({ ...prev, [paramId]: value }))
  }

  const handleComplete = async () => {
    setIsSubmitting(true)

    // Bypass DB logic for the demo sample
    if (selectedSample.id === "demo-sample-123") {
      toast.success("Results saved and report marked as completed! (Demo Mode)")
      setSelectedSample({ ...selectedSample, status: 'completed' })
      setIsSubmitting(false)
      return
    }
    
    // Save results to DB
    for (const item of orderItems) {
      for (const param of item.test?.parameters || []) {
        const val = results[param.id]
        if (val !== undefined && val !== "") {
          const numVal = Number(val)
          let isCritical = false
          if (param.is_numeric && !isNaN(numVal)) {
            if ((param.min_critical_value && numVal < param.min_critical_value) || 
                (param.max_critical_value && numVal > param.max_critical_value)) {
              isCritical = true
            }
          }
          await saveTestResultAction({
            orderId: selectedSample.order_id,
            testId: item.test_id,
            parameterId: param.id,
            value: val,
            isCritical
          })
        }
      }
    }

    const res = await completeReportAction(selectedSample.id)
    if (res.success) {
      toast.success("Results saved and report marked as completed!")
      setSelectedSample({ ...selectedSample, status: 'completed' })
      loadWorklist()
    } else {
      toast.error(res.error)
    }
    setIsSubmitting(false)
  }

  const isValueCritical = (param: any, val: string) => {
    if (!val || !param.is_numeric) return false;
    const numVal = Number(val)
    if (isNaN(numVal)) return false;
    if ((param.min_critical_value && numVal < param.min_critical_value) || 
        (param.max_critical_value && numVal > param.max_critical_value)) {
      return true
    }
    return false
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Report Engine</h2>
          <p className="text-muted-foreground">Enter results and generate medical reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <Card>
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <h3 className="font-semibold text-lg">Worklist</h3>
              <Button variant="outline" size="sm" onClick={loadDemoSample} title="Load Demo Sample">
                <FlaskConical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="pt-0 px-0">
              {worklist.length === 0 && <p className="p-4 text-sm text-muted-foreground text-center">No samples in processing. Click the flask icon to load a demo.</p>}
              <div className="divide-y max-h-[60vh] overflow-y-auto">
                {worklist.map(sample => (
                  <div 
                    key={sample.id} 
                    className={`p-4 cursor-pointer transition-colors ${selectedSample?.id === sample.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-muted'}`}
                    onClick={() => handleSelectSample(sample)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold font-mono">{sample.barcode}</span>
                      {sample.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </div>
                    <div className="text-sm font-medium">{sample.order?.patient?.first_name} {sample.order?.patient?.last_name}</div>
                    <div className="text-xs text-muted-foreground">{sample.sample_type}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2 space-y-6">
          {!selectedSample ? (
            <Card className="h-[400px] flex flex-col items-center justify-center text-muted-foreground">
              <FileText className="w-12 h-12 mb-4 opacity-50" />
              <p>Select a sample from the worklist to enter results.</p>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader className="bg-muted/30 border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedSample.order?.patient?.first_name} {selectedSample.order?.patient?.last_name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">UHID: {selectedSample.order?.patient?.uhid}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{selectedSample.barcode}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{selectedSample.sample_type}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {orderItems.length === 0 && <p className="text-sm text-amber-600">No tests or parameters configured for this order.</p>}
                  
                  {orderItems.map(item => (
                    <div key={item.id} className="mb-8">
                      <h4 className="font-bold text-primary border-b pb-2 mb-4">{item.test?.name}</h4>
                      {item.test?.parameters?.length === 0 && <p className="text-sm text-muted-foreground">No parameters defined.</p>}
                      
                      <div className="space-y-4">
                        {item.test?.parameters?.map((param: any) => {
                          const val = results[param.id] || ''
                          const isCritical = isValueCritical(param, val)
                          
                          return (
                            <div key={param.id} className="grid grid-cols-12 gap-4 items-center">
                              <div className="col-span-4 text-sm font-medium">{param.name}</div>
                              <div className="col-span-4 relative">
                                <Input 
                                  value={val}
                                  onChange={e => handleResultChange(param.id, e.target.value)}
                                  disabled={selectedSample.status === 'completed'}
                                  placeholder="Enter value"
                                  className={isCritical ? "border-red-500 text-red-600 focus-visible:ring-red-500" : ""}
                                />
                                {isCritical && (
                                  <div className="absolute -right-6 top-2 text-red-500" title="Critical Value!">
                                    <AlertTriangle className="w-5 h-5" />
                                  </div>
                                )}
                              </div>
                              <div className="col-span-2 text-sm text-muted-foreground">{param.unit}</div>
                              <div className="col-span-2 text-xs text-muted-foreground">
                                {selectedSample.order?.patient?.gender === 'female' ? param.reference_range_female : param.reference_range_male}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                    {selectedSample.status !== 'completed' ? (
                      <Button onClick={handleComplete} disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Approve & Complete Report"}
                      </Button>
                    ) : (
                      isMounted && (
                        <PDFDownloadLink 
                          document={<MedicalReportTemplate sample={selectedSample} orderItems={orderItems} results={results} barcodeUri={barcodeUri} qrUri={qrUri} />} 
                          fileName={`${selectedSample.barcode}_Report.pdf`}
                        >
                          {({ loading, error }) => (
                            <Button disabled={loading}>
                              <Download className="mr-2 h-4 w-4" /> {loading ? 'Preparing...' : (error ? 'Error' : 'Download Medical Report')}
                            </Button>
                          )}
                        </PDFDownloadLink>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
