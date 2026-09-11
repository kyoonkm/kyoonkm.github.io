'use client';

import { AREAS, WORKS, type AreaId } from '@/data/research-graph';
import { useResearchState } from './useResearchState';

const AREA_BY_ID = Object.fromEntries(AREAS.map((a) => [a.id, a])) as Record<
  AreaId,
  (typeof AREAS)[number]
>;

const ROWS = [...WORKS].sort(
  (a, b) => b.year - a.year || Number(!!b.featured) - Number(!!a.featured),
);

function track(name: string, params: Record<string, unknown>) {
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') gtag('event', name, params);
}

/**
 * The full non-visual equivalent of the graph: every work, with its areas,
 * hover-synced to the same state. Each row links to the work itself, so this
 * list doubles as the home page's publication listing.
 */
export default function SelectedWork() {
  const { area, focus, setHover } = useResearchState();

  const rows = ROWS.filter((w) => !area || w.areas.includes(area));

  return (
    <section className="rn-works" aria-labelledby="rn-work-h">
      <div className="rn-work-head">
        <h2 id="rn-work-h">Selected work</h2>
        <p className="rn-showing">
          {area
            ? `${rows.length} of ${WORKS.length} in ${AREA_BY_ID[area].label}`
            : `${WORKS.length} works, newest first`}
        </p>
      </div>
      <ol className="rn-list">
        {rows.map((w) => {
          const external = w.href.startsWith('http');
          return (
            <li key={w.id}>
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
                  <span className="rn-su">{w.summary}</span>
                  <span className="rn-ty">
                    {w.type}
                    {w.venue ? <> · <span className="rn-ve">{w.venue}</span></> : null}
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
        })}
      </ol>
      <p className="rn-work-foot">
        <a href="/publications">All publications</a>
        <a href="/projects">All projects</a>
        <a href="/CV_Kayoon_Kim.pdf" target="_blank" rel="noopener noreferrer">
          CV (PDF)
        </a>
      </p>
    </section>
  );
}
