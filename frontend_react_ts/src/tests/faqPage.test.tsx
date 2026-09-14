import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FaqPage } from '@/pages/public/FaqPage'
import * as AuthModule from '@/app/providers/AuthProvider'

describe('FaqPage Component', () => {
  it('renders FAQ header and categories correctly', () => {
    vi.spyOn(AuthModule, 'useAuth').mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      authStatus: 'unauthenticated',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refetchUser: vi.fn(),
    })

    render(
      <MemoryRouter>
        <FaqPage />
      </MemoryRouter>
    )

    // Verify main headings and search bar
    expect(screen.getByText('Frequently Asked Questions')).toBeDefined()
    expect(
      screen.getByPlaceholderText('Search questions or topics...')
    ).toBeDefined()

    // Verify key categories exist
    expect(screen.getByText('All')).toBeDefined()
    expect(screen.getByText('Concepts')).toBeDefined()
    expect(screen.getByText('Owl & Privacy')).toBeDefined()
    expect(screen.getByText('Archive & Sharing')).toBeDefined()
    expect(screen.getByText('Technical & Deploy')).toBeDefined()

    // Verify critical questions answered
    expect(screen.getByText('What is a Fragment?')).toBeDefined()
    expect(
      screen.getByText('Why does the hosted preview say "Coming soon" for Login/Register?')
    ).toBeDefined()
  })
})
