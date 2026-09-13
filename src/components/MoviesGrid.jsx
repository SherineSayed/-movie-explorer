import { useEffect, useState } from "react";
import { fetchMovies } from "../api/movieApi";
import SearchBar from "./SearchBar";
import GenreFilter from "./GenreFilter";
import MovieCard from "./MovieCard";
import Loader from "./Loader";
import ErrorState from "./ErrorState";

export default function MoviesGrid({ onOpenMovie, title = "Browse movies", showControls = true }) {
  // useState: local UI state for search text, active genre, sort order
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  // useState: async data lifecycle
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  // useEffect + fetch: debounce search input, then call the API whenever
  // query / genre / sortBy change. Cleanup cancels stale requests.
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    const timer = setTimeout(async () => {
      try {
        const results = await fetchMovies({ query, genre, sortBy, limit: 24 });
        if (!cancelled) {
          setMovies(results);
          setStatus("success");
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(err.message);
          setStatus("error");
        }
      }
    }, 400); // debounce so we don't fire a request on every keystroke

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, genre, sortBy, reloadToken]);

  return (
    <section className="section" id="movies">
      <div className="container">
        <div className="section-head">
          <h2>{title}</h2>
          <span className="section-sub">
            {status === "success" ? `${movies.length} results` : ""}
          </span>
        </div>

        {showControls && (
          <div className="controls">
            <SearchBar value={query} onChange={setQuery} />
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort movies"
            >
              <option value="rating">Top rated</option>
              <option value="year">Newest</option>
              <option value="title">A–Z</option>
              <option value="download_count">Most popular</option>
            </select>
          </div>
        )}

        {showControls && <GenreFilter active={genre} onSelect={setGenre} />}

        <div style={{ height: 24 }} />

        {/* Conditional rendering across loading / error / empty / success */}
        {status === "loading" && <Loader skeletonCount={8} />}

        {status === "error" && (
          <ErrorState message={errorMessage} onRetry={() => setReloadToken((n) => n + 1)} />
        )}

        {status === "success" && movies.length === 0 && (
          <div className="state-block">
            <h3>No movies found</h3>
            <p>Try a different title, or clear your genre filter.</p>
          </div>
        )}

        {status === "success" && movies.length > 0 && (
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onOpen={onOpenMovie} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
