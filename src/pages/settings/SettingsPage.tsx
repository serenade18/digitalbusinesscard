import { PageHeader } from '@/components/layout/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProfileSettingsPanel } from '@/pages/settings/ProfileSettingsPanel'
import { OrganizationSettingsPanel } from '@/pages/settings/OrganizationSettingsPanel'
import { NotificationsSettingsPanel } from '@/pages/settings/NotificationsSettingsPanel'
import { CustomDomainPanel } from '@/pages/settings/CustomDomainPanel'

export function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" />

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="domain">Custom domain</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-4">
          <ProfileSettingsPanel />
        </TabsContent>
        <TabsContent value="organization" className="mt-4">
          <OrganizationSettingsPanel />
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <NotificationsSettingsPanel />
        </TabsContent>
        <TabsContent value="domain" className="mt-4">
          <CustomDomainPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
