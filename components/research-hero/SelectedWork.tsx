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

/**
 * The full non-visual equivalent of the graph: every work, with its areas,
 * synced to the same hover / pin / filter state.
 */
export default function SelectedWork() {
  const { area, focus, setHover, togglePinned, reducedMotion } = useResearchState();

  const rows = ROWS.filter((w) => !area || w.areas.includes(area));

  return (
    <section className="rn-work" aria-labelledby="rn-work-h">
      <div className="rn-work-head">
        <h2 id="rn-work-h">Selected work</h2>
        <p className="rn-showing">
          {area
            ? `${rows.length} of ${WORKS.length} in ${AREA_BY_ID[area].label}`
            : `${WORKS.length} works, newest first`}
        </p>
      </div>
      <ol className="rn-list">
        {rows.map((w) => (
          <li key={w.id}>
            <button
              type="button"
              className={`rn-row${w.id === focus ? ' is-on' : ''}`}
              onPointerEnter={(e) => {
                if (e.pointerType === 'mouse') setHover(w.id);
              }}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(w.id)}
              onBlur={() => setHover(null)}
              onClick={() => {
                togglePinned(w.id);
                document.querySelector('.rn-hero')?.scrollIntoView({
                  block: 'start',
                  behavior: reducedMotion ? 'auto' : 'smooth',
                });
              }}
            >
              <span className="rn-yr">{w.year}</span>
              <span>
                <span className="rn-ti">{w.title}</span>
                <span className="rn-su">{w.summary}</span>
              </span>
              <span className="rn-ty">{w.type}</span>
              <span className="rn-ds">
                {w.areas.map((a) => (
                  <i key={a} data-area={a} aria-hidden="true" />
                ))}
                <span className="sr-only">{w.areas.map((a) => AREA_BY_ID[a].label).join(', ')}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
