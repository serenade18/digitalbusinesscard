import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const STORAGE_KEY = 'dbc.activeOrganizationId'

function readStored(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

interface ActiveOrgState {
  /** null = "Personal" (no organization) */
  organizationId: string | null
}

const initialState: ActiveOrgState = {
  organizationId: readStored(),
}

const activeOrgSlice = createSlice({
  name: 'activeOrg',
  initialState,
  reducers: {
    activeOrganizationChanged(state, action: PayloadAction<string | null>) {
      state.organizationId = action.payload
      try {
        if (action.payload) localStorage.setItem(STORAGE_KEY, action.payload)
        else localStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
    },
  },
})

export const { activeOrganizationChanged } = activeOrgSlice.actions
export default activeOrgSlice.reducer
