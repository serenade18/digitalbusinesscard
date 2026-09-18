import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { PricingTable } from '@/components/billing/PricingTable'
import { useListPlansQuery } from '@/features/billing/billingApi'

export function PricingPage() {
  const { data: plans, isLoading } = useListPlansQuery()
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Simple, transparent pricing</h1>
        <p className="mt-4 text-muted-foreground md:text-lg">Start free, upgrade when you need more room.</p>
      </div>

      <div className="mt-14">
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {plans && (
          <PricingTable
            plans={plans}
            ctaLabel="Get started"
            onSelectPlan={() => navigate('/register')}
          />
        )}
      </div>
    </div>
  )
}
