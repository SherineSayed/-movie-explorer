import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext(null);

const FAVORITES_KEY = "marquee.favorites";
const USERS_KEY = "marquee.users";
const SESSION_KEY = "marquee.session";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  // ---- Favorites (array of movie objects) ----
  const [favorites, setFavorites] = useState(() => readJSON(FAVORITES_KEY, []));

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (id) => favorites.some((m) => m.id === id);

  const toggleFavorite = (movie) => {
    setFavorites((prev) =>
      prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie]
    );
  };

  // ---- Auth (very simple client-side demo auth) ----
  const [currentUser, setCurrentUser] = useState(() => readJSON(SESSION_KEY, null));

  useEffect(() => {
    if (currentUser) localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    else localStorage.removeItem(SESSION_KEY);
  }, [currentUser]);

  const register = ({ name, email, password }) => {
    const users = readJSON(USERS_KEY, []);
    if (users.some((u) => u.email === email)) {
      throw new Error("An account with this email already exists.");
    }
    const user = { name, email, password };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
    setCurrentUser({ name, email });
  };

  const login = ({ email, password }) => {
    const users = readJSON(USERS_KEY, []);
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      throw new Error("Email or password is incorrect.");
    }
    setCurrentUser({ name: found.name, email: found.email });
  };

  const logout = () => setCurrentUser(null);

  const value = {
    favorites,
    isFavorite,
    toggleFavorite,
    currentUser,
    register,
    login,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
