import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { MobileSidebar } from '@/components/layout/Sidebar'
import { OrgSwitcher } from '@/components/layout/OrgSwitcher'
import { NotificationsMenu } from '@/components/layout/NotificationsMenu'
import { UserMenu } from '@/components/layout/UserMenu'

export function Topbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileNavOpen(true)}>
          <Menu className="size-5" />
        </Button>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <MobileSidebar onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="hidden md:block">
        <OrgSwitcher />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <div className="md:hidden">
          <OrgSwitcher />
        </div>
        <NotificationsMenu />
        <UserMenu />
      </div>
    </header>
  )
}
