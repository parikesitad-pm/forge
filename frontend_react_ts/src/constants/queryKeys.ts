export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  fragments: {
    all: ['fragments'] as const,
    detail: (id: number | string) => ['fragments', id] as const,
  },
  sparks: {
    byFragment: (fragmentId: number | string) => ['fragments', fragmentId, 'sparks'] as const,
  },
  growth: {
    byFragment: (fragmentId: number | string) => ['fragments', fragmentId, 'growth'] as const,
  },
  settings: {
    profile: ['settings', 'profile'] as const,
  },
} as const
