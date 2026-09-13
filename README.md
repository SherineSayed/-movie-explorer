# Marquee — Movie Explorer (React Final Project)

A movie/streaming browsing app built with React + Vite, connected to a real,
key-free movie API ([YTS](https://yts.mx/api)).

## Original UI reference

**Design chosen:** *Online Movie Streaming Platform* by Purrweb UI/UX Agency
— https://dribbble.com/shots/14614377-Online-Movie-Streaming-Platform

A dark UI for browsing/filtering movies with a details screen (full
description + cast), palette here (deep indigo background, blue accent,
gold star ratings) sampled from a screenshot of the actual shot — see
`DESIGN.md` for the full token list and reasoning.

> 📸 **Still needed for submission:** attach the screenshot you took of the
> link above alongside this repo — that's the "original UI you chose"
> deliverable.

## Required sections — where to find them

| Requirement | Component |
|---|---|
| Navbar | `src/components/Navbar.jsx` |
| Hero section | `src/components/Hero.jsx` |
| Movies section | `src/components/MoviesGrid.jsx` |
| Search | `src/components/SearchBar.jsx` (controlled input, debounced) |
| Category / genre filter | `src/components/GenreFilter.jsx` |
| Movie cards | `src/components/MovieCard.jsx` |
| Movie details | `src/components/MovieDetails.jsx` (modal, fetches full detail) |
| Favorites | `src/components/Favorites.jsx` + `src/context/AppContext.jsx` |
| Login / Register | `src/components/AuthForm.jsx` |
| Loading state | `src/components/Loader.jsx` |
| Error state | `src/components/ErrorState.jsx` |
| Footer | `src/components/Footer.jsx` |

## React concepts used (and where)

- **JSX / Functional components** — every file in `src/components`.
- **Props** — e.g. `MovieCard({ movie, onOpen })`, `Hero({ movie, onViewDetails })`.
- **Arrays & objects, `map()`, `key`** — genre pills, nav tabs, and movie
  grids all render from arrays with a stable `key`.
- **Conditional rendering** — loading/error/empty/success states in
  `MoviesGrid.jsx` and `MovieDetails.jsx`; logged-in vs guest nav in
  `Navbar.jsx`; page switch in `App.jsx`.
- **React events / arrow functions** — `onClick`, `onChange`, `onSubmit`
  handlers throughout, written as inline arrow functions or curried
  handlers (see `AuthForm.jsx`'s `handleChange(field) => (e) => ...`).
- **`useState`** — search text, active genre, sort order, modal state,
  favorites, auth session, form values/errors (see `AppContext.jsx`,
  `MoviesGrid.jsx`, `AuthForm.jsx`).
- **Controlled forms + validation** — `AuthForm.jsx` validates email format,
  password length, and confirm-password match, with per-field error
  messages and disabled submission until valid.
- **Search & filter** — `MoviesGrid.jsx` combines a debounced search term,
  a genre filter, and a sort order into one API call.
- **`useEffect`** — data fetching on mount/param change with cleanup to
  avoid race conditions (`MoviesGrid.jsx`, `MovieDetails.jsx`, `App.jsx`),
  persisting favorites/session to `localStorage` (`AppContext.jsx`), and an
  Escape-key listener for the modal.
- **API + fetch** — `src/api/movieApi.js` wraps the YTS REST API
  (`list_movies.json`, `movie_details.json`) with `fetch`.
- **Loading / error handling** — every fetch has a `loading` → `success`/`error`
  state machine, surfaced via `Loader.jsx` / `ErrorState.jsx` with a retry button.
- **Responsive CSS** — see the media queries at the bottom of `src/index.css`
  (collapses nav, reflows the modal, and shrinks the poster grid on mobile).

## Data source

Movie data comes from [TMDB](https://www.themoviedb.org/documentation/api)
(The Movie Database) — a free, widely-reachable API. We started with YTS
but switched because `yts.mx` is blocked on many networks (it's a
torrent-adjacent site), while TMDB is the standard choice for movie-app
projects and works everywhere.

**You need your own free API key to run this:**

1. Sign up at https://www.themoviedb.org/signup and verify your email.
2. Go to https://www.themoviedb.org/settings/api and request a free
   "Developer" key (fill in any app name/URL — it isn't checked).
3. Copy `.env.example` to a new file named `.env` in the project root, and
   put your key in it:
   ```
   VITE_TMDB_API_KEY=your_key_here
   ```
4. Restart `npm run dev` if it was already running — Vite only reads `.env`
   on startup.

`.env` is git-ignored on purpose so your key never gets pushed to GitHub.
When you deploy (Netlify/Vercel), add the same `VITE_TMDB_API_KEY` variable
in that platform's project settings — the build won't have your key
otherwise and the app will show the "Missing TMDB API key" error state.

## Auth & favorites

Login/Register is a fully client-side demo (accounts are stored in
`localStorage`, nothing is sent to a server) — this satisfies the "Login /
Register" UI + validation requirement without needing a backend. Favorites
are also persisted to `localStorage` so they survive a page refresh.

## Running it

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build (outputs to dist/)
npm run preview   # preview the production build locally
```

## Deploying

The `dist/` folder from `npm run build` is a static site — drag it into
[Netlify Drop](https://app.netlify.com/drop), or connect the GitHub repo to
Vercel/Netlify/GitHub Pages for a live link.

## What I implemented as-is vs. changed

- Implemented as-is: all 12 required UI sections, all listed React concepts,
  a real API integration with loading/error states, and responsive layout.
- Changed/added beyond the brief: a debounced search (avoids spamming the
  API on every keystroke), a demo auth system with localStorage persistence
  so favorites and login survive refreshes, and a details modal that shows
  card data instantly while it fetches the richer detail payload in the
  background — done to make the app feel real rather than static.
