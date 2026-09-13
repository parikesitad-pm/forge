import { useQuery } from '@tanstack/react-query'
import { growthApi } from '@/services/api/growthApi'
import { queryKeys } from '@/constants/queryKeys'

export function useGrowth(fragmentId: number | string | undefined) {
  return useQuery({
    queryKey: fragmentId ? queryKeys.growth.byFragment(fragmentId) : ['growth', 'empty'],
    queryFn: () => (fragmentId ? growthApi.getGrowth(fragmentId) : Promise.reject('No ID')),
    enabled: !!fragmentId,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })
}
