import React from 'react'
import { AppWorkspaceTemplate } from '@/components/templates/AppWorkspaceTemplate'
import { CaptureHero } from '@/features/fragments/components/CaptureHero'
import { FragmentList } from '@/features/fragments/components/FragmentList'

export const AppWorkspacePage: React.FC = () => {
  return (
    <AppWorkspaceTemplate>
      <div className="space-y-12 pb-16">
        <CaptureHero />
        <FragmentList />
      </div>
    </AppWorkspaceTemplate>
  )
}
