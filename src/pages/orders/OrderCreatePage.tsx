import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Field } from '@/components/forms/Field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { formatMoney, titleCase } from '@/lib/format'
import { useListPhysicalCardProductsQuery, useCreateOrderMutation } from '@/features/orders/ordersApi'
import { useListCardsQuery } from '@/features/cards/cardsApi'
import { extractErrorMessage } from '@/lib/errors'

const schema = z.object({
  product_id: z.string().min(1, 'Pick a card'),
  quantity: z.coerce.number().min(1),
  vcard_id: z.string().optional(),
  provider: z.enum(['stripe', 'mpesa', 'sasapay']),
  full_name: z.string().min(1, 'Required'),
  phone: z.string().min(1, 'Required'),
  address_line_1: z.string().min(1, 'Required'),
  address_line_2: z.string().optional(),
  city: z.string().min(1, 'Required'),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().min(1, 'Required'),
})

type FormValues = z.infer<typeof schema>

export function OrderCreatePage() {
  const navigate = useNavigate()
  const { data: products, isLoading: isLoadingProducts } = useListPhysicalCardProductsQuery()
  const { data: cardsData } = useListCardsQuery()
  const [createOrder, { isLoading }] = useCreateOrderMutation()
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { quantity: 1, provider: 'stripe' } })

  const cards = cardsData?.results ?? []

  async function onSubmit(values: FormValues) {
    try {
      const result = await createOrder({
        items: [{ product_id: values.product_id, quantity: values.quantity, vcard_id: values.vcard_id || null }],
        shipping_address: {
          full_name: values.full_name,
          company: '',
          phone: values.phone,
          address_line_1: values.address_line_1,
          address_line_2: values.address_line_2 ?? '',
          city: values.city,
          state: values.state ?? '',
          postal_code: values.postal_code ?? '',
          country: values.country,
        },
        provider: values.provider,
      }).unwrap()

      if (result.redirect_url) {
        window.location.assign(result.redirect_url)
        return
      }
      toast.success('Order placed.')
      navigate('/app/orders', { replace: true })
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Order a physical card" description="An NFC card that taps your digital card open." />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <section className="rounded-2xl border border-border bg-background p-6">
          <h2 className="mb-4 text-sm font-semibold text-muted-foreground">Choose a card</h2>
          {isLoadingProducts && <Loader2 className="size-5 animate-spin text-muted-foreground" />}
          <div className="grid gap-3 sm:grid-cols-3">
            {products?.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => {
                  setSelectedProductId(product.id)
                  setValue('product_id', product.id)
                }}
                className={cn(
                  'flex flex-col gap-1 rounded-xl border p-3 text-left transition-colors',
                  selectedProductId === product.id ? 'border-foreground' : 'border-border hover:border-foreground/40',
                )}
              >
                <span className="text-sm font-medium">{titleCase(product.material)}</span>
                <span className="text-xs text-muted-foreground">{product.description}</span>
                <span className="mt-1 text-sm font-semibold">{formatMoney(product.price, product.currency)}</span>
              </button>
            ))}
          </div>
          {errors.product_id && <p className="mt-2 text-xs text-destructive">{errors.product_id.message}</p>}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Field label="Quantity" htmlFor="quantity">
              <Input id="quantity" type="number" min={1} {...register('quantity')} />
            </Field>
            <Field label="Link to a card" htmlFor="vcard_id" optional>
              <Controller
                control={control}
                name="vcard_id"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="vcard_id" className="w-full">
                      <SelectValue placeholder="Choose later" />
                    </SelectTrigger>
                    <SelectContent>
                      {cards.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.display_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-background p-6">
          <h2 className="mb-4 text-sm font-semibold text-muted-foreground">Shipping address</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name" htmlFor="full_name" error={errors.full_name?.message}>
              <Input id="full_name" {...register('full_name')} />
            </Field>
            <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
              <Input id="phone" {...register('phone')} />
            </Field>
            <Field label="Address line 1" htmlFor="address_line_1" error={errors.address_line_1?.message} className="sm:col-span-2">
              <Input id="address_line_1" {...register('address_line_1')} />
            </Field>
            <Field label="Address line 2" htmlFor="address_line_2" optional className="sm:col-span-2">
              <Input id="address_line_2" {...register('address_line_2')} />
            </Field>
            <Field label="City" htmlFor="city" error={errors.city?.message}>
              <Input id="city" {...register('city')} />
            </Field>
            <Field label="State / region" htmlFor="state" optional>
              <Input id="state" {...register('state')} />
            </Field>
            <Field label="Postal code" htmlFor="postal_code" optional>
              <Input id="postal_code" {...register('postal_code')} />
            </Field>
            <Field label="Country" htmlFor="country" error={errors.country?.message}>
              <Input id="country" {...register('country')} />
            </Field>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-background p-6">
          <h2 className="mb-4 text-sm font-semibold text-muted-foreground">Payment method</h2>
          <Controller
            control={control}
            name="provider"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Card (Stripe)</SelectItem>
                  <SelectItem value="mpesa">M-Pesa</SelectItem>
                  <SelectItem value="sasapay">SasaPay</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </section>

        <Button type="submit" size="lg" disabled={isLoading}>
          {isLoading && <Loader2 className="animate-spin" />}
          Place order
        </Button>
      </form>
    </div>
  )
}
