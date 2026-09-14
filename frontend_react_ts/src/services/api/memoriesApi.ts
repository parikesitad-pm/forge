import { apiClient } from '../http/apiClient'
import type { UserMemory } from '@/types/fragment.types'

export interface CreateMemoryPayload {
  title: string
  content: string
  source?: 'explicit' | 'profile' | 'confirmed'
}

export interface UpdateMemoryPayload {
  title?: string
  content?: string
}

export interface MemoriesListResponse {
  use_memory: boolean
  memories: UserMemory[]
}

export const memoriesApi = {
  list: () => apiClient.get<MemoriesListResponse>('/api/v1/memories'),

  create: (payload: CreateMemoryPayload) =>
    apiClient.post<UserMemory>('/api/v1/memories', { memory: payload }),

  update: (id: number | string, payload: UpdateMemoryPayload) =>
    apiClient.patch<UserMemory>(`/api/v1/memories/${id}`, { memory: payload }),

  delete: (id: number | string) =>
    apiClient.delete<{ id: number }>(`/api/v1/memories/${id}`),

  toggle: () =>
    apiClient.patch<{ use_memory: boolean }>('/api/v1/memories/toggle'),
}
