import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/forms/Field'
import { AuthShell } from '@/pages/auth/AuthShell'
import { useResetPasswordMutation } from '@/features/auth/authApi'
import { extractErrorMessage } from '@/lib/errors'

const schema = z.object({ new_password: z.string().min(8, 'At least 8 characters') })
type FormValues = z.infer<typeof schema>

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const uid = searchParams.get('uid')
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const [resetPassword, { isLoading }] = useResetPasswordMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  if (!uid || !token) {
    return (
      <AuthShell title="Invalid link">
        <div className="flex flex-col items-center gap-3 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <p className="text-sm text-muted-foreground">
            This password reset link is missing required information. Request a new one.
          </p>
          <Link to="/forgot-password" className="text-sm font-medium hover:underline">
            Request new link
          </Link>
        </div>
      </AuthShell>
    )
  }

  async function onSubmit(values: FormValues) {
    try {
      await resetPassword({ uid: uid!, token: token!, new_password: values.new_password }).unwrap()
      toast.success('Password updated — log in with your new password.')
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(extractErrorMessage(error, 'This reset link may have expired.'))
    }
  }

  return (
    <AuthShell title="Set a new password">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field label="New password" htmlFor="new_password" error={errors.new_password?.message}>
          <Input id="new_password" type="password" autoComplete="new-password" {...register('new_password')} />
        </Field>
        <Button type="submit" disabled={isLoading} className="mt-2">
          {isLoading && <Loader2 className="animate-spin" />}
          Reset password
        </Button>
      </form>
    </AuthShell>
  )
}
