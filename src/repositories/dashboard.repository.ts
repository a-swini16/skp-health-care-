import { supabase } from "@/lib/supabase/client"
import { startOfMonth, startOfDay, subMonths, format } from "date-fns"

export interface TopTest {
  name: string
  count: number
}

export interface TopDoctor {
  name: string
  referrals: number
}

export interface DashboardStats {
  totalRevenue: number
  revenueGrowth: number // percentage
  patientsToday: number
  patientGrowth: number // percentage
  pendingReports: number
  activeSamples: number
  topTests: TopTest[]
  topDoctors: TopDoctor[]
}

export interface RevenueDataPoint {
  date: string
  revenue: number
}

export interface RecentActivity {
  id: string
  patientName: string
  testName: string
  timeAgo: string
}

export interface IDashboardRepository {
  getStats(): Promise<DashboardStats>
  getRevenueChartData(): Promise<RevenueDataPoint[]>
  getRecentActivity(): Promise<RecentActivity[]>
}

export class SupabaseDashboardRepository implements IDashboardRepository {
  async getStats(): Promise<DashboardStats> {
    const today = startOfDay(new Date()).toISOString()
    const thisMonth = startOfMonth(new Date()).toISOString()
    const lastMonth = startOfMonth(subMonths(new Date(), 1)).toISOString()

    // Revenue
    const { data: thisMonthOrders } = await supabase
      .from("orders")
      .select("paid_amount")
      .gte("created_at", thisMonth)

    const { data: lastMonthOrders } = await supabase
      .from("orders")
      .select("paid_amount")
      .gte("created_at", lastMonth)
      .lt("created_at", thisMonth)

    const currentRevenue = thisMonthOrders?.reduce((acc, o) => acc + Number(o.paid_amount), 0) || 0
    const prevRevenue = lastMonthOrders?.reduce((acc, o) => acc + Number(o.paid_amount), 0) || 0
    const revenueGrowth = prevRevenue === 0 ? 100 : ((currentRevenue - prevRevenue) / prevRevenue) * 100

    // Patients
    const { count: patientsTodayCount } = await supabase
      .from("patients")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today)

    const { count: patientsThisMonthCount } = await supabase
      .from("patients")
      .select("*", { count: "exact", head: true })
      .gte("created_at", thisMonth)

    const { count: patientsLastMonthCount } = await supabase
      .from("patients")
      .select("*", { count: "exact", head: true })
      .gte("created_at", lastMonth)
      .lt("created_at", thisMonth)

    const ptThisMonth = patientsThisMonthCount || 0
    const ptLastMonth = patientsLastMonthCount || 0
    const patientGrowth = ptLastMonth === 0 ? 100 : ((ptThisMonth - ptLastMonth) / ptLastMonth) * 100

    // Pending Reports
    const { count: pendingReportsCount } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "draft", "ready_for_approval"])

    // Active Samples
    const { count: activeSamplesCount } = await supabase
      .from("samples")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending_collection", "collected", "received", "processing"])

    // Top Tests (Grouping in JS)
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("test_id, tests(name)")
    
    const testCounts: Record<string, number> = {}
    orderItems?.forEach((item: any) => {
      const name = item.tests?.name || 'Unknown'
      testCounts[name] = (testCounts[name] || 0) + 1
    })
    const topTests = Object.entries(testCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Top Doctors (Grouping in JS)
    const { data: ordersWithDoctors } = await supabase
      .from("orders")
      .select("doctor_id, doctors(name)")
      .not("doctor_id", "is", null)

    const docCounts: Record<string, number> = {}
    ordersWithDoctors?.forEach((order: any) => {
      const name = order.doctors?.name || 'Unknown'
      docCounts[name] = (docCounts[name] || 0) + 1
    })
    const topDoctors = Object.entries(docCounts)
      .map(([name, referrals]) => ({ name, referrals }))
      .sort((a, b) => b.referrals - a.referrals)
      .slice(0, 5)

    return {
      totalRevenue: currentRevenue,
      revenueGrowth,
      patientsToday: patientsTodayCount || 0,
      patientGrowth,
      pendingReports: pendingReportsCount || 0,
      activeSamples: activeSamplesCount || 0,
      topTests,
      topDoctors
    }
  }

  async getRevenueChartData(): Promise<RevenueDataPoint[]> {
    const thisMonth = startOfMonth(new Date()).toISOString()
    const { data } = await supabase
      .from("orders")
      .select("paid_amount, created_at")
      .gte("created_at", thisMonth)
      .order("created_at", { ascending: true })

    if (!data) return []

    // Group by day
    const grouped: Record<string, number> = {}
    data.forEach(order => {
      const day = format(new Date(order.created_at), "MMM dd")
      grouped[day] = (grouped[day] || 0) + Number(order.paid_amount)
    })

    return Object.entries(grouped).map(([date, revenue]) => ({ date, revenue }))
  }

  async getRecentActivity(): Promise<RecentActivity[]> {
    const { data } = await supabase
      .from("samples")
      .select(`
        id,
        created_at,
        sample_type,
        order:orders(
          patient:patients(first_name, last_name)
        )
      `)
      .order("created_at", { ascending: false })
      .limit(5)

    if (!data) return []

    return data.map((sample: any) => {
      const p = sample.order?.patient
      const patientName = p ? `${p.first_name} ${p.last_name}` : "Unknown Patient"
      
      // Calculate time ago
      const diff = new Date().getTime() - new Date(sample.created_at).getTime()
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const timeAgo = hours === 0 ? "Just now" : `${hours}h ago`

      return {
        id: sample.id,
        patientName,
        testName: `Sample for ${sample.sample_type}`,
        timeAgo
      }
    })
  }
}
