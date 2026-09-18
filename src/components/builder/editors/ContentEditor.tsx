import { useEffect, useState } from 'react'
import { Field } from '@/components/forms/Field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AutosaveStatus } from '@/components/common/AutosaveStatus'
import type { AutosaveState } from '@/components/common/AutosaveStatus'
import { useUpdateBlockMutation } from '@/features/builder/builderApi'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'
import type { ProfileBlock } from '@/types/blocks'

export function ContentEditor({ block }: { block: ProfileBlock }) {
  const [updateBlock] = useUpdateBlockMutation()
  const [content, setContent] = useState<Record<string, unknown>>(block.content ?? {})
  const [state, setState] = useState<AutosaveState>('idle')

  useEffect(() => {
    setContent(block.content ?? {})
  }, [block.id, block.content])

  const save = useDebouncedCallback(async (next: Record<string, unknown>) => {
    setState('saving')
    try {
      await updateBlock({ id: block.id, body: { content: next } }).unwrap()
      setState('saved')
    } catch {
      setState('error')
    }
  }, 600)

  function update(field: string, value: string) {
    const next = { ...content, [field]: value }
    setContent(next)
    save(next)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <AutosaveStatus state={state} />
      </div>

      {block.type === 'video' && (
        <>
          <Field label="Video URL" hint="A YouTube, Vimeo, or direct video link">
            <Input
              value={(content.url as string) ?? ''}
              onChange={(e) => update('url', e.target.value)}
              placeholder="https://"
            />
          </Field>
          <Field label="Caption" optional>
            <Input value={(content.caption as string) ?? ''} onChange={(e) => update('caption', e.target.value)} />
          </Field>
        </>
      )}

      {block.type === 'contact' && (
        <Field label="Extra note" hint="Shown alongside your contact details on the public page" optional>
          <Textarea rows={3} value={(content.note as string) ?? ''} onChange={(e) => update('note', e.target.value)} />
        </Field>
      )}

      {block.type === 'location' && (
        <Field label="Map link" hint="A Google Maps (or similar) link to your address" optional>
          <Input
            value={(content.map_url as string) ?? ''}
            onChange={(e) => update('map_url', e.target.value)}
            placeholder="https://maps.google.com/…"
          />
        </Field>
      )}

      {block.type === 'custom' && (
        <Field label="Content" optional>
          <Textarea rows={5} value={(content.body as string) ?? ''} onChange={(e) => update('body', e.target.value)} />
        </Field>
      )}
    </div>
  )
}
