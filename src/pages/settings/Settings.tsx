import { usePageConfig } from '../../hooks/usePageConfig';
import { useScrollToHash } from '../../hooks/useScrollToHash';
import { Section } from '../../components/Section';
import { LocationsSectionBody } from './LocationsSection';
import { SessionSectionBody } from './SessionSectionBody';
import { GasComparisonSectionBody } from './GasComparisonSectionBody';
import { StorageSectionBody } from './StorageSectionBody';
import { UpdateSectionBody } from './UpdateSectionBody';
import { AboutSectionBody } from './AboutSectionBody';
import { BackupRestoreSectionBody } from './BackupRestoreSectionBody';
import { ThemeSectionBody } from './ThemeSectionBody';
import { DateTimeSectionBody } from './DateTimeSectionBody';

export function Settings() {
  usePageConfig('Settings');
  useScrollToHash();

  return (
    <div className="bg-background px-4 py-6">
      <div className="mx-auto max-w-2xl space-y-8">
        <Section title="Theme">
          <ThemeSectionBody />
        </Section>

        <Section title="Date & Time">
          <DateTimeSectionBody />
        </Section>

        <Section title="Locations">
          <LocationsSectionBody />
        </Section>

        <Section title="Session" cardClassName="space-y-4">
          <SessionSectionBody />
        </Section>

        <Section title="Gas Comparison" id="gas-comparison" cardClassName="space-y-4">
          <GasComparisonSectionBody />
        </Section>

        <Section title="Storage" cardClassName="space-y-3">
          <StorageSectionBody />
        </Section>

        <Section title="Backup & Restore" id="backup-restore" cardClassName="space-y-3">
          <BackupRestoreSectionBody />
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
