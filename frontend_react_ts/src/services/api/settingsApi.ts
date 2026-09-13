import { apiClient } from '../http/apiClient'
import type { User } from '@/types/auth.types'

export interface UpdateProfilePayload {
  fullname?: string
  username?: string
  bio?: string
}

export interface UpdatePasswordPayload {
  current_password: string
  password: string
  password_confirmation: string
}

export const settingsApi = {
  getProfile: () => apiClient.get<User>('/api/v1/settings'),

  updateProfile: (payload: UpdateProfilePayload) =>
    apiClient.patch<User>('/api/v1/settings/profile', payload),

  updatePassword: (payload: UpdatePasswordPayload) =>
    apiClient.patch<User>('/api/v1/settings/password', payload),
}
