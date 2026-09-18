import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Plus, Star, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field } from '@/components/forms/Field'
import {
  useCreateTestimonialMutation,
  useDeleteTestimonialMutation,
  useListTestimonialsQuery,
  useUpdateTestimonialMutation,
} from '@/features/builder/builderApi'
import { extractErrorMessage } from '@/lib/errors'

interface FormValues {
  customer_name: string
  customer_title: string
  content: string
  rating: string
}

const empty: FormValues = { customer_name: '', customer_title: '', content: '', rating: '5' }

export function TestimonialsEditor({ vcardId }: { vcardId: string }) {
  const { data: testimonials, isLoading } = useListTestimonialsQuery(vcardId)
  const [createTestimonial, { isLoading: isCreating }] = useCreateTestimonialMutation()
  const [updateTestimonial] = useUpdateTestimonialMutation()
  const [deleteTestimonial] = useDeleteTestimonialMutation()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ defaultValues: empty })

  async function onAdd(values: FormValues) {
    try {
      await createTestimonial({
        vcardId,
        body: {
          ...values,
          rating: values.rating ? Number(values.rating) : undefined,
          position: testimonials?.length ?? 0,
          is_visible: true,
        },
      }).unwrap()
      reset(empty)
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  async function toggleVisible(id: string, is_visible: boolean) {
    try {
      await updateTestimonial({ id, body: { is_visible: !is_visible } }).unwrap()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}

      <div className="flex flex-col gap-2">
        {testimonials?.map((testimonial) => (
          <div key={testimonial.id} className="flex items-start gap-2 rounded-lg border border-border p-2.5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-medium">{testimonial.customer_name}</p>
                {testimonial.rating && (
                  <span className="flex items-center gap-0.5 text-xs text-amber-500">
                    <Star className="size-3 fill-current" /> {testimonial.rating}
                  </span>
                )}
              </div>
              <p className="line-clamp-2 text-xs text-muted-foreground">{testimonial.content}</p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => void toggleVisible(testimonial.id, testimonial.is_visible)}
            >
              {testimonial.is_visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => void deleteTestimonial(testimonial.id)}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onAdd)} className="flex flex-col gap-3 rounded-lg border border-dashed border-border p-3">
        <p className="text-xs font-medium text-muted-foreground">Add a testimonial</p>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Customer name" htmlFor="t-name" error={errors.customer_name?.message}>
            <Input id="t-name" {...register('customer_name', { required: 'Required' })} />
          </Field>
          <Field label="Title" htmlFor="t-title" optional>
            <Input id="t-title" {...register('customer_title')} />
          </Field>
        </div>
        <Field label="Quote" htmlFor="t-content" error={errors.content?.message}>
          <Textarea id="t-content" rows={2} {...register('content', { required: 'Required' })} />
        </Field>
        <Field label="Rating (1–5)" htmlFor="t-rating" optional>
          <Input id="t-rating" type="number" min={1} max={5} {...register('rating')} />
        </Field>
        <Button type="submit" size="sm" disabled={isCreating} className="self-start">
          {isCreating ? <Loader2 className="animate-spin" /> : <Plus />}
          Add testimonial
        </Button>
      </form>
    </div>
  )
}
