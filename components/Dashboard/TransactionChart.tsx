"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function TransactionChart({ data, theme }: { data: any[]; theme?: string }) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme === "dark" ? "#374151" : "#e5e7eb"} />
          <XAxis dataKey="month" stroke={theme === "dark" ? "#9ca3af" : "#6b7280"} />
          <YAxis stroke={theme === "dark" ? "#9ca3af" : "#6b7280"} />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
              borderColor: theme === "dark" ? "#374151" : "#e5e7eb",
              borderRadius: "0.5rem",
            }}
          />
          <Legend />
          <Bar dataKey="crypto" fill="#3b82f6" name="Crypto" />
          <Bar dataKey="fiat" fill="#10b981" name="Fiat" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
