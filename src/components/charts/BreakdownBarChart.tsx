import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { chartAxisColor, chartGridColor, chartSeriesColors } from '@/lib/chart-colors'
import { EmptyState } from '@/components/common/EmptyState'

export function BreakdownBarChart<T extends object>({
  data,
  labelKey,
  valueKey = 'count' as keyof T,
}: {
  data: T[]
  labelKey: keyof T
  valueKey?: keyof T
}) {
  if (data.length === 0) {
    return <EmptyState title="No data for this period" />
  }

  return (
    <ResponsiveContainer width="100%" height={Math.max(120, data.length * 36)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid stroke={chartGridColor} horizontal={false} />
        <XAxis type="number" stroke={chartAxisColor} fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey={labelKey as string}
          stroke={chartAxisColor}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={110}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 12,
          }}
        />
        <Bar dataKey={valueKey as string} fill={chartSeriesColors[0]} radius={[0, 4, 4, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  )
}
