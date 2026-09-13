import type { ObservationEntry } from './fragment.types'

export const OWL_RUN_STATE = {
  IDLE: 'idle',
  QUEUED: 'queued',
  THINKING: 'thinking',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const

export type OwlRunState = (typeof OWL_RUN_STATE)[keyof typeof OWL_RUN_STATE]

export interface ObserveFragmentResponse {
  state: string
  observation: ObservationEntry
}

export interface GrowthData {
  status: string
  headline: string
  reflection: string
  sparks_count: number
  tensions: string[]
  invitation: string
}
