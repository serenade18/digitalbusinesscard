import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthShell } from '@/pages/auth/AuthShell'
import { useResendVerificationMutation, useVerifyEmailMutation } from '@/features/auth/authApi'
import { useAppSelector } from '@/hooks/redux'
import { extractErrorMessage } from '@/lib/errors'
import { toast } from 'sonner'

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const uid = searchParams.get('uid')
  const token = searchParams.get('token')
  const isAuthenticated = useAppSelector((state) => state.auth.status === 'authenticated')

  const [verifyEmail] = useVerifyEmailMutation()
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation()
  const [state, setState] = useState<'pending' | 'success' | 'error'>('pending')

  useEffect(() => {
    if (!uid || !token) {
      setState('error')
      return
    }
    verifyEmail({ uid, token })
      .unwrap()
      .then(() => setState('success'))
      .catch(() => setState('error'))
  }, [uid, token, verifyEmail])

  async function handleResend() {
    try {
      await resendVerification().unwrap()
      toast.success('Verification email sent.')
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <AuthShell title="Email verification">
      <div className="flex flex-col items-center gap-3 text-center">
        {state === 'pending' && <Loader2 className="size-8 animate-spin text-muted-foreground" />}
        {state === 'success' && (
          <>
            <CheckCircle2 className="size-8 text-brand" />
            <p className="text-sm text-muted-foreground">Your email has been verified.</p>
            <Link to={isAuthenticated ? '/app' : '/login'} className="text-sm font-medium hover:underline">
              {isAuthenticated ? 'Go to dashboard' : 'Log in'}
            </Link>
          </>
        )}
        {state === 'error' && (
          <>
            <AlertTriangle className="size-8 text-destructive" />
            <p className="text-sm text-muted-foreground">
              This verification link is invalid or has expired.
            </p>
            {isAuthenticated && (
              <Button variant="outline" size="sm" disabled={isResending} onClick={() => void handleResend()}>
                {isResending && <Loader2 className="animate-spin" />}
                Resend verification email
              </Button>
            )}
          </>
        )}
      </div>
    </AuthShell>
  )
}
