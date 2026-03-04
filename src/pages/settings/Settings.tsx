import { usePageTitle } from '../../hooks/usePageTitle';
import { SettingsSection } from './SettingsSection';
import { LocationsSectionBody } from './LocationsSection';
import { StorageSectionBody } from './StorageSectionBody';
import { UpdateSectionBody } from './UpdateSectionBody';
import { AboutSectionBody } from './AboutSectionBody';

export function Settings() {
  usePageTitle('Settings');

  return (
    <div className="bg-background px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <SettingsSection title="Locations">
          <LocationsSectionBody />
        </SettingsSection>

        <SettingsSection title="Storage" cardClassName="space-y-3">
          <StorageSectionBody />
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
