import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff, ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  useCreateGalleryItemMutation,
  useDeleteGalleryItemMutation,
  useListGalleryItemsQuery,
  useUpdateGalleryItemMutation,
} from '@/features/builder/builderApi'
import { extractErrorMessage } from '@/lib/errors'

export function GalleryEditor({ vcardId }: { vcardId: string }) {
  const { data: items, isLoading } = useListGalleryItemsQuery(vcardId)
  const [createGalleryItem, { isLoading: isCreating }] = useCreateGalleryItemMutation()
  const [updateGalleryItem] = useUpdateGalleryItemMutation()
  const [deleteGalleryItem] = useDeleteGalleryItemMutation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setError(null)
    try {
      for (const file of Array.from(files)) {
        await createGalleryItem({
          vcardId,
          body: { image: file, position: items?.length ?? 0, is_visible: true },
        }).unwrap()
      }
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function toggleVisible(id: string, is_visible: boolean) {
    try {
      await updateGalleryItem({ id, body: { is_visible: !is_visible } }).unwrap()
    } catch (err) {
      toast.error(extractErrorMessage(err))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}

      <div className="grid grid-cols-3 gap-2">
        {items?.map((item) => (
          <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
            <img src={item.image} alt={item.title || 'Gallery item'} className="size-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="secondary"
                size="icon-sm"
                onClick={() => void toggleVisible(item.id, item.is_visible)}
              >
                {item.is_visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
              </Button>
              <Button variant="secondary" size="icon-sm" onClick={() => void deleteGalleryItem(item.id)}>
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isCreating}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground"
        >
          {isCreating ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
          <span className="text-xs">Add photo</span>
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => void handleFiles(e.target.files)}
      />
    </div>
  )
}
