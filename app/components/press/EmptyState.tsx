export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="press-empty" role="status">
      <p className="press-empty__title">{title}</p>
      <p className="press-empty__desc">{description}</p>
      {action}
    </div>
  );
}
