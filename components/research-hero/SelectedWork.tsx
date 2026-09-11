'use client';

import { AREAS, WORKS, type AreaId, type Work } from '@/data/research-graph';
import { useResearchState } from './useResearchState';

const AREA_BY_ID = Object.fromEntries(AREAS.map((a) => [a.id, a])) as Record<
  AreaId,
  (typeof AREAS)[number]
>;

const byYear = (a: Work, b: Work) =>
  b.year - a.year || Number(!!b.featured) - Number(!!a.featured);

/**
 * Publications only. Projects live on /projects, linked from the foot below;
 * mixing them here made a PLOS ONE article and a coursework project look
 * equivalent. Note the graph above still plots the full corpus, so hovering a
 * project node highlights no row.
 */
const PUBLICATIONS = WORKS.filter((w) => w.type !== 'Project').sort(byYear);

function track(name: string, params: Record<string, unknown>) {
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') gtag('event', name, params);
}

/**
 * Type, then where, then how far along. A status that already names the type
 * replaces it, so "Manuscript" never prints next to "Manuscript in
 * preparation".
 */
function metaParts(w: Work) {
  const restatesType = !!w.status && w.status.toLowerCase().includes(w.type.toLowerCase());
  return [
    restatesType ? null : { text: w.type, className: '' },
    w.venue ? { text: w.venue, className: 'rn-ve' } : null,
    w.status ? { text: w.status, className: 'rn-st' } : null,
  ].filter(Boolean) as { text: string; className: string }[];
}

function WorkRow({ w }: { w: Work }) {
  const { focus, setHover } = useResearchState();
  const external = w.href.startsWith('http');
  const meta = metaParts(w);

  return (
    <li>
      <a
        className={`rn-row${w.id === focus ? ' is-on' : ''}`}
        href={w.href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') setHover(w.id);
        }}
        onPointerLeave={() => setHover(null)}
        onFocus={() => setHover(w.id)}
        onBlur={() => setHover(null)}
        onClick={() => track('research_map_open', { id: w.id, href: w.href })}
      >
        <span className="rn-yr">{w.year}</span>
        <span>
          <span className="rn-ti">{w.title}</span>
          <span className="rn-ty">
            {meta.map((part, i) => (
              <span key={part.text} className={part.className}>
                {i ? ' · ' : ''}
                {part.text}
              </span>
            ))}
          </span>
        </span>
        <span className="rn-ds">
          {w.areas.map((a) => (
            <i key={a} data-area={a} aria-hidden="true" />
          ))}
          <span className="sr-only">
            {w.areas.map((a) => AREA_BY_ID[a].label).join(', ')}
          </span>
        </span>
      </a>
    </li>
  );
}

/**
 * The non-visual equivalent of the graph: every work, with its areas,
 * hover-synced to the same state.
 */
export default function SelectedWork() {
  const { area } = useResearchState();

  const pubs = PUBLICATIONS.filter((w) => !area || w.areas.includes(area));
  const label = area ? AREA_BY_ID[area].label : null;

  return (
    <section className="rn-works" aria-labelledby="rn-pub-h">
      <div className="rn-work-head">
        <h2 id="rn-pub-h">Publications</h2>
        <p className="rn-showing">
          {label
            ? `${pubs.length} of ${PUBLICATIONS.length} in ${label}`
            : `${PUBLICATIONS.length} publications, newest first`}
        </p>
      </div>
      {pubs.length ? (
        <ol className="rn-list">
          {pubs.map((w) => (
            <WorkRow key={w.id} w={w} />
          ))}
        </ol>
      ) : (
        <p className="rn-empty">No publications in {label}.</p>
      )}
    </section>
  );
}
