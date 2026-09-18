import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { MarketingLayout } from '@/components/layout/MarketingLayout'

import { LandingPage } from '@/pages/marketing/LandingPage'
import { FeaturesPage } from '@/pages/marketing/FeaturesPage'
import { PricingPage } from '@/pages/marketing/PricingPage'
import { AboutPage } from '@/pages/marketing/AboutPage'
import { ContactPage } from '@/pages/marketing/ContactPage'
import { FaqPage } from '@/pages/marketing/FaqPage'

import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { VerifyEmailPage } from '@/pages/auth/VerifyEmailPage'

import { DashboardHomePage } from '@/pages/dashboard/DashboardHomePage'
import { CardsListPage } from '@/pages/cards/CardsListPage'
import { CardCreatePage } from '@/pages/cards/CardCreatePage'
import { CardBuilderPage } from '@/pages/cards/CardBuilderPage'
import { CardThemePage } from '@/pages/cards/CardThemePage'
import { CardSettingsPage } from '@/pages/cards/CardSettingsPage'
import { TemplateGalleryPage } from '@/pages/cards/TemplateGalleryPage'

import { AnalyticsPage } from '@/pages/dashboard/AnalyticsPage'
import { EnquiriesPage } from '@/pages/dashboard/EnquiriesPage'
import { AppointmentsPage } from '@/pages/dashboard/AppointmentsPage'
import { DirectoryManagementPage } from '@/pages/dashboard/DirectoryManagementPage'

import { TeamPage } from '@/pages/team/TeamPage'
import { OrdersPage } from '@/pages/orders/OrdersPage'
import { OrderCreatePage } from '@/pages/orders/OrderCreatePage'
import { BillingPage } from '@/pages/billing/BillingPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'

import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/features', element: <FeaturesPage /> },
      { path: '/pricing', element: <PricingPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/faq', element: <FaqPage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/verify-email', element: <VerifyEmailPage /> },
  {
    path: '/app',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <DashboardHomePage /> },
      { path: 'cards', element: <CardsListPage /> },
      { path: 'cards/new', element: <CardCreatePage /> },
      { path: 'cards/:cardId', element: <CardBuilderPage /> },
      { path: 'cards/:cardId/theme', element: <CardThemePage /> },
      { path: 'cards/:cardId/settings', element: <CardSettingsPage /> },
      { path: 'templates', element: <TemplateGalleryPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'enquiries', element: <EnquiriesPage /> },
      { path: 'appointments', element: <AppointmentsPage /> },
      { path: 'directory', element: <DirectoryManagementPage /> },
      { path: 'team', element: <TeamPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/new', element: <OrderCreatePage /> },
      { path: 'billing', element: <BillingPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  { path: '/dashboard', element: <Navigate to="/app" replace /> },
  { path: '*', element: <NotFoundPage /> },
])
