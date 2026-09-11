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
 * Split, not filtered: publications and projects are ranked on different
 * scales, and showing them in one list made a PLOS ONE article and a
 * coursework project look equivalent. Both lists together still cover every
 * node in the graph, so hovering any node highlights a row somewhere.
 */
const PUBLICATIONS = WORKS.filter((w) => w.type !== 'Project').sort(byYear);
const PROJECTS = WORKS.filter((w) => w.type === 'Project').sort(byYear);

function track(name: string, params: Record<string, unknown>) {
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') gtag('event', name, params);
}

function WorkRow({ w }: { w: Work }) {
  const { focus, setHover } = useResearchState();
  const external = w.href.startsWith('http');

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
}

/**
 * The non-visual equivalent of the graph: every work, with its areas,
 * hover-synced to the same state.
 */
export default function SelectedWork() {
  const { area } = useResearchState();

  const pubs = PUBLICATIONS.filter((w) => !area || w.areas.includes(area));
  const projects = PROJECTS.filter((w) => !area || w.areas.includes(area));
  const label = area ? AREA_BY_ID[area].label : null;

  return (
    <>
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

      <section className="rn-works" aria-labelledby="rn-proj-h">
        <div className="rn-work-head">
          <h2 id="rn-proj-h">Projects</h2>
          <p className="rn-showing">
            {label
              ? `${projects.length} of ${PROJECTS.length} in ${label}`
              : `${PROJECTS.length} projects, newest first`}
          </p>
        </div>
        {projects.length ? (
          <ol className="rn-list">
            {projects.map((w) => (
              <WorkRow key={w.id} w={w} />
            ))}
          </ol>
        ) : (
          <p className="rn-empty">No projects in {label}.</p>
        )}
        <p className="rn-work-foot">
          <a href="/publications">All publications</a>
          <a href="/projects">All projects</a>
          <a href="/CV_Kayoon_Kim.pdf" target="_blank" rel="noopener noreferrer">
            CV (PDF)
          </a>
        </p>
      </section>
    </>
  );
}
