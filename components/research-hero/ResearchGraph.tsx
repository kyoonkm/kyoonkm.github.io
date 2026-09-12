'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { AREAS, type AreaId } from '@/data/research-graph';
import {
  AREA_R_OPEN,
  AREA_R_REST,
  VIEW_BOX,
  type GraphNode,
} from '@/lib/research-graph-layout';
import { useResearchState } from './useResearchState';

const AREA_BY_ID = Object.fromEntries(AREAS.map((a) => [a.id, a])) as Record<AreaId, (typeof AREAS)[number]>;

/* Stable style objects: React never re-diffs them, so the rAF loop owns
   `opacity` and `display` on these elements without being clobbered. */
const STYLE_SHOWN: CSSProperties = { opacity: 1 };
const STYLE_HIDDEN: CSSProperties = { opacity: 0, display: 'none' };
const STYLE_EDGE_HIDDEN: CSSProperties = { display: 'none' };

const TIP_W = 290;
const TIP_GAP = 18;

interface NodeRefs {
  outer: SVGGElement | null;
  body: SVGCircleElement | null;
  hit: SVGCircleElement | null;
  ring: SVGCircleElement | null;
  pulse: SVGCircleElement | null;
  text: SVGTextElement | null;
}

export default function ResearchGraph() {
  const {
    graph,
    area,
    hover,
    pinned,
    focus,
    open,
    visible,
    mobile,
    reducedMotion,
    openArea,
    closeAreaSoon,
    cancelClose,
    toggleFilter,
    setHover,
    togglePinned,
    unpin,
  } = useResearchState();

  /* The one node that carries tabIndex=0. Starts on the first area, follows
     the arrow keys, and never points at a hidden node. */
  const [roving, setRoving] = useState<string>(() => graph.nodes[0]?.id ?? '');

  const tabbable = graph.nodes.filter((n) => n.kind === 'area' || visible.has(n.id));
  const rovingValid = tabbable.some((n) => n.id === roving);
  const rovingId = rovingValid ? roving : (tabbable[0]?.id ?? '');

  const moveRoving = useCallback(
    (from: string, step: number) => {
      const ids = tabbable.map((n) => n.id);
      const i = ids.indexOf(from);
      if (i < 0) return;
      const next = ids[(i + step + ids.length) % ids.length];
      setRoving(next);
      nodeRefs.current[next]?.outer?.querySelector<SVGGElement>('.rn-nd')?.focus();
    },
    [tabbable],
  );

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Record<string, NodeRefs>>({});
  const edgeRefs = useRef<Record<string, SVGLineElement | null>>({});

  const revRef = useRef<Record<string, number>>({});
  const hubBigRef = useRef(1);
  /* Entrance progress 0..1, and a per-node hover lift. Both start settled so
     that markup rendered without JS is the finished state, not a blank frame. */
  const mountRef = useRef(1);
  const liftRef = useRef<Record<string, number>>({});
  if (Object.keys(revRef.current).length === 0) {
    for (const n of graph.nodes) revRef.current[n.id] = n.kind === 'area' ? 1 : 0;
  }

  /* Latest derived state, read by the animation loop without restarting it. */
  const live = useRef({ visible, open, focus, reducedMotion });
  const hoverRef = useRef(hover);
  useLayoutEffect(() => {
    live.current = { visible, open, focus, reducedMotion };
    hoverRef.current = hover;
  }, [visible, open, focus, reducedMotion, hover]);

  const getRefs = (id: string): NodeRefs =>
    (nodeRefs.current[id] ??= {
      outer: null,
      body: null,
      hit: null,
      ring: null,
      pulse: null,
      text: null,
    });

  /* ---------------------------------------------------------------- */
  /* Animation: reveal, drift, idle pulse                              */
  /* ---------------------------------------------------------------- */

  useEffect(() => {
    const { nodes, edges, triangle, adjacency, byId, labels } = graph;
    const ease = (u: number) => 1 - Math.pow(1 - u, 3);
    let t = 0;

    /* Arm the entrance here rather than at declaration: this runs only when JS
       is alive, so a failed bundle leaves the server markup fully visible. */
    if (!live.current.reducedMotion) mountRef.current = 0;

    /* Two summed periods per axis, so the orbit never repeats visibly and the
       nodes do not drift in lockstep. Amplitudes are in viewBox units: the
       graph renders at roughly 0.9x, so 4 units reads as ~4px of travel. */
    const drift = (n: GraphNode) => {
      if (!t) return { x: 0, y: 0 };
      const amp = n.kind === 'area' ? 3.4 : 6;
      const w = (2 * Math.PI) / (11 + (n.index % 7));
      const w2 = (2 * Math.PI) / (17 + (n.index % 5));
      const ph = n.index * 1.7;
      return {
        x: amp * (0.72 * Math.sin(t * w + ph) + 0.28 * Math.sin(t * w2 + ph * 0.6)),
        y: amp * (0.72 * Math.cos(t * w * 0.8 + ph) + 0.28 * Math.cos(t * w2 * 1.3 + ph)),
      };
    };

    /* Distance from a node to the area it blooms out of, normalised across the
       graph. Drives the stagger: near works arrive first, far works trail, so
       an area opens as a wavefront travelling outward rather than a puff. */
    const spread: Record<string, number> = {};
    {
      let max = 1;
      for (const n of nodes) {
        if (n.kind === 'area') continue;
        const home = n.kind === 'work' ? byId[n.areas[0]] : byId[(adjacency[n.id] ?? [])[0]];
        const d = home ? Math.hypot(n.x - home.x, n.y - home.y) : 0;
        spread[n.id] = d;
        if (d > max) max = d;
      }
      for (const id in spread) spread[id] /= max;
    }

    const place = () => {
      const { visible, open, focus, reducedMotion } = live.current;
      const rev = revRef.current;
      const cur: Record<string, { x: number; y: number }> = {};

      for (const n of nodes) {
        if (n.kind !== 'area') continue;
        const d = drift(n);
        cur[n.id] = { x: n.x + d.x, y: n.y + d.y };
      }

      /* A work blooms out of the open area node it belongs to. */
      const originOf = (n: GraphNode) => {
        const a = n.areas.find((a) => open.has(a)) ?? n.areas[0];
        return cur[a];
      };

      {
        for (const n of nodes) {
          if (n.kind !== 'work') continue;
          const d = drift(n);
          const final = { x: n.x + d.x, y: n.y + d.y };
          const o = originOf(n);
          const e = ease(rev[n.id]);
          cur[n.id] = {
            x: o.x + (final.x - o.x) * e,
            y: o.y + (final.y - o.y) * e,
          };
        }
      }

      /* Entrance: the three areas settle in first, each a beat after the last,
         then the triangle draws between them. Everything else is ambient. */
      const m = mountRef.current;
      let ai = 0;

      for (const n of nodes) {
        const refs = nodeRefs.current[n.id];
        if (!refs?.outer) continue;
        const e = n.kind === 'area' ? 1 : ease(rev[n.id]);
        const p = cur[n.id];

        let enter = 1;
        if (n.kind === 'area') {
          const stagger = ai++ * 0.16;
          enter = ease(Math.min(1, Math.max(0, (m - stagger) / (1 - stagger || 1))));
        }

        const lift = liftRef.current[n.id] ?? 0;
        const s = (0.35 + 0.65 * e) * (0.9 + 0.1 * enter) * (1 + 0.085 * lift);
        refs.outer.setAttribute(
          'transform',
          `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${s.toFixed(3)})`,
        );
        const o = e * enter;
        refs.outer.style.opacity = o.toFixed(3);
        refs.outer.style.display = o < 0.01 ? 'none' : '';
      }

      for (const ed of edges) {
        const line = edgeRefs.current[ed.id];
        if (!line) continue;
        const a = cur[ed.a];
        const b = cur[ed.b];
        const o = ease(Math.min(rev[ed.a], rev[ed.b]));
        line.setAttribute('x1', a.x.toFixed(1));
        line.setAttribute('y1', a.y.toFixed(1));
        line.setAttribute('x2', b.x.toFixed(1));
        line.setAttribute('y2', b.y.toFixed(1));
        /* The edge is the claim of membership, so it draws from the area
           outward rather than fading in place. */
        if (o < 0.995) {
          const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
          line.setAttribute('stroke-dasharray', len.toFixed(1));
          line.setAttribute('stroke-dashoffset', (len * (1 - o)).toFixed(1));
        } else if (line.hasAttribute('stroke-dasharray')) {
          line.removeAttribute('stroke-dasharray');
          line.removeAttribute('stroke-dashoffset');
        }
        line.setAttribute('stroke-opacity', Math.min(1, o * 1.6).toFixed(3));
        line.style.display = o < 0.01 ? 'none' : '';
      }

      /* The triangle draws itself in after the areas land: dash the full span,
         then retract the offset. */
      const draw = ease(Math.min(1, Math.max(0, (m - 0.35) / 0.65)));
      for (const ed of triangle) {
        const line = edgeRefs.current[ed.id];
        if (!line) continue;
        const a = cur[ed.a];
        const b = cur[ed.b];
        line.setAttribute('x1', a.x.toFixed(1));
        line.setAttribute('y1', a.y.toFixed(1));
        line.setAttribute('x2', b.x.toFixed(1));
        line.setAttribute('y2', b.y.toFixed(1));
        if (draw < 0.999) {
          const len = Math.hypot(b.x - a.x, b.y - a.y);
          line.setAttribute('stroke-dasharray', len.toFixed(1));
          line.setAttribute('stroke-dashoffset', (len * (1 - draw)).toFixed(1));
        } else if (line.hasAttribute('stroke-dasharray')) {
          line.removeAttribute('stroke-dasharray');
          line.removeAttribute('stroke-dashoffset');
        }
      }

      /* The idle pulse is the only hint that the area nodes are interactive. */
      const idle = open.size === 0 && !focus && !reducedMotion;
      const hr = AREA_R_OPEN + (AREA_R_REST - AREA_R_OPEN) * ease(hubBigRef.current);
      let k = 0;
      for (const n of nodes) {
        if (n.kind !== 'area') continue;
        const refs = nodeRefs.current[n.id];
        const i = k++;
        if (!refs) continue;
        refs.body?.setAttribute('r', hr.toFixed(2));
        refs.hit?.setAttribute('r', (hr + 12).toFixed(2));
        refs.ring?.setAttribute('r', (hr + 4).toFixed(2));
        const lab = labels[n.id];
        if (refs.text && lab) {
          const dy = n.area?.labelSide === 'below' ? hr + lab.fontSize + 4 : -hr - 10;
          refs.text.setAttribute('y', dy.toFixed(2));
        }
        if (!refs.pulse) continue;
        if (!idle) {
          refs.pulse.setAttribute('opacity', '0');
          continue;
        }
        const ph = ((t + i * 1.3) % 3.8) / 3.8;
        refs.pulse.setAttribute('r', (hr + 22 * ph).toFixed(2));
        refs.pulse.setAttribute('opacity', (0.62 * (1 - ph) * (1 - ph)).toFixed(3));
      }
    };

    let raf = 0;
    const frame = (ts: number) => {
      const { visible, open, focus, reducedMotion } = live.current;
      t = reducedMotion ? 0 : ts / 1000;

      /* Exponential ease-out toward settled, so the entrance decelerates. */
      mountRef.current = reducedMotion
        ? 1
        : mountRef.current > 0.999
          ? 1
          : mountRef.current + (1 - mountRef.current) * 0.045;

      /* Lift follows hover, not focus: focus includes the pinned node, which
         left a pinned circle permanently enlarged. */
      const lift = liftRef.current;
      for (const n of nodes) {
        const target = n.id === hoverRef.current ? 1 : 0;
        const prev = lift[n.id] ?? 0;
        const d = target - prev;
        lift[n.id] =
          reducedMotion || Math.abs(d) < 0.004 ? target : prev + d * 0.18;
      }

      const rev = revRef.current;
      for (const n of nodes) {
        if (n.kind === 'area') continue;
        const target = visible.has(n.id) ? 1 : 0;
        /* Opening is a wavefront — near nodes lead, far nodes trail — and
           closing is uniform and quicker, because dismissal should not feel
           as consequential as discovery. */
        const k = reducedMotion
          ? 1
          : target
            ? 0.19 - 0.11 * spread[n.id]
            : 0.26;
        const d = target - rev[n.id];
        rev[n.id] = Math.abs(d) < 0.004 ? target : rev[n.id] + d * k;
      }
      const target = open.size || focus ? 0 : 1;
      const d = target - hubBigRef.current;
      hubBigRef.current =
        Math.abs(d) < 0.004 ? target : hubBigRef.current + d * (reducedMotion ? 1 : 0.12);
      place();
      raf = requestAnimationFrame(frame);
    };

    let onScreen = true;
    const start = () => {
      cancelAnimationFrame(raf);
      if (onScreen && !document.hidden) raf = requestAnimationFrame(frame);
      else place();
    };

    const onVisibility = () => start();
    document.addEventListener('visibilitychange', onVisibility);

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined' && svgRef.current) {
      io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        start();
      });
      io.observe(svgRef.current);
    }

    place();
    start();

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
      io?.disconnect();
    };
  }, [graph]);

  /* ---------------------------------------------------------------- */
  /* Tooltip                                                           */
  /* ---------------------------------------------------------------- */

  const [tipPos, setTipPos] = useState<{ left: number; top: number } | null>(null);

  const positionTip = useCallback(() => {
    const svg = svgRef.current;
    const tip = tipRef.current;
    if (!svg || !tip || !focus || mobile) {
      setTipPos(null);
      return;
    }
    const hero = svg.closest('.rn-hero') as HTMLElement | null;
    const m = svg.getScreenCTM();
    if (!hero || !m) return;
    const rect = hero.getBoundingClientRect();
    const node = graph.byId[focus];
    const toScreen = (id: string) => ({
      x: m.a * graph.byId[id].x + m.e - rect.left,
      y: m.d * graph.byId[id].y + m.f - rect.top,
    });

    const s0 = toScreen(focus);
    const r = (node.kind === 'area' ? AREA_R_OPEN : node.r) * m.a;
    const h = tip.offsetHeight;
    const neighbours = new Set(graph.adjacency[focus] ?? []);

    // Try right, left, below, above; clamp inside the hero.
    const candidates = [
      { x: s0.x + r + TIP_GAP, y: s0.y - 24 },
      { x: s0.x - r - TIP_GAP - TIP_W, y: s0.y - 24 },
      { x: s0.x - TIP_W / 2, y: s0.y + r + TIP_GAP },
      { x: s0.x - TIP_W / 2, y: s0.y - r - TIP_GAP - h },
    ].map((c) => ({
      x: Math.max(12, Math.min(c.x, rect.width - TIP_W - 12)),
      y: Math.max(12, Math.min(c.y, rect.height - h - 12)),
    }));

    // Prefer the side that covers the fewest visible nodes: area nodes weigh
    // most, then the focused node's neighbours. Never cover the node itself.
    const points = [...visible].map((id) => {
      const n = graph.byId[id];
      return {
        ...toScreen(id),
        weight: n.kind === 'area' ? 6 : neighbours.has(id) ? 3 : 1,
        pad: n.kind === 'area' ? 40 : 12,
      };
    });
    const cost = (c: { x: number; y: number }) =>
      points.reduce(
        (s, p) =>
          s +
          (p.x > c.x - p.pad &&
          p.x < c.x + TIP_W + p.pad &&
          p.y > c.y - p.pad &&
          p.y < c.y + h + p.pad
            ? p.weight
            : 0),
        0,
      ) +
      (s0.x > c.x - r && s0.x < c.x + TIP_W + r && s0.y > c.y - r && s0.y < c.y + h + r
        ? 99
        : 0);

    const best = candidates.reduce((a, c) => (cost(c) < cost(a) ? c : a));
    setTipPos({ left: best.x, top: best.y });
  }, [focus, mobile, graph, visible]);

  useEffect(() => {
    positionTip();
  }, [positionTip]);

  useEffect(() => {
    const onResize = () => positionTip();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [positionTip]);

  /* ---------------------------------------------------------------- */
  /* Interaction                                                       */
  /* ---------------------------------------------------------------- */

  const enter = (n: GraphNode) => {
    cancelClose();
    if (n.kind === 'area') openArea(n.id as AreaId);
    else setHover(n.id);
  };
  const leave = (n: GraphNode) => {
    if (hover === n.id) setHover(null);
  };
  const activate = (n: GraphNode) => {
    if (n.kind === 'area') toggleFilter(n.id as AreaId);
    else togglePinned(n.id);
  };

  const focusNode = focus ? graph.byId[focus] : null;
  const neighbours = focus ? new Set([focus, ...(graph.adjacency[focus] ?? [])]) : null;

  /* ---------------------------------------------------------------- */
  /* Render                                                            */
  /* ---------------------------------------------------------------- */

  return (
    <>
      <svg
        ref={svgRef}
        className="rn-net"
        viewBox={VIEW_BOX}
        // Left-anchored, not centred: the 62% band is wider than the graph's
        // aspect allows, and centring opened dead space between name and graph.
        preserveAspectRatio="xMinYMid meet"
        role="group"
        aria-label="Research network: three research areas. Select an area to reveal its work. Every publication is also listed in full under Publications below."
        onPointerEnter={cancelClose}
        onPointerLeave={closeAreaSoon}
      >
        <rect
          x={-2000}
          y={-2000}
          width={6000}
          height={6000}
          fill="transparent"
          onClick={unpin}
        />

        <g>
          {graph.triangle.map((e) => (
            <line
              key={e.id}
              ref={(el) => {
                edgeRefs.current[e.id] = el;
              }}
              className="rn-edge rn-tri"
              x1={graph.byId[e.a].x}
              y1={graph.byId[e.a].y}
              x2={graph.byId[e.b].x}
              y2={graph.byId[e.b].y}
            />
          ))}
          {graph.edges.map((e) => {
            const hot = !!focus && (e.a === focus || e.b === focus);
            return (
              <line
                key={e.id}
                ref={(el) => {
                  edgeRefs.current[e.id] = el;
                }}
                className={`rn-edge${hot ? ' is-hot' : ''}${focus && !hot ? ' is-dim' : ''}`}
                x1={graph.byId[e.a].x}
                y1={graph.byId[e.a].y}
                x2={graph.byId[e.b].x}
                y2={graph.byId[e.b].y}
                strokeOpacity={0}
                style={STYLE_EDGE_HIDDEN}
              />
            );
          })}
        </g>

        <g>
          {graph.nodes.map((n) => {
            const refs = getRefs(n.id);
            const label = graph.labels[n.id];
            const isArea = n.kind === 'area';
            const shown =
              isArea || (visible.has(n.id) && (!mobile || n.id === focus));
            const dim = !!focus && !neighbours!.has(n.id);
            const pressed = isArea ? n.id === area : n.id === pinned;
            return (
              <g
                key={n.id}
                ref={(el) => {
                  refs.outer = el;
                }}
                transform={`translate(${n.x.toFixed(1)} ${n.y.toFixed(1)}) scale(${isArea ? 1 : 0.35})`}
                style={isArea ? STYLE_SHOWN : STYLE_HIDDEN}
              >
                <g
                  className={[
                    'rn-nd',
                    `rn-${n.kind}`,
                    shown ? 'is-shown' : '',
                    dim ? 'is-dim' : '',
                    n.id === focus ? 'is-on' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  data-area={isArea ? n.id : n.areas[0]}
                  /* Roving: exactly one node is tabbable, so the graph costs a
                     single Tab stop instead of 25, and the tab ring no longer
                     grows as focusing an area reveals its works. */
                  tabIndex={n.id === rovingId ? 0 : -1}
                  role="button"
                  {...(isArea
                    ? { 'aria-expanded': open.has(n.id as AreaId) }
                    : { 'aria-pressed': pressed })}
                  aria-label={n.ariaLabel}
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') enter(n);
                  }}
                  onPointerLeave={() => leave(n)}
                  onFocus={() => {
                    setRoving(n.id);
                    enter(n);
                  }}
                  onBlur={() => leave(n)}
                  onClick={(e) => {
                    e.stopPropagation();
                    activate(n);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      activate(n);
                      return;
                    }
                    const step =
                      e.key === 'ArrowRight' || e.key === 'ArrowDown'
                        ? 1
                        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
                          ? -1
                          : 0;
                    if (!step) return;
                    e.preventDefault();
                    moveRoving(n.id, step);
                  }}
                >
                  <circle
                    ref={(el) => {
                      refs.hit = el;
                    }}
                    className="rn-hit"
                    r={n.r + 12}
                  />
                  {isArea && (
                    <circle
                      ref={(el) => {
                        refs.pulse = el;
                      }}
                      className="rn-pulse"
                      r={n.r}
                      opacity={0}
                    />
                  )}
                  {n.kind === 'work' && n.areas.length > 1 ? (
                    <>
                      {n.areas.map((a, k) => (
                        <path key={a} className="rn-slice" data-area={a} d={slice(n.r, k, n.areas.length)} />
                      ))}
                      <circle className="rn-body rn-split" r={n.r} fill="none" />
                    </>
                  ) : (
                    <circle
                      ref={(el) => {
                        refs.body = el;
                      }}
                      className="rn-body"
                      r={n.r}
                    />
                  )}
                  <circle
                    ref={(el) => {
                      refs.ring = el;
                    }}
                    className="rn-ring"
                    r={n.r + 4}
                  />
                  <text
                    ref={(el) => {
                      refs.text = el;
                    }}
                    x={label.dx}
                    y={label.dy}
                    textAnchor={label.anchor}
                  >
                    {n.label}
                    {isArea && <tspan>{`  ${n.count} ${n.count === 1 ? 'paper' : 'papers'}`}</tspan>}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      <p className="rn-touch-hint">Tap an area to explore</p>

      <div
        ref={tipRef}
        className={`rn-tip${pinned && pinned === focus ? ' is-pinned' : ''}`}
        hidden={!focusNode || focusNode.kind === 'area'}
        style={tipPos ? { left: tipPos.left, top: tipPos.top } : undefined}
      >
        {focusNode && focusNode.kind !== 'area' && <TipBody node={focusNode} />}
      </div>
    </>
  );
}

function TipBody({ node }: { node: GraphNode }) {
  const w = node.work!;
  const external = w.href.startsWith('http');
  /* Venue and status, matching metaParts() in SelectedWork: the tooltip used
     to show type and year only, omitting the field an academic reader ranks
     on. A status that already names the type replaces it. */
  const restatesType = !!w.status && w.status.toLowerCase().includes(w.type.toLowerCase());
  return (
    <>
      <p className="rn-eyebrow">
        {restatesType ? null : <>{w.type} · </>}
        {w.venue ? <>{w.venue} · </> : null}
        {w.status ? <em>{w.status}</em> : w.year}
      </p>
      <h3>{w.title}</h3>
      <p>{w.summary}</p>
      <div className="rn-meta">
        {w.areas.map((a) => (
          <span key={a} className="rn-tag" data-area={a}>
            {AREA_BY_ID[a].label}
          </span>
        ))}
        <a
          className="rn-go"
          href={w.href}
          onClick={() => {
            const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
            if (typeof gtag === 'function')
              gtag('event', 'research_map_open', { id: w.id, href: w.href });
          }}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          Open →
        </a>
      </div>
    </>
  );
}

/** Equal pie slice `k` of `m`, starting at 12 o'clock. */
function slice(r: number, k: number, m: number): string {
  const a0 = -Math.PI / 2 + (k * 2 * Math.PI) / m;
  const a1 = a0 + (2 * Math.PI) / m;
  return `M0 0L${(r * Math.cos(a0)).toFixed(2)} ${(r * Math.sin(a0)).toFixed(2)}A${r} ${r} 0 0 1 ${(r * Math.cos(a1)).toFixed(2)} ${(r * Math.sin(a1)).toFixed(2)}Z`;
}
