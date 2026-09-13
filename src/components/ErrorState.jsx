// Reusable error state — shown when a fetch in useEffect throws/rejects
export default function ErrorState({ message, onRetry }) {
  return (
    <div className="state-block" role="alert">
      <h3>Something went wrong</h3>
      <p>{message || "We couldn't reach the movie service. Check your connection and try again."}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
