import reimagined1 from '@/assets/reimagined1.webp'
import reimagined2 from '@/assets/reimagined2.webp'

export function HowItWorksShowcase() {
  return (
    <div className="grid items-center gap-6 md:grid-cols-2">
      <img
        src={reimagined1}
        alt="A digital business card added to Apple Wallet, held up on a phone in front of a city backdrop"
        className="w-full grayscale"
      />
      <img
        src={reimagined2}
        alt="Two people sharing a digital business card via QR code on a phone"
        className="w-full grayscale"
      />
    </div>
  )
}
