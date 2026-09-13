import { useMutation, useQueryClient } from '@tanstack/react-query'
import { observationsApi } from '@/services/api/observationsApi'
import { sparksApi } from '@/services/api/sparksApi'
import { queryKeys } from '@/constants/queryKeys'
import type { FragmentDetail } from '@/types/fragment.types'

export function useAddThought(fragmentId: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content: string) => observationsApi.createEntry(fragmentId, { content }),
    onSuccess: (newEntry) => {
      queryClient.setQueryData<FragmentDetail>(queryKeys.fragments.detail(fragmentId), (old) => {
        if (!old) return old
        return {
          ...old,
          entries: [...old.entries, newEntry],
        }
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.fragments.all })
    },
  })
}

export function useObserveFragment(fragmentId: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => observationsApi.observe(fragmentId),
    onSuccess: (res) => {
      queryClient.setQueryData<FragmentDetail>(queryKeys.fragments.detail(fragmentId), (old) => {
        if (!old) return old
        return {
          ...old,
          entries: [...old.entries, res.observation],
        }
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.fragments.all })
    },
  })
}

export function useToggleSpark(fragmentId: number | string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ observationId, currentlyPinned }: { observationId: number; currentlyPinned: boolean }) =>
      currentlyPinned ? sparksApi.unpin(observationId) : sparksApi.pin(observationId),

    // Optimistic Update
    onMutate: async ({ observationId, currentlyPinned }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.fragments.detail(fragmentId) })
      const previousFragment = queryClient.getQueryData<FragmentDetail>(queryKeys.fragments.detail(fragmentId))

      if (previousFragment) {
        const nextEntries = previousFragment.entries.map((entry) =>
          entry.id === observationId ? { ...entry, pinned: !currentlyPinned } : entry
        )
        const nextSparks = nextEntries.filter((e) => e.pinned)

        queryClient.setQueryData<FragmentDetail>(queryKeys.fragments.detail(fragmentId), {
          ...previousFragment,
          entries: nextEntries,
          sparks: nextSparks,
        })
      }

      return { previousFragment }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousFragment) {
        queryClient.setQueryData(queryKeys.fragments.detail(fragmentId), context.previousFragment)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fragments.detail(fragmentId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.sparks.byFragment(fragmentId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.fragments.all })
    },
  })
}
