import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Field } from '@/components/forms/Field'
import { formatMoney } from '@/lib/format'
import {
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useListServicesQuery,
  useUpdateServiceMutation,
} from '@/features/builder/builderApi'
import { extractErrorMessage } from '@/lib/errors'

interface FormValues {
  name: string
  description: string
  price: string
  currency: string
  booking_enabled: boolean
}

const empty: FormValues = { name: '', description: '', price: '', currency: 'USD', booking_enabled: false }

export function ServicesEditor({ vcardId }: { vcardId: string }) {
  const { data: services, isLoading } = useListServicesQuery(vcardId)
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation()
  const [updateService] = useUpdateServiceMutation()
  const [deleteService] = useDeleteServiceMutation()

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormValues>({ defaultValues: empty })

  async function onAdd(values: FormValues) {
    try {
      await createService({
        vcardId,
        body: { ...values, price: values.price || undefined, position: services?.length ?? 0, is_visible: true },
      }).unwrap()
      reset(empty)
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  async function toggleVisible(id: string, is_visible: boolean) {
    try {
      await updateService({ id, body: { is_visible: !is_visible } }).unwrap()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}

      <div className="flex flex-col gap-2">
        {services?.map((service) => (
          <div key={service.id} className="flex items-center gap-2 rounded-lg border border-border p-2.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{service.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {service.price ? formatMoney(service.price, service.currency) : 'No price'}
                {service.booking_enabled && ' · Bookable'}
              </p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => void toggleVisible(service.id, service.is_visible)}>
              {service.is_visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => void deleteService(service.id)}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onAdd)} className="flex flex-col gap-3 rounded-lg border border-dashed border-border p-3">
        <p className="text-xs font-medium text-muted-foreground">Add a service</p>
        <Field label="Name" htmlFor="service-name" error={errors.name?.message}>
          <Input id="service-name" {...register('name', { required: 'Required' })} />
        </Field>
        <Field label="Description" htmlFor="service-description" optional>
          <Input id="service-description" {...register('description')} />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Price" htmlFor="service-price" optional>
            <Input id="service-price" type="number" step="0.01" {...register('price')} />
          </Field>
          <Field label="Currency" htmlFor="service-currency">
            <Input id="service-currency" {...register('currency')} />
          </Field>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Controller
            control={control}
            name="booking_enabled"
            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
          />
          Allow booking for this service
        </label>
        <Button type="submit" size="sm" disabled={isCreating} className="self-start">
          {isCreating ? <Loader2 className="animate-spin" /> : <Plus />}
          Add service
        </Button>
      </form>
    </div>
  )
}
