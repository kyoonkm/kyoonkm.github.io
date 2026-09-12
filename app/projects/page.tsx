import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { PROJECTS_BY_YEAR, type Project } from '@/data/projects';
import { AREAS, type AreaId } from '@/data/research-graph';

export const metadata: Metadata = {
  title: 'Projects — Kayoon Kim',
  description:
    'Research projects in human–AI interaction, social agents and computational social science by Kayoon Kim.',
};

const AREA_BY_ID = Object.fromEntries(AREAS.map((a) => [a.id, a])) as Record<
  AreaId,
  (typeof AREAS)[number]
>;

/**
 * One list, newest first.
 *
 * Grouping by outcome was tried and reverted: it is the better arrangement for
 * a committee hunting for peer review, and the worse one for the far more
 * common reader who wants to know what this person is working on now. Sorted
 * by outcome, the page opened on 2020 and buried 2026 below the fold. The
 * credential survives per row instead, in bold on the meta line.
 *
 * The three area toggles are also gone — every one of them returned exactly
 * four of eight, so the control could only ever answer "half". The areas
 * survive as the dots on each row, keyed by the legend below, which is the
 * first place the blurbs in data/research-graph.ts have been shown to a
 * reader. With no filter the route needs no client state.
 */
export default function Projects() {
  let figureIndex = 0;

  const Row = ({ p }: { p: Project }) => {
    /* The first figure on the page is the LCP candidate; the rest defer. */
    const eager = figureIndex++ === 0;
    const outcome = p.outcomes?.[0];
    const areaNames = p.areas.map((a) => AREA_BY_ID[a].label).join(', ');

    return (
      <li>
        {/*
          aria-label replaces the whole subtree for name computation, so
          everything the row says has to be inside it. An earlier version
          carried only the title and the year, which silently dropped
          "Published in PLOS ONE, 2024" out of the accessible tree entirely.
        */}
        <Link
          className="rn-prow"
          href={`/projects/${p.id}`}
          aria-label={`${p.title}, ${p.year}${outcome ? `. ${outcome}` : ''}. ${areaNames}`}
        >
          <div className="rn-pmain">
            <p className="rn-pyr" aria-hidden="true">
              {p.year}
            </p>
            <h2 className="rn-pti">{p.title}</h2>
            <p className="rn-pq">{p.question}</p>
            {(outcome || p.context) && (
              <p className="rn-pmeta">
                {outcome ? (
                  <>
                    <strong>{outcome}</strong>
                    {p.context ? ` · ${p.context}` : ''}
                  </>
                ) : (
                  p.context
                )}
              </p>
            )}
          </div>

          {/*
            Dots first, so a row with a figure and a row without start their
            column at the same y. The one project with no figure used to float
            its dots 130px above everyone else's.
          */}
          <div className="rn-pfig">
            <span className="rn-ds" aria-hidden="true">
              {p.areas.map((a) => (
                <i key={a} data-area={a} />
              ))}
            </span>
            {p.thumb && (
              /*
                Contained on a mat, not cropped to fill. These are research
                figures of wildly different proportions — forcing them all to
                one aspect ratio cut 46% off the widest. The mat is what gives
                seven unrelated screenshots a shared treatment.
              */
              <span className="rn-mat">
                <img
                  src={p.thumb}
                  alt=""
                  width={640}
                  height={360}
                  loading={eager ? 'eager' : 'lazy'}
                  fetchPriority={eager ? 'high' : undefined}
                  decoding="async"
                />
              </span>
            )}
          </div>
        </Link>
      </li>
    );
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main id="main" className="rn-page">
        <div className="max-w-6xl mx-auto px-6">
          <section aria-labelledby="rn-proj-h">
            <div className="rn-page-head">
              <h1 id="rn-proj-h">Projects</h1>
              <p className="rn-showing">
                {PROJECTS_BY_YEAR.length} projects, newest first
              </p>
            </div>

            <p className="rn-lede">
              Research projects from the lab, the internships and the coursework
              that preceded them. Peer-reviewed work is listed in full on{' '}
              <Link href="/publications" className="rn-link">
                publications
              </Link>
              .
            </p>

            {/* The key for the dots on every row, and the one place the area
                definitions are written out for a reader. */}
            <dl className="rn-areakey">
              {AREAS.map((a) => (
                <div key={a.id} data-area={a.id}>
                  <dt>{a.label}</dt>
                  <dd>{a.blurb}</dd>
                </div>
              ))}
            </dl>

            <ol className="rn-plist">
              {PROJECTS_BY_YEAR.map((p) => (
                <Row key={p.id} p={p} />
              ))}
            </ol>

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
