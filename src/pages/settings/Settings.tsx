import { usePageConfig } from '../../hooks/usePageConfig';
import { useScrollToHash } from '../../hooks/useScrollToHash';
import { Section } from '../../components/Section';
import { LocationsSectionBody } from './LocationsSection';
import { SessionSectionBody } from './SessionSectionBody';
import { StorageSectionBody } from './StorageSectionBody';
import { UpdateSectionBody } from './UpdateSectionBody';
import { AboutSectionBody } from './AboutSectionBody';
import { ExportRestoreSectionBody } from './ExportRestoreSectionBody';
import { BackupReminderSectionBody } from './BackupReminderSectionBody';
import { ThemeSectionBody } from './ThemeSectionBody';

export function Settings() {
  usePageConfig('Settings');
  useScrollToHash();

  return (
    <div className="bg-background px-4 py-6">
      <div className="mx-auto max-w-2xl space-y-8">
        <Section title="Theme">
          <ThemeSectionBody />
        </Section>

        <Section title="Locations">
          <LocationsSectionBody />
        </Section>

        <Section title="Session" cardClassName="space-y-4">
          <SessionSectionBody />
        </Section>

        <Section title="Storage" cardClassName="space-y-3">
          <StorageSectionBody />
        </Section>

        <Section title="Export & Restore" id="export-restore" cardClassName="space-y-3">
          <ExportRestoreSectionBody />
        </Section>

        <Section title="Backup Reminder">
          <BackupReminderSectionBody />
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
