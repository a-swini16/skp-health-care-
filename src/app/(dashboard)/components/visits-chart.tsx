"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export function VisitsChart() {
  const data = [
    { month: "Jan", new: 400, returning: 240 },
    { month: "Feb", new: 300, returning: 139 },
    { month: "Mar", new: 200, returning: 980 },
    { month: "Apr", new: 278, returning: 390 },
    { month: "May", new: 189, returning: 480 },
    { month: "Jun", new: 239, returning: 380 },
  ]

  return (
    <div className="h-[300px] mx-4 mb-4 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} barGap={0}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
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
            dx={-10}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar
            dataKey="new"
            fill="#0891b2"
            radius={[4, 4, 0, 0]}
            barSize={20}
            name="New Patients"
          />
          <Bar
            dataKey="returning"
            fill="#bae6fd"
            radius={[4, 4, 0, 0]}
            barSize={20}
            name="Returning"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
