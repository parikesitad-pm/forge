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
    staleTime: 1000 * 30, // 30 seconds
  })
}

export function useArchivedFragments() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['fragments', 'archived'],
    queryFn: () => fragmentsApi.getArchived(),
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
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

export function useRenameFragment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, title }: { id: number | string; title: string }) =>
      fragmentsApi.rename(id, title),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fragments.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.fragments.detail(data.id) })
    },
  })
}

export function useArchiveFragment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => fragmentsApi.archive(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fragments.all })
      queryClient.invalidateQueries({ queryKey: ['fragments', 'archived'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.fragments.detail(data.id) })
    },
  })
}

export function useRestoreFragment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => fragmentsApi.restore(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fragments.all })
      queryClient.invalidateQueries({ queryKey: ['fragments', 'archived'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.fragments.detail(data.id) })
    },
  })
}

export function useShareFragment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => fragmentsApi.share(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fragments.detail(id) })
    },
  })
}

export function useRevokeShareFragment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => fragmentsApi.revokeShare(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fragments.detail(id) })
    },
  })
}

export function useDeleteFragment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => fragmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fragments.all })
      queryClient.invalidateQueries({ queryKey: ['fragments', 'archived'] })
    },
  })
}
