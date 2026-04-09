import { AboutContent } from './AboutContent';
import { ResetAppPanel } from './ResetAppPanel';
import { SettingsContentDivider } from './SettingsContentDivider';

export function AboutSectionBody() {
  return (
    <>
      <AboutContent />
      <SettingsContentDivider className="my-4" />
      <ResetAppPanel />
    </>
  );
}
