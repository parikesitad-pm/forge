import { apiClient } from '../http/apiClient'
import type { CreateFragmentPayload, FragmentDetail, FragmentSummary } from '@/types/fragment.types'

export const fragmentsApi = {
  getAll: () => apiClient.get<FragmentSummary[]>('/api/v1/fragments'),

  getById: (id: number | string) =>
    apiClient.get<FragmentDetail>(`/api/v1/fragments/${id}`),

  create: (payload: CreateFragmentPayload) =>
    apiClient.post<FragmentDetail>('/api/v1/fragments', { fragment: payload }),

  delete: (id: number | string) =>
    apiClient.delete<{ id: number }>(`/api/v1/fragments/${id}`),
}
