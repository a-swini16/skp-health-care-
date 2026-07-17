"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Patient } from "@/types/patient"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2, Edit, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { deletePatientAction } from "@/app/actions/patient.actions"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "uhid",
    header: "UHID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("uhid")}</div>,
  },
  {
    accessorKey: "firstName",
    header: "Name",
    cell: ({ row }) => {
      const patient = row.original
      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="font-medium text-primary">
              {patient.firstName} {patient.lastName}
            </span>
            <span className="text-xs text-muted-foreground">{patient.gender}, {new Date().getFullYear() - new Date(patient.dob).getFullYear()} Yrs</span>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "bloodGroup",
    header: "Blood Group",
    cell: ({ row }) => {
      const bg = row.getValue("bloodGroup") as string
      if (!bg) return <span className="text-muted-foreground">-</span>
      return <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">{bg}</Badge>
    }
  },
  {
    accessorKey: "createdAt",
    header: "Registered",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string
      if (!date) return null
      return <div className="text-sm text-muted-foreground">{new Date(date).toLocaleDateString()}</div>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const patient = row.original
      const router = useRouter()

      const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this patient? This action cannot be undone.")) {
          const res = await deletePatientAction(patient.id)
          if (res.success) {
            toast.success("Patient deleted successfully")
            window.location.reload()
          } else {
            toast.error(res.error || "Failed to delete patient")
          }
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(patient.uhid)}>
              Copy UHID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/patients/${patient.id}`)}>
              <Eye className="mr-2 h-4 w-4" /> View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/patients/${patient.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" /> Edit Patient
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
