import { useApp } from "../context/AppContext";
import MovieCard from "./MovieCard";

export default function Favorites({ onOpenMovie }) {
  const { favorites } = useApp();

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>Your favorites</h2>
          <span className="section-sub">{favorites.length} saved</span>
        </div>

        {/* Conditional rendering: empty state vs grid */}
        {favorites.length === 0 ? (
          <div className="state-block favorites-empty">
            <h3>No favorites yet</h3>
            <p>Tap the ♡ on any movie card to save it here for later.</p>
          </div>
        ) : (
          <div className="movie-grid">
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onOpen={onOpenMovie} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
