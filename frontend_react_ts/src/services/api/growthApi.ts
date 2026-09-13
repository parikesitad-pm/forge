import { apiClient } from '../http/apiClient';
import type { GrowthData } from '@/types/owl.types';

export const growthApi = {
  getGrowth: (fragmentId: number | string) =>
    apiClient.get<GrowthData>(`/api/v1/fragments/${fragmentId}/growth`),
};
