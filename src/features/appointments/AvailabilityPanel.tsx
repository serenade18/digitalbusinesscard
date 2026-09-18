import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/forms/Field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EmptyState } from '@/components/common/EmptyState'
import {
  useCreateAvailabilityRuleMutation,
  useDeleteAvailabilityRuleMutation,
  useListAvailabilityRulesQuery,
} from '@/features/appointments/appointmentsApi'
import { WEEKDAYS } from '@/types/appointments'
import { extractErrorMessage } from '@/lib/errors'

interface FormValues {
  weekday: string
  start_time: string
  end_time: string
}

const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

export function AvailabilityPanel({ vcardId }: { vcardId: string }) {
  const { data: rules, isLoading } = useListAvailabilityRulesQuery(vcardId)
  const [createRule, { isLoading: isCreating }] = useCreateAvailabilityRuleMutation()
  const [deleteRule] = useDeleteAvailabilityRuleMutation()

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { weekday: '0', start_time: '09:00', end_time: '17:00' },
  })

  async function onAdd(values: FormValues) {
    try {
      await createRule({
        vcardId,
        body: { weekday: Number(values.weekday), start_time: values.start_time, end_time: values.end_time, timezone: defaultTimezone },
      }).unwrap()
      reset()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">Times are in {defaultTimezone}.</p>
      {isLoading && <Loader2 className="size-5 animate-spin text-muted-foreground" />}
      {!isLoading && rules?.length === 0 && <EmptyState title="No availability set" description="Add a weekly time range so people can book you." />}

      <div className="flex flex-col gap-2">
        {rules?.map((rule) => (
          <div key={rule.id} className="flex items-center gap-2 rounded-xl border border-border bg-background p-3">
            <p className="min-w-0 flex-1 text-sm">
              {WEEKDAYS.find((w) => w.value === rule.weekday)?.label} · {rule.start_time.slice(0, 5)}–{rule.end_time.slice(0, 5)}
            </p>
            <Button variant="ghost" size="icon-sm" onClick={() => void deleteRule(rule.id)}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onAdd)} className="flex flex-col gap-3 rounded-xl border border-dashed border-border p-4 sm:flex-row sm:items-end">
        <Field label="Day" htmlFor="weekday" className="w-36">
          <Controller
            control={control}
            name="weekday"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="weekday" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {WEEKDAYS.map((w) => (
                    <SelectItem key={w.value} value={String(w.value)}>
                      {w.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="Start" htmlFor="start_time" error={errors.start_time?.message}>
          <Input id="start_time" type="time" {...register('start_time', { required: true })} />
        </Field>
        <Field label="End" htmlFor="end_time" error={errors.end_time?.message}>
          <Input id="end_time" type="time" {...register('end_time', { required: true })} />
        </Field>
        <Button type="submit" disabled={isCreating}>
          {isCreating ? <Loader2 className="animate-spin" /> : <Plus />}
          Add
        </Button>
      </form>
    </div>
  )
}
