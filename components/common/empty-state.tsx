export function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="empty-state stack">
      <strong>{title}</strong>
      <span className="muted">{description}</span>
    </div>
  );
}
