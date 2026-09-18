import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/forms/Field'
import { AuthShell } from '@/pages/auth/AuthShell'
import { useLoginMutation } from '@/features/auth/authApi'
import { credentialsReceived } from '@/features/auth/authSlice'
import { useAppDispatch } from '@/hooks/redux'
import { storeRefreshToken } from '@/services/auth'
import { extractErrorMessage } from '@/lib/errors'
import { Loader2 } from 'lucide-react'

const schema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [login, { isLoading }] = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    try {
      const result = await login(values).unwrap()
      storeRefreshToken(result.refresh)
      dispatch(credentialsReceived({ accessToken: result.access, user: result.user }))
      const from = (location.state as { from?: Location })?.from
      navigate(from?.pathname ?? '/app', { replace: true })
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not log in. Check your credentials.'))
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Log in to manage your digital business cards"
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-foreground hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
        </Field>
        <Field
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
          labelExtra={
            <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground hover:underline">
              Forgot password?
            </Link>
          }
        >
          <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
        </Field>
        <Button type="submit" disabled={isLoading} className="mt-2">
          {isLoading && <Loader2 className="animate-spin" />}
          Log in
        </Button>
      </form>
    </AuthShell>
  )
}
