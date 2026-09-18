import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/forms/PasswordInput'
import { Field } from '@/components/forms/Field'
import { AuthShell } from '@/pages/auth/AuthShell'
import { useRegisterMutation } from '@/features/auth/authApi'
import { credentialsReceived } from '@/features/auth/authSlice'
import { useAppDispatch } from '@/hooks/redux'
import { storeRefreshToken } from '@/services/auth'
import { extractErrorMessage } from '@/lib/errors'

const schema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  email: z.email('Enter a valid email address'),
  phone: z.string().optional(),
  password: z.string().min(8, 'At least 8 characters'),
})

type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [registerUser, { isLoading }] = useRegisterMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    try {
      const result = await registerUser(values).unwrap()
      storeRefreshToken(result.refresh)
      dispatch(credentialsReceived({ accessToken: result.access, user: result.user }))
      toast.success('Account created — check your inbox to verify your email.')
      navigate('/app', { replace: true })
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not create your account.'))
    }
  }

  return (
    <AuthShell
      title="Create your account"
      description="Set up your digital business card in minutes"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-foreground hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name" htmlFor="first_name" error={errors.first_name?.message}>
            <Input id="first_name" autoComplete="given-name" {...register('first_name')} />
          </Field>
          <Field label="Last name" htmlFor="last_name" error={errors.last_name?.message}>
            <Input id="last_name" autoComplete="family-name" {...register('last_name')} />
          </Field>
        </div>
        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
        </Field>
        <Field label="Phone" htmlFor="phone" optional error={errors.phone?.message}>
          <Input id="phone" type="tel" autoComplete="tel" {...register('phone')} />
        </Field>
        <Field label="Password" htmlFor="password" error={errors.password?.message}>
          <PasswordInput id="password" autoComplete="new-password" {...register('password')} />
        </Field>
        <Button type="submit" disabled={isLoading} className="mt-2">
          {isLoading && <Loader2 className="animate-spin" />}
          Create account
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our Terms and Privacy Policy.
        </p>
      </form>
    </AuthShell>
  )
}
