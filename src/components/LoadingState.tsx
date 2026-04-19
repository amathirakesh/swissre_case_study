interface LoadingStateProps {
  title?: string;
  message?: string;
}

export function LoadingState({
  title = 'Loading data',
  message = 'Fetching the next view while preserving responsive shell rendering.',
}: LoadingStateProps) {
  return (
    <div className="card state-card" role="status" aria-live="polite">
      <h3 className="state-title">{title}</h3>
      <p className="state-copy">{message}</p>
    </div>
  );
}
