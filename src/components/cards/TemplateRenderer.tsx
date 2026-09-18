import type { CSSProperties, ReactNode } from 'react'
import { Calendar, Globe, Mail, MapPin, MessageCircle, Phone, Star } from 'lucide-react'
import type { GalleryItem, Product, ProfileBlock, ProfileLink, Service, Testimonial } from '@/types/blocks'
import type { ThemeConfig } from '@/types/templates'

export interface TemplateRendererData {
  display_name: string
  job_title: string
  company_name: string
  bio: string
  profile_photo: string | null
  cover_photo: string | null
  email: string
  phone: string
  whatsapp: string
  website: string
  theme_config: ThemeConfig
  blocks: ProfileBlock[]
  links: ProfileLink[]
  services: Service[]
  products: Product[]
  testimonials: Testimonial[]
  galleryItems: GalleryItem[]
}

const radiusClass: Record<ThemeConfig['borderRadius'], string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  full: 'rounded-3xl',
}

const buttonRadiusClass: Record<ThemeConfig['buttonStyle'], string> = {
  rounded: 'rounded-lg',
  pill: 'rounded-full',
  square: 'rounded-none',
}

/**
 * The shared public-page renderer (spec §7/§11): reads only template +
 * theme_config + block/item data as props, no builder-only state. Used for
 * the builder's live preview pane; should match the real Django-rendered
 * public page.
 */
