import { useState } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { LayoutGrid, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { SortableBlockRow } from '@/components/builder/SortableBlockRow'
import { AddBlockMenu } from '@/components/builder/AddBlockMenu'
import { BlockManagerDialog } from '@/components/builder/BlockManagerDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { blockTypeMeta } from '@/features/builder/blockTypes'
import {
  useCreateBlockMutation,
  useDeleteBlockMutation,
  useListBlocksQuery,
  useReorderBlocksMutation,
  useUpdateBlockMutation,
} from '@/features/builder/builderApi'
import { extractErrorMessage } from '@/lib/errors'
import type { ProfileBlock, ProfileBlockType } from '@/types/blocks'

export function BlockList({ vcardId }: { vcardId: string }) {
  const { data: blocks, isLoading } = useListBlocksQuery(vcardId)
  const [createBlock] = useCreateBlockMutation()
  const [updateBlock] = useUpdateBlockMutation()
  const [deleteBlock] = useDeleteBlockMutation()
  const [reorderBlocks] = useReorderBlocksMutation()
  const [managingBlock, setManagingBlock] = useState<ProfileBlock | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const sorted = [...(blocks ?? [])].sort((a, b) => a.position - b.position)

  async function handleAdd(type: ProfileBlockType) {
    try {
      await createBlock({
        vcardId,
        body: { type, title: blockTypeMeta[type].label, position: sorted.length, is_visible: true },
      }).unwrap()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  async function handleDuplicate(block: ProfileBlock) {
    try {
      await createBlock({
        vcardId,
        body: { type: block.type, title: block.title, content: block.content, position: sorted.length, is_visible: block.is_visible },
      }).unwrap()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  async function handleDelete(block: ProfileBlock) {
    try {
      await deleteBlock(block.id).unwrap()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  async function handleToggleVisible(block: ProfileBlock) {
    try {
      await updateBlock({ id: block.id, body: { is_visible: !block.is_visible } }).unwrap()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = sorted.findIndex((b) => b.id === active.id)
    const newIndex = sorted.findIndex((b) => b.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const next = [...sorted]
    const [moved] = next.splice(oldIndex, 1)
    next.splice(newIndex, 0, moved)

    try {
      await reorderBlocks({ vcardId, order: next.map((b) => b.id) }).unwrap()
    } catch (error) {
      toast.error(extractErrorMessage(error))
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">Page sections</h2>
        <AddBlockMenu onAdd={handleAdd} />
      </div>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && sorted.length === 0 && (
        <EmptyState
          icon={LayoutGrid}
          title="No sections yet"
          description="Add a section to start building your card's public page."
        />
      )}

      {sorted.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => void handleDragEnd(e)}>
          <SortableContext items={sorted.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {sorted.map((block) => (
                <SortableBlockRow
                  key={block.id}
                  block={block}
                  onToggleVisible={() => void handleToggleVisible(block)}
                  onDuplicate={() => void handleDuplicate(block)}
                  onDelete={() => void handleDelete(block)}
                  onManage={() => setManagingBlock(block)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <BlockManagerDialog
        block={managingBlock}
        vcardId={vcardId}
        open={!!managingBlock}
        onOpenChange={(open) => !open && setManagingBlock(null)}
      />
    </div>
  )
}
