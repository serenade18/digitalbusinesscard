import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Building2, Loader2 } from 'lucide-react'
import { Field } from '@/components/forms/Field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/common/EmptyState'
import { useActiveOrganization } from '@/features/organizations/useActiveOrganization'
import { useGetOrganizationQuery, useUpdateOrganizationMutation } from '@/features/organizations/organizationsApi'
import { extractErrorMessage } from '@/lib/errors'

interface FormValues {
  name: string
  description: string
  website: string
  email: string
  phone: string
  country: string
}

export function OrganizationSettingsPanel() {
  const { organizationId } = useActiveOrganization()

  if (!organizationId) {
    return (
      <EmptyState
        icon={Building2}
        title="No organization selected"
        description="Switch to an organization from the top bar to manage its settings."
      />
    )
  }

  return <OrganizationForm organizationId={organizationId} />
}

function OrganizationForm({ organizationId }: { organizationId: string }) {
  const { data: org, isLoading } = useGetOrganizationQuery(organizationId)
  const [updateOrganization, { isLoading: isSaving }] = useUpdateOrganizationMutation()

  const { register, handleSubmit } = useForm<FormValues>({
    values: org
      ? {
          name: org.name,
          description: org.description,
          website: org.website,
          email: org.email,
          phone: org.phone,
          country: org.country,
        }
      : undefined,
  })

  const canEdit = org?.my_role === 'owner' || org?.my_role === 'admin'

  async function onSubmit(values: FormValues) {
    try {
      await updateOrganization({ id: organizationId, body: values }).unwrap()
      toast.success('Organization updated.')
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  if (isLoading || !org) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <section className="rounded-2xl border border-border bg-background p-6">
      <h2 className="mb-4 text-sm font-semibold text-muted-foreground">Organization</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Field label="Name" htmlFor="org-name">
          <Input id="org-name" disabled={!canEdit} {...register('name')} />
        </Field>
        <Field label="Description" htmlFor="org-description" optional>
          <Input id="org-description" disabled={!canEdit} {...register('description')} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Website" htmlFor="org-website" optional>
            <Input id="org-website" type="url" disabled={!canEdit} {...register('website')} />
          </Field>
          <Field label="Email" htmlFor="org-email" optional>
            <Input id="org-email" type="email" disabled={!canEdit} {...register('email')} />
          </Field>
          <Field label="Phone" htmlFor="org-phone" optional>
            <Input id="org-phone" disabled={!canEdit} {...register('phone')} />
          </Field>
          <Field label="Country" htmlFor="org-country" optional>
            <Input id="org-country" disabled={!canEdit} {...register('country')} />
          </Field>
        </div>
        {canEdit && (
          <Button type="submit" disabled={isSaving} className="self-start">
            {isSaving && <Loader2 className="animate-spin" />}
            Save changes
          </Button>
        )}
        {!canEdit && <p className="text-xs text-muted-foreground">Only the owner or an admin can edit these settings.</p>}
      </form>
    </section>
  )
}
