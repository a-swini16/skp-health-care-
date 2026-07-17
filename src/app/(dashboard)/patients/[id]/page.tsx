import { getPatientByIdAction } from "@/app/actions/patient.actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, FileText, Activity } from "lucide-react"
import Link from "next/link"

export default async function PatientDetailsPage({ params }: { params: { id: string } }) {
  const patient = await getPatientByIdAction(params.id)

  if (!patient) {
    notFound()
  }

  const age = new Date().getFullYear() - new Date(patient.dob).getFullYear()

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{patient.firstName} {patient.lastName}</h2>
          <p className="text-muted-foreground">Patient Profile • UHID: {patient.uhid}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/patients/${patient.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </Link>
          <Button>
            <Activity className="mr-2 h-4 w-4" /> New Order
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 shadow-sm border-muted">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gender & Age</p>
              <p className="capitalize">{patient.gender}, {age} Years</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Contact</p>
              <p>{patient.phone}</p>
              <p className="text-sm">{patient.email || "No email"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Blood Group</p>
              {patient.bloodGroup ? (
                <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50 mt-1">
                  {patient.bloodGroup}
                </Badge>
              ) : (
                <p>-</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p>{patient.address || "Not provided"}</p>
              <p>{patient.city}</p>
            </div>
          </CardContent>
        </Card>

        <div className="col-span-2 space-y-6">
          <Card className="shadow-sm border-muted">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground text-sm">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                No orders found for this patient yet.
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-muted">
            <CardHeader>
              <CardTitle>Documents & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground text-sm">
                No documents uploaded.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
