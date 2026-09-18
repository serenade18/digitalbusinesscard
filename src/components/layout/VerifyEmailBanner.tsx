import { Loader2, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/hooks/redux'
import { useResendVerificationMutation } from '@/features/auth/authApi'
import { extractErrorMessage } from '@/lib/errors'

export function VerifyEmailBanner() {
  const user = useAppSelector((state) => state.auth.user)
  const [resendVerification, { isLoading, isSuccess }] = useResendVerificationMutation()

  if (!user || user.email_verified) return null

  async function handleResend() {
    try {
      await resendVerification().unwrap()
      toast.success('Verification email sent — check your inbox.')
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-amber-500/10 px-4 py-2 text-sm md:px-8">
      <Mail className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
      <span className="text-amber-900 dark:text-amber-200">
        Verify <strong>{user.email}</strong> to make sure you don't lose access to your account.
      </span>
      <Button
        type="button"
        variant="link"
        size="sm"
        className="h-auto px-0 text-amber-900 underline dark:text-amber-200"
        disabled={isLoading || isSuccess}
        onClick={() => void handleResend()}
      >
        {isLoading && <Loader2 className="animate-spin" />}
        {isSuccess ? 'Email sent' : 'Resend verification email'}
      </Button>
    </div>
  )
}
