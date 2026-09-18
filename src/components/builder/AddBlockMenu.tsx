import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { addableBlockTypes } from '@/features/builder/blockTypes'
import type { ProfileBlockType } from '@/types/blocks'

export function AddBlockMenu({ onAdd }: { onAdd: (type: ProfileBlockType) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus /> Add block
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {addableBlockTypes.map((meta) => (
          <DropdownMenuItem key={meta.type} onClick={() => onAdd(meta.type)} className="items-start gap-2.5 py-2">
            <meta.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{meta.label}</span>
              <span className="text-xs text-muted-foreground">{meta.description}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
