import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/hooks/redux'
import { Loader2 } from 'lucide-react'

export function RequireAuth({ children }: { children: ReactNode }) {
  const status = useAppSelector((state) => state.auth.status)
  const location = useLocation()

  if (status === 'hydrating') {
    return (
      <div className="flex h-svh w-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
