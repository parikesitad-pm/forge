import { apiClient } from '../http/apiClient'
import type { CheckEmailResponse, CheckUsernameResponse, LoginPayload, RegisterPayload, User } from '@/types/auth.types'

export const authApi = {
  me: () => apiClient.get<User>('/api/v1/me'),

  register: (payload: RegisterPayload) =>
    apiClient.post<User>('/api/v1/auth/register', { user: payload }),

  login: (payload: LoginPayload) =>
    apiClient.post<User>('/api/v1/auth/login', payload),

  logout: () => apiClient.delete<{ success: boolean }>('/api/v1/auth/logout'),

  checkUsername: (username: string) =>
    apiClient.get<CheckUsernameResponse>(`/api/v1/auth/check-username?username=${encodeURIComponent(username)}`),

  checkEmail: (email: string) =>
    apiClient.get<CheckEmailResponse>(`/api/v1/auth/check-email?email=${encodeURIComponent(email)}`),
}
