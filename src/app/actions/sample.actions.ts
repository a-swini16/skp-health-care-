"use server"

import { Sample, SampleStatus } from "@/types/sample"
import { sampleService } from "@/services/sample.service"
import { revalidatePath } from "next/cache"

export async function getSamplesAction(): Promise<Sample[]> {
  try {
    return await sampleService.getAllSamples()
  } catch (error) {
    console.error("Failed to fetch samples:", error)
    return []
  }
}

export async function updateSampleStatusAction(id: string, status: SampleStatus): Promise<{ success: boolean; data?: Sample; error?: string }> {
  try {
    const sample = await sampleService.updateStatus(id, status)
    revalidatePath("/sample-tracking")
    return { success: true, data: sample }
  } catch (error: any) {
    console.error("Failed to update sample status:", error)
    return { success: false, error: error.message || "Failed to update sample" }
  }
}
