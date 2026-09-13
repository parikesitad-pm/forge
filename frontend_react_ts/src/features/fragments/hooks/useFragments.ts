import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fragmentsApi } from '@/services/api/fragmentsApi'
import { queryKeys } from '@/constants/queryKeys'
import { useAuth } from '@/app/providers/AuthProvider'
import type { CreateFragmentPayload } from '@/types/fragment.types'

export function useFragments() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: queryKeys.fragments.all,
    queryFn: () => fragmentsApi.getAll(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60, // 1 minute
  })
}

export function useFragment(id: number | string | undefined) {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: id ? queryKeys.fragments.detail(id) : ['fragments', 'empty'],
    queryFn: () => (id ? fragmentsApi.getById(id) : Promise.reject('No ID')),
    enabled: isAuthenticated && !!id,
  })
}

export function useCreateFragment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateFragmentPayload) => fragmentsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fragments.all })
    },
  })
}

export function useDeleteFragment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => fragmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fragments.all })
    },
  })
}
