import { GENRES } from "../api/movieApi";

// Filter UI driven entirely by props (active genre + setter from parent state)
export default function GenreFilter({ active, onSelect }) {
  return (
    <div className="genre-filter" role="group" aria-label="Filter by genre">
      {GENRES.map((genre) => (
        <button
          key={genre}
          className={`genre-pill${active === genre ? " active" : ""}`}
          onClick={() => onSelect(genre)}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
