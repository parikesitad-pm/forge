import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LandingPage } from '@/pages/public/LandingPage'
import { LoginPage } from '@/pages/public/LoginPage'
import { RegisterPage } from '@/pages/public/RegisterPage'
import { AppWorkspacePage } from '@/pages/app/AppWorkspacePage'
import { FragmentDetailPage } from '@/pages/app/FragmentDetailPage'
import { SettingsPage } from '@/pages/app/SettingsPage'
import { ContinueThinkingPage } from '@/pages/app/ContinueThinkingPage'
import { DocsPage } from '@/pages/docs/DocsPage'
import { FaqPage } from '@/pages/public/FaqPage'
import { SharedFragmentPage } from '@/pages/public/SharedFragmentPage'
import { useAuth } from './providers/AuthProvider'
import { Spinner } from '@/components/atoms/Spinner'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-3 text-zinc-500">
        <Spinner size="lg" />
        <span className="text-xs font-mono">Authenticating thinker...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

const PublicAuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/app" replace />
  }

  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/docs',
    element: <DocsPage />,
  },
  {
    path: '/faq',
    element: <FaqPage />,
  },
  {
    path: '/share/:username/:shareSlug',
    element: <SharedFragmentPage />,
  },
  {
    path: '/share/@:username/:shareSlug',
    element: <SharedFragmentPage />,
  },
  {
    path: '/login',
    element: (
      <PublicAuthRoute>
        <LoginPage />
      </PublicAuthRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicAuthRoute>
        <RegisterPage />
      </PublicAuthRoute>
    ),
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppWorkspacePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/continue',
    element: (
      <ProtectedRoute>
        <ContinueThinkingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/fragments/:id',
    element: (
      <ProtectedRoute>
        <FragmentDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/app/settings',
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  // Backwards compatibility redirects for old routes
  {
    path: '/fragments',
    element: <Navigate to="/app" replace />,
  },
  {
    path: '/fragments/:id',
    element: <Navigate to="/app" replace />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
