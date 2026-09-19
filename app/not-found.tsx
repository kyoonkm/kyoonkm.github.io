import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

/* Two <h1>s, an invisible "404" at 1.1:1 on white, and a note addressed to the
   site's author rather than to whoever hit the dead link. */
export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />
      <main id="main" className="rn-page">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rn-detail">
            <p className="rn-pyr">404</p>
            <h1>There is nothing at this address</h1>
            <p className="rn-detail-lede">
              The link may be out of date, or the page may have moved. The work
              is all reachable from here.
            </p>
            <p className="rn-work-foot">
              <Link href="/">Home</Link>
              <Link href="/publications">Publications</Link>
              <Link href="/projects">Projects</Link>
              <a href="/CV_KayoonKim.pdf" target="_blank" rel="noopener noreferrer">
                CV (PDF)
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
