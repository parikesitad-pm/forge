import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { memoriesApi, type CreateMemoryPayload, type UpdateMemoryPayload } from '@/services/api/memoriesApi'
import { useAuth } from '@/app/providers/AuthProvider'

export function useMemories() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['memories'],
    queryFn: () => memoriesApi.list(),
    enabled: isAuthenticated,
  })
}

export function useCreateMemory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateMemoryPayload) => memoriesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] })
    },
  })
}

export function useUpdateMemory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number | string; payload: UpdateMemoryPayload }) =>
      memoriesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] })
    },
  })
}

export function useDeleteMemory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | string) => memoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] })
    },
  })
}

export function useToggleMemory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => memoriesApi.toggle(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] })
    },
  })
}