export function TemplateRenderer({ data }: { data: TemplateRendererData }) {
  const theme = data.theme_config
  const cardRadius = radiusClass[theme.borderRadius] ?? radiusClass.lg
  const buttonRadius = buttonRadiusClass[theme.buttonStyle] ?? buttonRadiusClass.rounded

  const cardStyle: CSSProperties =
    theme.cardStyle === 'glass'
      ? { backgroundColor: `${theme.backgroundColor}CC`, backdropFilter: 'blur(12px)' }
      : theme.cardStyle === 'outline'
        ? { backgroundColor: 'transparent', border: `1px solid ${theme.secondaryColor}40` }
        : { backgroundColor: theme.backgroundColor }

  const buttonStyle: CSSProperties = { backgroundColor: theme.primaryColor, color: theme.backgroundColor }
  const outlineButtonStyle: CSSProperties = {
    borderColor: theme.primaryColor,
    color: theme.primaryColor,
    borderWidth: 1,
  }

  const visibleBlocks = [...data.blocks].filter((b) => b.is_visible).sort((a, b) => a.position - b.position)

  function renderBlock(block: ProfileBlock) {
    switch (block.type) {
      case 'social':
      case 'link': {
        const links = data.links.filter((l) => l.is_visible)
        if (links.length === 0) return null
        return (
          <Section key={block.id} title={block.title} theme={theme}>
            <div className="flex flex-wrap gap-2">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-3 py-1.5 text-xs font-medium ${buttonRadius}`}
                  style={outlineButtonStyle}
                >
                  {link.title}
                </a>
              ))}
            </div>
          </Section>
        )
      }
      case 'service': {
        const services = data.services.filter((s) => s.is_visible)
        if (services.length === 0) return null
        return (
          <Section key={block.id} title={block.title} theme={theme}>
            <div className="flex flex-col gap-2">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between rounded-lg p-2.5" style={{ backgroundColor: `${theme.secondaryColor}14` }}>
                  <span className="text-sm font-medium">{service.name}</span>
                  {service.price && (
                    <span className="text-xs" style={{ color: theme.secondaryColor }}>
                      {service.currency} {service.price}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )
      }
      case 'product': {
        const products = data.products.filter((p) => p.is_visible)
        if (products.length === 0) return null
        return (
          <Section key={block.id} title={block.title} theme={theme}>
            <div className="grid grid-cols-2 gap-2">
              {products.map((product) => (
                <div key={product.id} className={`overflow-hidden border p-2 text-left ${cardRadius}`} style={{ borderColor: `${theme.secondaryColor}30` }}>
                  {product.image && <img src={product.image} alt={product.name} className="mb-2 aspect-square w-full rounded object-cover" />}
                  <p className="text-xs font-medium">{product.name}</p>
                  {product.price && (
                    <p className="text-[11px]" style={{ color: theme.secondaryColor }}>
                      {product.currency} {product.price}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )
      }
      case 'gallery': {
        const items = data.galleryItems.filter((g) => g.is_visible)
        if (items.length === 0) return null
        return (
          <Section key={block.id} title={block.title} theme={theme}>
            <div className="grid grid-cols-3 gap-1.5">
              {items.map((item) => (
                <img key={item.id} src={item.image} alt={item.title} className={`aspect-square w-full object-cover ${cardRadius}`} />
              ))}
            </div>
          </Section>
        )
      }
      case 'testimonial': {
        const testimonials = data.testimonials.filter((t) => t.is_visible)
        if (testimonials.length === 0) return null
        return (
          <Section key={block.id} title={block.title} theme={theme}>
            <div className="flex flex-col gap-2">
              {testimonials.map((t) => (
                <div key={t.id} className="rounded-lg p-2.5 text-left" style={{ backgroundColor: `${theme.secondaryColor}14` }}>
                  <p className="text-xs italic">"{t.content}"</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[11px] font-medium">{t.customer_name}</span>
                    {t.rating && (
                      <span className="flex items-center gap-0.5 text-[10px] text-amber-500">
                        <Star className="size-2.5 fill-current" /> {t.rating}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )
      }
      case 'video': {
        const url = block.content.url as string | undefined
        if (!url) return null
        return (
          <Section key={block.id} title={block.title} theme={theme}>
            <div className="flex aspect-video items-center justify-center rounded-lg text-xs" style={{ backgroundColor: `${theme.secondaryColor}14`, color: theme.secondaryColor }}>
              Video: {url}
            </div>
          </Section>
        )
      }
      case 'location': {
        const mapUrl = block.content.map_url as string | undefined
        return (
          <Section key={block.id} title={block.title} theme={theme}>
            <a href={mapUrl || '#'} className="flex items-center gap-2 text-xs" style={{ color: theme.secondaryColor }}>
              <MapPin className="size-3.5" /> {mapUrl || 'No map link set'}
            </a>
          </Section>
        )
      }
      case 'contact': {
        const note = block.content.note as string | undefined
        if (!note) return null
        return (
          <Section key={block.id} title={block.title} theme={theme}>
            <p className="text-xs" style={{ color: theme.secondaryColor }}>{note}</p>
          </Section>
        )
      }
      case 'appointment':
        return (
          <Section key={block.id} title={block.title} theme={theme}>
            <button type="button" className={`w-full px-3 py-2 text-xs font-medium ${buttonRadius}`} style={buttonStyle}>
              <Calendar className="mr-1.5 inline size-3.5" /> Book an appointment
            </button>
          </Section>
        )
      case 'custom': {
        const body = block.content.body as string | undefined
        if (!body) return null
        return (
          <Section key={block.id} title={block.title} theme={theme}>
            <p className="text-xs whitespace-pre-wrap" style={{ color: theme.secondaryColor }}>{body}</p>
          </Section>
        )
      }
      default:
        return null
    }
  }

  return (
    <div className={`mx-auto flex w-full max-w-sm flex-col overflow-hidden shadow-sm ${cardRadius}`} style={cardStyle}>
      <div className="relative h-28 shrink-0" style={{ backgroundColor: `${theme.primaryColor}30` }}>
        {data.cover_photo && <img src={data.cover_photo} alt="" className="size-full object-cover" />}
      </div>

      <div className="flex flex-col items-center gap-3 px-5 pt-0 pb-6 text-center" style={{ color: theme.textColor }}>
        <div className="-mt-10 size-20 overflow-hidden rounded-full border-4" style={{ borderColor: theme.backgroundColor }}>
          {data.profile_photo ? (
            <img src={data.profile_photo} alt={data.display_name} className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center bg-muted text-lg font-semibold">
              {data.display_name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold">{data.display_name || 'Your name'}</h2>
          {data.job_title && <p className="text-sm" style={{ color: theme.secondaryColor }}>{data.job_title}</p>}
          {data.company_name && <p className="text-xs" style={{ color: theme.secondaryColor }}>{data.company_name}</p>}
        </div>

        <button type="button" className={`w-full px-4 py-2 text-sm font-medium ${buttonRadius}`} style={buttonStyle}>
          Save Contact
        </button>

        <div className="flex w-full gap-2">
          {data.whatsapp && (
            <a href={`https://wa.me/${data.whatsapp.replace(/\D/g, '')}`} className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium ${buttonRadius}`} style={outlineButtonStyle}>
              <MessageCircle className="size-3.5" /> WhatsApp
            </a>
          )}
          {data.email && (
            <a href={`mailto:${data.email}`} className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium ${buttonRadius}`} style={outlineButtonStyle}>
              <Mail className="size-3.5" /> Email
            </a>
          )}
          {data.phone && (
            <a href={`tel:${data.phone}`} className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium ${buttonRadius}`} style={outlineButtonStyle}>
              <Phone className="size-3.5" /> Call
            </a>
          )}
          {data.website && (
            <a href={data.website} target="_blank" rel="noreferrer" className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium ${buttonRadius}`} style={outlineButtonStyle}>
              <Globe className="size-3.5" /> Site
            </a>
          )}
        </div>

        {data.bio && (
          <p className="text-sm" style={{ color: theme.secondaryColor }}>
            {data.bio}
          </p>
        )}

        <div className="flex w-full flex-col gap-4">{visibleBlocks.map(renderBlock)}</div>
      </div>
    </div>
  )
}

function Section({ title, theme, children }: { title: string; theme: ThemeConfig; children: ReactNode }) {
  return (
    <div className="text-left">
      {title && (
        <h3 className="mb-2 text-xs font-semibold tracking-wide uppercase" style={{ color: theme.secondaryColor }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
