"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FlaskConical, CheckCircle2, Clock, PlayCircle } from "lucide-react"
import { toast } from "sonner"
import { getSamplesAction, updateSampleStatusAction } from "@/app/actions/sample.actions"
import { Sample, SampleStatus } from "@/types/sample"
import { supabase } from "@/lib/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function SampleTrackingPage() {
  const [samples, setSamples] = React.useState<Sample[]>([])
  const [search, setSearch] = React.useState("")
  const [isUpdating, setIsUpdating] = React.useState<string | null>(null)
  const [timelineSample, setTimelineSample] = React.useState<Sample | null>(null)

  React.useEffect(() => {
    loadSamples()

    // Realtime subscription
    const channel = supabase
      .channel('samples-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'samples' },
        (payload) => {
          console.log("Sample realtime update:", payload)
          // Simple approach: reload all to fetch relations. 
          // For a production app, we might just update the specific row in state.
          loadSamples()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function loadSamples() {
    const data = await getSamplesAction()
    setSamples(data)
  }

  const handleUpdateStatus = async (id: string, newStatus: SampleStatus) => {
    setIsUpdating(id)
    const res = await updateSampleStatusAction(id, newStatus)
    if (res.success) {
      toast.success("Sample status updated!")
      await loadSamples()
    } else {
      toast.error(res.error)
    }
    setIsUpdating(null)
  }

  const filteredSamples = samples.filter(s => 
    s.barcode.toLowerCase().includes(search.toLowerCase()) ||
    (s.order?.patient?.firstName || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.order?.patient?.lastName || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.order?.patient?.uhid || "").toLowerCase().includes(search.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending_collection': return <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-50"><Clock className="w-3 h-3 mr-1"/> Pending Collection</Badge>
      case 'collected': return <Badge variant="outline" className="text-blue-500 border-blue-200 bg-blue-50"><FlaskConical className="w-3 h-3 mr-1"/> Collected</Badge>
      case 'received': return <Badge variant="outline" className="text-purple-500 border-purple-200 bg-purple-50"><CheckCircle2 className="w-3 h-3 mr-1"/> Received in Lab</Badge>
      case 'processing': return <Badge variant="outline" className="text-indigo-500 border-indigo-200 bg-indigo-50"><PlayCircle className="w-3 h-3 mr-1"/> Processing</Badge>
      case 'completed': return <Badge variant="outline" className="text-green-500 border-green-200 bg-green-50"><CheckCircle2 className="w-3 h-3 mr-1"/> Completed</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sample Tracking</h2>
          <p className="text-muted-foreground">Scan barcodes and track sample lifecycle.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Scan Barcode or Search Patient/UHID..."
                className="pl-8"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button>Scan Barcode</Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6 p-0">
          <div className="border rounded-lg overflow-hidden m-6">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="text-left font-medium p-3 text-muted-foreground">Barcode</th>
                  <th className="text-left font-medium p-3 text-muted-foreground">Patient Info</th>
                  <th className="text-left font-medium p-3 text-muted-foreground">Sample Type</th>
                  <th className="text-left font-medium p-3 text-muted-foreground">Status</th>
                  <th className="text-right font-medium p-3 text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredSamples.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                      No samples found. Create a bill first to generate samples.
                    </td>
                  </tr>
                ) : (
                  filteredSamples.map(sample => (
                    <tr key={sample.id}>
                      <td className="p-3">
                        <div className="font-mono font-bold text-primary">{sample.barcode}</div>
                        <div className="text-xs text-muted-foreground mt-1">{new Date(sample.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{sample.order?.patient?.firstName} {sample.order?.patient?.lastName}</div>
                        <div className="text-xs text-muted-foreground">UHID: {sample.order?.patient?.uhid}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{sample.sampleType}</div>
                      </td>
                      <td className="p-3">
                        {getStatusBadge(sample.status)}
                      </td>
                      <td className="p-3 text-right">
                        {sample.status === 'pending_collection' && (
                          <Button size="sm" onClick={() => handleUpdateStatus(sample.id, 'collected')} disabled={isUpdating === sample.id}>
                            Mark Collected
                          </Button>
                        )}
                        {sample.status === 'collected' && (
                          <Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(sample.id, 'received')} disabled={isUpdating === sample.id}>
                            Receive in Lab
                          </Button>
                        )}
                        {sample.status === 'received' && (
                          <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(sample.id, 'processing')} disabled={isUpdating === sample.id}>
                            Start Processing
                          </Button>
                        )}
                        {(sample.status === 'processing' || sample.status === 'completed') && (
                          <span className="text-xs text-muted-foreground mr-2">No action</span>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => setTimelineSample(sample)}>
                          Timeline
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!timelineSample} onOpenChange={(o) => !o && setTimelineSample(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sample Timeline - {timelineSample?.barcode}</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                <div className="w-1 h-full bg-border"></div>
              </div>
              <div className="pb-6">
                <h4 className="font-semibold">Order Created</h4>
                <p className="text-sm text-muted-foreground">The order was placed and sample barcode generated.</p>
                <p className="text-xs text-muted-foreground mt-1">{timelineSample?.createdAt ? new Date(timelineSample.createdAt).toLocaleString() : ''}</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${['collected', 'received', 'processing', 'completed'].includes(timelineSample?.status || '') ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>2</div>
                <div className="w-1 h-full bg-border"></div>
              </div>
              <div className="pb-6">
                <h4 className="font-semibold">Sample Collected</h4>
                <p className="text-sm text-muted-foreground">Sample collected from patient.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${['received', 'processing', 'completed'].includes(timelineSample?.status || '') ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>3</div>
                <div className="w-1 h-full bg-border"></div>
              </div>
              <div className="pb-6">
                <h4 className="font-semibold">Received in Lab</h4>
                <p className="text-sm text-muted-foreground">Sample arrived at the processing facility.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${['processing', 'completed'].includes(timelineSample?.status || '') ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>4</div>
                <div className="w-1 h-full bg-border"></div>
              </div>
              <div className="pb-6">
                <h4 className="font-semibold">Processing</h4>
                <p className="text-sm text-muted-foreground">Sample is being tested.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${timelineSample?.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>5</div>
              </div>
              <div>
                <h4 className="font-semibold">Completed</h4>
                <p className="text-sm text-muted-foreground">Results are ready for verification.</p>
                {timelineSample?.status === 'completed' && timelineSample.updatedAt && (
                  <p className="text-xs text-muted-foreground mt-1">{new Date(timelineSample.updatedAt).toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
