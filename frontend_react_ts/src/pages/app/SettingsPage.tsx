import React from 'react';
import { AppWorkspaceTemplate } from '@/components/templates/AppWorkspaceTemplate';
import { SettingsView } from '@/features/settings/components/SettingsView';

export const SettingsPage: React.FC = () => {
  return (
    <AppWorkspaceTemplate>
      <SettingsView />
    </AppWorkspaceTemplate>
  );
};
