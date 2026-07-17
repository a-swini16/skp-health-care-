import { ITestRepository, SupabaseTestRepository } from "@/repositories/test.repository"
import { Department, LabTest, TestParameter, CreateLabTestDTO } from "@/types/test"

export class TestService {
  constructor(private readonly repository: ITestRepository) {}

  async getDepartments(): Promise<Department[]> {
    return this.repository.getDepartments()
  }

  async createDepartment(data: import('@/types/test').CreateDepartmentDTO): Promise<Department> {
    return this.repository.createDepartment(data)
  }

  async deleteDepartment(id: string): Promise<boolean> {
    return this.repository.deleteDepartment(id)
  }

  async getAllTests(): Promise<LabTest[]> {
    return this.repository.getTests()
  }

  async createTest(data: CreateLabTestDTO): Promise<LabTest> {
    // Business logic: check code format etc.
    return this.repository.createTest(data)
  }

  async updateTest(id: string, data: Partial<CreateLabTestDTO>): Promise<LabTest> {
    return this.repository.updateTest(id, data)
  }

  async deleteTest(id: string): Promise<boolean> {
    return this.repository.deleteTest(id)
  }

  async getTestParameters(testId: string): Promise<TestParameter[]> {
    return this.repository.getTestParameters(testId)
  }

  async createTestParameter(data: import('@/types/test').CreateTestParameterDTO): Promise<TestParameter> {
    return this.repository.createTestParameter(data)
  }

  async deleteTestParameter(id: string): Promise<boolean> {
    return this.repository.deleteTestParameter(id)
  }
}

// Dependency Injection instance
const testRepository = new SupabaseTestRepository()
export const testService = new TestService(testRepository)
