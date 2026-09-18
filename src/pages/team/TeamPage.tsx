import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2, Users } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { Field } from '@/components/forms/Field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useActiveOrganization } from '@/features/organizations/useActiveOrganization'
import {
  useCreateOrganizationMutation,
  useInviteMemberMutation,
  useListMembersQuery,
  useRemoveMemberMutation,
  useUpdateMemberMutation,
} from '@/features/organizations/organizationsApi'
import { extractErrorMessage } from '@/lib/errors'
import type { OrganizationRole } from '@/types/organizations'

const orgSchema = z.object({ name: z.string().min(1, 'Required') })
type OrgFormValues = z.infer<typeof orgSchema>

const inviteSchema = z.object({
  email: z.email('Enter a valid email address'),
  role: z.enum(['admin', 'member']),
})
type InviteFormValues = z.infer<typeof inviteSchema>

export function TeamPage() {
  const { organizationId, organization, setOrganizationId } = useActiveOrganization()
  const [createOrganization, { isLoading: isCreatingOrg }] = useCreateOrganizationMutation()
  const [createOrgOpen, setCreateOrgOpen] = useState(false)

  const {
    register: registerOrg,
    handleSubmit: handleSubmitOrg,
    reset: resetOrg,
    formState: { errors: orgErrors },
  } = useForm<OrgFormValues>({ resolver: zodResolver(orgSchema) })

  async function onCreateOrg(values: OrgFormValues) {
    try {
      const org = await createOrganization(values).unwrap()
      setOrganizationId(org.id)
      setCreateOrgOpen(false)
      resetOrg()
      toast.success('Organization created.')
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  if (!organizationId) {
    return (
      <div>
        <PageHeader title="Team" description="Invite teammates and manage roles." />
        <EmptyState
          icon={Users}
          title="No organization selected"
          description="Team management applies to an organization. Create one or switch to an existing one from the org menu in the top bar."
          action={
            <Dialog open={createOrgOpen} onOpenChange={setCreateOrgOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus /> Create organization
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create an organization</DialogTitle>
                  <DialogDescription>You'll be its owner and can invite teammates next.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitOrg(onCreateOrg)} className="flex flex-col gap-3">
                  <Field label="Organization name" htmlFor="org-name" error={orgErrors.name?.message}>
                    <Input id="org-name" {...registerOrg('name')} />
                  </Field>
                  <Button type="submit" disabled={isCreatingOrg}>
                    {isCreatingOrg && <Loader2 className="animate-spin" />}
                    Create
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          }
        />
      </div>
    )
  }

  return <OrganizationTeam organizationId={organizationId} orgName={organization?.name} />
}

function OrganizationTeam({ organizationId, orgName }: { organizationId: string; orgName?: string }) {
  const { data: members, isLoading } = useListMembersQuery(organizationId)
  const [inviteMember, { isLoading: isInviting }] = useInviteMemberMutation()
  const [updateMember] = useUpdateMemberMutation()
  const [removeMember] = useRemoveMemberMutation()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteFormValues>({ resolver: zodResolver(inviteSchema), defaultValues: { role: 'member' } })

  async function onInvite(values: InviteFormValues) {
    try {
      await inviteMember({ orgId: organizationId, body: values }).unwrap()
      toast.success('Invitation sent.')
      reset({ role: 'member', email: '' })
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div>
      <PageHeader title="Team" description={orgName ? `Members of ${orgName}` : 'Invite teammates and manage roles.'} />

      <form onSubmit={handleSubmit(onInvite)} className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-background p-5 sm:flex-row sm:items-end">
        <Field label="Invite by email" htmlFor="invite-email" error={errors.email?.message} className="flex-1">
          <Input id="invite-email" type="email" placeholder="teammate@company.com" {...register('email')} />
        </Field>
        <Field label="Role" htmlFor="invite-role" className="w-32">
          <select
            id="invite-role"
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            {...register('role')}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </Field>
        <Button type="submit" disabled={isInviting}>
          {isInviting ? <Loader2 className="animate-spin" /> : <Plus />}
          Invite
        </Button>
      </form>

      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}

      <div className="flex flex-col gap-2">
        {members?.map((member) => (
          <div key={member.id} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
            <Avatar className="size-9">
              <AvatarImage src={member.user.avatar ?? undefined} />
              <AvatarFallback>{(member.user.full_name || member.user.email).slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{member.user.full_name || member.user.email}</p>
              <p className="truncate text-xs text-muted-foreground">{member.user.email}</p>
            </div>
            {member.status === 'invited' && (
              <Badge variant="secondary" className="text-[10px]">
                Invited
              </Badge>
            )}
            {member.role === 'owner' ? (
              <Badge className="text-[10px]">Owner</Badge>
            ) : (
              <Select
                value={member.role}
                onValueChange={(role) =>
                  void updateMember({
                    orgId: organizationId,
                    memberId: member.id,
                    body: { role: role as Exclude<OrganizationRole, 'owner'> },
                  })
                }
              >
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            )}
            {member.role !== 'owner' && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => void removeMember({ orgId: organizationId, memberId: member.id })}
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>
      {!isLoading && members?.length === 0 && <EmptyState title="No members yet" />}
    </div>
  )
}
