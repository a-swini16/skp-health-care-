import { IDashboardRepository, SupabaseDashboardRepository, DashboardStats, RevenueDataPoint, RecentActivity } from "@/repositories/dashboard.repository"

export class DashboardService {
  constructor(private readonly repository: IDashboardRepository) {}

  async getDashboardStats(): Promise<DashboardStats> {
    return this.repository.getStats()
  }

  async getRevenueChartData(): Promise<RevenueDataPoint[]> {
    return this.repository.getRevenueChartData()
  }

  async getRecentActivity(): Promise<RecentActivity[]> {
    return this.repository.getRecentActivity()
  }
}

const dashboardRepository = new SupabaseDashboardRepository()
export const dashboardService = new DashboardService(dashboardRepository)
