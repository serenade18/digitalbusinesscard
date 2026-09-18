export type AnalyticsPeriod = 'today' | '7d' | '30d' | '90d' | '12m' | 'custom'

export interface AnalyticsSummary {
  total_views: number
  unique_visitors: number
  link_clicks: number
  contact_downloads: number
  enquiries: number
  appointments: number
}

export interface AnalyticsTimeSeriesPoint {
  date: string
  views: number
  link_clicks: number
  engagement_rate: number
}

export interface AnalyticsTopLink {
  link_id: string
  title: string
  clicks: number
}

export interface AnalyticsTrafficSource {
  source: string
  count: number
}

export interface AnalyticsCountry {
  country: string
  count: number
}

export interface AnalyticsDevice {
  device_type: string
  count: number
}

export interface AnalyticsResponse {
  period: { start: string; end: string }
  summary: AnalyticsSummary
  time_series: AnalyticsTimeSeriesPoint[]
  top_links: AnalyticsTopLink[]
  traffic_sources: AnalyticsTrafficSource[]
  countries: AnalyticsCountry[]
  devices: AnalyticsDevice[]
}
