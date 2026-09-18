import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/forms/Field'
import { EmptyState } from '@/components/common/EmptyState'
import {
  useCreateAppointmentServiceMutation,
  useDeleteAppointmentServiceMutation,
  useListAppointmentServicesQuery,
} from '@/features/appointments/appointmentsApi'
import { formatMoney } from '@/lib/format'
import { extractErrorMessage } from '@/lib/errors'

interface FormValues {
  name: string
  duration_minutes: string
  price: string
  currency: string
}

const empty: FormValues = { name: '', duration_minutes: '30', price: '', currency: 'USD' }

export function AppointmentServicesPanel({ vcardId }: { vcardId: string }) {
  const { data: services, isLoading } = useListAppointmentServicesQuery(vcardId)
  const [createService, { isLoading: isCreating }] = useCreateAppointmentServiceMutation()
  const [deleteService] = useDeleteAppointmentServiceMutation()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ defaultValues: empty })

  async function onAdd(values: FormValues) {
    try {
      await createService({
        vcardId,
        body: { ...values, duration_minutes: Number(values.duration_minutes), price: values.price || undefined },
      }).unwrap()
      reset(empty)
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <Loader2 className="size-5 animate-spin text-muted-foreground" />}
      {!isLoading && services?.length === 0 && <EmptyState title="No bookable services yet" />}

      <div className="flex flex-col gap-2">
        {services?.map((service) => (
          <div key={service.id} className="flex items-center gap-2 rounded-xl border border-border bg-background p-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{service.name}</p>
              <p className="text-xs text-muted-foreground">
                {service.duration_minutes} min
                {service.price && ` · ${formatMoney(service.price, service.currency)}`}
              </p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => void deleteService(service.id)}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onAdd)} className="flex flex-col gap-3 rounded-xl border border-dashed border-border p-4 sm:flex-row sm:items-end">
        <Field label="Service name" htmlFor="svc-name" error={errors.name?.message} className="flex-1">
          <Input id="svc-name" {...register('name', { required: 'Required' })} />
        </Field>
        <Field label="Duration (min)" htmlFor="svc-duration" className="w-28">
          <Input id="svc-duration" type="number" {...register('duration_minutes')} />
        </Field>
        <Field label="Price" htmlFor="svc-price" optional className="w-28">
          <Input id="svc-price" type="number" step="0.01" {...register('price')} />
        </Field>
        <Button type="submit" disabled={isCreating}>
          {isCreating ? <Loader2 className="animate-spin" /> : <Plus />}
          Add
        </Button>
      </form>
    </div>
  )
}
