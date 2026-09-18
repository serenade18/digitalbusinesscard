import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/render'
import { PricingTable } from '@/components/billing/PricingTable'
import type { Plan } from '@/types/billing'

const freePlan: Plan = {
  id: 'plan-free',
  name: 'Free',
  slug: 'free',
  description: '',
  monthly_price: '0',
  annual_price: '0',
  currency: 'USD',
  max_vcards: 1,
  max_storage_mb: 100,
  max_team_members: 1,
  max_gallery_items: 5,
  max_products: 5,
  max_services: 5,
  analytics_enabled: false,
  appointments_enabled: false,
  custom_domain_enabled: false,
  directory_enabled: false,
  remove_branding: false,
  priority_support: false,
}

const proPlan: Plan = {
  ...freePlan,
  id: 'plan-pro',
  name: 'Pro',
  slug: 'pro',
  monthly_price: '29',
  annual_price: '290',
  max_vcards: 10,
  analytics_enabled: true,
}

describe('PricingTable', () => {
  it('marks the active subscription plan as current and disables its CTA', () => {
    renderWithProviders(<PricingTable plans={[freePlan, proPlan]} currentPlanId="plan-free" onSelectPlan={vi.fn()} />)

    const currentBadges = screen.getAllByText(/current plan/i)
    expect(currentBadges.length).toBeGreaterThan(0)

    const freeButton = screen.getAllByRole('button', { name: /current plan/i })[0]
    expect(freeButton).toBeDisabled()
  })

  it('calls onSelectPlan with the plan and billing interval for an upgrade', async () => {
    const onSelectPlan = vi.fn()
    const user = userEvent.setup()
    renderWithProviders(<PricingTable plans={[freePlan, proPlan]} currentPlanId="plan-free" onSelectPlan={onSelectPlan} />)

    await user.click(screen.getByRole('button', { name: /choose plan/i }))

    expect(onSelectPlan).toHaveBeenCalledWith(proPlan, 'monthly')
  })
})
