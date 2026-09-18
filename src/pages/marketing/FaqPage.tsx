import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const categories = [
  {
    name: 'Getting started',
    items: [
      {
        q: 'How do I create my first card?',
        a: 'After signing up, go to Cards → Create card, fill in your details, and pick a template. You can publish it as soon as you\'re happy with the preview.',
      },
      {
        q: 'Do I need a credit card to try it?',
        a: 'No — you can create and preview a card on the free plan before deciding whether to upgrade.',
      },
    ],
  },
  {
    name: 'Customization',
    items: [
      {
        q: 'Can I change colors and fonts?',
        a: 'Yes, the theme editor lets you set primary/secondary colors, fonts, button style, and corner radius — changes preview live.',
      },
      {
        q: 'What are premium templates?',
        a: 'Some templates require a paid plan. You can preview them from the gallery, but publishing with one requires an upgrade.',
      },
    ],
  },
  {
    name: 'Sharing',
    items: [
      {
        q: 'How do people view my card?',
        a: 'Your card has a canonical link (yourdomain.com/@your-slug) plus a downloadable QR code you can print or share.',
      },
      {
        q: 'Can I get a physical card?',
        a: 'Yes — order an NFC card from the Orders section and link it to any of your digital cards once it arrives.',
      },
    ],
  },
]

export function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-8 md:py-24">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">Frequently asked questions</h1>
      </div>

      <div className="mt-14 flex flex-col gap-10">
        {categories.map((category) => (
          <div key={category.name}>
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              {category.name}
            </h2>
            <Accordion type="single" collapsible>
              {category.items.map((item, index) => (
                <AccordionItem key={item.q} value={`${category.name}-${index}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  )
}
