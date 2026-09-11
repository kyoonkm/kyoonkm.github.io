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

  const svgRef = useRef<SVGSVGElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Record<string, NodeRefs>>({});
  const edgeRefs = useRef<Record<string, SVGLineElement | null>>({});

  const revRef = useRef<Record<string, number>>({});
  const hubBigRef = useRef(1);
  if (Object.keys(revRef.current).length === 0) {
    for (const n of graph.nodes) revRef.current[n.id] = n.kind === 'area' ? 1 : 0;
  }

  /* Latest derived state, read by the animation loop without restarting it. */
  const live = useRef({ visible, open, focus, reducedMotion });
  useLayoutEffect(() => {
    live.current = { visible, open, focus, reducedMotion };
  }, [visible, open, focus, reducedMotion]);

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

    const drift = (n: GraphNode) => {
      if (!t) return { x: 0, y: 0 };
      const amp = n.kind === 'area' ? 1.2 : 2.2;
      const w = (2 * Math.PI) / (9 + (n.index % 5));
      const ph = n.index * 1.7;
      return { x: amp * Math.sin(t * w + ph), y: amp * Math.cos(t * w * 0.8 + ph) };
    };

    const place = () => {
      const { visible, open, focus, reducedMotion } = live.current;
      const rev = revRef.current;
      const cur: Record<string, { x: number; y: number }> = {};

      for (const n of nodes) {
        if (n.kind !== 'area') continue;
        const d = drift(n);
        cur[n.id] = { x: n.x + d.x, y: n.y + d.y };
      }

      /* A work blooms out of its open area node; a method blooms out of the
         first visible work that uses it. */
      const originOf = (n: GraphNode) => {
        if (n.kind === 'work') {
          const a = n.areas.find((a) => open.has(a)) ?? n.areas[0];
          return cur[a];
        }
        const neighbours = adjacency[n.id] ?? [];
        const w = neighbours.find((id) => visible.has(id)) ?? neighbours[0];
        return cur[w] ?? byId[w];
      };

      for (const kind of ['work', 'method'] as const) {
        for (const n of nodes) {
          if (n.kind !== kind) continue;
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

      for (const n of nodes) {
        const refs = nodeRefs.current[n.id];
        if (!refs?.outer) continue;
        const e = n.kind === 'area' ? 1 : ease(rev[n.id]);
        const p = cur[n.id];
        refs.outer.setAttribute(
          'transform',
          `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${(0.35 + 0.65 * e).toFixed(3)})`,
        );
        refs.outer.style.opacity = e.toFixed(3);
        refs.outer.style.display = e < 0.01 ? 'none' : '';
      }

      for (const ed of edges) {
        const line = edgeRefs.current[ed.id];
        if (!line) continue;
        const a = cur[ed.a];
        const b = cur[ed.b];
        const o = Math.min(rev[ed.a], rev[ed.b]);
        line.setAttribute('x1', a.x.toFixed(1));
        line.setAttribute('y1', a.y.toFixed(1));
        line.setAttribute('x2', b.x.toFixed(1));
        line.setAttribute('y2', b.y.toFixed(1));
        line.setAttribute('stroke-opacity', ease(o).toFixed(3));
        line.style.display = o < 0.01 ? 'none' : '';
      }

      for (const ed of triangle) {
        const line = edgeRefs.current[ed.id];
        if (!line) continue;
        const a = cur[ed.a];
        const b = cur[ed.b];
        line.setAttribute('x1', a.x.toFixed(1));
        line.setAttribute('y1', a.y.toFixed(1));
        line.setAttribute('x2', b.x.toFixed(1));
        line.setAttribute('y2', b.y.toFixed(1));
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
        const ph = ((t + i * 1.1) % 3.3) / 3.3;
        refs.pulse.setAttribute('r', (hr + 16 * ph).toFixed(2));
        refs.pulse.setAttribute('opacity', (0.45 * (1 - ph)).toFixed(3));
      }
    };

    let raf = 0;
    const frame = (ts: number) => {
      const { visible, open, focus, reducedMotion } = live.current;
      t = reducedMotion ? 0 : ts / 1000;
      const k = reducedMotion ? 1 : 0.13;
      const rev = revRef.current;
      for (const n of nodes) {
        if (n.kind === 'area') continue;
        const target = visible.has(n.id) ? 1 : 0;
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
        aria-label="Research network: three research areas. Hover or select an area to reveal its works and methods. The Selected work list below holds the same information."
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
                  tabIndex={0}
                  role="button"
                  aria-pressed={pressed}
                  aria-label={n.ariaLabel}
                  onPointerEnter={(e) => {
                    if (e.pointerType === 'mouse') enter(n);
                  }}
                  onPointerLeave={() => leave(n)}
                  onFocus={() => enter(n)}
                  onBlur={() => leave(n)}
                  onClick={(e) => {
                    e.stopPropagation();
                    activate(n);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      activate(n);
                    }
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
                    {isArea && <tspan>{`  ${n.count}`}</tspan>}
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
        {focusNode && focusNode.kind !== 'area' && <TipBody node={focusNode} degree={(graph.adjacency[focusNode.id] ?? []).length} />}
      </div>
    </>
  );
}

function TipBody({ node, degree }: { node: GraphNode; degree: number }) {
  if (node.kind === 'method') {
    return (
      <>
        <p className="rn-eyebrow">Method · used in {degree} works</p>
        <h3 className="rn-method-name">{node.label}</h3>
      </>
    );
  }
  const w = node.work!;
  const external = w.href.startsWith('http');
  return (
    <>
      <p className="rn-eyebrow">
        {w.type} · {w.year}
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
