import { PageHeader } from '@/components/layout/PageHeader'
import { VCardSelect } from '@/components/cards/VCardSelect'
import { EmptyState } from '@/components/common/EmptyState'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSelectedVCard } from '@/features/cards/useSelectedVCard'
import { AppointmentServicesPanel } from '@/features/appointments/AppointmentServicesPanel'
import { AvailabilityPanel } from '@/features/appointments/AvailabilityPanel'
import { BookingsPanel } from '@/features/appointments/BookingsPanel'

export function AppointmentsPage() {
  const { vcardId, setVCardId, cards, isLoading } = useSelectedVCard()

  return (
    <div>
      <PageHeader
        title="Appointments"
        description="Bookable services, your availability, and incoming bookings."
        actions={!isLoading && <VCardSelect cards={cards} value={vcardId} onChange={setVCardId} />}
      />

      {!isLoading && cards.length === 0 && (
        <EmptyState title="No cards yet" description="Create a card to start taking bookings." />
      )}

      {vcardId && (
        <Tabs defaultValue="bookings">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>
          <TabsContent value="bookings" className="mt-4">
            <BookingsPanel vcardId={vcardId} />
          </TabsContent>
          <TabsContent value="services" className="mt-4">
            <AppointmentServicesPanel vcardId={vcardId} />
          </TabsContent>
          <TabsContent value="availability" className="mt-4">
            <AvailabilityPanel vcardId={vcardId} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
