/**
 * Categorical series colors, in the fixed (validated, CVD-safe) order —
 * never cycle or reassign by rank. Backed by CSS custom properties in
 * index.css so charts follow the light/dark theme automatically.
 */
export const chartSeriesColors = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
] as const

export const chartGridColor = 'var(--border)'
export const chartAxisColor = 'var(--muted-foreground)'
export const chartTextColor = 'var(--muted-foreground)'
