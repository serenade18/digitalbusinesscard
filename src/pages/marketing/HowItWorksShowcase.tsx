import reimagined1 from '@/assets/reimagined1.webp'
import reimagined2 from '@/assets/reimagined2.webp'

export function HowItWorksShowcase() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="relative h-64 overflow-hidden rounded-3xl sm:h-80 md:h-96">
        <img
          src={reimagined1}
          alt="A digital business card added to Apple Wallet, held up on a phone in front of a city backdrop"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-brand/40 mix-blend-multiply" />
      </div>
      <div className="relative h-64 overflow-hidden rounded-3xl sm:h-80 md:h-96">
        <img
          src={reimagined2}
          alt="Two people sharing a digital business card via QR code on a phone"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-brand/40 mix-blend-multiply" />
      </div>
    </div>
  )
}
