import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../api/movieApi";
import { useApp } from "../context/AppContext";
import Loader from "./Loader";
import ErrorState from "./ErrorState";

// Props: `movie` (summary card data, used immediately) + `onClose`
export default function MovieDetails({ movie, onClose }) {
  const { isFavorite, toggleFavorite } = useApp();
  const [details, setDetails] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  // useEffect: fetch the richer detail payload (cast, full summary) once,
  // whenever a different movie is opened.
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    fetchMovieDetails(movie.id)
      .then((data) => {
        if (!cancelled) {
          setDetails(data);
          setStatus("success");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorMessage(err.message);
          setStatus("error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [movie.id]);

  // Close on Escape key — a React event handled at the document level
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const shown = details || movie; // show what we have instantly, then upgrade
  const fav = isFavorite(movie.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Close details">
          ✕
        </button>

        <div className="modal-hero">
          <img src={shown.poster} alt={`${shown.title} poster`} />
          <div>
            <h3 className="modal-title">
              {shown.title} <span style={{ color: "var(--muted)", fontWeight: 400 }}>({shown.year})</span>
            </h3>
            <div className="modal-meta">
              <span>★ {shown.rating}/10</span>
              {shown.runtime ? <span>{shown.runtime} min</span> : null}
              {shown.language ? <span>{shown.language.toUpperCase()}</span> : null}
            </div>
            <div className="modal-genres">
              {shown.genres.map((g) => (
                <span key={g}>{g}</span>
              ))}
            </div>
            <div className="modal-actions">
              <button
                className={`btn ${fav ? "btn-danger" : "btn-primary"}`}
                onClick={() => toggleFavorite(shown)}
              >
                {fav ? "Remove from favorites" : "Add to favorites"}
              </button>
            </div>
          </div>
        </div>

        <div className="modal-body">
          {status === "loading" && <Loader label="Loading full details…" />}
          {status === "error" && <ErrorState message={errorMessage} />}
          {status === "success" && (
            <>
              <h4>Synopsis</h4>
              <p className="modal-summary">{details.summary}</p>
              {details.cast && details.cast.length > 0 && (
                <>
                  <h4>Cast</h4>
                  <p className="modal-summary">
                    {details.cast.slice(0, 6).map((c) => c.name).join(", ")}
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
