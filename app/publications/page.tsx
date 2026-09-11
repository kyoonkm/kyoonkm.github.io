import type { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { WORKS, type Author, type Work } from '@/data/research-graph';

export const metadata: Metadata = {
  title: 'Publications — Kayoon Kim',
  description:
    'Peer-reviewed articles, conference and workshop papers, and manuscripts in preparation by Kayoon Kim.',
};

/**
 * Grouped by record type, newest first inside each group.
 *
 * The old page was flat reverse-chronological, which put four items dated 2026
 * — a projected year for unpublished work — above the one peer-reviewed
 * article. A committee skimming for thirty seconds never reached the evidence.
 * Grouping is also the more honest arrangement, not the less: each group names
 * exactly what its rows are, and `status` carries the rest per row.
 */
const GROUPS: { id: string; heading: string; types: Work['type'][] }[] = [
  { id: 'journal', heading: 'Journal articles', types: ['Journal article'] },
  { id: 'venue', heading: 'Conference & workshop', types: ['Poster'] },
  {
    id: 'preprint',
    heading: 'Manuscripts & work in progress',
    types: ['Manuscript', 'Work in progress'],
  },
];

const PUBLICATIONS = WORKS.filter((w) => w.type !== 'Project');

const byYear = (a: Work, b: Work) => b.year - a.year;

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

/**
 * The byline. Kayoon renders at full ink so "first or co-first on four of six"
 * is legible at a glance instead of requiring word-by-word parsing.
 *
 * The note sits immediately after the names it annotates, not as a detached
 * legend — the old page rendered "*Equal Contribution" two lines below the
 * asterisks, styled identically to "Under review", which is a status and not
 * a footnote. Mirrors the row byline on the home page.
 */
function Byline({ authors }: { authors: Author[] }) {
  const equal = authors.some((a) => a.equal);
  return (
    <span className="rn-au">
      {authors.map((a, i) => (
        <span key={a.name} className={a.self ? 'rn-self' : undefined}>
          {i ? ', ' : ''}
          {a.name}
          {a.equal ? '*' : ''}
        </span>
      ))}
      {equal ? <span className="rn-eq"> *equal contribution</span> : null}
    </span>
  );
}

/**
 * One citation. The title is a link only when there is somewhere to go — five
 * of six have no public record yet, and the old page painted `cursor-pointer`
 * on all six plus their type labels, twelve false affordances against two real
 * links. A row that cannot be opened now says so by staying plain text.
 */
/**
 * Type, then where, then how far along, then when. A status that already names
 * the type replaces it, so "Manuscript" never prints next to "Manuscript in
 * preparation" — the restatement the old page shipped. Built as a list so the
 * " · " separators fall out of the join instead of being hand-placed on each
 * optional field, which is where the leading-separator bugs come from.
 */
function metaParts(w: Work) {
  const restatesType = !!w.status && w.status.toLowerCase().includes(w.type.toLowerCase());
  return [
    restatesType ? null : { text: w.type, className: undefined },
    w.venue ? { text: w.venue, className: 'rn-ve' } : null,
    w.status ? { text: w.status, className: 'rn-st' } : null,
    w.published ? { text: `Published ${formatDate(w.published)}`, className: undefined } : null,
  ].filter(Boolean) as { text: string; className?: string }[];
}

function PublicationRow({ w }: { w: Work }) {
  const meta = metaParts(w);

  return (
    <li id={w.id} className="rn-pub">
      <span className="rn-yr">{w.year}</span>

      <span className="rn-pub-body">
        {w.doi ? (
          <a
            className="rn-ti"
            href={`https://doi.org/${w.doi}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {w.title}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <span className="rn-ti">{w.title}</span>
        )}

        {w.authors ? <Byline authors={w.authors} /> : null}

        <span className="rn-ty">
          {meta.map((part, i) => (
            <span key={part.text} className={part.className}>
              {i ? ' · ' : ''}
              {part.text}
            </span>
          ))}
        </span>

        {w.doi ? <span className="rn-doi">doi.org/{w.doi}</span> : null}
      </span>
    </li>
  );
}

export default function PublicationsPage() {
  const groups = GROUPS.map((g) => ({
    ...g,
    items: PUBLICATIONS.filter((w) => g.types.includes(w.type)).sort(byYear),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen">
      <Header />

      <main id="main" className="rn-page">
        <section className="max-w-6xl mx-auto px-6 rn-pubs" aria-labelledby="rn-pub-h">
          <div className="rn-page-head">
            <h1 id="rn-pub-h">Publications</h1>
            {/* "publications", matching the home page list — the same six
                records were called "works" here and "publications" there. */}
            <p className="rn-showing">
              {PUBLICATIONS.length} publications, grouped by type
            </p>
          </div>

          {groups.map((g) => (
            <section key={g.id} className="rn-pub-group" aria-labelledby={`h-${g.id}`}>
              {/* No per-group count: a bare "1" beside the heading announces
                  as an unlabelled number, and with one to three rows the
                  figure is already on screen. */}
              <div className="rn-pub-group-head">
                <h2 id={`h-${g.id}`}>{g.heading}</h2>
              </div>
              <ol className="rn-pub-list">
                {g.items.map((w) => (
                  <PublicationRow key={w.id} w={w} />
                ))}
              </ol>
            </section>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
