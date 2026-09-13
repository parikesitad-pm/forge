import { apiClient } from '../http/apiClient'
import type { ObservationEntry } from '@/types/fragment.types'

export const sparksApi = {
  getByFragment: (fragmentId: number | string) =>
    apiClient.get<ObservationEntry[]>(`/api/v1/fragments/${fragmentId}/sparks`),

  pin: (observationId: number | string) =>
    apiClient.post<ObservationEntry>(`/api/v1/observations/${observationId}/spark`),

  unpin: (observationId: number | string) =>
    apiClient.delete<ObservationEntry>(`/api/v1/observations/${observationId}/spark`),
}
