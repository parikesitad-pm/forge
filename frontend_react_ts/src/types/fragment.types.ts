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
  title?: string | null
  display_title?: string
  seed: string
  observations_count: number
  sparks_count: number
  archived?: boolean
  archived_at?: string | null
  shared?: boolean
  share_slug?: string | null
  created_at: string
  updated_at: string
}

export interface FragmentDetail {
  id: number
  title?: string | null
  display_title?: string
  seed: string
  archived?: boolean
  archived_at?: string | null
  shared?: boolean
  share_slug?: string | null
  share_token?: string | null
  shared_at?: string | null
  public_url?: string | null
  created_at: string
  updated_at: string
  entries: ObservationEntry[]
  sparks: ObservationEntry[]
}

export interface SharedFragmentDetail {
  title?: string | null
  display_title: string
  seed: string
  shared_at: string
  created_at: string
  author: {
    username: string
    calling_name?: string
  }
  entries: ObservationEntry[]
  sparks: {
    id: number
    content: string
    created_at: string
  }[]
}

export interface UserMemory {
  id: number
  title: string
  content: string
  source: 'explicit' | 'profile' | 'confirmed'
  created_at: string
  updated_at: string
}

export interface CreateFragmentPayload {
  content: string
  title?: string
}

export interface CreateThoughtPayload {
  content: string
}
