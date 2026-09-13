import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DocsPage } from '@/pages/docs/DocsPage';
import * as AuthModule from '@/app/providers/AuthProvider';

describe('DocsPage Component', () => {
  it('renders all documentation sections without authentication', () => {
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
        <DocsPage />
      </MemoryRouter>
    );

    // Heading verification using role
    expect(
      screen.getByRole('heading', { name: 'Forge by Modula Project' })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', { name: 'Product Philosophy' })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', { name: 'System Architecture' })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', { name: 'Local Development Setup' })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', { name: 'Frontend Development' })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', { name: 'Backend Development' })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', { name: 'Testing Strategy & CI Gate' })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', { name: 'Environment Variables' })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', {
        name: 'Deployment Guide (Vercel & Railway)',
      })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', {
        name: 'API Reference & OpenAPI Specification',
      })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', { name: 'Troubleshooting & Known Fixes' })
    ).toBeDefined();

    // Swagger link verification
    expect(screen.getAllByText(/Swagger/i).length).toBeGreaterThan(0);
  });
});
