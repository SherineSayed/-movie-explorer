import { useApp } from "../context/AppContext";

// Functional component + props: `page` and `onNavigate` come from App.jsx
export default function Navbar({ page, onNavigate }) {
  const { favorites, currentUser, logout } = useApp();

  // Arrow function + array of tab definitions, rendered with map()
  const tabs = [
    { id: "home", label: "Home" },
    { id: "movies", label: "Movies" },
    { id: "favorites", label: "Favorites" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a
          className="brand"
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate("home");
          }}
        >
          <span className="brand-mark">▶</span> Marquee
        </a>

        <ul className="nav-links">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                className={page === tab.id ? "active" : ""}
                onClick={() => onNavigate(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <span className="nav-fav-count" title="Saved favorites">
            ♥ <strong>{favorites.length}</strong>
          </span>

          {/* Conditional rendering: logged-in vs guest */}
          {currentUser ? (
            <>
              <span className="section-sub">Hi, {currentUser.name.split(" ")[0]}</span>
              <button className="btn btn-ghost" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => onNavigate("auth")}>
              Log in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
