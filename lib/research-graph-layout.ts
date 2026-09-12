/**
 * Pure, deterministic layout for the research-network hero.
 *
 * No Math.random and no DOM access, so the server and the client produce
 * identical markup. Ported from docs/prototypes/research-map.html.
 */

import {
  AREAS,
  METHODS,
  WORKS,
  type Area,
  type AreaId,
  type Method,
  type Work,
} from "@/data/research-graph";

export const VIEW_BOX = "480 10 740 650";
/** Inner bounds used for label placement (the viewBox, inset by 5px). */
const LABEL_BOUNDS = { x0: 485, x1: 1215, y0: 15, y1: 655 };

export const AREA_R_REST = 46;
export const AREA_R_OPEN = 26;
export const MOBILE_QUERY = "(max-width: 860px)";

export type NodeKind = "area" | "work";

export interface GraphNode {
  id: string;
  kind: NodeKind;
  /** Tab order / drift phase. Follows data order: areas, works, methods. */
  index: number;
  label: string;
  x: number;
  y: number;
  r: number;
  ariaLabel: string;
  /** Areas this node belongs to. Works only; areas use [id]. */
  areas: AreaId[];
  area?: Area;
  work?: Work;
  /** Work count, for area nodes. */
  count?: number;
}

export interface GraphEdge {
  id: string;
  a: string;
  b: string;
}

export interface LabelPlacement {
  dx: number;
  dy: number;
  anchor: "start" | "middle" | "end";
  fontSize: number;
}

export interface Graph {
  nodes: GraphNode[];
  byId: Record<string, GraphNode>;
  edges: GraphEdge[];
  /** The three faint area-to-area lines, visible at rest. */
  triangle: GraphEdge[];
  adjacency: Record<string, string[]>;
  labels: Record<string, LabelPlacement>;
}


/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

/** Throws on malformed data. Called from a dev assertion and from tests. */
export function validateGraphData(): void {
  const problems: string[] = [];
  const areaIds = new Set(AREAS.map((a) => a.id));
  const methodIds = new Set(METHODS.map((m) => m.id));

  if (AREAS.length !== 3) problems.push(`expected 3 areas, got ${AREAS.length}`);
  if (WORKS.length > 15) problems.push(`more than 15 works (${WORKS.length})`);
  if (METHODS.length > 10)
    problems.push(`more than 10 methods (${METHODS.length})`);

  const seen = new Set<string>();
  for (const id of [...areaIds, ...methodIds, ...WORKS.map((w) => w.id)]) {
    if (seen.has(id)) problems.push(`duplicate id "${id}"`);
    seen.add(id);
  }

  const usedMethods = new Set<string>();
  for (const w of WORKS) {
    if (w.short.length > 18)
      problems.push(`"${w.id}".short is ${w.short.length} chars (max 18)`);
    if (w.summary.length > 140)
      problems.push(`"${w.id}".summary is ${w.summary.length} chars (max 140)`);
    if (w.areas.length < 1 || w.areas.length > 3)
      problems.push(`"${w.id}" has ${w.areas.length} areas (expected 1–3)`);
    for (const a of w.areas) {
      if (!areaIds.has(a)) problems.push(`"${w.id}" references unknown area "${a}"`);
    }
    if ((w.methods ?? []).length > 3)
      problems.push(`"${w.id}" has more than 3 methods`);
    for (const m of w.methods ?? []) {
      if (!methodIds.has(m))
        problems.push(`"${w.id}" references unknown method "${m}"`);
      usedMethods.add(m);
    }
  }

  for (const m of METHODS) {
    if (!usedMethods.has(m.id)) problems.push(`method "${m.id}" has no works`);
  }

  if (problems.length) {
    throw new Error(`research-graph data is invalid:\n  - ${problems.join("\n  - ")}`);
  }
}

/* ------------------------------------------------------------------ */
/* Positions                                                           */
/* ------------------------------------------------------------------ */

type Pos = { x: number; y: number; tx: number; ty: number };

/**
 * Places every node. Areas are fixed at their data coordinates; works are
 * grouped by their sorted area set and fanned out from their hubs; methods
 * start at the centroid of their works with a golden-angle offset. A 400-step
 * relaxation then separates nodes and clamps them into bounds.
 */
