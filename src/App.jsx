import { useEffect, useState } from "react";
import { AppProvider } from "./context/AppContext";
import { fetchMovies } from "./api/movieApi";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MoviesGrid from "./components/MoviesGrid";
import Favorites from "./components/Favorites";
import AuthForm from "./components/AuthForm";
import MovieDetails from "./components/MovieDetails";
import Footer from "./components/Footer";

function AppShell() {
  // useState: which "page" is showing, and which movie the modal is open on
  const [page, setPage] = useState("home");
  const [activeMovie, setActiveMovie] = useState(null);

  // useState + useEffect: the hero needs one great movie to feature.
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchMovies({ sortBy: "download_count", limit: 1 })
      .then((movies) => {
        if (!cancelled && movies[0]) setFeatured(movies[0]);
      })
      .catch(() => {
        /* Hero silently falls back to its skeleton; the Movies section
           below still shows a full error state if the API is down. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const openMovie = (movie) => setActiveMovie(movie);
  const closeMovie = () => setActiveMovie(null);

  return (
    <>
      <Navbar page={page} onNavigate={setPage} />

      {/* Conditional rendering: swap the whole "page" based on nav state */}
      {page === "home" && (
        <>
          <Hero movie={featured} onViewDetails={openMovie} />
          <MoviesGrid onOpenMovie={openMovie} title="Top rated right now" />
        </>
      )}

      {page === "movies" && (
        <MoviesGrid onOpenMovie={openMovie} title="All movies" />
      )}

      {page === "favorites" && <Favorites onOpenMovie={openMovie} />}

      {page === "auth" && <AuthForm onSuccess={() => setPage("home")} />}

      <Footer />

      {activeMovie && <MovieDetails movie={activeMovie} onClose={closeMovie} />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
