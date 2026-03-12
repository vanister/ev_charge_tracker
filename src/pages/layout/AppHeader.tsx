type AppHeaderProps = {
  title: string;
};

export function AppHeader(props: AppHeaderProps) {
  const { title } = props;

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-surface border-b border-default flex items-center justify-center px-4 z-10">
      <h1 className="text-lg font-semibold text-body">{title}</h1>
    </header>
  );
}