export function layout(
  areas: Area[] = AREAS,
): Record<string, { x: number; y: number }> {
  const cx = areas.reduce((s, a) => s + a.x, 0) / areas.length;
  const cy = areas.reduce((s, a) => s + a.y, 0) / areas.length;
  const areaById = Object.fromEntries(areas.map((a) => [a.id, a])) as Record<
    AreaId,
    Area
  >;

  const P: Record<string, Pos> = {};
  for (const a of areas) P[a.id] = { x: a.x, y: a.y, tx: a.x, ty: a.y };

  const groups = new Map<string, Work[]>();
  for (const w of WORKS) {
    const key = [...w.areas].sort().join("+");
    const list = groups.get(key);
    if (list) list.push(w);
    else groups.set(key, [w]);
  }

  for (const [key, list] of groups) {
    const hubs = key.split("+").map((id) => areaById[id as AreaId]);
    list.forEach((w, k) => {
      const off = k - (list.length - 1) / 2;
      let x: number;
      let y: number;
      if (hubs.length === 1) {
        const h = hubs[0];
        const ang = Math.atan2(h.y - cy, h.x - cx) + off * 0.9;
        x = h.x + 135 * Math.cos(ang);
        y = h.y + 135 * Math.sin(ang);
      } else if (hubs.length === 2) {
        const [a, b] = hubs;
        let mx = (a.x + b.x) / 2;
        let my = (a.y + b.y) / 2;
        mx += (cx - mx) * 0.22;
        my += (cy - my) * 0.22;
        const len = Math.hypot(b.x - a.x, b.y - a.y);
        x = mx + ((b.x - a.x) / len) * off * 120;
        y = my + ((b.y - a.y) / len) * off * 120;
      } else {
        x = cx;
        y = cy;
      }
      P[w.id] = { x, y, tx: x, ty: y };
    });
  }

  /* Only works relax. Methods used to add 9 more movables, and that extra
     crowding is what pressed 6 of the 13 works flat against the frame. */
  const movable = WORKS.map((w) => w.id);

  for (let it = 0; it < 400; it++) {
    for (let i = 0; i < movable.length; i++) {
      for (let j = i + 1; j < movable.length; j++) {
        const p = P[movable[i]];
        const q = P[movable[j]];
        let dx = q.x - p.x;
        let dy = q.y - p.y;
        const d = Math.hypot(dx, dy) || 0.01;
        const min = 86;
        if (d < min) {
          const s = (min - d) / 2;
          dx /= d;
          dy /= d;
          p.x -= dx * s;
          p.y -= dy * s;
          q.x += dx * s;
          q.y += dy * s;
        }
      }
    }
    for (const id of movable) {
      const p = P[id];
      for (const a of areas) {
        const dx = p.x - a.x;
        const dy = p.y - a.y;
        const d = Math.hypot(dx, dy) || 0.01;
        /* Raised from 108 now that only 13 nodes compete: it keeps work
           labels clear of the area label, which sits outside the r=46 circle. */
        if (d < 142) {
          p.x = a.x + (dx / d) * 142;
          p.y = a.y + (dy / d) * 142;
        }
      }
      /* Stronger pull back to the barycentric anchor (was 0.025). Position is
         supposed to encode area membership; a weak pull let relaxation swap
         nodes across their own axis. */
      p.x += (p.tx - p.x) * 0.06;
      p.y += (p.ty - p.y) * 0.06;
      p.x = Math.min(1175, Math.max(540, p.x));
      p.y = Math.min(625, Math.max(45, p.y));
    }
  }

  return Object.fromEntries(
    Object.entries(P).map(([id, p]) => [id, { x: p.x, y: p.y }]),
  );
}

/* ------------------------------------------------------------------ */
/* Nodes, edges, adjacency                                             */
/* ------------------------------------------------------------------ */

