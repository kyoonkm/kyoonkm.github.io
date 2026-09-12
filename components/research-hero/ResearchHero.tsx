import ResearchGraph from './ResearchGraph';
import ThesisPhrases from './ThesisPhrases';

/**
 * The hero: name and thesis sentence on the left, the research network filling
 * the right 62%. Geometry is computed by lib/research-graph-layout.ts, so the
 * SVG is server-rendered markup. The affiliation lines used to sit under the
 * h1; they are carried by the bio instead, which states them in context.
 */
export default function ResearchHero() {
  return (
    <>
      {/* The graph renders after the intro so a keyboard or screen-reader user
          reaches the name first; .rn-net is position:absolute, so the visual
          order is unchanged. */}
      <section className="rn-hero" aria-labelledby="rn-name">
        <div className="max-w-6xl mx-auto px-6 rn-hero-inner">
          <div className="rn-intro">
            <h1 id="rn-name">Kayoon Kim</h1>
            <ThesisPhrases />
          </div>
        </div>
        <ResearchGraph />
      </section>
    </>
  );
}
