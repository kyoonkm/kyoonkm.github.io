import type { Metadata } from 'next';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { AREAS, WORKS, type AreaId, type Author, type Work } from '@/data/research-graph';

export const metadata: Metadata = {
  title: 'Publications — Kayoon Kim',
  description:
    'Peer-reviewed articles, conference and workshop papers, and manuscripts in preparation by Kayoon Kim.',
};

const AREA_BY_ID = Object.fromEntries(AREAS.map((a) => [a.id, a])) as Record<
  AreaId,
  (typeof AREAS)[number]
>;

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
 * The asterisk is decorative — `aria-hidden`, because a screen reader
 * announcing "star" mid-name is noise. The note it refers to is rendered in
 * the adjacent meta line rather than as a detached legend two rows down.
 */
function Byline({ authors }: { authors: Author[] }) {
  return (
    <span className="rn-au">
      {authors.map((a, i) => (
        <span key={a.name}>
          {a.self ? <b className="rn-self">{a.name}</b> : a.name}
          {a.equal ? <sup aria-hidden="true">*</sup> : null}
          {i < authors.length - 1 ? ', ' : null}
        </span>
      ))}
    </span>
  );
}

/**
 * One citation. The title is a link only when there is somewhere to go — five
 * of six have no public record yet, and the old page painted `cursor-pointer`
 * on all six plus their type labels, twelve false affordances against two real
 * links. A row that cannot be opened now says so by staying plain text.
 */
function PublicationRow({ w }: { w: Work }) {
  const equal = w.authors?.some((a) => a.equal);
  const meta = [w.type, w.venue, w.status].filter(Boolean) as string[];

  return (
    <li id={w.id} className="rn-pub">
      <span className="rn-yr">{w.year}</span>

      <span className="rn-pub-body">
        {w.doi ? (
          <a className="rn-ti" href={`https://doi.org/${w.doi}`} target="_blank" rel="noopener noreferrer">
            {w.title}
          </a>
        ) : (
          <span className="rn-ti">{w.title}</span>
        )}

        {w.authors ? <Byline authors={w.authors} /> : null}

        <span className="rn-ty">
          {meta.map((part, i) => (
            <span key={part}>
              {i > 0 ? ' · ' : null}
              <span className={i === 1 ? 'rn-ve' : undefined}>{part}</span>
            </span>
          ))}
          {w.published ? <> · Published {formatDate(w.published)}</> : null}
          {equal ? <> · Equal contribution</> : null}
        </span>

        {w.doi ? <span className="rn-doi">doi.org/{w.doi}</span> : null}
      </span>

      <span className="rn-ds">
        {w.areas.map((a) => (
          <i key={a} data-area={a} aria-hidden="true" />
        ))}
        <span className="sr-only">{w.areas.map((a) => AREA_BY_ID[a].label).join(', ')}</span>
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

      <main id="main" className="max-w-6xl mx-auto px-6">
        <section className="rn-pubs" aria-labelledby="rn-pub-h">
          <div className="rn-pub-head">
            <h1 id="rn-pub-h">Publications</h1>
            <p className="rn-showing">
              {PUBLICATIONS.length} works, grouped by type
            </p>
          </div>

          {groups.map((g) => (
            <section key={g.id} className="rn-pub-group" aria-labelledby={`h-${g.id}`}>
              <div className="rn-pub-group-head">
                <h2 id={`h-${g.id}`}>{g.heading}</h2>
                <span className="rn-showing">{g.items.length}</span>
              </div>
              <ol className="rn-pub-list">
                {g.items.map((w) => (
                  <PublicationRow key={w.id} w={w} />
                ))}
              </ol>
            </section>
          ))}

          <p className="rn-work-foot">
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
            <a href="/projects">All projects</a>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
