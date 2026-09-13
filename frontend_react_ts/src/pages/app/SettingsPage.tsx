import React from 'react'
import { AppWorkspaceTemplate } from '@/components/templates/AppWorkspaceTemplate'
import { SettingsView } from '@/features/settings/components/SettingsView'

export const SettingsPage: React.FC = () => {
  return (
    <AppWorkspaceTemplate breadcrumbTitle="Thinker Profile">
      <div className="flex-1 flex flex-col justify-between px-4 sm:px-6">
        <SettingsView />
        <div className="py-2 text-center select-none border-t border-zinc-900/60 mt-auto">
          <p className="text-[11px] font-mono text-zinc-600">
            Forge &middot; A Thinking Companion
          </p>
        </div>
      </div>
    </AppWorkspaceTemplate>
  )
}
