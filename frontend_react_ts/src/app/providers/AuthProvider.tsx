import React, { createContext, useContext, useState } from 'react'
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
  const [sessionUser, setSessionUser] = useState<User | null>(null)

  const {
    data: queryUser = null,
    isLoading,
    refetch,
  } = useQuery<User | null>({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      try {
        const u = await authApi.me()
        setSessionUser(u)
        return u
      } catch {
        setSessionUser(null)
        return null
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  })

  const user = sessionUser || queryUser

  const authStatus: AuthStatus = isLoading && !user
    ? 'unknown'
    : user
      ? 'authenticated'
      : 'unauthenticated'

  const login = async (payload: LoginPayload) => {
    const userData = await authApi.login(payload)
    setSessionUser(userData)
    queryClient.setQueryData(queryKeys.auth.me, userData)
    return userData
  }

  const register = async (payload: RegisterPayload) => {
    const userData = await authApi.register(payload)
    setSessionUser(userData)
    queryClient.setQueryData(queryKeys.auth.me, userData)
    return userData
  }

  const logout = async () => {
    setSessionUser(null)
    queryClient.setQueryData(queryKeys.auth.me, null)
    queryClient.removeQueries({ queryKey: ['fragments'] })
    try {
      await authApi.logout()
    } finally {
      queryClient.clear()
      setSessionUser(null)
      queryClient.setQueryData(queryKeys.auth.me, null)
    }
  }

  const refetchUser = async () => {
    const res = await refetch()
    if (res.data) {
      setSessionUser(res.data)
    }
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
