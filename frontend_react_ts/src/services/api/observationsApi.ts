import { apiClient } from '../http/apiClient'
import type { CreateThoughtPayload, ObservationEntry } from '@/types/fragment.types'
import type { ObserveFragmentResponse } from '@/types/owl.types'

export const observationsApi = {
  createEntry: (fragmentId: number | string, payload: CreateThoughtPayload) =>
    apiClient.post<ObservationEntry>(`/api/v1/fragments/${fragmentId}/entries`, { entry: payload }),

  observe: (fragmentId: number | string) =>
    apiClient.post<ObserveFragmentResponse>(`/api/v1/fragments/${fragmentId}/owl/observe`),
}
