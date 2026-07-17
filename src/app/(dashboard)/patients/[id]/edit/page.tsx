import { getPatientByIdAction } from "@/app/actions/patient.actions"
import { PatientForm } from "../../components/patient-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { notFound } from "next/navigation"

export default async function EditPatientPage({ params }: { params: { id: string } }) {
  const patient = await getPatientByIdAction(params.id)

  if (!patient) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Patient</h2>
        <p className="text-muted-foreground">Update details for {patient.firstName} {patient.lastName} ({patient.uhid})</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientForm patient={patient} />
        </CardContent>
      </Card>
    </div>
  )
}
