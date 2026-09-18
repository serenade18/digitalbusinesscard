import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Copy, Download, Loader2, QrCode } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Field } from '@/components/forms/Field'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { StatusBadge } from '@/components/common/StatusBadge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  useAssignCardMutation,
  useDeleteCardMutation,
  useGetCardQuery,
  useLazyGetCardQrQuery,
  useLazyGetCardVcfQuery,
  usePublishCardMutation,
  useUnassignCardMutation,
  useUnpublishCardMutation,
  useUpdateCardMutation,
} from '@/features/cards/cardsApi'
import { useUpdateDirectoryVisibilityMutation } from '@/features/directory/directoryApi'
import { useListMembersQuery } from '@/features/organizations/organizationsApi'
import { vcardStatusTone } from '@/lib/status'
import { extractErrorMessage } from '@/lib/errors'
import { triggerDownload } from '@/lib/download'
import type { VCardVisibility } from '@/types/cards'

export function CardSettingsPage() {
  const { cardId } = useParams<{ cardId: string }>()
  const navigate = useNavigate()
  const { data: card, isLoading } = useGetCardQuery(cardId!)
  const [updateCard] = useUpdateCardMutation()
  const [publishCard, { isLoading: isPublishing }] = usePublishCardMutation()
  const [unpublishCard, { isLoading: isUnpublishing }] = useUnpublishCardMutation()
  const [deleteCard] = useDeleteCardMutation()
  const [updateVisibility] = useUpdateDirectoryVisibilityMutation()
  const [assignCard] = useAssignCardMutation()
  const [unassignCard] = useUnassignCardMutation()
  const { data: members } = useListMembersQuery(card?.organization ?? '', { skip: !card?.organization })
  const [triggerQr, { isFetching: isFetchingQr }] = useLazyGetCardQrQuery()
  const [triggerVcf, { isFetching: isFetchingVcf }] = useLazyGetCardVcfQuery()
  const [copied, setCopied] = useState(false)

  if (isLoading || !card) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  async function handlePublishToggle() {
    try {
      if (card!.status === 'published') {
        await unpublishCard(card!.id).unwrap()
        toast.success('Card unpublished.')
      } else {
        await publishCard(card!.id).unwrap()
        toast.success('Card published.')
      }
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(card!.public_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  async function handleDownloadQr(format: 'png' | 'svg' | 'pdf') {
    try {
      const url = await triggerQr({ id: card!.id, format }).unwrap()
      triggerDownload(url, `${card!.slug}-qr.${format}`)
    } catch (error) {
      toast.error(extractErrorMessage(error, `Could not generate a ${format.toUpperCase()} QR code.`))
    }
  }

  async function handleDownloadVcf() {
    try {
      const url = await triggerVcf(card!.id).unwrap()
      triggerDownload(url, `${card!.slug}.vcf`)
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Could not download the contact file.'))
    }
  }

  async function handleDelete() {
    try {
      await deleteCard(card!.id).unwrap()
      toast.success('Card deleted.')
      navigate('/app/cards', { replace: true })
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <PageHeader title="Card settings" description={card.display_name} />

      <section className="rounded-2xl border border-border bg-background p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">Publishing</h2>
          <StatusBadge status={card.status} tone={vcardStatusTone(card.status)} />
        </div>

        <div className="mb-4 flex items-center gap-2">
          <Input readOnly value={card.public_url} className="font-mono text-xs" />
          <Button variant="outline" size="icon" onClick={() => void handleCopyLink()}>
            <Copy className="size-4" />
          </Button>
        </div>
        {copied && <p className="mb-4 text-xs text-brand">Link copied.</p>}

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void handlePublishToggle()} disabled={isPublishing || isUnpublishing}>
            {(isPublishing || isUnpublishing) && <Loader2 className="animate-spin" />}
            {card.status === 'published' ? 'Unpublish' : 'Publish'}
          </Button>
          <Button variant="outline" disabled={isFetchingVcf} onClick={() => void handleDownloadVcf()}>
            <Download /> Save Contact (.vcf)
          </Button>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-background p-6">
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground">Visibility</h2>
        <Field label="Who can view this card" htmlFor="visibility">
          <Select
            value={card.visibility}
            onValueChange={(v) => void updateCard({ id: card.id, body: { visibility: v as VCardVisibility } })}
          >
            <SelectTrigger id="visibility" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="unlisted">Unlisted (link only)</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </section>

      <section className="rounded-2xl border border-border bg-background p-6">
        <h2 className="mb-4 text-sm font-semibold text-muted-foreground">QR code</h2>
        <div className="flex flex-wrap gap-2">
          {(['png', 'svg', 'pdf'] as const).map((format) => (
            <Button key={format} variant="outline" disabled={isFetchingQr} onClick={() => void handleDownloadQr(format)}>
              <QrCode /> {format.toUpperCase()}
            </Button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-background p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Directory listing</h2>
            <p className="text-xs text-muted-foreground">Make this card discoverable in the public directory.</p>
          </div>
          <Switch
            checked={card.is_directory_visible}
            onCheckedChange={(checked) =>
              void updateVisibility({ vcardId: card.id, body: { is_directory_visible: checked } })
            }
          />
        </div>
        <Field label="Category / industry" htmlFor="industry" optional className="mt-4">
          <Input
            id="industry"
            defaultValue={card.industry}
            onBlur={(e) => void updateVisibility({ vcardId: card.id, body: { industry: e.target.value } })}
          />
        </Field>
      </section>

      {card.organization && (
        <section className="rounded-2xl border border-border bg-background p-6">
          <h2 className="mb-4 text-sm font-semibold text-muted-foreground">Assignment</h2>
          <Field label="Assigned team member" htmlFor="assigned">
            <Select
              value={card.assigned_user ?? 'unassigned'}
              onValueChange={(v) =>
                v === 'unassigned'
                  ? void unassignCard(card.id)
                  : void assignCard({ id: card.id, userId: v })
              }
            >
              <SelectTrigger id="assigned" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {members?.map((member) => (
                  <SelectItem key={member.user.id} value={member.user.id}>
                    {member.user.full_name || member.user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </section>
      )}

      <section className="rounded-2xl border border-destructive/30 bg-background p-6">
        <h2 className="mb-1 text-sm font-semibold text-destructive">Danger zone</h2>
        <p className="mb-4 text-xs text-muted-foreground">Deleting a card permanently removes its public page and all content.</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete this card</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {card.display_name}?</AlertDialogTitle>
              <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => void handleDelete()}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  )
}
