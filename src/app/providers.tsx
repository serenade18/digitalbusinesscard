import type { ReactNode } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { store } from '@/app/store'
import { AuthHydrator } from '@/features/auth/AuthHydrator'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <AuthHydrator>{children}</AuthHydrator>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </ReduxProvider>
  )
}