function buildTopology(areas: Area[] = AREAS) {
  const positions = layout(areas);

  const edges: GraphEdge[] = [];
  for (const w of WORKS) {
    for (const a of w.areas) edges.push({ id: `${w.id}~${a}`, a: w.id, b: a });
  }

  const adjacency: Record<string, string[]> = {};
  const push = (a: string, b: string) => {
    (adjacency[a] ??= []).push(b);
  };
  for (const e of edges) {
    push(e.a, e.b);
    push(e.b, e.a);
  }
  for (const a of areas) adjacency[a.id] ??= [];

  const nodes: GraphNode[] = [];
  let index = 0;

  for (const a of areas) {
    /* Publications only, to reconcile with the list below, which excludes
       Projects. A bare total counting projects read as "7 publications". */
    const count = WORKS.filter(
      (w) => w.areas.includes(a.id) && w.type !== "Project",
    ).length;
    nodes.push({
      id: a.id,
      kind: "area",
      index: index++,
      label: a.label,
      x: positions[a.id].x,
      y: positions[a.id].y,
      r: AREA_R_OPEN,
      areas: [a.id],
      area: a,
      count,
      ariaLabel: `${a.label}: show its ${count} ${count === 1 ? "paper" : "papers"}`,
    });
  }
  for (const w of WORKS) {
    const deg = adjacency[w.id].length;
    nodes.push({
      id: w.id,
      kind: "work",
      index: index++,
      label: w.short,
      x: positions[w.id].x,
      y: positions[w.id].y,
      r: 6 + 2.2 * Math.sqrt(deg),
      areas: w.areas,
      work: w,
      ariaLabel: `${w.title}, ${w.type}, ${w.year}`,
    });
  }
  const triangle: GraphEdge[] = [
    { id: "tri-society-ai", a: "society", b: "ai" },
    { id: "tri-ai-decisions", a: "ai", b: "decisions" },
    { id: "tri-decisions-society", a: "decisions", b: "society" },
  ];

  return { nodes, edges, triangle, adjacency };
}

/* ------------------------------------------------------------------ */
/* Labels                                                              */
/* ------------------------------------------------------------------ */

type Box = { x0: number; x1: number; y0: number; y1: number; owner: string };

/**
 * Greedy label placement for the *fully expanded* graph, so labels never
 * collide whichever area happens to be open. Area labels go first (on their
 * `labelSide`), then featured works, other works, then methods.
 */
export function placeLabels(
  nodes: GraphNode[],
  mobile: boolean,
): Record<string, LabelPlacement> {
  const occupied: Box[] = nodes.map((n) => ({
    x0: n.x - n.r - 2,
    x1: n.x + n.r + 2,
    y0: n.y - n.r - 2,
    y1: n.y + n.r + 2,
    owner: n.id,
  }));

  const inBounds = (b: Box) =>
    b.x0 >= LABEL_BOUNDS.x0 &&
    b.x1 <= LABEL_BOUNDS.x1 &&
    b.y0 >= LABEL_BOUNDS.y0 &&
    b.y1 <= LABEL_BOUNDS.y1;

  /** Total overlap area against everything already placed. */
  const overlap = (b: Box, self: string) =>
    occupied.reduce((sum, o) => {
      if (o.owner === self) return sum;
      const w = Math.min(b.x1, o.x1) - Math.max(b.x0, o.x0);
      const h = Math.min(b.y1, o.y1) - Math.max(b.y0, o.y0);
      return w > 0 && h > 0 ? sum + w * h : sum;
    }, 0);

  const collides = (b: Box, self: string) => !inBounds(b) || overlap(b, self) > 0;

  const labels: Record<string, LabelPlacement> = {};

  for (const n of nodes.filter((n) => n.kind === "area")) {
    const fontSize = mobile ? 26 : 15;
    const w = n.label.length * fontSize * 0.6;
    const below = n.area?.labelSide === "below";
    const dy = below ? n.r + fontSize + 4 : -n.r - 10;
    labels[n.id] = { dx: 0, dy, anchor: "middle", fontSize };
    occupied.push({
      x0: n.x - w / 2,
      x1: n.x + w / 2,
      y0: n.y + dy - fontSize,
      y1: n.y + dy + 4,
      owner: `${n.id}-label`,
    });
  }

  const order = [
    ...nodes.filter((n) => n.kind === "work" && n.work?.featured),
    ...nodes.filter((n) => n.kind === "work" && !n.work?.featured),
  ];

  for (const n of order) {
    const fontSize = mobile ? 24 : 13;
    const w = n.label.length * fontSize * 0.58;
    const h = fontSize * 1.15;
    const gap = n.r + 5;

    const candidates: { box: Box; placement: LabelPlacement }[] = [
      {
        box: { x0: n.x + gap, x1: n.x + gap + w, y0: n.y - h / 2, y1: n.y + h / 2, owner: `${n.id}-label` },
        placement: { dx: gap, dy: fontSize * 0.35, anchor: "start", fontSize },
      },
      {
        box: { x0: n.x - gap - w, x1: n.x - gap, y0: n.y - h / 2, y1: n.y + h / 2, owner: `${n.id}-label` },
        placement: { dx: -gap, dy: fontSize * 0.35, anchor: "end", fontSize },
      },
      {
        box: { x0: n.x - w / 2, x1: n.x + w / 2, y0: n.y + n.r + 3, y1: n.y + n.r + 3 + h, owner: `${n.id}-label` },
        placement: { dx: 0, dy: n.r + fontSize, anchor: "middle", fontSize },
      },
      {
        box: { x0: n.x - w / 2, x1: n.x + w / 2, y0: n.y - n.r - 3 - h, y1: n.y - n.r - 3, owner: `${n.id}-label` },
        placement: { dx: 0, dy: -n.r - 6, anchor: "middle", fontSize },
      },
    ];

    // First free spot in right / left / below / above order. If none is free,
    // take the in-bounds spot that overlaps the least, so a data edit degrades
    // gracefully instead of stacking two labels on top of each other.
    const free = candidates.find((c) => !collides(c.box, n.id));
    const chosen =
      free ??
      candidates
        .filter((c) => inBounds(c.box))
        .reduce(
          (a, c) => (overlap(c.box, n.id) < overlap(a.box, n.id) ? c : a),
          candidates.find((c) => inBounds(c.box)) ?? candidates[0],
        );

    labels[n.id] = chosen.placement;
 occupied.push(chosen.box);
  }

  return labels;
}

