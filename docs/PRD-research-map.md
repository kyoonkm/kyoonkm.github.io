# PRD: Research Network Hero for kyoonkm.github.io

| | |
|---|---|
| **Owner** | Kayoon Kim |
| **Implementer** | Claude Code, working in the existing site repo |
| **Version** | v5: progressive reveal, with large area nodes that shrink on interaction (supersedes v1–v4) |
| **Status** | Ready to build, using sample data |
| **Reference prototype** | `docs/prototypes/research-map.html`, a single self-contained file. Open it in a browser; it is the behavioural and visual spec. |
| **Date** | 11 Sept 2026 |

---

## 0. Instructions for Claude Code (read first)

1. **Explore the repo before writing code.** The live site is a Next.js App Router project, statically exported to GitHub Pages and deployed with `actions/deploy-pages@v4`. It uses Tailwind classes and styled-jsx. Confirm all of this from `package.json`, `next.config.*`, `app/` and `.github/workflows/`.
2. **Find the current hero.** Run `grep -rn "Social Understanding" --include=*.{tsx,jsx,ts,js} .`. That component draws the two-circle Venn diagram, and this feature replaces it.
3. **Treat the prototype as the spec.** Copy `research-map.html` into `docs/prototypes/`. Port its data shapes, layout algorithm, label placement, visual encoding and interactions into React components. Don't embed the HTML file.
4. **Use the prototype's sample data** (13 works, 3 areas, 9 methods), each work marked `sample: true`. Don't invent real publications; Kayoon will replace the data file.
5. **Add no new runtime dependencies.** No d3, no physics engine, no graph library.
6. Work on a branch named `feat/research-network-hero`. Open a PR with screenshots at 390, 768, 1280 and 1440 px wide, and don't merge it.

---

## 1. Summary

Replace the decorative Venn diagram with a **social-network-style graph that fills the right side of the hero as a living background**. The name, status line, thesis and icon links sit on the left.

**At rest the graph shows only the three area nodes, drawn large**, joined by faint lines, with a slow pulse as the only hint that they're interactive. Hovering over an area (or tapping it) makes all three area nodes shrink while that area's works bloom outward, with their links. Hovering over a work then reveals the methods it uses. This keeps the first impression calm and clean, and the network rewards curiosity.

The graph has three kinds of node:

- **Research areas:** three large pastel nodes.
- **Works:** papers and projects, coloured by the area or areas they belong to.
- **Methods:** small grey nodes such as "LLMs", "surveys" and "NLP".

Edges are straight lines. Hovering over a work or method shows a small tooltip card, and clicking one pins it. The thesis phrases filter the graph and the "Selected work" list below it.

## 2. Why

- **Committees and PIs skim for about 30 seconds.** The hero has to state who she is, her degree, that she's applying for Fall 2027, and what she works on, all without scrolling.
- **Her strongest signal is interdisciplinarity.** In a network, works that bridge areas physically sit between the area nodes and carry both colours. Method nodes show she has range across quantitative and qualitative methods.
- **The visual echoes her own methods** (social networks, multi-agent systems, computational social science), so it doesn't read as decoration.
- **It must look like her own site, not a template.** That rules out the three-circle Venn from sbleeyouk.github.io, curved "AI-generated" edges, black nodes on pastel, and dense explanatory panels.

## 3. Success criteria

- The name, status line, thesis and icons are readable at first paint, and never hidden behind an animation.
- The rest state is calm (three nodes). Every area opens in one hover or tap, and nothing is ever clipped at the hero edges.
- The graph occupies the right 62% of the hero on desktop and is readable at 1× with no zooming.
- Every work is reachable in one hover or tap. Every piece of information in the graph is also available in the "Selected work" list.
- It works on touch devices without hover.
- Lighthouse accessibility is at least 95, and performance doesn't drop compared with `main`.

## 4. Scope

**In scope**

