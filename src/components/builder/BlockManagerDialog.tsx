import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { blockTypeMeta } from '@/features/builder/blockTypes'
import { LinksEditor } from '@/components/builder/editors/LinksEditor'
import { ServicesEditor } from '@/components/builder/editors/ServicesEditor'
import { ProductsEditor } from '@/components/builder/editors/ProductsEditor'
import { TestimonialsEditor } from '@/components/builder/editors/TestimonialsEditor'
import { GalleryEditor } from '@/components/builder/editors/GalleryEditor'
import { ContentEditor } from '@/components/builder/editors/ContentEditor'
import type { ProfileBlock } from '@/types/blocks'

export function BlockManagerDialog({
  block,
  vcardId,
  open,
  onOpenChange,
}: {
  block: ProfileBlock | null
  vcardId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!block) return null
  const meta = blockTypeMeta[block.type]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{meta.label}</DialogTitle>
          <DialogDescription>{meta.description}</DialogDescription>
        </DialogHeader>

        {meta.editor === 'links' && <LinksEditor vcardId={vcardId} />}
        {meta.editor === 'services' && <ServicesEditor vcardId={vcardId} />}
        {meta.editor === 'products' && <ProductsEditor vcardId={vcardId} />}
        {meta.editor === 'testimonials' && <TestimonialsEditor vcardId={vcardId} />}
        {meta.editor === 'gallery' && <GalleryEditor vcardId={vcardId} />}
        {meta.editor === 'content' && <ContentEditor block={block} />}
      </DialogContent>
    </Dialog>
  )
}
