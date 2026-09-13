import { useApp } from "../context/AppContext";

// Presentational functional component, receives one `movie` object via props
export default function MovieCard({ movie, onOpen }) {
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite(movie.id);

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <button
          className="poster-hit"
          onClick={() => onOpen(movie)}
          aria-label={`View details for ${movie.title}`}
        >
          <img src={movie.poster} alt={`${movie.title} poster`} loading="lazy" />
        </button>
        <span className="movie-rating-badge">★ {movie.rating}</span>
        <button
          className={`fav-toggle${fav ? " active" : ""}`}
          onClick={() => toggleFavorite(movie)}
          aria-pressed={fav}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        >
          {fav ? "♥" : "♡"}
        </button>
      </div>
      <div className="movie-info">
        <div className="movie-title">{movie.title}</div>
        <div className="movie-meta">
          <span>{movie.year}</span>
          <span>{movie.genres[0] || "—"}</span>
        </div>
      </div>
    </div>
  );
}