- A full-width hero with the graph filling its right 62%.
- Progressive reveal: rest state (3 area nodes) → area opened (its works) → work focused (its methods and all its connections).
- A tooltip card for works and methods on hover or focus, which stays pinned after a click. Area nodes get no tooltip.
- Area filtering from the thesis phrases and the area nodes, plus a "Showing X · Show all" note.
- Ambient drift animation, with a reduced-motion fallback.
- A "Selected work" list synced with the graph.
- One typed data file.
- A white-only theme with the rose · sky · butter palette (more transparent than html prototype).
- GA4 events.

**Out of scope**

- Zoom and pan. Dropped in v3: the graph is sized to read at 1×.
- A details panel or explanatory copy about the map. Dropped in v3.
- Dark mode.
- Dragging nodes, or a live force simulation.
- Changes to the Projects or Publications pages. Phase 2 may reuse the data file there.

## 5. UX specification

### 5.1 Layout

```
Desktop (≥ 861px): hero ≈ 700px tall; fully expanded view shown
┌──────────────────────────────────────────────────────────────────────────┐
│                                                  Home  Publications  CV  │
│                                                ○ NLP                     │
│                                        ● Society       ○ data pipelines  │
│  Kayoon Kim                               ◐ Petition atlas   ● AI agents │
│  HCI + AI researcher                           ◐ Agent norms       & ML  │
│  Applying to PhD programs for Fall 2027   ◑ Trust survey  ◐ Negotiation  │
│                                          ◐ AI in design teams            │
│  Studying [society] with                     ○ interviews                │
│  [AI agents & ML], for                              ● Human decisions    │
│  [better human decisions].                                               │
│  (CV)(Scholar)(in)(GitHub)(✉)                                            │
├──────────────────────────────────────────────────────────────────────────┤
│ Selected work                                                            │
└──────────────────────────────────────────────────────────────────────────┘

Rest state shows only the 3 area nodes (plus faint triangle edges); works bloom out on hover.
Mobile (≤ 860px): text first, then the graph as a normal block, then the tooltip card (static).
```

- **The hero** is `position: relative`, `min-height: 700px`, full width, `overflow: hidden`.
- **The graph** is an absolutely positioned SVG with `top: 0; right: 0; width: 62%; height: 100%`, `viewBox="480 10 740 650"` and `preserveAspectRatio="xMidYMid meet"`. It never extends under the text column, so nothing is clipped or hidden at any desktop width. A CSS mask (`linear-gradient(90deg, transparent 0, #000 9%)`) softens its left edge, so blooming nodes fade in rather than hitting a hard edge.
- **The text column** is the existing `max-w-6xl` wrapper, with the intro at `max-width: 30rem` and about 160px of top padding.
- **On mobile** (860px and below) the hero becomes a flex column ordered text → SVG (static, full width) → "Tap an area to explore" caption → tooltip card. The caption only appears on touch devices (`@media (hover: none)`).

### 5.2 Copy (placeholder; Kayoon edits)

- **h1:** Kayoon Kim
- **Status:** "HCI + AI researcher" / "Applying to PhD programs for Fall 2027"
- **Thesis:** "Studying **society** with **AI agents & ML**, for **better human decisions**." Each phrase is a `<button>`.
- **Filter note:** empty by default. When a filter is on it reads "Showing {Area}" followed by a "Show all" text button, and it sits in a reserved-height slot so the layout doesn't jump.
- **No hint text, no map explanation and no panel.**
- **Icon links:** CV, Google Scholar, LinkedIn, GitHub and Email, as 40px circles with a 1.25px `#262626` outline and a white fill. They invert on hover. Each has an `aria-label` and a `title`. Keep the existing URLs.

### 5.3 Visual encoding

