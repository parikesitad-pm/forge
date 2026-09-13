export interface User {
  id: number
  username: string
  email: string
  fullname?: string | null
  bio?: string | null
  created_at: string
}

export interface RegisterPayload {
  username: string
  email: string
  password: string
  password_confirmation: string
}

export interface LoginPayload {
  identifier: string
  password: string
}

export interface CheckUsernameResponse {
  available: boolean
  message: string
}
