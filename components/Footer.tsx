/**
 * The page used to stop dead on the last publication row: no contact, no
 * location, no date. Contact is a Gmail address on purpose — the institutional
 * one expires with the affiliation, and a dead address is worse than none.
 */
export default function Footer() {
  return (
    <footer className="rn-foot">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rn-foot-grid">
          <div>
            <p className="rn-foot-name">Kayoon Kim</p>
            <p className="rn-foot-where">Tübingen, Germany</p>
          </div>

          <nav className="rn-foot-nav" aria-label="Elsewhere">
            <a href="mailto:kyoonkm@gmail.com">kyoonkm@gmail.com</a>
            <a href="/CV_Kayoon_Kim.pdf" target="_blank" rel="noopener noreferrer">
              CV (PDF)
            </a>
            <a
              href="https://scholar.google.com/citations?user=ZQQzsosAAAAJ&hl=en&oi=ao"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Scholar
            </a>
            <a href="https://github.com/kyoonkm" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/kyoonkm/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </nav>
        </div>

        <p className="rn-foot-meta">Last updated September 2026</p>
      </div>
    </footer>
  );
}
