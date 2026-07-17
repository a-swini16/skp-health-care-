"use server"

import { dashboardService } from "@/services/dashboard.service"

export async function getDashboardStatsAction() {
  try {
    return await dashboardService.getDashboardStats()
  } catch (error) {
    console.error("Failed to fetch dashboard stats", error)
    return null
  }
}

export async function getRevenueChartDataAction() {
  try {
    return await dashboardService.getRevenueChartData()
  } catch (error) {
    console.error("Failed to fetch revenue chart data", error)
    return []
  }
}

export async function getRecentActivityAction() {
  try {
    return await dashboardService.getRecentActivity()
  } catch (error) {
    console.error("Failed to fetch recent activity", error)
    return []
  }
}
