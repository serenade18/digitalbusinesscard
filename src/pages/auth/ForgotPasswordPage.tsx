import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/forms/Field'
import { AuthShell } from '@/pages/auth/AuthShell'
import { useForgotPasswordMutation } from '@/features/auth/authApi'
import { extractErrorMessage } from '@/lib/errors'
import { toast } from 'sonner'

const schema = z.object({ email: z.email('Enter a valid email address') })
type FormValues = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [forgotPassword, { isLoading, isSuccess }] = useForgotPasswordMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    try {
      await forgotPassword(values).unwrap()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  if (isSuccess) {
    return (
      <AuthShell title="Check your email">
        <div className="flex flex-col items-center gap-3 text-center">
          <CheckCircle2 className="size-8 text-brand" />
          <p className="text-sm text-muted-foreground">
            If an account exists for that email, we've sent a link to reset your password.
          </p>
          <Link to="/login" className="text-sm font-medium hover:underline">
            Back to login
          </Link>
        </div>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Forgot password"
      description="We'll email you a link to reset it"
      footer={
        <Link to="/login" className="font-medium text-foreground hover:underline">
          Back to login
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
        </Field>
        <Button type="submit" disabled={isLoading} className="mt-2">
          {isLoading && <Loader2 className="animate-spin" />}
          Send reset link
        </Button>
      </form>
    </AuthShell>
  )
}
