// Controlled form input: value + onChange come from parent's useState
export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <div className="search-box">
      <span className="search-icon">⌕</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder || "Search movies by title…"}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search movies"
      />
    </div>
  );
}
