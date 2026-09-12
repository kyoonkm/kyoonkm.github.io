'use client';

import { AREAS, type AreaId } from '@/data/research-graph';
import { useResearchState } from './useResearchState';

const AREA_BY_ID = Object.fromEntries(AREAS.map((a) => [a.id, a])) as Record<
  AreaId,
  (typeof AREAS)[number]
>;

const PHRASES: { area: AreaId; text: string }[] = [
  { area: 'society', text: 'society' },
  { area: 'ai', text: 'AI agents & ML' },
  { area: 'decisions', text: 'better human decisions' },
];

/**
 * The interactive part of the text column: the thesis sentence (each phrase
 * opens and filters its area) plus the aria-live filter note.
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
        Studying {phrase(0)} with {phrase(1, ',')} for {phrase(2, '.')}
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
