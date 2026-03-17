import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePageConfig } from '../../hooks/usePageConfig';
import { Section } from '../../components/Section';
import { LocationsSectionBody } from './LocationsSection';
import { PreferencesSectionBody } from './PreferencesSectionBody';
import { StorageSectionBody } from './StorageSectionBody';
import { UpdateSectionBody } from './UpdateSectionBody';
import { AboutSectionBody } from './AboutSectionBody';
import { ExportRestoreSectionBody } from './ExportRestoreSectionBody';
import { BackupReminderSectionBody } from './BackupReminderSectionBody';
import { ThemeSectionBody } from './ThemeSectionBody';
import { PAGE_TRANSITION_DURATION } from '../../constants';

export function Settings() {
  usePageConfig('Settings');

  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, PAGE_TRANSITION_DURATION);
    return () => clearTimeout(timer);
  }, [hash]);

  return (
    <div className="bg-background px-4 py-6">
      <div className="mx-auto max-w-2xl space-y-8">
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
