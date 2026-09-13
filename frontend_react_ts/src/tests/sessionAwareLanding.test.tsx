import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LandingNavbar } from '@/features/landing/components/LandingNavbar';
import { LandingHero } from '@/features/landing/components/LandingHero';
import * as AuthModule from '@/app/providers/AuthProvider';

describe('Session-Aware Landing Components', () => {
  it('renders subtle skeleton without auth assumption when authStatus is unknown', () => {
    vi.spyOn(AuthModule, 'useAuth').mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      authStatus: 'unknown',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refetchUser: vi.fn(),
    });

    render(
      <MemoryRouter>
        <LandingNavbar />
        <LandingHero />
      </MemoryRouter>
    );

    // Skeleton elements should be displayed
    expect(screen.getByTestId('auth-skeleton-nav')).toBeDefined();
    expect(screen.getByTestId('auth-skeleton-hero')).toBeDefined();

    // Neither unauthenticated nor authenticated CTAs should be visible yet
    expect(screen.queryByText('Log In')).toBeNull();
    expect(screen.queryByText('Continue thinking')).toBeNull();
  });

  it('renders "Log In" and "Start Thinking" when user is unauthenticated', () => {
    vi.spyOn(AuthModule, 'useAuth').mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      authStatus: 'unauthenticated',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refetchUser: vi.fn(),
    });

    render(
      <MemoryRouter>
        <LandingNavbar />
        <LandingHero />
      </MemoryRouter>
    );

    expect(screen.getByText('Log In')).toBeDefined();
    expect(screen.getAllByText('Start Thinking').length).toBeGreaterThan(0);
    expect(screen.queryByText('Continue thinking')).toBeNull();
  });

  it('renders "Continue thinking" when user is authenticated', () => {
    vi.spyOn(AuthModule, 'useAuth').mockReturnValue({
      user: {
        id: 1,
        username: 'thinker_alpha',
        email: 'thinker@example.com',
        created_at: '2026-01-01',
      },
      isLoading: false,
      isAuthenticated: true,
      authStatus: 'authenticated',
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refetchUser: vi.fn(),
    });

    render(
      <MemoryRouter>
        <LandingNavbar />
        <LandingHero />
      </MemoryRouter>
    );

    // Should display "Continue thinking" in both navbar and hero
    const continueButtons = screen.getAllByText('Continue thinking');
    expect(continueButtons.length).toBe(2);

    // Should NOT display "Log In" or "Start Thinking"
    expect(screen.queryByText('Log In')).toBeNull();
    expect(screen.queryByText('Start Thinking')).toBeNull();
  });
});
