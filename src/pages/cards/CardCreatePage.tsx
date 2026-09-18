import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Field } from '@/components/forms/Field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateCardMutation } from '@/features/cards/cardsApi'
import { useActiveOrganization } from '@/features/organizations/useActiveOrganization'
import { extractErrorMessage } from '@/lib/errors'

const schema = z.object({
  display_name: z.string().min(1, 'Required'),
  job_title: z.string().optional(),
  company_name: z.string().optional(),
  bio: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function CardCreatePage() {
  const navigate = useNavigate()
  const [createCard, { isLoading }] = useCreateCardMutation()
  const { organizationId } = useActiveOrganization()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    try {
      const card = await createCard({ ...values, organization: organizationId }).unwrap()
      toast.success('Card created.')
      navigate(`/app/cards/${card.id}`, { replace: true })
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not create card.'))
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="Create a card" description="You can fill in the rest from the builder." />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-6">
        <Field label="Display name" htmlFor="display_name" error={errors.display_name?.message}>
          <Input id="display_name" placeholder="Jane Doe" {...register('display_name')} />
        </Field>
        <Field label="Job title" htmlFor="job_title" optional error={errors.job_title?.message}>
          <Input id="job_title" placeholder="Software Engineer" {...register('job_title')} />
        </Field>
        <Field label="Company" htmlFor="company_name" optional error={errors.company_name?.message}>
          <Input id="company_name" placeholder="Acme Inc." {...register('company_name')} />
        </Field>
        <Field label="Bio" htmlFor="bio" optional error={errors.bio?.message}>
          <Textarea id="bio" rows={3} placeholder="A short introduction" {...register('bio')} />
        </Field>
        <Button type="submit" disabled={isLoading} className="mt-2">
          {isLoading && <Loader2 className="animate-spin" />}
          Create card
        </Button>
      </form>
    </div>
  )
}
