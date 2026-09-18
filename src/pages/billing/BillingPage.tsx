import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { PricingTable } from '@/components/billing/PricingTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  useCancelSubscriptionMutation,
  useCheckoutMutation,
  useGetSubscriptionQuery,
  useListInvoicesQuery,
  useListPlansQuery,
  useReactivateSubscriptionMutation,
} from '@/features/billing/billingApi'
import { useActiveOrganization } from '@/features/organizations/useActiveOrganization'
import { formatDate, formatMoney } from '@/lib/format'
import { subscriptionStatusTone } from '@/lib/status'
import { extractErrorMessage } from '@/lib/errors'
import type { Plan, SubscriptionProvider } from '@/types/billing'

export function BillingPage() {
  const { organizationId } = useActiveOrganization()
  const { data: plans, isLoading: isLoadingPlans } = useListPlansQuery()
  const { data: subscription } = useGetSubscriptionQuery({ organizationId })
  const { data: invoices } = useListInvoicesQuery({ organizationId })
  const [checkout, { isLoading: isCheckingOut }] = useCheckoutMutation()
  const [cancelSubscription] = useCancelSubscriptionMutation()
  const [reactivateSubscription] = useReactivateSubscriptionMutation()
  const [pendingPlan, setPendingPlan] = useState<Plan | null>(null)

  async function handleProvider(provider: SubscriptionProvider) {
    if (!pendingPlan) return
    try {
      const result = await checkout({ plan_id: pendingPlan.id, provider, organization_id: organizationId }).unwrap()
      if (result.redirect_url) {
        window.location.assign(result.redirect_url)
        return
      }
      toast.success('Check your phone to complete the payment.')
    } catch (error) {
      toast.error(extractErrorMessage(error))
    } finally {
      setPendingPlan(null)
    }
  }

  return (
    <div>
      <PageHeader title="Billing" description="Your plan, usage, and payment history." />

      {subscription && (
        <section className="mb-8 flex flex-col gap-3 rounded-2xl border border-border bg-background p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">{subscription.plan.name}</h2>
              <StatusBadge status={subscription.status} tone={subscriptionStatusTone(subscription.status)} />
            </div>
            {subscription.status === 'trialing' && subscription.trial_end && (
              <p className="mt-1 text-sm text-muted-foreground">Trial ends {formatDate(subscription.trial_end)}</p>
            )}
            {subscription.current_period_end && (
              <p className="mt-1 text-sm text-muted-foreground">
                {subscription.cancel_at_period_end ? 'Cancels' : 'Renews'} {formatDate(subscription.current_period_end)}
              </p>
            )}
          </div>
          {subscription.cancel_at_period_end ? (
            <Button variant="outline" onClick={() => void reactivateSubscription({ organization_id: organizationId })}>
              Reactivate
            </Button>
          ) : (
            Number(subscription.plan.monthly_price) > 0 && (
              <Button variant="outline" onClick={() => void cancelSubscription({ organization_id: organizationId })}>
                Cancel plan
              </Button>
            )
          )}
        </section>
      )}

      <section className="mb-10">
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground">Plans</h2>
        {isLoadingPlans && (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        )}
        {plans && (
          <PricingTable
            plans={plans}
            currentPlanId={subscription?.plan.id}
            ctaLabel="Switch plan"
            isMutating={isCheckingOut}
            onSelectPlan={(plan) => setPendingPlan(plan)}
          />
        )}
      </section>

      <section>
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground">Invoices</h2>
        {invoices && invoices.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>{formatDate(invoice.paid_at ?? invoice.created_at)}</TableCell>
                  <TableCell>{formatMoney(invoice.amount, invoice.currency)}</TableCell>
                  <TableCell className="capitalize">{invoice.provider}</TableCell>
                  <TableCell>
                    <StatusBadge status={invoice.status} tone={invoice.status === 'succeeded' ? 'success' : invoice.status === 'failed' ? 'danger' : 'neutral'} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-sm text-muted-foreground">No invoices yet.</p>
        )}
      </section>

      <Dialog open={!!pendingPlan} onOpenChange={(open) => !open && setPendingPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay with</DialogTitle>
            <DialogDescription>Switching to {pendingPlan?.name}.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Button variant="outline" disabled={isCheckingOut} onClick={() => void handleProvider('stripe')}>
              Card (Stripe)
            </Button>
            <Button variant="outline" disabled={isCheckingOut} onClick={() => void handleProvider('mpesa')}>
              M-Pesa
            </Button>
            <Button variant="outline" disabled={isCheckingOut} onClick={() => void handleProvider('sasapay')}>
              SasaPay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
