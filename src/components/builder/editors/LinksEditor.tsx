import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/forms/Field'
import {
  useCreateLinkMutation,
  useDeleteLinkMutation,
  useListLinksQuery,
  useUpdateLinkMutation,
} from '@/features/builder/builderApi'
import { extractErrorMessage } from '@/lib/errors'

interface FormValues {
  title: string
  url: string
  icon: string
}

const empty: FormValues = { title: '', url: '', icon: '' }

export function LinksEditor({ vcardId }: { vcardId: string }) {
  const { data: links, isLoading } = useListLinksQuery(vcardId)
  const [createLink, { isLoading: isCreating }] = useCreateLinkMutation()
  const [updateLink] = useUpdateLinkMutation()
  const [deleteLink] = useDeleteLinkMutation()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ defaultValues: empty })

  async function onAdd(values: FormValues) {
    try {
      await createLink({
        vcardId,
        body: { ...values, position: links?.length ?? 0, is_visible: true },
      }).unwrap()
      reset(empty)
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  async function toggleVisible(id: string, is_visible: boolean) {
    try {
      await updateLink({ id, body: { is_visible: !is_visible } }).unwrap()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteLink(id).unwrap()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}

      <div className="flex flex-col gap-2">
        {links?.map((link) => (
          <div key={link.id} className="flex items-center gap-2 rounded-lg border border-border p-2.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{link.title}</p>
              <p className="truncate text-xs text-muted-foreground">{link.url}</p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => void toggleVisible(link.id, link.is_visible)}>
              {link.is_visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => void handleDelete(link.id)}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onAdd)} className="flex flex-col gap-3 rounded-lg border border-dashed border-border p-3">
        <p className="text-xs font-medium text-muted-foreground">Add a link</p>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Title" htmlFor="link-title" error={errors.title?.message}>
            <Input id="link-title" {...register('title', { required: 'Required' })} />
          </Field>
          <Field label="Icon" htmlFor="link-icon" optional>
            <Input id="link-icon" placeholder="instagram" {...register('icon')} />
          </Field>
        </div>
        <Field label="URL" htmlFor="link-url" error={errors.url?.message}>
          <Input id="link-url" type="url" placeholder="https://" {...register('url', { required: 'Required' })} />
        </Field>
        <Button type="submit" size="sm" disabled={isCreating} className="self-start">
          {isCreating ? <Loader2 className="animate-spin" /> : <Plus />}
          Add link
        </Button>
      </form>
    </div>
  )
}
