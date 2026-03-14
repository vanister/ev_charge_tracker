type AppHeaderProps = {
  title: string;
};

export function AppHeader(props: AppHeaderProps) {
  const { title } = props;

  return (
    <header className="bg-surface border-default fixed top-0 right-0 left-0 z-10 flex h-14 items-center justify-center border-b px-4">
      <h1 className="text-body text-lg font-semibold">{title}</h1>
    </header>
  );
}
