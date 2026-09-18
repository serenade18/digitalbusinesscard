import { Link } from 'react-router-dom'
import { Logo } from '@/components/layout/Logo'

const columns = [
  {
    heading: 'General',
    links: [
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'About', to: '/about' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', to: '/faq' },
      { label: 'Terms', to: '/faq' },
    ],
  },
  {
    heading: 'Contact',
    links: [
      { label: 'Contact us', to: '/contact' },
      { label: 'Support', to: '/contact' },
    ],
  },
]

export function MarketingFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-14 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:px-8">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            One link for your whole professional identity — share it, tap it, scan it.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.heading} className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold">{col.heading}</h4>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground md:px-8">
        © {new Date().getFullYear()} DBC. All rights reserved.
      </div>
    </footer>
  )
}