| Element | Spec |
|---|---|
| Area node | **r = 46 at rest, animating to 26** whenever anything is open or focused (a separate eased progress value, `p += (target − p) × 0.12`); the hit area, focus ring, pulse and label offset follow the current radius. Pastel fill with a slightly darker stroke of the same hue (1.2px). Label is 15px, weight 600, `#262626`, followed by the work count in 400-weight grey (e.g. "Society 7"). Centred above the node, or below it for "Human decisions" (via `labelSide`). The three area nodes are joined by 1px `#ececec` lines. |
| Work node | r = `6 + 2.2·√degree`, where degree = number of areas + methods, so larger means more connected. One area: that area's pastel fill and stroke. Two or three areas: equal pie slices in each area's pastel, with a 1.2px `#cdcdcd` outline. **Never black.** |
| Method node | r = `4 + 1.5·√degree`. Fill `#f0f0f0`, stroke `#cdcdcd`. Label is 11.5px italic, `#8f8f8f`. |
| Edges | **Straight lines** (`<line>`), 1.1px, `#e0e0e0`. No curves and no dashes. Edges run work–area and work–method. |
| Work label | 13px, `#555`, with a 4px white text halo (`paint-order: stroke`). Always shown for featured works; others appear on hover, focus or filter. |
| Highlight | Edges turn `#9b9b9b` at 1.4px. The node gets a 1.2px grey ring, and its label turns `#262626`. |
| Dimmed | Nodes at opacity .18, edges at .25. |
| Palette (fill / stroke) | **Rose · sky · butter (chosen).** Society `#f5c6ce` / `#de95a3`, AI `#c3dcf1` / `#8db8dc`, Decisions `#f3e0a2` / `#d4b85e`. Method nodes: `#f2f2f2` / `#d0d0d0`. |

**Progressive reveal and label visibility**

| State | Visible |
|---|---|
| Rest | The 3 area nodes, **large (r = 46)**, with labels and counts, and the faint triangle edges. Nothing else. |
| Area open (hover, focus, filter, or a hovered work belonging to it) | Area nodes shrink to r = 26. All works in that area, **with labels**, and their edges to area nodes. Bridging works also connect to their other area. Methods stay hidden. |
| Work or method focused | Its methods, related works and area nodes are revealed and labelled. Everything not directly connected dims to .2. |
| Mobile | Area labels always. Other labels only for the tapped node (details go in the card). |

### 5.4 Interactions

| Trigger | Result |
|---|---|
| Hover or keyboard focus on an **area** node or a thesis phrase | **Open** that area: its works bloom out (see §5.5). No tooltip and no dimming. |
| Pointer leaves the graph (or the phrase) | Close the hover-opened area after **700ms**. Re-entering within that window cancels the close. Filtered areas stay open. |
| Hover or focus on a **work or method** | Reveal and highlight its connections, dim everything else, and show the **tooltip card**. |
| Click, tap, Enter or Space on a work or method | Toggle it as **pinned**. The tooltip stays open and becomes clickable (`pointer-events: auto`), so its "Open →" link works. |
| Click or tap an area node or a thesis phrase | Toggle the **area filter**: the area stays open after the pointer leaves, the list filters, and the filter note appears. This clears any pinned node. On touch devices this is how areas open. |
| "Show all", clicking the same area again, or Esc | Clear the filter. Esc also clears the pin and the hover. |
| Click on empty graph space | Unpin. |
| Hover over a list row | Same as hovering its node: its areas open, and its node is highlighted with the tooltip. |
| Click a list row | Pin its node and scroll the hero into view. |

**Tooltip card**

- 290px wide, white, with a 1px `#ededed` border, 8px radius and a very soft shadow (`0 6px 24px rgba(0,0,0,.06)`).
- **Placement:** try right, left, below and above the node (18px gap, clamped inside the hero). Pick the side that covers the fewest visible nodes, weighting area nodes ×6 (with 40px padding) and the focused node's neighbours ×3. Never cover the node itself.
- **Work:** "{type} · {year}", the title, the summary, area tags (pastel dot plus name), and "Open →".
- **Method:** "Method · used in N works" and the name.
- **Mobile:** it renders as a static card under the graph.

### 5.5 Motion

- **Bloom:** each node has a reveal progress value `p` between 0 and 1. Every frame it eases toward its target (1 if visible, 0 if not) with `p += (target − p) × 0.13`. That takes about 400ms, with ease-out-cubic applied when rendering.
  - A revealed node's position is interpolated from its **origin** to its final position. A work's origin is its open area node; a method's origin is the first visible work that uses it.
  - A revealed node renders at `scale(0.35 + 0.65·p)` and `opacity: p`, with `display: none` below 0.01, so hidden nodes can't be hovered or tabbed to.
  - Edge opacity is the smaller of its two endpoints' `p` values.
  - Collapsing runs the same animation in reverse, back into the area node.
