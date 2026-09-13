import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fragmentsApi } from '@/services/api/fragmentsApi'
import { queryKeys } from '@/constants/queryKeys'
import type { CreateFragmentPayload } from '@/types/fragment.types'

export function useFragments() {
  return useQuery({
    queryKey: queryKeys.fragments.all,
    queryFn: () => fragmentsApi.getAll(),
    staleTime: 1000 * 60, // 1 minute
  })
}

export function useFragment(id: number | string | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.fragments.detail(id) : ['fragments', 'empty'],
    queryFn: () => (id ? fragmentsApi.getById(id) : Promise.reject('No ID')),
    enabled: !!id,
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
