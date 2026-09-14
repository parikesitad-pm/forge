export interface User {
  id: number
  username: string
  email: string
  fullname?: string | null
  preferred_name?: string | null
  calling_name?: string
  display_calling_name?: string
  date_of_birth?: string | null
  derived_age?: number | null
  birthday_today?: boolean
  interests?: string[]
  owl_instructions?: string | null
  use_memory?: boolean
  seen_journey_milestones?: string[]
  initials?: string
  bio?: string | null
  avatar_url?: string | null
  created_at: string
}

export interface RegisterPayload {
  fullname?: string
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

export interface CheckEmailResponse {
  available: boolean
  message: string
}
