import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Camera } from 'lucide-react'
import { Field } from '@/components/forms/Field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AutosaveStatus } from '@/components/common/AutosaveStatus'
import type { AutosaveState } from '@/components/common/AutosaveStatus'
import { useUpdateCardMutation } from '@/features/cards/cardsApi'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'
import type { VCard, VCardUpdatePayload } from '@/types/cards'

const FIELDS = [
  'display_name',
  'job_title',
  'company_name',
  'bio',
  'email',
  'phone',
  'whatsapp',
  'website',
  'address',
  'location',
  'industry',
] as const

type FormValues = Pick<VCard, (typeof FIELDS)[number]>

export function CardDetailsForm({ card }: { card: VCard }) {
  const [updateCard] = useUpdateCardMutation()
  const [autosaveState, setAutosaveState] = useState<AutosaveState>('idle')
  const { register, watch, reset } = useForm<FormValues>({
    defaultValues: Object.fromEntries(FIELDS.map((f) => [f, card[f] ?? ''])) as FormValues,
  })

  const lastCardId = useRef(card.id)
  useEffect(() => {
    if (lastCardId.current !== card.id) {
      reset(Object.fromEntries(FIELDS.map((f) => [f, card[f] ?? ''])) as FormValues)
      lastCardId.current = card.id
    }
  }, [card, reset])

  const debouncedSave = useDebouncedCallback(async (values: VCardUpdatePayload) => {
    setAutosaveState('saving')
    try {
      await updateCard({ id: card.id, body: values }).unwrap()
      setAutosaveState('saved')
    } catch {
      setAutosaveState('error')
    }
  }, 700)

  useEffect(() => {
    const subscription = watch((values) => debouncedSave(values as VCardUpdatePayload))
    return () => subscription.unsubscribe()
  }, [watch, debouncedSave])

  async function handlePhotoChange(field: 'profile_photo' | 'cover_photo', file: File | null) {
    if (!file) return
    setAutosaveState('saving')
    try {
      await updateCard({ id: card.id, body: { [field]: file } as unknown as VCardUpdatePayload }).unwrap()
      setAutosaveState('saved')
    } catch {
      setAutosaveState('error')
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">Card details</h2>
        <AutosaveStatus state={autosaveState} />
      </div>

      <div className="flex items-center gap-4">
        <label className="group relative cursor-pointer">
          <Avatar className="size-16">
            <AvatarImage src={card.profile_photo ?? undefined} alt={card.display_name} />
            <AvatarFallback>{card.display_name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Camera className="size-4 text-white" />
          </span>
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => void handlePhotoChange('profile_photo', e.target.files?.[0] ?? null)}
          />
        </label>
        <div className="flex-1">
          <p className="text-sm font-medium">Profile photo</p>
          <p className="text-xs text-muted-foreground">Click the avatar to change it.</p>
        </div>
      </div>

      <Field label="Display name" htmlFor="display_name">
        <Input id="display_name" {...register('display_name')} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Job title" htmlFor="job_title" optional>
          <Input id="job_title" {...register('job_title')} />
        </Field>
        <Field label="Company" htmlFor="company_name" optional>
          <Input id="company_name" {...register('company_name')} />
        </Field>
      </div>
      <Field label="Bio" htmlFor="bio" optional>
        <Textarea id="bio" rows={3} {...register('bio')} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Email" htmlFor="email" optional>
          <Input id="email" type="email" {...register('email')} />
        </Field>
        <Field label="Phone" htmlFor="phone" optional>
          <Input id="phone" type="tel" {...register('phone')} />
        </Field>
        <Field label="WhatsApp" htmlFor="whatsapp" optional>
          <Input id="whatsapp" type="tel" {...register('whatsapp')} />
        </Field>
        <Field label="Website" htmlFor="website" optional>
          <Input id="website" type="url" {...register('website')} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Location" htmlFor="location" optional>
          <Input id="location" {...register('location')} />
        </Field>
        <Field label="Industry" htmlFor="industry" optional>
          <Input id="industry" {...register('industry')} />
        </Field>
      </div>
      <Field label="Address" htmlFor="address" optional>
        <Input id="address" {...register('address')} />
      </Field>
    </div>
  )
}
