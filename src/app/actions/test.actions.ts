"use server"

import { CreateLabTestDTO, LabTest, Department } from "@/types/test"
import { testService } from "@/services/test.service"
import { revalidatePath } from "next/cache"

export async function getDepartmentsAction(): Promise<Department[]> {
  try {
    return await testService.getDepartments()
  } catch (error) {
    console.error("Failed to fetch departments:", error)
    return []
  }
}

export async function getTestsAction(): Promise<LabTest[]> {
  try {
    return await testService.getAllTests()
  } catch (error) {
    console.error("Failed to fetch tests:", error)
    return []
  }
}

export async function createDepartmentAction(data: import('@/types/test').CreateDepartmentDTO) {
  try {
    const dept = await testService.createDepartment(data)
    revalidatePath("/tests")
    return { success: true, data: dept }
  } catch (error: any) {
    console.error("Failed to create department:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteDepartmentAction(id: string) {
  try {
    await testService.deleteDepartment(id)
    revalidatePath("/tests")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete department:", error)
    return { success: false, error: error.message }
  }
}

export async function createTestAction(data: CreateLabTestDTO): Promise<{ success: boolean; data?: LabTest; error?: string }> {
  try {
    const test = await testService.createTest(data)
    revalidatePath("/tests")
    return { success: true, data: test }
  } catch (error: any) {
    console.error("Failed to create test:", error)
    return { success: false, error: error.message || "Failed to create test" }
  }
}

export async function updateTestAction(id: string, data: Partial<CreateLabTestDTO>) {
  try {
    const test = await testService.updateTest(id, data)
    revalidatePath("/tests")
    return { success: true, data: test }
  } catch (error: any) {
    console.error("Failed to update test:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteTestAction(id: string) {
  try {
    await testService.deleteTest(id)
    revalidatePath("/tests")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete test:", error)
    return { success: false, error: error.message }
  }
}

export async function getTestParametersAction(testId: string) {
  try {
    return await testService.getTestParameters(testId)
  } catch (error: any) {
    console.error("Failed to get parameters:", error)
    return []
  }
}

export async function createTestParameterAction(data: import('@/types/test').CreateTestParameterDTO) {
  try {
    const param = await testService.createTestParameter(data)
    revalidatePath("/tests")
    return { success: true, data: param }
  } catch (error: any) {
    console.error("Failed to create parameter:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteTestParameterAction(id: string) {
  try {
    await testService.deleteTestParameter(id)
    revalidatePath("/tests")
    return { success: true }
  } catch (error: any) {
    console.error("Failed to delete parameter:", error)
    return { success: false, error: error.message }
  }
}
