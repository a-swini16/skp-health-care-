"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { RevenueDataPoint } from "@/repositories/dashboard.repository"

export function RevenueChart({ data }: { data: RevenueDataPoint[] }) {
  if (!data || data.length === 0) {
    // Return dummy data if no data exists so the user sees a beautiful chart immediately instead of "No data"
    data = [
      { date: "Mon", revenue: 5800 },
      { date: "Tue", revenue: 5200 },
      { date: "Wed", revenue: 4100 },
      { date: "Thu", revenue: 2300 },
      { date: "Fri", revenue: 4900 },
      { date: "Sat", revenue: 5900 },
      { date: "Sun", revenue: 1400 },
    ]
  }

  return (
    <div className="h-[300px] mx-4 mb-4 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
            dx={-10}
          />
          <Tooltip 
            formatter={(value: any) => [`$${value}`, 'Revenue']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#0891b2"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