- **Area node size:** it animates between r = 46 (rest) and r = 26 (anything open or focused) at the same time as the bloom. Collapsing everything grows the area nodes back.
- **Idle pulse:** while nothing is open or focused, each area node emits a ring. The radius grows from r to r + 16 and fades from .5 to 0 over 3.3s, staggered 1.1s per area. The pulse stops as soon as anything opens.
- **Ambient drift:** each node follows a tiny Lissajous path (2.2px amplitude, 1.2px for areas). The loop uses `requestAnimationFrame` and pauses when the graph is offscreen (`IntersectionObserver`) or the tab is hidden.
- **`prefers-reduced-motion`:** reveals jump instantly (`p` = target), with no pulse, no drift and no transitions.

## 6. Data model

`data/research-graph.ts`, or `src/data/` if that's where the repo keeps data:

```ts
export type AreaId = "society" | "ai" | "decisions";

export interface Area {
  id: AreaId; label: string; blurb: string;
  x: number; y: number;            // world coords (viewBox 480..1220 × 10..660)
  labelSide: "above" | "below";
}
export interface Method { id: string; label: string }   // lowercase unless proper noun
export interface Work {
  id: string; title: string; short: string;             // short ≤ 18 chars
  year: number; type: WorkType; areas: AreaId[];        // 1–3
  methods?: string[];                                   // Method ids, 0–3
  featured?: boolean;                                   // always-labelled; aim for 3–5
  summary: string;                                      // ≤ 140 chars
  href: string; sample?: boolean;
}
```

- Copy `AREAS`, `WORKS` and `METHODS` from the prototype.
- **Validate at build time** (a unit test or a dev assertion). Fail when:
  - an id is duplicated, or an area or method id is unknown;
  - a method has no works;
  - `short` is longer than 18 characters;
  - there are more than 15 works or more than 10 methods.

## 7. Layout (deterministic, SSR-safe)

`lib/research-graph-layout.ts` contains pure functions with no `Math.random` and no DOM access, so the server and the client produce identical markup:

1. **Areas** are fixed at their data coordinates. `c` is their centroid.
2. **Works** are grouped by their sorted area set, with `off = k − (m−1)/2`:
   - **1 area:** place at radius 135 from its hub, at angle `atan2(hub − c) + off × 0.9`.
   - **2 areas:** start at the hubs' midpoint pulled 22% toward `c`, then shift along the hub-to-hub direction by `off × 120`.
   - **3 areas:** place at `c`.
3. **Methods** start at the centroid of their works, plus 55 × (cos, sin)(i × 2.39996), a golden-angle offset.
4. **Relax for 400 iterations:**
   - Push apart any pair of non-area nodes closer than 86.
   - Keep every node at least 108 from every area node.
   - Spring each node toward its target with k = 0.025.
   - Clamp positions to x ∈ [530, 1175] and y ∈ [45, 625].
5. **Place labels greedily, for the fully expanded graph** (so labels never collide whatever is open). Area labels go first, on their `labelSide`. Then featured works, other works, then methods. For each label try right, left, below, then above, and take the first spot that stays inside the viewBox and doesn't overlap any node or already-placed label. If none is free, take the first in-bounds spot. Estimate label width as `chars × fontSize × 0.58`.
   - Re-run placement when the mobile breakpoint changes, because label sizes change.
   - On mobile, only featured labels reserve space.

## 8. Components

```
components/research-hero/
  ResearchHero.tsx        // server: layout, text column, <ResearchGraph/>, <SelectedWork/>
  ResearchGraph.tsx       // "use client": SVG, tooltip, drift loop, label placement
  SelectedWork.tsx        // "use client": list
  useResearchState.tsx    // context: hover | pinned | area
lib/research-graph-layout.ts   // layout() + placeLabels() (pure)
data/research-graph.ts
```

- Render the static geometry as SVG markup on the server.
- The drift loop mutates `transform` and the line endpoints through refs, never through React state.
- Position the tooltip from `svg.getScreenCTM()` relative to the hero, and recompute it on resize.

