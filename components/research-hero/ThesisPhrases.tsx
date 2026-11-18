'use client';

import { AREAS, type AreaId } from '@/data/research-graph';
import { useResearchState } from './useResearchState';

const AREA_BY_ID = Object.fromEntries(AREAS.map((a) => [a.id, a])) as Record<
  AreaId,
  (typeof AREAS)[number]
>;

/* The three research interests, in the order the slides give them. Each
   opens and filters its area, as the thesis phrases used to. */
const PHRASES: { area: AreaId; text: string }[] = AREAS.map((a) => ({
  area: a.id,
  text: a.label,
}));

/**
 * The interactive part of the text column: the thesis question, the three
 * research interests (each opens and filters its area), and the aria-live
 * filter note.
 */
export default function ThesisPhrases() {
  const { area, openArea, closeAreaSoon, toggleFilter, clearFilter } = useResearchState();

  /* `after` is the punctuation that follows the phrase. It is rendered inside
     a nowrap wrapper because the button is an inline-block, which gives the
     browser a break opportunity between it and a following text node — the
     comma was wrapping to the next line on its own. */
  const phrase = (i: number, after = '') => {
    const p = PHRASES[i];
    return (
      <span className="rn-nb">
        <button
          type="button"
          className="rn-phrase"
          data-area={p.area}
          aria-pressed={area === p.area}
          onClick={() => toggleFilter(p.area)}
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse') openArea(p.area);
          }}
          onPointerLeave={closeAreaSoon}
          onFocus={() => openArea(p.area)}
          onBlur={closeAreaSoon}
        >
          {p.text}
        </button>
        {after}
      </span>
    );
  };

  return (
    <>
      <p className="rn-thesis">
        How can AI read the social context that people leave unsaid?
      </p>
      <p className="rn-interests">
        {phrase(0, ' \u00b7')} {phrase(1, ' \u00b7')} {phrase(2)}
      </p>
      <p className="rn-filter-note" aria-live="polite">
        {area ? (
          <>
            Showing {AREA_BY_ID[area].label}
            <button type="button" onClick={clearFilter}>
              Show all
            </button>
          </>
        ) : null}
      </p>
    </>
  );
}
