interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }: ErrorStateProps) {
  return (
    <div className="card state-card" role="alert">
      <h3 className="state-title">{title}</h3>
      <p className="state-copy">{message}</p>
      {onRetry ? (
        <button className="button" type="button" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}
