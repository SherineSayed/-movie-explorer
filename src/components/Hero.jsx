// Props: receives the featured movie (or null while loading) and a click handler
export default function Hero({ movie, onViewDetails }) {
  if (!movie) {
    return <div className="hero-skeleton" aria-hidden="true" />;
  }

  const style = { "--hero-image": `url(${movie.backdrop || movie.poster})` };

  return (
    <section className="hero" style={style}>
      <div className="hero-inner">
        <p className="hero-eyebrow">Featured tonight</p>
        <h1>{movie.title}</h1>
        <div className="hero-meta">
          <span className="hero-rating">★ {movie.rating}/10</span>
          <span>{movie.year}</span>
          {movie.runtime ? <span>{movie.runtime} min</span> : null}
          <span>{movie.genres.slice(0, 3).join(" · ")}</span>
        </div>
        <p>{movie.summary}</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => onViewDetails(movie)}>
            View details
          </button>
        </div>
      </div>
    </section>
  );
}
