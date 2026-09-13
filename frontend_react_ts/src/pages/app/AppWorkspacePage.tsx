import React, { useState, useEffect } from 'react'
import { AppWorkspaceTemplate } from '@/components/templates/AppWorkspaceTemplate'
import { CaptureHero } from '@/features/fragments/components/CaptureHero'
import { FragmentList } from '@/features/fragments/components/FragmentList'
import { OnboardingModal } from '@/features/auth/components/OnboardingModal'

export const AppWorkspacePage: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const shouldShow = sessionStorage.getItem('forge_show_onboarding') === 'true'
    if (shouldShow) {
      setShowOnboarding(true)
    }
  }, [])

  return (
    <AppWorkspaceTemplate breadcrumbTitle="New Thought">
      {/* Post-Registration Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />

      <div className="flex-1 flex flex-col justify-between max-w-3xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-12 pb-8">
          <CaptureHero />
          <FragmentList />
        </div>

        {/* Micro-footer */}
        <div className="py-2 text-center select-none border-t border-zinc-900/60 mt-auto">
          <p className="text-[11px] font-mono text-zinc-600">
            Forge &middot; A Thinking Companion
          </p>
        </div>
      </div>
    </AppWorkspaceTemplate>
  )
}
