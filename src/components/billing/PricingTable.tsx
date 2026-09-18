import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { formatMoney } from '@/lib/format'
import type { Plan } from '@/types/billing'

function planFeatures(plan: Plan): string[] {
  const features = [
    `${plan.max_vcards} card${plan.max_vcards === 1 ? '' : 's'}`,
    `${plan.max_storage_mb} MB storage`,
    `${plan.max_team_members} team member${plan.max_team_members === 1 ? '' : 's'}`,
    `${plan.max_products} products, ${plan.max_services} services`,
    `${plan.max_gallery_items} gallery items`,
  ]
  if (plan.analytics_enabled) features.push('Analytics')
  if (plan.appointments_enabled) features.push('Appointments')
  if (plan.directory_enabled) features.push('Directory listing')
  if (plan.custom_domain_enabled) features.push('Custom domain')
  if (plan.remove_branding) features.push('Remove DBC branding')
  if (plan.priority_support) features.push('Priority support')
  return features
}

export function PricingTable({
  plans,
  currentPlanId,
  ctaLabel = 'Choose plan',
  onSelectPlan,
  isMutating,
}: {
  plans: Plan[]
  currentPlanId?: string
  ctaLabel?: string
  onSelectPlan?: (plan: Plan, interval: 'monthly' | 'annual') => void
  isMutating?: boolean
}) {
  const [interval, setInterval] = useState<'monthly' | 'annual'>('monthly')
  const hasAnnual = plans.some((p) => Number(p.annual_price) > 0)

  return (
    <div className="flex flex-col items-center gap-8">
      {hasAnnual && (
        <div className="inline-flex items-center rounded-full border border-border bg-muted/40 p-1">
          {(['monthly', 'annual'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setInterval(value)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors',
                interval === value ? 'bg-background shadow-sm' : 'text-muted-foreground',
              )}
            >
              {value}
            </button>
          ))}
        </div>
      )}

      <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          const price = interval === 'monthly' ? plan.monthly_price : plan.annual_price
          const isCurrent = plan.id === currentPlanId
          return (
            <div
              key={plan.id}
              className={cn(
                'flex flex-col gap-5 rounded-2xl border p-6',
                isCurrent ? 'border-foreground shadow-sm' : 'border-border',
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{plan.name}</h3>
                {isCurrent && <Badge variant="secondary">Current plan</Badge>}
              </div>
              <div>
                <span className="text-3xl font-semibold tracking-tight">{formatMoney(price, plan.currency)}</span>
                <span className="text-sm text-muted-foreground">/{interval === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              {plan.description && <p className="text-sm text-muted-foreground">{plan.description}</p>}
              <ul className="flex flex-1 flex-col gap-2 text-sm">
                {planFeatures(plan).map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="size-3.5 shrink-0 text-brand" />
                    {feature}
                  </li>
                ))}
              </ul>
              {onSelectPlan && (
                <Button
                  variant={isCurrent ? 'outline' : 'default'}
                  disabled={isCurrent || isMutating}
                  onClick={() => onSelectPlan(plan, interval)}
                >
                  {isCurrent ? 'Current plan' : ctaLabel}
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
