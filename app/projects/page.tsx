'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { PROJECTS_BY_YEAR } from '@/data/projects';
import { AREAS, type AreaId } from '@/data/research-graph';

const AREA_BY_ID = Object.fromEntries(AREAS.map((a) => [a.id, a])) as Record<
  AreaId,
  (typeof AREAS)[number]
>;

/**
 * Rows, newest first, one filter.
 *
 * The previous version governed seven items with a sort select, a nine-option
 * dropdown, a dismissible chip stack and a result count — a toolbar for a
 * problem this page does not have. The three toggles below are the same three
 * areas as the hero graph, so the grid and the graph finally name the work the
 * same way.
 */
export default function Projects() {
  const [area, setArea] = useState<AreaId | null>(null);

  const shown = area
    ? PROJECTS_BY_YEAR.filter((p) => p.areas.includes(area))
    : PROJECTS_BY_YEAR;
  const label = area ? AREA_BY_ID[area].label : null;

  return (
    <div className="min-h-screen">
      <Header />
      <main id="main" className="rn-page">
        <div className="max-w-6xl mx-auto px-6">
          <section aria-labelledby="rn-proj-h">
            <div className="rn-page-head">
              <h1 id="rn-proj-h">Projects</h1>
              <p className="rn-showing" role="status">
                {label
                  ? `${shown.length} of ${PROJECTS_BY_YEAR.length} in ${label}`
                  : `${PROJECTS_BY_YEAR.length} projects, newest first`}
              </p>
            </div>

            <p className="rn-lede">
              Research projects from the lab, the internships and the coursework
              that preceded them. Peer-reviewed work lives on{' '}
              <Link href="/publications" className="rn-link">
                publications
              </Link>
              .
            </p>

            <div className="rn-areafilter">
              {AREAS.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  data-area={a.id}
                  className="rn-areabtn"
                  aria-pressed={area === a.id}
                  onClick={() => setArea((cur) => (cur === a.id ? null : a.id))}
                >
                  {a.label}
                </button>
              ))}
              {area && (
                <button type="button" className="rn-clear" onClick={() => setArea(null)}>
                  Show all
                </button>
              )}
            </div>

            {shown.length ? (
              <ol className="rn-plist">
                {shown.map((p) => {
                  const credit = [p.outcomes?.[0], p.context]
                    .filter(Boolean)
                    .join(' · ');
                  return (
                    <li key={p.id}>
                      {/* The accessible name is the title and the year. It used
                          to be the title, the year, the title again and a
                          40-word paragraph, which made the links list
                          unusable. */}
                      <Link
                        className="rn-prow"
                        href={`/projects/${p.id}`}
                        aria-label={`${p.title}, ${p.year}`}
                      >
                        <p className="rn-pyr" aria-hidden="true">
                          {p.year}
                        </p>
                        <div className="rn-pmain">
                          <h2 className="rn-pti">{p.title}</h2>
                          <p className="rn-pq">{p.question}</p>
                          {credit && (
                            <p className="rn-pmeta">
                              {p.outcomes?.[0] ? (
                                <>
                                  <strong>{p.outcomes[0]}</strong>
                                  {p.context ? ` · ${p.context}` : ''}
                                </>
                              ) : (
                                p.context
                              )}
                            </p>
                          )}
                        </div>
                        <div className="rn-pfig">
                          {p.thumb && (
                            /* Decorative: the figure repeats nothing the
                               heading does not already say, and the old
                               alt text claimed a Porsche logo was "Sim-DSE". */
                            <img
                              src={p.thumb}
                              alt=""
                              width={480}
                              height={320}
                              loading="lazy"
                              decoding="async"
                            />
                          )}
                          <span className="rn-ds">
                            {p.areas.map((a) => (
                              <i key={a} data-area={a} aria-hidden="true" />
                            ))}
                            <span className="sr-only">
                              {p.areas.map((a) => AREA_BY_ID[a].label).join(', ')}
                            </span>
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="rn-empty">No projects in {label}.</p>
            )}

            <p className="rn-work-foot">
              <Link href="/publications">All publications</Link>
              <a href="/CV_Kayoon_Kim.pdf" target="_blank" rel="noopener noreferrer">
                CV (PDF)
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
