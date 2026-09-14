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

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData

  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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
    let errorMsg = json?.error || json?.message
    if (!errorMsg) {
      if (response.status === 405) {
        errorMsg =
          'Backend belum terhubung atau service offline (HTTP 405 Method Not Allowed). Pastikan backend Rails sudah aktif.'
      } else if (response.status === 404) {
        errorMsg = 'Layanan API tidak ditemukan (HTTP 404 Not Found).'
      } else if (response.status === 502 || response.status === 503) {
        errorMsg = 'Layanan backend sedang tidak tersedia atau restart (HTTP 502/503).'
      } else {
        errorMsg = `Permintaan gagal dengan status ${response.status}`
      }
    }
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

  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) => {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    })
  },

  patch: <T>(endpoint: string, body?: unknown, options?: RequestInit) => {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
    return request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    })
  },

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
}
