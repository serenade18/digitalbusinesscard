import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Copy, Eye, EyeOff, GripVertical, Settings2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { blockTypeMeta } from '@/features/builder/blockTypes'
import type { ProfileBlock } from '@/types/blocks'

export function SortableBlockRow({
  block,
  onToggleVisible,
  onDuplicate,
  onDelete,
  onManage,
}: {
  block: ProfileBlock
  onToggleVisible: () => void
  onDuplicate: () => void
  onDelete: () => void
  onManage: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })
  const meta = blockTypeMeta[block.type]

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 rounded-xl border border-border bg-background p-3',
        isDragging && 'opacity-60',
        !block.is_visible && 'opacity-60',
      )}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <meta.icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{block.title || meta.label}</p>
        <p className="truncate text-xs text-muted-foreground">{meta.label}</p>
      </div>
      <div className="flex items-center gap-0.5">
        {meta.editor !== 'none' && (
          <Button variant="ghost" size="icon-sm" onClick={onManage} title="Manage content">
            <Settings2 className="size-3.5" />
          </Button>
        )}
        <Button variant="ghost" size="icon-sm" onClick={onToggleVisible} title={block.is_visible ? 'Hide' : 'Show'}>
          {block.is_visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onDuplicate} title="Duplicate">
          <Copy className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onDelete} title="Remove">
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}
