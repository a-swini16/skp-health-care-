import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CreditCard, Users, FileText } from "lucide-react"
import { getDashboardStatsAction, getRevenueChartDataAction, getRecentActivityAction } from "@/app/actions/dashboard.actions"
import { RevenueChart } from "./components/revenue-chart"

import { VisitsChart } from "./components/visits-chart"

export default async function DashboardPage() {
  const stats = await getDashboardStatsAction()
  const chartData = await getRevenueChartDataAction()
  const recentActivity = await getRecentActivityAction()

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (This Month)</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.totalRevenue.toFixed(2) || "0.00"}</div>
            <p className="text-xs text-muted-foreground">
              {stats && stats.revenueGrowth >= 0 ? "+" : ""}{stats?.revenueGrowth.toFixed(1) || "0"}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.patientsToday || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats && stats.patientGrowth >= 0 ? "+" : ""}{stats?.patientGrowth.toFixed(1) || "0"}% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingReports || 0}</div>
            <p className="text-xs text-muted-foreground text-amber-500">
              Needs attention
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Samples</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeSamples || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently processing
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm border-muted">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Daily revenue for the past 7 days
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart data={chartData || []} />
          </CardContent>
        </Card>
        <Card className="shadow-sm border-muted">
          <CardHeader>
            <CardTitle>Patient Visits</CardTitle>
            <CardDescription>
              New vs Returning patients by month
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <VisitsChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-muted">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest samples collected.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {(!recentActivity || recentActivity.length === 0) ? (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No recent activity found.
                </div>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {activity.patientName.charAt(0)}
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.testName}
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-xs text-muted-foreground">
                      {activity.timeAgo}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-sm border-muted">
          <CardHeader>
            <CardTitle>Top Tests</CardTitle>
            <CardDescription>Most frequently ordered tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(!stats || !stats.topTests || stats.topTests.length === 0) ? (
                <div className="text-sm text-muted-foreground">No test data available.</div>
              ) : (
                stats.topTests.map((test, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="font-medium">{test.name}</span>
                    <span className="text-muted-foreground">{test.count} orders</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-muted">
          <CardHeader>
            <CardTitle>Top Referring Doctors</CardTitle>
            <CardDescription>Doctors with the most referrals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(!stats || !stats.topDoctors || stats.topDoctors.length === 0) ? (
                <div className="text-sm text-muted-foreground">No doctor data available.</div>
              ) : (
                stats.topDoctors.map((doc, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="font-medium">{doc.name}</span>
                    <span className="text-muted-foreground">{doc.referrals} referrals</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
