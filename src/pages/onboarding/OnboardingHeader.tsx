type OnboardingHeaderProps = {
  title: string;
  description: string;
  subDescription?: string;
};

export function OnboardingHeader(props: OnboardingHeaderProps) {
  return (
    <div className="mb-6 text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-body mb-3">{props.title}</h2>
      <p className="text-base text-body-secondary">{props.description}</p>
      {props.subDescription && (
        <p className="text-base text-body-tertiary mt-2">{props.subDescription}</p>
      )}
    </div>
  );
}
