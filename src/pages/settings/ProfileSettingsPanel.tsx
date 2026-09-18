import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Camera, CheckCircle2, Loader2 } from 'lucide-react'
import { Field } from '@/components/forms/Field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAppSelector } from '@/hooks/redux'
import { useChangePasswordMutation, useUpdateMeMutation } from '@/features/auth/authApi'
import { extractErrorMessage } from '@/lib/errors'

const profileSchema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  phone: z.string().optional(),
})
type ProfileFormValues = z.infer<typeof profileSchema>

const passwordSchema = z
  .object({
    old_password: z.string().min(1, 'Required'),
    new_password: z.string().min(8, 'At least 8 characters'),
  })

export function ProfileSettingsPanel() {
  const user = useAppSelector((state) => state.auth.user)
  const [updateMe, { isLoading: isSavingProfile }] = useUpdateMeMutation()
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: user ? { first_name: user.first_name, last_name: user.last_name, phone: user.phone } : undefined,
  })

  const {
    register: registerPw,
    handleSubmit: handleSubmitPw,
    reset: resetPw,
    formState: { errors: pwErrors },
  } = useForm<z.infer<typeof passwordSchema>>({ resolver: zodResolver(passwordSchema) })

  async function onSaveProfile(values: ProfileFormValues) {
    try {
      await updateMe(values).unwrap()
      toast.success('Profile updated.')
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  async function handleAvatarChange(file: File | null) {
    if (!file) return
    const formData = new FormData()
    formData.append('avatar', file)
    try {
      await updateMe(formData).unwrap()
      toast.success('Avatar updated.')
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  async function onChangePassword(values: z.infer<typeof passwordSchema>) {
    try {
      await changePassword(values).unwrap()
      toast.success('Password changed.')
      resetPw()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  if (!user) return null

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-background p-6">
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground">Profile</h2>
        <div className="mb-5 flex items-center gap-4">
          <label className="group relative cursor-pointer">
            <Avatar className="size-16">
              <AvatarImage src={user.avatar ?? undefined} alt={user.full_name} />
              <AvatarFallback>{user.full_name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="size-4 text-white" />
            </span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => void handleAvatarChange(e.target.files?.[0] ?? null)}
            />
          </label>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{user.email}</p>
              {user.email_verified ? (
                <Badge variant="secondary" className="gap-1 text-[10px]">
                  <CheckCircle2 className="size-3" /> Verified
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px]">
                  Unverified
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">Email can't be changed here.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSaveProfile)} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" htmlFor="first_name" error={errors.first_name?.message}>
              <Input id="first_name" {...register('first_name')} />
            </Field>
            <Field label="Last name" htmlFor="last_name" error={errors.last_name?.message}>
              <Input id="last_name" {...register('last_name')} />
            </Field>
          </div>
          <Field label="Phone" htmlFor="phone" optional>
            <Input id="phone" {...register('phone')} />
          </Field>
          <Button type="submit" disabled={isSavingProfile} className="self-start">
            {isSavingProfile && <Loader2 className="animate-spin" />}
            Save changes
          </Button>
        </form>
      </section>

      <section className="rounded-2xl border border-border bg-background p-6">
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground">Password</h2>
        <form onSubmit={handleSubmitPw(onChangePassword)} className="flex flex-col gap-3">
          <Field label="Current password" htmlFor="old_password" error={pwErrors.old_password?.message}>
            <Input id="old_password" type="password" {...registerPw('old_password')} />
          </Field>
          <Field label="New password" htmlFor="new_password" error={pwErrors.new_password?.message}>
            <Input id="new_password" type="password" {...registerPw('new_password')} />
          </Field>
          <Button type="submit" disabled={isChangingPassword} className="self-start">
            {isChangingPassword && <Loader2 className="animate-spin" />}
            Change password
          </Button>
        </form>
      </section>
    </div>
  )
}
