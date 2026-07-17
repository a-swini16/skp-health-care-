import { supabase } from "@/lib/supabase/client"
import { Department, LabTest, TestParameter, CreateLabTestDTO } from "@/types/test"

export interface ITestRepository {
  createDepartment(data: import('@/types/test').CreateDepartmentDTO): Promise<Department>
  deleteDepartment(id: string): Promise<boolean>
  getDepartments(): Promise<Department[]>
  getTests(): Promise<LabTest[]>
  createTest(data: CreateLabTestDTO): Promise<LabTest>
  updateTest(id: string, data: Partial<CreateLabTestDTO>): Promise<LabTest>
  deleteTest(id: string): Promise<boolean>
  getTestParameters(testId: string): Promise<TestParameter[]>
  createTestParameter(data: import('@/types/test').CreateTestParameterDTO): Promise<TestParameter>
  deleteTestParameter(id: string): Promise<boolean>
}

export class SupabaseTestRepository implements ITestRepository {
  async getDepartments(): Promise<Department[]> {
    const { data, error } = await supabase.from("departments").select("*").order("name")
    if (error) throw new Error(error.message)
    
    // Map camelCase
    return data.map(d => ({
      id: d.id,
      name: d.name,
      description: d.description,
      createdAt: d.created_at
    }))
  }

  async createDepartment(data: import('@/types/test').CreateDepartmentDTO): Promise<Department> {
    const { data: result, error } = await supabase
      .from("departments")
      .insert({ name: data.name, description: data.description })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return { id: result.id, name: result.name, description: result.description, createdAt: result.created_at }
  }

  async deleteDepartment(id: string): Promise<boolean> {
    const { error } = await supabase.from("departments").delete().eq("id", id)
    if (error) throw new Error(error.message)
    return true
  }

  async getTests(): Promise<LabTest[]> {
    const { data, error } = await supabase
      .from("tests")
      .select(`
        *,
        department:departments(*)
      `)
      .order("name")
    
    if (error) throw new Error(error.message)
    
    return data.map(t => ({
      id: t.id,
      departmentId: t.department_id,
      code: t.code,
      name: t.name,
      method: t.method,
      sampleType: t.sample_type,
      price: Number(t.price),
      turnAroundTimeHours: t.turn_around_time_hours,
      isActive: t.is_active,
      department: t.department ? {
        id: t.department.id,
        name: t.department.name
      } : undefined
    }))
  }

  async createTest(data: CreateLabTestDTO): Promise<LabTest> {
    const { data: result, error } = await supabase
      .from("tests")
      .insert({
        department_id: data.departmentId,
        code: data.code,
        name: data.name,
        method: data.method,
        sample_type: data.sampleType,
        price: data.price,
        turn_around_time_hours: data.turnAroundTimeHours
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    
    return {
      id: result.id,
      departmentId: result.department_id,
      code: result.code,
      name: result.name,
      sampleType: result.sample_type,
      price: Number(result.price),
      turnAroundTimeHours: result.turn_around_time_hours,
      isActive: result.is_active
    }
  }

  async updateTest(id: string, data: Partial<CreateLabTestDTO>): Promise<LabTest> {
    const updateData: any = {}
    if (data.departmentId) updateData.department_id = data.departmentId
    if (data.code) updateData.code = data.code
    if (data.name) updateData.name = data.name
    if (data.method !== undefined) updateData.method = data.method
    if (data.sampleType) updateData.sample_type = data.sampleType
    if (data.price !== undefined) updateData.price = data.price
    if (data.turnAroundTimeHours !== undefined) updateData.turn_around_time_hours = data.turnAroundTimeHours

    const { data: result, error } = await supabase
      .from("tests")
      .update(updateData)
      .eq("id", id)
      .select(`*, department:departments(*)`)
      .single()

    if (error) throw new Error(error.message)
    return {
      id: result.id, departmentId: result.department_id, code: result.code, name: result.name,
      sampleType: result.sample_type, price: Number(result.price), turnAroundTimeHours: result.turn_around_time_hours,
      isActive: result.is_active
    }
  }

  async deleteTest(id: string): Promise<boolean> {
    const { error } = await supabase.from("tests").delete().eq("id", id)
    if (error) throw new Error(error.message)
    return true
  }

  async getTestParameters(testId: string): Promise<TestParameter[]> {
    const { data, error } = await supabase
      .from("test_parameters")
      .select("*")
      .eq("test_id", testId)
      .order("display_order")

    if (error) throw new Error(error.message)

    return data.map(p => ({
      id: p.id,
      testId: p.test_id,
      name: p.name,
      unit: p.unit,
      referenceRangeMale: p.reference_range_male,
      referenceRangeFemale: p.reference_range_female,
      minCriticalValue: p.min_critical_value,
      maxCriticalValue: p.max_critical_value,
      displayOrder: p.display_order,
      isNumeric: p.is_numeric
    }))
  }

  async createTestParameter(data: import('@/types/test').CreateTestParameterDTO): Promise<TestParameter> {
    const { data: result, error } = await supabase
      .from("test_parameters")
      .insert({
        test_id: data.testId,
        name: data.name,
        unit: data.unit,
        reference_range_male: data.referenceRangeMale,
        reference_range_female: data.referenceRangeFemale,
        min_critical_value: data.minCriticalValue,
        max_critical_value: data.maxCriticalValue,
        display_order: data.displayOrder,
        is_numeric: data.isNumeric
      })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return {
      id: result.id, testId: result.test_id, name: result.name, unit: result.unit,
      referenceRangeMale: result.reference_range_male, referenceRangeFemale: result.reference_range_female,
      minCriticalValue: result.min_critical_value, maxCriticalValue: result.max_critical_value,
      displayOrder: result.display_order, isNumeric: result.is_numeric
    }
  }

  async deleteTestParameter(id: string): Promise<boolean> {
    const { error } = await supabase.from("test_parameters").delete().eq("id", id)
    if (error) throw new Error(error.message)
    return true
  }
}
