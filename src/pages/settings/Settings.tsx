import { useAppUpdateAvailable } from '../../hooks/useAppUpdateAvailable';
import { usePageTitle } from '../../hooks/usePageTitle';
import { SettingsSection } from './SettingsSection';
import { LocationsSection } from './LocationsSection';
import { StorageSectionBody } from './StorageSectionBody';
import { UpdateSectionBody } from './UpdateSectionBody';
import { AboutSectionBody } from './AboutSectionBody';

export function Settings() {
  usePageTitle('Settings');

  const { needsUpdate, applyUpdate } = useAppUpdateAvailable();

  return (
    <div className="bg-background px-4 py-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <LocationsSection />

        <SettingsSection title="Storage" cardClassName="space-y-3">
          <StorageSectionBody />
        </SettingsSection>

        {needsUpdate && (
          <SettingsSection title="Update">
            <UpdateSectionBody onApply={applyUpdate} />
          </SettingsSection>
        )}

        <SettingsSection title="About">
          <AboutSectionBody />
        </SettingsSection>
      </div>
    </div>
  );
}