/* ------------------------------------------------------------------ */
/* Public entry point                                                  */
/* ------------------------------------------------------------------ */

/**
 * Throws if the computed layout breaks an invariant from PRD §13: everything
 * in bounds, non-area nodes at least 80 apart, and no overlapping labels at
 * desktop sizes.
 */
export function assertLayoutInvariants(nodes: GraphNode[]): void {
  const problems: string[] = [];

  for (const n of nodes) {
    if (
      n.x - n.r < LABEL_BOUNDS.x0 ||
      n.x + n.r > LABEL_BOUNDS.x1 ||
      n.y - n.r < LABEL_BOUNDS.y0 ||
      n.y + n.r > LABEL_BOUNDS.y1
    ) {
      problems.push(`"${n.id}" is out of bounds at (${n.x.toFixed(0)}, ${n.y.toFixed(0)})`);
    }
  }

  const movable = nodes.filter((n) => n.kind !== "area");
  for (let i = 0; i < movable.length; i++) {
    for (let j = i + 1; j < movable.length; j++) {
      const d = Math.hypot(movable[i].x - movable[j].x, movable[i].y - movable[j].y);
      if (d < 80)
        problems.push(
          `"${movable[i].id}" and "${movable[j].id}" are ${d.toFixed(1)} apart (min 80)`,
        );
    }
  }

  const labels = placeLabels(nodes, false);
  const boxes = nodes.map((n) => {
    const l = labels[n.id];
    const w = (n.label.length + (n.kind === "area" ? 3 : 0)) * l.fontSize * 0.58;
    const x0 =
      l.anchor === "start" ? n.x + l.dx : l.anchor === "end" ? n.x + l.dx - w : n.x - w / 2;
    return {
      id: n.id,
      x0,
      x1: x0 + w,
      y0: n.y + l.dy - l.fontSize,
      y1: n.y + l.dy + 3,
    };
  });
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];
      if (a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0)
        problems.push(`labels for "${a.id}" and "${b.id}" overlap`);
    }
  }

  if (problems.length) {
    throw new Error(`research-graph layout is invalid:\n  - ${problems.join("\n  - ")}`);
  }
}

export function buildGraphFor(areas: Area[]): Graph {
  const topology = buildTopology(areas);
  return {
    ...topology,
    byId: Object.fromEntries(topology.nodes.map((n) => [n.id, n])),
    labels: placeLabels(topology.nodes, false),
  };
}

const TOPOLOGY = buildTopology();

if (process.env.NODE_ENV !== "production") {
  validateGraphData();
  assertLayoutInvariants(TOPOLOGY.nodes);
}

/** Deterministic for a given `mobile` flag, and cached per flag. */
const cache = new Map<boolean, Graph>();

export function getGraph(mobile = false): Graph {
  const hit = cache.get(mobile);
  if (hit) return hit;
  const graph: Graph = {
    ...TOPOLOGY,
    byId: Object.fromEntries(TOPOLOGY.nodes.map((n) => [n.id, n])),
    labels: placeLabels(TOPOLOGY.nodes, mobile),
  };
  cache.set(mobile, graph);
  return graph;
}
