import { ISampleRepository, SupabaseSampleRepository } from "@/repositories/sample.repository"
import { Sample, SampleStatus } from "@/types/sample"

export class SampleService {
  constructor(private readonly repository: ISampleRepository) {}

  async getAllSamples(): Promise<Sample[]> {
    return this.repository.getSamples()
  }

  async updateStatus(id: string, status: SampleStatus): Promise<Sample> {
    return this.repository.updateSampleStatus(id, status)
  }
}

export const sampleService = new SampleService(new SupabaseSampleRepository())
