import { usePageConfig } from '../../hooks/usePageConfig';
import { SettingsSection } from './SettingsSection';
import { LocationsSectionBody } from './LocationsSection';
import { PreferencesSectionBody } from './PreferencesSectionBody';
import { StorageSectionBody } from './StorageSectionBody';
import { UpdateSectionBody } from './UpdateSectionBody';
import { AboutSectionBody } from './AboutSectionBody';
import { ExportRestoreSectionBody } from './ExportRestoreSectionBody';
import { ThemeSectionBody } from './ThemeSectionBody';

export function Settings() {
  usePageConfig('Settings');

  return (
    <div className="bg-background px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <SettingsSection title="Theme">
          <ThemeSectionBody />
        </SettingsSection>

        <SettingsSection title="Locations">
          <LocationsSectionBody />
        </SettingsSection>

        <SettingsSection title="Preferences" cardClassName="space-y-4">
          <PreferencesSectionBody />
        </SettingsSection>

        <SettingsSection title="Storage" cardClassName="space-y-3">
          <StorageSectionBody />
        </SettingsSection>

        <SettingsSection title="Export & Restore" cardClassName="space-y-3">
          <ExportRestoreSectionBody />
        </SettingsSection>

        <SettingsSection title="Update">
          <UpdateSectionBody />
        </SettingsSection>

        <SettingsSection title="About">
          <AboutSectionBody />
        </SettingsSection>
      </div>
    </div>
  );
}
