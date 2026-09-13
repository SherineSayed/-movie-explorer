export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <div className="brand" style={{ marginBottom: 10 }}>
              <span className="brand-mark">▶</span> Marquee
            </div>
            <p style={{ maxWidth: "32ch" }}>
              A small movie explorer built as a React learning project.
            </p>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h4>Explore</h4>
              <ul>
                <li>Top rated</li>
                <li>New releases</li>
                <li>Genres</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Account</h4>
              <ul>
                <li>Log in</li>
                <li>Register</li>
                <li>Favorites</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Project</h4>
              <ul>
                <li>Built with React + Vite</li>
                <li>Movie data via YTS API</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">© {year} Marquee — Final project, for learning purposes only.</div>
      </div>
    </footer>
  );
}
