export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
  details?: Record<string, string[]> | string[]
}
