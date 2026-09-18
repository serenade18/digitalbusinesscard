import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field } from '@/components/forms/Field'
import { formatMoney } from '@/lib/format'
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useListProductsQuery,
  useUpdateProductMutation,
} from '@/features/builder/builderApi'
import { extractErrorMessage } from '@/lib/errors'

interface FormValues {
  name: string
  description: string
  price: string
  currency: string
  external_url: string
}

const empty: FormValues = { name: '', description: '', price: '', currency: 'USD', external_url: '' }

export function ProductsEditor({ vcardId }: { vcardId: string }) {
  const { data: products, isLoading } = useListProductsQuery(vcardId)
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation()
  const [updateProduct] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ defaultValues: empty })

  async function onAdd(values: FormValues) {
    try {
      await createProduct({
        vcardId,
        body: { ...values, price: values.price || undefined, position: products?.length ?? 0, is_visible: true },
      }).unwrap()
      reset(empty)
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  async function toggleVisible(id: string, is_visible: boolean) {
    try {
      await updateProduct({ id, body: { is_visible: !is_visible } }).unwrap()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}

      <div className="flex flex-col gap-2">
        {products?.map((product) => (
          <div key={product.id} className="flex items-center gap-2 rounded-lg border border-border p-2.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {product.price ? formatMoney(product.price, product.currency) : 'No price'}
              </p>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => void toggleVisible(product.id, product.is_visible)}>
              {product.is_visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => void deleteProduct(product.id)}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onAdd)} className="flex flex-col gap-3 rounded-lg border border-dashed border-border p-3">
        <p className="text-xs font-medium text-muted-foreground">Add a product</p>
        <Field label="Name" htmlFor="product-name" error={errors.name?.message}>
          <Input id="product-name" {...register('name', { required: 'Required' })} />
        </Field>
        <Field label="Description" htmlFor="product-description" optional>
          <Input id="product-description" {...register('description')} />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Price" htmlFor="product-price" optional>
            <Input id="product-price" type="number" step="0.01" {...register('price')} />
          </Field>
          <Field label="Currency" htmlFor="product-currency">
            <Input id="product-currency" {...register('currency')} />
          </Field>
        </div>
        <Field label="Buy link" htmlFor="product-url" optional>
          <Input id="product-url" type="url" placeholder="https://" {...register('external_url')} />
        </Field>
        <Button type="submit" size="sm" disabled={isCreating} className="self-start">
          {isCreating ? <Loader2 className="animate-spin" /> : <Plus />}
          Add product
        </Button>
      </form>
    </div>
  )
}
