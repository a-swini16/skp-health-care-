import { IReportRepository, SupabaseReportRepository } from "@/repositories/report.repository"
import { ISampleRepository, SupabaseSampleRepository } from "@/repositories/sample.repository"
import { SaveResultDTO } from "@/types/report"

export class ReportService {
  constructor(
    private readonly repository: IReportRepository,
    private readonly sampleRepository: ISampleRepository
  ) {}

  async getPendingWorklist(): Promise<any[]> {
    return this.repository.getPendingReports()
  }

  async getReportDetails(orderId: string): Promise<any[]> {
    return this.repository.getOrderItemsForReport(orderId)
  }

  async saveTestResult(data: SaveResultDTO): Promise<void> {
    await this.repository.saveResult(data)
  }

  async completeReport(sampleId: string): Promise<void> {
    await this.sampleRepository.updateSampleStatus(sampleId, 'completed')
  }
}

export const reportService = new ReportService(
  new SupabaseReportRepository(),
  new SupabaseSampleRepository()
)
