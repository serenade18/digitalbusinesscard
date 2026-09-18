import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2, Lock } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { AutosaveStatus } from '@/components/common/AutosaveStatus'
import type { AutosaveState } from '@/components/common/AutosaveStatus'
import { Field } from '@/components/forms/Field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { TemplateRenderer } from '@/components/cards/TemplateRenderer'
import { useGetCardQuery, useUpdateCardMutation } from '@/features/cards/cardsApi'
import {
  useListBlocksQuery,
  useListGalleryItemsQuery,
  useListLinksQuery,
  useListProductsQuery,
  useListServicesQuery,
  useListTestimonialsQuery,
} from '@/features/builder/builderApi'
import { useListTemplatesQuery } from '@/features/templates/templatesApi'
import { useGetSubscriptionQuery } from '@/features/billing/billingApi'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/types/templates'

const fonts = ['Inter', 'Manrope', 'Poppins', 'Roboto', 'Playfair Display', 'Space Grotesk']

export function CardThemePage() {
  const { cardId } = useParams<{ cardId: string }>()
  const { data: card, isLoading } = useGetCardQuery(cardId!)
  const { data: blocks } = useListBlocksQuery(cardId!)
  const { data: links } = useListLinksQuery(cardId!)
  const { data: services } = useListServicesQuery(cardId!)
  const { data: products } = useListProductsQuery(cardId!)
  const { data: testimonials } = useListTestimonialsQuery(cardId!)
  const { data: galleryItems } = useListGalleryItemsQuery(cardId!)
  const { data: templates } = useListTemplatesQuery()
  const { data: subscription } = useGetSubscriptionQuery(
    card ? { organizationId: card.organization } : undefined,
    { skip: !card },
  )
  const [updateCard] = useUpdateCardMutation()

  const [theme, setTheme] = useState<ThemeConfig | null>(null)
  const [state, setState] = useState<AutosaveState>('idle')

  useEffect(() => {
    if (card) setTheme(card.theme_config)
  }, [card])

  const debouncedSaveTheme = useDebouncedCallback(async (next: ThemeConfig) => {
    if (!card) return
    setState('saving')
    try {
      await updateCard({ id: card.id, body: { theme_config: next } }).unwrap()
      setState('saved')
    } catch {
      setState('error')
    }
  }, 500)

  function updateTheme<K extends keyof ThemeConfig>(key: K, value: ThemeConfig[K]) {
    if (!theme) return
    const next = { ...theme, [key]: value }
    setTheme(next)
    debouncedSaveTheme(next)
  }

  const hasPremiumAccess = Number(subscription?.plan.monthly_price ?? 0) > 0

  async function handleSelectTemplate(templateId: string, isPremium: boolean) {
    if (!card) return
    if (isPremium && !hasPremiumAccess) {
      toast.error('This template requires a paid plan.', {
        action: { label: 'View plans', onClick: () => window.location.assign('/app/billing') },
      })
      return
    }
    try {
      await updateCard({ id: card.id, body: { template: templateId } }).unwrap()
    } catch {
      toast.error('Could not select template.')
    }
  }

  if (isLoading || !card || !theme) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Theme & templates" description="Pick a layout and tune the look of your card." />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Templates</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {templates?.results.map((template) => {
                const locked = template.is_premium && !hasPremiumAccess
                const selected = template.id === card.template
                return (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => void handleSelectTemplate(template.id, template.is_premium)}
                    className={cn(
                      'group relative flex flex-col overflow-hidden rounded-xl border text-left transition-colors',
                      selected ? 'border-foreground' : 'border-border hover:border-foreground/40',
                    )}
                  >
                    <div className="flex aspect-[3/4] items-center justify-center bg-muted">
                      {template.preview_image ? (
                        <img src={template.preview_image} alt={template.name} className="size-full object-cover" />
                      ) : (
                        <span className="text-xs text-muted-foreground">No preview</span>
                      )}
                      {locked && (
                        <span className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                          <Lock className="size-5 text-muted-foreground" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-1 p-2">
                      <span className="truncate text-xs font-medium">{template.name}</span>
                      {template.is_premium && (
                        <Badge variant="secondary" className="shrink-0 text-[10px]">
                          Premium
                        </Badge>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-background p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-muted-foreground">Theme</h2>
              <AutosaveStatus state={state} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Primary color" htmlFor="primaryColor">
                <input
                  id="primaryColor"
                  type="color"
                  className="h-9 w-full cursor-pointer rounded-md border border-input"
                  value={theme.primaryColor}
                  onChange={(e) => updateTheme('primaryColor', e.target.value)}
                />
              </Field>
              <Field label="Secondary color" htmlFor="secondaryColor">
                <input
                  id="secondaryColor"
                  type="color"
                  className="h-9 w-full cursor-pointer rounded-md border border-input"
                  value={theme.secondaryColor}
                  onChange={(e) => updateTheme('secondaryColor', e.target.value)}
                />
              </Field>
              <Field label="Background color" htmlFor="backgroundColor">
                <input
                  id="backgroundColor"
                  type="color"
                  className="h-9 w-full cursor-pointer rounded-md border border-input"
                  value={theme.backgroundColor}
                  onChange={(e) => updateTheme('backgroundColor', e.target.value)}
                />
              </Field>
              <Field label="Text color" htmlFor="textColor">
                <input
                  id="textColor"
                  type="color"
                  className="h-9 w-full cursor-pointer rounded-md border border-input"
                  value={theme.textColor}
                  onChange={(e) => updateTheme('textColor', e.target.value)}
                />
              </Field>

              <Field label="Font" htmlFor="fontFamily">
                <Select value={theme.fontFamily} onValueChange={(v) => updateTheme('fontFamily', v)}>
                  <SelectTrigger id="fontFamily" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Border radius" htmlFor="borderRadius">
                <Select
                  value={theme.borderRadius}
                  onValueChange={(v) => updateTheme('borderRadius', v as ThemeConfig['borderRadius'])}
                >
                  <SelectTrigger id="borderRadius" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(['none', 'sm', 'md', 'lg', 'xl', 'full'] as const).map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Button style" htmlFor="buttonStyle">
                <Select
                  value={theme.buttonStyle}
                  onValueChange={(v) => updateTheme('buttonStyle', v as ThemeConfig['buttonStyle'])}
                >
                  <SelectTrigger id="buttonStyle" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(['rounded', 'pill', 'square'] as const).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Card style" htmlFor="cardStyle">
                <Select value={theme.cardStyle} onValueChange={(v) => updateTheme('cardStyle', v as ThemeConfig['cardStyle'])}>
                  <SelectTrigger id="cardStyle" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(['glass', 'solid', 'outline'] as const).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </section>
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <p className="mb-3 text-center text-xs font-medium text-muted-foreground">Live preview</p>
          <div className="rounded-2xl border border-border bg-muted/30 p-4">
            <TemplateRenderer
              data={{
                display_name: card.display_name,
                job_title: card.job_title,
                company_name: card.company_name,
                bio: card.bio,
                profile_photo: card.profile_photo,
                cover_photo: card.cover_photo,
                email: card.email,
                phone: card.phone,
                whatsapp: card.whatsapp,
                website: card.website,
                theme_config: theme,
                blocks: blocks ?? [],
                links: links ?? [],
                services: services ?? [],
                products: products ?? [],
                testimonials: testimonials ?? [],
                galleryItems: galleryItems ?? [],
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
