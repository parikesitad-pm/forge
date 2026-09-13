import type { ApiResponse } from '@/types/api.types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export class ApiError extends Error {
  status: number
  details?: Record<string, string[]> | string[]

  constructor(message: string, status: number, details?: Record<string, string[]> | string[]) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Essential for session cookie authentication
  }

  const response = await fetch(url, config)

  let json: ApiResponse<T> | null = null
  try {
    json = await response.json()
  } catch {
    // If not json
  }

  if (!response.ok) {
    const errorMsg = json?.error || json?.message || `Request failed with status ${response.status}`
    throw new ApiError(errorMsg, response.status, json?.details)
  }

  if (json && 'data' in json) {
    return json.data as T
  }

  return (json as unknown) as T
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
}
