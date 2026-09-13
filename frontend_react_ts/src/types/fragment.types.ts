export type ThoughtRole = 'user' | 'ai'

export interface ObservationEntry {
  id: number
  fragment_id: number
  role: ThoughtRole
  content: string
  pinned: boolean
  created_at: string
}

export interface FragmentSummary {
  id: number
  seed: string
  observations_count: number
  sparks_count: number
  created_at: string
  updated_at: string
}

export interface FragmentDetail {
  id: number
  seed: string
  created_at: string
  updated_at: string
  entries: ObservationEntry[]
  sparks: ObservationEntry[]
}

export interface CreateFragmentPayload {
  content: string
}

export interface CreateThoughtPayload {
  content: string
}
