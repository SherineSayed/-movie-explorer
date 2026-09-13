// Reusable loading state — shown while useEffect's fetch is in flight
export default function Loader({ label = "Loading movies…", skeletonCount = 0 }) {
  if (skeletonCount > 0) {
    return (
      <div className="skeleton-grid" role="status" aria-live="polite">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div className="skeleton-card" key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="state-block" role="status" aria-live="polite">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}
