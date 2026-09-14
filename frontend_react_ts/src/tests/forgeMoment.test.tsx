import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { ForgeMomentOverlay } from '@/features/reflections/components/ForgeMomentOverlay'
import * as AuthModule from '@/app/providers/AuthProvider'
import type { User } from '@/types/auth.types'

describe('ForgeMomentOverlay Component', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('renders Birthday reflection with highest priority when today is birthday', async () => {
    const mockUser: User = {
      id: 1,
      username: 'thinker_test',
      email: 'thinker@modula.app',
      fullname: 'Thinker Test',
      calling_name: 'Thinker',
      created_at: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(), // 400 days old (eligible for 1yr)
      birthday_today: true,
      seen_journey_milestones: [],
    }

    vi.spyOn(AuthModule, 'useAuth').mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
      authStatus: 'authenticated',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refetchUser: vi.fn(),
    })

    render(<ForgeMomentOverlay />)

    // Fast-forward past the 3500ms idle guard timer
    act(() => {
      vi.advanceTimersByTime(4000)
    })

    // Birthday reflection must take precedence over the 1yr journey milestone
    expect(screen.getByText('Happy Birthday, Thinker!')).toBeDefined()
    expect(
      screen.getByText(
        'Another year of questions, wonder, and thought. May your mind stay curious and your quiet moments fruitful.'
      )
    ).toBeDefined()
    expect(screen.queryByText('One Year of Wonder')).toBeNull()
  })

  it('renders Journey milestone when not birthday and milestone is eligible', async () => {
    const mockUser: User = {
      id: 2,
      username: 'thinker_journey',
      email: 'journey@modula.app',
      fullname: 'Journey Thinker',
      calling_name: 'Journey',
      created_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(), // 100 days old (eligible for 3mo)
      birthday_today: false,
      seen_journey_milestones: [],
    }

    vi.spyOn(AuthModule, 'useAuth').mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
      authStatus: 'authenticated',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refetchUser: vi.fn(),
    })

    render(<ForgeMomentOverlay />)

    act(() => {
      vi.advanceTimersByTime(4000)
    })

    expect(screen.getByText('A Seed Pulsing in Quiet Soil')).toBeDefined()
    expect(screen.getByText('3 Months with Forge')).toBeDefined()
  })
})
