// ---------------------------------------------------------------------------
// Real API integration: TMDB (The Movie Database) — https://www.themoviedb.org
// Docs: https://developer.themoviedb.org/docs
// We switched to TMDB from YTS because yts.mx is blocked on many networks
// (it's a torrent-adjacent site). TMDB is the standard, widely-reachable
// choice for movie-app learning projects.
//
// The API key comes from an environment variable (VITE_TMDB_API_KEY), read
// from a local .env file. It is NOT hard-coded here — see .env.example for
// how to set your own key.
// ---------------------------------------------------------------------------

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

const PLACEHOLDER_POSTER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600'>
       <rect width='100%' height='100%' fill='#20244A'/>
       <text x='50%' y='50%' fill='#9AA0BE' font-family='sans-serif' font-size='20'
             text-anchor='middle' dominant-baseline='middle'>No Poster</text>
     </svg>`
  );

// TMDB's official genre id -> name map for movies (fixed, doesn't need a
// network call). Used to turn the `genre_ids` array from list endpoints
// into readable genre names.
const GENRE_ID_TO_NAME = {
  28: "Action",
  35: "Comedy",
  18: "Drama",
  27: "Horror",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller",
  16: "Animation",
  99: "Documentary",
  14: "Fantasy",
  80: "Crime",
};

// Reverse map, used to turn our genre-filter pill ("Action") into the id
// TMDB's `discover` endpoint expects (28).
const GENRE_NAME_TO_ID = Object.fromEntries(
  Object.entries(GENRE_ID_TO_NAME).map(([id, name]) => [name, id])
);

// map() + arrays/objects: normalize a raw TMDB movie into the shape our UI uses
function normalizeMovie(raw) {
  return {
    id: raw.id,
    title: raw.title || raw.name,
    year: raw.release_date ? raw.release_date.slice(0, 4) : "—",
    rating: raw.vote_average ? Math.round(raw.vote_average * 10) / 10 : 0,
    runtime: raw.runtime || null,
    genres:
      raw.genres?.map((g) => g.name) ||
      raw.genre_ids?.map((id) => GENRE_ID_TO_NAME[id]).filter(Boolean) ||
      [],
    summary: raw.overview || "No summary available.",
    poster: raw.poster_path ? `${IMAGE_BASE}/w500${raw.poster_path}` : PLACEHOLDER_POSTER,
    backdrop: raw.backdrop_path
      ? `${IMAGE_BASE}/original${raw.backdrop_path}`
      : raw.poster_path
      ? `${IMAGE_BASE}/w780${raw.poster_path}`
      : null,
    language: raw.original_language,
    cast: raw.credits?.cast || [],
  };
}

function assertKey() {
  if (!API_KEY) {
    throw new Error(
      "Missing TMDB API key. Add VITE_TMDB_API_KEY=your_key to a .env file at the project root, then restart `npm run dev`."
    );
  }
}

const SORT_MAP = {
  rating: "vote_average.desc",
  year: "primary_release_date.desc",
  title: "title.asc",
  download_count: "popularity.desc",
};

/**
 * Fetch a list of movies, optionally filtered by search term / genre / sort.
 * Throws on network or API-level failure so callers can show an error state.
 */
export async function fetchMovies({ query = "", genre = "All", sortBy = "rating", limit = 20 } = {}) {
  assertKey();

  let url;
  if (query) {
    // Search endpoint doesn't support genre/sort filters — TMDB limitation.
    const params = new URLSearchParams({ api_key: API_KEY, query, page: "1" });
    url = `${BASE_URL}/search/movie?${params.toString()}`;
  } else {
    const params = new URLSearchParams({
      api_key: API_KEY,
      sort_by: SORT_MAP[sortBy] || "popularity.desc",
      page: "1",
      "vote_count.gte": "50", // filters out obscure titles with 1-2 votes
    });
    if (genre && genre !== "All" && GENRE_NAME_TO_ID[genre]) {
      params.set("with_genres", GENRE_NAME_TO_ID[genre]);
    }
    url = `${BASE_URL}/discover/movie?${params.toString()}`;
  }

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Movie service returned ${res.status}`);
  }
  const json = await res.json();
  const movies = (json.results || []).map(normalizeMovie);
  return movies.slice(0, limit);
}

/** Fetch full details for a single movie by id, including cast. */
export async function fetchMovieDetails(id) {
  assertKey();
  const params = new URLSearchParams({ api_key: API_KEY, append_to_response: "credits" });
  const res = await fetch(`${BASE_URL}/movie/${id}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Movie service returned ${res.status}`);
  }
  const json = await res.json();
  return normalizeMovie(json);
}

export const GENRES = ["All", ...Object.values(GENRE_ID_TO_NAME)];
