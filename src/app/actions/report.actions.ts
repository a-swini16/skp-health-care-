"use server"

import { reportService } from "@/services/report.service"
import { SaveResultDTO } from "@/types/report"
import { revalidatePath } from "next/cache"

export async function getPendingWorklistAction() {
  try {
    return await reportService.getPendingWorklist()
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getReportDetailsAction(orderId: string) {
  try {
    return await reportService.getReportDetails(orderId)
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function saveTestResultAction(data: SaveResultDTO) {
  try {
    await reportService.saveTestResult(data)
    revalidatePath("/reports")
    return { success: true }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: error.message }
  }
}

export async function completeReportAction(sampleId: string) {
  try {
    await reportService.completeReport(sampleId)
    revalidatePath("/reports")
    revalidatePath("/sample-tracking")
    return { success: true }
  } catch (error: any) {
    console.error(error)
    return { success: false, error: error.message }
  }
}
