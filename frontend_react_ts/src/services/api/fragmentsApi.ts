import { apiClient } from '../http/apiClient'
import type {
  CreateFragmentPayload,
  FragmentDetail,
  FragmentSummary,
  SharedFragmentDetail,
} from '@/types/fragment.types'

export const fragmentsApi = {
  // Lists active fragments (excludes archived)
  getAll: () => apiClient.get<FragmentSummary[]>('/api/v1/fragments'),

  // Lists exclusively archived fragments
  getArchived: () => apiClient.get<FragmentSummary[]>('/api/v1/fragments/archived'),

  getById: (id: number | string) =>
    apiClient.get<FragmentDetail>(`/api/v1/fragments/${id}`),

  create: (payload: CreateFragmentPayload) =>
    apiClient.post<FragmentDetail>('/api/v1/fragments', { fragment: payload }),

  rename: (id: number | string, title: string) =>
    apiClient.patch<FragmentDetail>(`/api/v1/fragments/${id}/rename`, {
      fragment: { title },
    }),

  archive: (id: number | string) =>
    apiClient.patch<FragmentDetail>(`/api/v1/fragments/${id}/archive`),

  restore: (id: number | string) =>
    apiClient.patch<FragmentDetail>(`/api/v1/fragments/${id}/restore`),

  share: (id: number | string) =>
    apiClient.post<{
      share_token: string
      share_slug: string
      shared_at: string
      public_url: string
    }>(`/api/v1/fragments/${id}/share`),

  revokeShare: (id: number | string) =>
    apiClient.delete<{ id: number; shared: boolean }>(`/api/v1/fragments/${id}/share`),

  delete: (id: number | string) =>
    apiClient.delete<{ id: number }>(`/api/v1/fragments/${id}`),

  // Public unauthenticated view of a shared fragment
  getShared: (username: string, shareSlug: string) => {
    const cleanUser = username.startsWith('@') ? username.slice(1) : username
    return apiClient.get<SharedFragmentDetail>(`/api/v1/share/${cleanUser}/${shareSlug}`)
  },
}
