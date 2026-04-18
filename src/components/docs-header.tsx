export function DocsHeader({
  group,
  title,
  description,
}: {
  group?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-10">
      {group && (
        <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-1">
          {group}
        </p>
      )}
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-lg text-muted-foreground mt-2">{description}</p>
      )}
    </header>
  );
}
