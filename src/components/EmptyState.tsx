interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="card state-card">
      <h3 className="state-title">{title}</h3>
      <p className="state-copy">{message}</p>
    </div>
  );
}
