'use client';

import Link from 'next/link';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { AREAS, type AreaId } from '@/data/research-graph';
import type { Project } from '@/data/projects';

const AREA_BY_ID = Object.fromEntries(AREAS.map((a) => [a.id, a])) as Record<
  AreaId,
  (typeof AREAS)[number]
>;

export default function ProjectDetailClient({ project }: { project: Project }) {
  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* A Link, not router.back(). Arriving from the hero graph or from a
          search result, "Back to projects" used to send people to the home
          page or off the site entirely. */}
      <Link href="/projects" className="rn-back">
        &larr; Back to projects
      </Link>

      <article className="rn-detail">
        <h1>{project.title}</h1>

        <div className="rn-detail-meta">
          <span>{project.year}</span>
          <span>{project.status}</span>
          {project.areas.map((a) => (
            <span key={a} className="rn-tag" data-area={a}>
              {AREA_BY_ID[a].label}
            </span>
          ))}
        </div>

        <p className="rn-detail-lede">{project.summary}</p>

        {project.image && (
          <div className="rn-hero-fig">
            <Zoom>
              {/* Decorative: the h1 directly above already names the work. */}
              <img
                src={project.image}
                alt=""
                width={1800}
                height={1013}
                decoding="async"
              />
            </Zoom>
          </div>
        )}

        {project.fullDescription && (
          <>
            <h2>Overview</h2>
            <p className="rn-prose">{project.fullDescription}</p>
          </>
        )}

        {project.images && project.images.length > 0 && (
          <>
            <h3>Figures</h3>
            <div className="rn-gal">
              {project.images
                .filter((img) => img !== project.image)
                .map((img, i) => (
                  <Zoom key={img}>
                    <img
                      src={img}
                      alt={`${project.title}, figure ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </Zoom>
                ))}
            </div>
          </>
        )}

        <dl className="rn-facts">
          {project.technologies && (
            <div className="rn-fact">
              <dt>Built with</dt>
              <dd>{project.technologies.join(', ')}</dd>
            </div>
          )}

          {project.outcomes && (
            <div className="rn-fact">
              <dt>Outcome</dt>
              <dd>
                <ul>
                  {project.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
              </dd>
            </div>
          )}

          {project.context && (
            <div className="rn-fact">
              <dt>Where</dt>
              <dd>{project.context}</dd>
            </div>
          )}

          {project.links && (
            <div className="rn-fact">
              <dt>Links</dt>
              <dd>
                <ul>
                  {project.links.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>

        <p className="rn-work-foot">
          <Link href="/projects">All projects</Link>
          <Link href="/publications">All publications</Link>
          <a href="/CV_Kayoon_Kim.pdf" target="_blank" rel="noopener noreferrer">
            CV (PDF)
          </a>
        </p>
      </article>
    </div>
  );
}
