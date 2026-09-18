import { Building2, Check, ChevronsUpDown, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useActiveOrganization } from '@/features/organizations/useActiveOrganization'
import { cn } from '@/lib/utils'

export function OrgSwitcher() {
  const { organizationId, organization, organizations, setOrganizationId } = useActiveOrganization()

  const label = organizationId ? (organization?.name ?? 'Loading…') : 'Personal'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="max-w-44 justify-between">
          <span className="flex min-w-0 items-center gap-1.5">
            {organizationId ? <Building2 className="size-3.5 shrink-0" /> : <User className="size-3.5 shrink-0" />}
            <span className="truncate">{label}</span>
          </span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem onClick={() => setOrganizationId(null)}>
          <User /> Personal
          {!organizationId && <Check className="ml-auto size-3.5" />}
        </DropdownMenuItem>
        {organizations.length > 0 && <DropdownMenuSeparator />}
        {organizations.map((org) => (
          <DropdownMenuItem key={org.id} onClick={() => setOrganizationId(org.id)}>
            <Building2 />
            <span className={cn('truncate')}>{org.name}</span>
            {organizationId === org.id && <Check className="ml-auto size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
