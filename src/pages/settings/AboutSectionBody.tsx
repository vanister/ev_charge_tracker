import { AboutContent } from './AboutContent';
import { ResetAppPanel } from './ResetAppPanel';

export function AboutSectionBody() {
  return (
    <>
      <AboutContent />
      <hr className="border-border my-4" />
      <ResetAppPanel />
    </>
  );
}
