import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { VCardSelect } from '@/components/cards/VCardSelect'
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart'
import { BreakdownBarChart } from '@/components/charts/BreakdownBarChart'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/common/EmptyState'
import { useSelectedVCard } from '@/features/cards/useSelectedVCard'
import { useGetAnalyticsQuery } from '@/features/analytics/analyticsApi'
import type { AnalyticsPeriod } from '@/types/analytics'

const periods: { value: AnalyticsPeriod; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: '12m', label: '12 months' },
  { value: 'custom', label: 'Custom' },
]

export function AnalyticsPage() {
  const { vcardId, setVCardId, cards, isLoading: isLoadingCards } = useSelectedVCard()
  const [period, setPeriod] = useState<AnalyticsPeriod>('7d')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const { data, isLoading, isFetching } = useGetAnalyticsQuery(
    vcardId
      ? {
          vcard: vcardId,
          period,
          start: period === 'custom' ? customStart : undefined,
          end: period === 'custom' ? customEnd : undefined,
        }
      : { vcard: '' },
    { skip: !vcardId || (period === 'custom' && (!customStart || !customEnd)) },
  )

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Views, clicks, and engagement for your cards."
        actions={!isLoadingCards && <VCardSelect cards={cards} value={vcardId} onChange={setVCardId} />}
      />

      {!isLoadingCards && cards.length === 0 && (
        <EmptyState title="No cards yet" description="Create a card to start seeing analytics." />
      )}

      {cards.length > 0 && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <Tabs value={period} onValueChange={(v) => setPeriod(v as AnalyticsPeriod)}>
              <TabsList>
                {periods.map((p) => (
                  <TabsTrigger key={p.value} value={p.value}>
                    {p.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            {period === 'custom' && (
              <div className="flex items-center gap-2">
                <Input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="w-40" />
                <span className="text-sm text-muted-foreground">to</span>
                <Input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="w-40" />
              </div>
            )}
          </div>

          {(isLoading || isFetching) && (
            <div className="flex justify-center py-16">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {data && !isFetching && (
            <>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <StatCard label="Views" value={data.summary.total_views} />
                <StatCard label="Unique visitors" value={data.summary.unique_visitors} />
                <StatCard label="Link clicks" value={data.summary.link_clicks} />
                <StatCard label="Contact downloads" value={data.summary.contact_downloads} />
                <StatCard label="Enquiries" value={data.summary.enquiries} />
                <StatCard label="Appointments" value={data.summary.appointments} />
              </div>

              <div className="rounded-2xl border border-border bg-background p-5">
                <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Views &amp; clicks over time</h2>
                <TimeSeriesChart data={data.time_series} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background p-5">
                  <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Top links</h2>
                  <BreakdownBarChart data={data.top_links} labelKey="title" valueKey="clicks" />
                </div>
                <div className="rounded-2xl border border-border bg-background p-5">
                  <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Traffic sources</h2>
                  <BreakdownBarChart data={data.traffic_sources} labelKey="source" />
                </div>
                <div className="rounded-2xl border border-border bg-background p-5">
                  <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Countries</h2>
                  <BreakdownBarChart data={data.countries} labelKey="country" />
                </div>
                <div className="rounded-2xl border border-border bg-background p-5">
                  <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Devices</h2>
                  <BreakdownBarChart data={data.devices} labelKey="device_type" />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
