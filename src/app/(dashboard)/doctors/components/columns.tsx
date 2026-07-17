"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Doctor } from "@/types/doctor"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2, Edit } from "lucide-react"
import { deleteDoctorAction } from "@/app/actions/doctor.actions"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface ColumnsProps {
  onEdit: (doctor: Doctor) => void;
}

export const getColumns = ({ onEdit }: ColumnsProps): ColumnDef<Doctor>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium text-primary">Dr. {row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "specialization",
    header: "Specialization",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("specialization") || "-"}</div>
    ),
  },
  {
    accessorKey: "clinicName",
    header: "Clinic / Hospital",
    cell: ({ row }) => (
      <div>{row.getValue("clinicName") || "-"}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Contact",
    cell: ({ row }) => (
      <div className="flex flex-col text-sm">
        <span>{row.getValue("phone") || "-"}</span>
        <span className="text-muted-foreground text-xs">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: "commissionPercentage",
    header: "Commission",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("commissionPercentage")}%</Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const doctor = row.original

      const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this doctor?")) {
          const res = await deleteDoctorAction(doctor.id)
          if (res.success) {
            toast.success("Doctor deleted successfully")
            window.location.reload()
          } else {
            toast.error(res.error || "Failed to delete doctor")
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
            <DropdownMenuItem onClick={() => onEdit(doctor)}>
              <Edit className="mr-2 h-4 w-4" /> Edit Doctor
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
