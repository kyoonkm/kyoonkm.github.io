import ResearchGraph from './ResearchGraph';
import ThesisPhrases from './ThesisPhrases';

interface IconLink {
  label: string;
  href: string;
  external: boolean;
  viewBox?: string;
  path: React.ReactNode;
}

const ICONS: IconLink[] = [
  {
    label: 'CV (PDF)',
    href: '/CV_Kayoon_Kim.pdf',
    external: true,
    path: (
      <g fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 17h4" />
      </g>
    ),
  },
  {
    label: 'Google Scholar',
    href: 'https://scholar.google.com/citations?user=ZQQzsosAAAAJ&hl=en&oi=ao',
    external: true,
    path: (
      <g fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9.5 12 4l10 5.5L12 15z" />
        <path d="M6 11.7V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.3" />
        <path d="M22 9.5V15" />
      </g>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/kyoonkm/',
    external: true,
    path: (
      <path
        fill="currentColor"
        d="M5 9.2h3V19H5zM6.5 4.6a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4zM10.2 9.2h2.9v1.4c.5-.8 1.6-1.6 3.2-1.6 3 0 3.6 1.9 3.6 4.5V19h-3v-4.9c0-1.2 0-2.7-1.7-2.7s-2 1.3-2 2.6v5h-3z"
      />
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/kyoonkm',
    external: true,
    viewBox: '0 0 16 16',
    path: (
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
      />
    ),
  },
  {
    label: 'Email',
    href: 'mailto:kyoonkm@gmail.com',
    external: false,
    path: (
      <g fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <rect x={3} y={5.5} width={18} height={13} rx={2} />
        <path d="m3.5 7 8.5 6 8.5-6" />
      </g>
    ),
  },
];

/**
 * The hero: name and thesis sentence on the left, the research network filling
 * the right 62%. Geometry is computed by lib/research-graph-layout.ts, so the
 * SVG is server-rendered markup. The affiliation lines used to sit under the
 * h1; they are carried by the bio instead, which states them in context.
 */
export default function ResearchHero() {
  return (
    <>
      <section className="rn-hero" aria-labelledby="rn-name">
        <ResearchGraph />
        <div className="max-w-6xl mx-auto px-6 rn-hero-inner">
          <div className="rn-intro">
            <h1 id="rn-name">Kayoon Kim</h1>
            <ThesisPhrases />
            <div className="rn-icons">
              {ICONS.map((icon) => (
                <a
                  key={icon.label}
                  className="rn-icon"
                  href={icon.href}
                  title={icon.label}
                  aria-label={icon.label}
                  {...(icon.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <svg viewBox={icon.viewBox ?? '0 0 24 24'} aria-hidden="true">
                    {icon.path}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
