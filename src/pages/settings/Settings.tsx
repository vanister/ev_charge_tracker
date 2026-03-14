import { usePageConfig } from '../../hooks/usePageConfig';
import { Section } from '../../components/Section';
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
        <Section title="Theme">
          <ThemeSectionBody />
        </Section>

        <Section title="Locations">
          <LocationsSectionBody />
        </Section>

        <Section title="Preferences" cardClassName="space-y-4">
          <PreferencesSectionBody />
        </Section>

        <Section title="Storage" cardClassName="space-y-3">
          <StorageSectionBody />
        </Section>

        <Section title="Export & Restore" cardClassName="space-y-3">
          <ExportRestoreSectionBody />
        </Section>

        <Section title="Update" id="update">
          <UpdateSectionBody />
        </Section>

        <Section title="About">
          <AboutSectionBody />
        </Section>
      </div>
    </div>
  );
}
