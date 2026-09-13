import React, { createContext, useContext } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/services/api/authApi'
import { queryKeys } from '@/constants/queryKeys'
import type { LoginPayload, RegisterPayload, User } from '@/types/auth.types'

export type AuthStatus = 'unknown' | 'authenticated' | 'unauthenticated'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  authStatus: AuthStatus
  login: (payload: LoginPayload) => Promise<User>
  register: (payload: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
  refetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient()

  const {
    data: user = null,
    isLoading,
    refetch,
  } = useQuery<User | null>({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      try {
        return await authApi.me()
      } catch {
        return null
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  })

  const authStatus: AuthStatus = isLoading
    ? 'unknown'
    : user
      ? 'authenticated'
      : 'unauthenticated'

  const login = async (payload: LoginPayload) => {
    const userData = await authApi.login(payload)
    queryClient.setQueryData(queryKeys.auth.me, userData)
    return userData
  }

  const register = async (payload: RegisterPayload) => {
    const userData = await authApi.register(payload)
    queryClient.setQueryData(queryKeys.auth.me, userData)
    return userData
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      queryClient.clear()
      queryClient.setQueryData(queryKeys.auth.me, null)
    }
  }

  const refetchUser = async () => {
    await refetch()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: authStatus === 'authenticated',
        authStatus,
        login,
        register,
        logout,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
