import { apiClient } from '../http/apiClient'
import type { User } from '@/types/auth.types'

export interface UpdateProfilePayload {
  fullname?: string
  username?: string
  email?: string
  bio?: string
  preferred_name?: string
  date_of_birth?: string
  interests?: string[]
  owl_instructions?: string
  use_memory?: boolean
  remove_avatar?: boolean
}

export interface UpdatePasswordPayload {
  current_password: string
  password: string
  password_confirmation: string
}

export const settingsApi = {
  getProfile: () => apiClient.get<User>('/api/v1/settings'),

  updateProfile: (payload: UpdateProfilePayload | FormData) => {
    if (typeof FormData !== 'undefined' && payload instanceof FormData) {
      return apiClient.patch<User>('/api/v1/settings/profile', payload)
    }
    return apiClient.patch<User>('/api/v1/settings/profile', { user: payload })
  },

  updatePassword: (payload: UpdatePasswordPayload) =>
    apiClient.patch<User>('/api/v1/settings/password', payload),

  recordMilestone: (milestone: string) =>
    apiClient.post<User>('/api/v1/settings/journey_milestone', { milestone }),

  deleteAccount: (password: string, confirmation: string = 'DELETE') =>
    apiClient.delete<{ deleted_id: number }>('/api/v1/settings/account', {
      body: JSON.stringify({ password, confirmation }),
    }),
}