## 9. Style tokens (white only)

| Token | Value |
|---|---|
| `--bg` | `#ffffff`. Paint `html` and `body` explicitly and set `color-scheme: light`. |
| `--ink` | `#262626` (h1, thesis, icon outlines) |
| `--ink-2` | `#555555` (body text, labels) |
| `--ink-3` | `#8f8f8f` (status line, meta, method labels; used only at 12px or larger) |
| `--line` | `#ededed` |
| `--edge` / `--edge-hot` | `#e0e0e0` / `#9b9b9b` |
| Area pastels | See §5.3 |

- Use the site's existing system font stack only.
- **Avoid:** black nodes, curved edges, gradients (other than the graph's edge mask), pills and heavy shadows.

## 10. Accessibility

- The SVG is `role="group"` with an `aria-label`.
- Every node is `tabindex="0"`, `role="button"` and `aria-pressed`, with a descriptive `aria-label` (title, type and year for works).
- Tab order follows the data order. Enter or Space pins or filters, and Esc clears.
- The focus ring is visible.
- The filter note is `aria-live="polite"`.
- The "Selected work" list is the full non-visual equivalent of the graph.
- Area colour is never the only cue: tooltips and tags name the area in text.
- Body text contrast is at least 4.5:1.
- Honour reduced motion.

## 11. Performance

- At most 8 KB of added client JS (gzipped), with no new dependencies.
- No layout shift: the hero has a fixed `min-height`, and the filter note has a reserved slot.
- LCP stays the h1.
- Drift stops when the tab is hidden, the graph is offscreen, or reduced motion is on.

## 12. Analytics

Guard every call with `typeof window.gtag === "function"`:

- `research_map_area` with `{ area }`
- `research_map_node` with `{ id }`, fired when a node is pinned
- `research_map_open` with `{ id, href }`

## 13. Implementation plan

1. Create the branch, copy the prototype, and add the data file with validation.
2. Write `layout()` and `placeLabels()` with unit tests. They must be deterministic, keep everything in bounds, keep nodes at least 80 apart, and avoid overlapping labels at desktop sizes.
3. Build the static SVG render, plus the hero shell (text column, and the graph in the right 62% with its edge mask).
4. Add state: `hoverArea`, `area` (filter), `hover` and `pinned`. `computeVisible()` derives the set of visible nodes, and the rest is tooltip, list sync and Esc.
5. Add the reveal animation, idle pulse, drift and reduced motion.
6. Handle the mobile stacking and label rules.
7. Quality pass: accessibility, a real phone, screenshots, Lighthouse, and a successful static export.
8. Open the PR.

## 14. Acceptance criteria

- [ ] The Venn component is removed. At rest only the 3 large area nodes (with counts) are visible, and they shrink smoothly when an area opens. Hovering or tapping an area blooms its works out smoothly, and they collapse back 700ms after the pointer leaves.
- [ ] Methods appear only when a work or method is focused.
- [ ] No node or label is clipped at 900, 1100, 1280 or 1440px wide. The graph stays within the right 62% of the hero.
- [ ] All edges are straight lines, and no node is black. Work nodes use the area pastels (split for bridging works); method nodes are light grey.
- [ ] There is no explanatory panel. The only hint is the idle pulse, plus "Tap an area to explore" on touch devices. Details appear only in the tooltip, which never covers its own node.
- [ ] Every interaction in §5.4 works with mouse, touch and keyboard, and the pinned tooltip's link is clickable.
- [ ] No labels overlap at 1440 or 1280px, and no label is clipped at 390px.
- [ ] Reduced motion means no drift and no transitions.
- [ ] It's white only, contrast meets §10, and the icon links have accessible names.
- [ ] Static export builds, and the GitHub Pages deploy works.

## 15. Open questions (for Kayoon)

1. What should the final area names, thesis wording and **method list** be? Each method needs her approval.
2. Which 3–5 works are featured? Only include work that is public or that her co-authors are fine showing.
3. Should nodes link to internal `/projects/N` pages or directly to PDFs?
