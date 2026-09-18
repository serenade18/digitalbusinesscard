import { QrCode, Smartphone, Wallet } from 'lucide-react'
import { cn } from 'cn'

const qrPattern = [
  1, 1, 1, 0, 1,
  1, 0, 1, 0, 0,
  1, 1, 1, 0, 1,
  0, 0, 1, 1, 0,
  1, 0, 0, 1, 1,
]

export function HowItWorksShowcase() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 sm:p-10">
        <div className="absolute -top-16 -left-16 size-56 rounded-full bg-brand/30 blur-3xl" />
        <div className="absolute -right-10 -bottom-20 size-56 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <div className="w-[150px] shrink-0 -rotate-6 sm:w-[168px]">
            <div className="aspect-9/19 rounded-[1.75rem] border-4 border-slate-800 bg-slate-950 p-2 shadow-2xl">
              <div className="mx-auto mb-2 h-3 w-12 rounded-full bg-slate-800" />
              <p className="px-1 text-[8px] font-medium text-slate-400">Wallet</p>
              <div className="mt-2 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 p-2.5 ring-1 ring-white/10">
                <p className="text-[6px] font-semibold tracking-wide text-brand">DBC · DIGITAL BUSINESS CARD</p>
                <p className="mt-1.5 text-[10px] font-semibold text-white">Sofia Marin</p>
                <div className="mt-1.5 space-y-0.5 text-[6px] text-white/60">
                  <p>+1 212 456 7890</p>
                  <p>sofia.marin@kalm.co</p>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-px rounded bg-white/90 p-1.5">
                  {qrPattern.map((filled, i) => (
                    <span key={i} className={cn('aspect-square rounded-[1px]', filled ? 'bg-slate-950' : 'bg-transparent')} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-xl font-semibold text-balance text-white sm:text-2xl">
              Nothing physical.
              <br />
              100% digital.
            </h3>
            <div className="mt-5 flex flex-col gap-2.5">
              <span className="inline-flex items-center gap-2.5 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white ring-1 ring-white/15">
                <Wallet className="size-4" /> Add to Apple Wallet
              </span>
              <span className="inline-flex items-center gap-2.5 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white ring-1 ring-white/15">
                <Wallet className="size-4" /> Add to Google Wallet
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-indigo-700 to-slate-900 p-8 sm:p-10">
        <div className="absolute -top-10 -right-10 size-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 size-40 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="relative flex min-h-[220px] flex-col items-center justify-center gap-5">
          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-white/15 text-lg font-semibold text-white ring-2 ring-white/30 backdrop-blur">
              JB
            </div>
            <Smartphone className="size-6 text-white/70" />
            <div className="flex size-16 items-center justify-center rounded-full bg-white/15 text-lg font-semibold text-white ring-2 ring-white/30 backdrop-blur">
              MR
            </div>
          </div>
          <p className="text-center text-sm font-medium text-balance text-white/90">
            Tap phones or scan a code — the connection is instant.
          </p>
        </div>

        <div className="animate-float absolute top-6 right-6 flex size-14 rotate-6 items-center justify-center rounded-2xl bg-white shadow-xl sm:size-16">
          <QrCode className="size-7 text-slate-900 sm:size-8" />
        </div>
      </div>
    </div>
  )
}
