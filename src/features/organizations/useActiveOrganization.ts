import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { activeOrganizationChanged } from '@/features/organizations/activeOrgSlice'
import { useListOrganizationsQuery } from '@/features/organizations/organizationsApi'

export function useActiveOrganization() {
  const dispatch = useAppDispatch()
  const organizationId = useAppSelector((state) => state.activeOrg.organizationId)
  const { data, isLoading } = useListOrganizationsQuery()

  const organizations = data?.results ?? []
  const organization = organizations.find((org) => org.id === organizationId) ?? null

  function setOrganizationId(id: string | null) {
    dispatch(activeOrganizationChanged(id))
  }

  return { organizationId, organization, organizations, isLoading, setOrganizationId }
}
