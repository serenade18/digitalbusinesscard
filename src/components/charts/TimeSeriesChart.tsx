import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { chartAxisColor, chartGridColor, chartSeriesColors } from '@/lib/chart-colors'
import { formatDate } from '@/lib/format'
import type { AnalyticsTimeSeriesPoint } from '@/types/analytics'

export function TimeSeriesChart({ data }: { data: AnalyticsTimeSeriesPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={chartGridColor} vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(value: string) => formatDate(value, { month: 'short', day: 'numeric' })}
          stroke={chartAxisColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} width={32} />
        <Tooltip
          labelFormatter={(value) => formatDate(String(value))}
          contentStyle={{
            backgroundColor: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="views"
          name="Views"
          stroke={chartSeriesColors[0]}
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="link_clicks"
          name="Link clicks"
          stroke={chartSeriesColors[1]}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
