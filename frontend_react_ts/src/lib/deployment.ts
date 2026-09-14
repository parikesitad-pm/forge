/**
 * Helper to determine local vs hosted deployment environment
 * and whether live backend auth is available.
 */

export const isLocalEnvironment = (): boolean => {
  if (typeof window === 'undefined') return true
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0'
}

export const isProductionAuthReady = (): boolean => {
  // Local development has Rails running on port 3000
  if (isLocalEnvironment()) return true

  // Check if explicit live API URL is provided and not expired/coming soon
  const apiUrl = import.meta.env.VITE_API_BASE_URL
  if (
    !apiUrl ||
    apiUrl.includes('railway.app') ||
    import.meta.env.VITE_AUTH_COMING_SOON === 'true'
  ) {
    return false
  }

  return true
}
