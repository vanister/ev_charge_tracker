type OnboardingHeaderProps = {
  title: string;
  description: string;
  subDescription?: string;
};

export function OnboardingHeader(props: OnboardingHeaderProps) {
  return (
    <div className="mb-6 text-center">
      <h2 className="text-body mb-3 text-2xl font-bold sm:text-3xl">{props.title}</h2>
      <p className="text-body-secondary text-base">{props.description}</p>
      {props.subDescription && <p className="text-body-tertiary mt-2 text-base">{props.subDescription}</p>}
    </div>
  );
}
