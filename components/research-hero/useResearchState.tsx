'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AREAS, WORKS, type AreaId } from '@/data/research-graph';
import { getGraph, MOBILE_QUERY, type Graph } from '@/lib/research-graph-layout';

const AREA_IDS = AREAS.map((a) => a.id);

function track(name: string, params: Record<string, unknown>) {
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') gtag('event', name, params);
}

interface ResearchState {
  graph: Graph;
  /** The area whose works are blooming because of a hover or focus. */
  hoverArea: AreaId | null;
  /** The sticky area filter, set by a click or tap. */
  area: AreaId | null;
  /** The hovered work or method node id. */
  hover: string | null;
  /** The pinned work or method node id. */
  pinned: string | null;
  /** pinned ?? hover: the node the tooltip describes. */
  focus: string | null;
  /** Areas currently blooming. */
  open: Set<AreaId>;
  /** Node ids currently revealed. */
  visible: Set<string>;
  mobile: boolean;
  reducedMotion: boolean;

  openArea: (id: AreaId) => void;
  closeAreaSoon: () => void;
  cancelClose: () => void;
  toggleFilter: (id: AreaId) => void;
  clearFilter: () => void;
  setHover: (id: string | null) => void;
  togglePinned: (id: string) => void;
  unpin: () => void;
  clearAll: () => void;
}

const Ctx = createContext<ResearchState | null>(null);

export function useResearchState(): ResearchState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useResearchState must be used inside ResearchStateProvider');
  return ctx;
}

function useMediaQuery(query: string): boolean {
  // Always false on the server, so SSR markup matches the desktop render.
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export function ResearchStateProvider({ children }: { children: React.ReactNode }) {
  const mobile = useMediaQuery(MOBILE_QUERY);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const graph = useMemo(() => getGraph(mobile), [mobile]);

  const [hoverArea, setHoverArea] = useState<AreaId | null>(null);
  const [area, setArea] = useState<AreaId | null>(null);
  const [hover, setHoverRaw] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);
  useEffect(() => cancelClose, [cancelClose]);

  const openArea = useCallback(
    (id: AreaId) => {
      cancelClose();
      setHoverArea(id);
    },
    [cancelClose],
  );

  /** §5.4: close a hover-opened area 700ms after the pointer leaves. */
  const closeAreaSoon = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setHoverArea(null), 700);
  }, [cancelClose]);

  const toggleFilter = useCallback((id: AreaId) => {
    setPinned(null);
    setArea((prev) => {
      const next = prev === id ? null : id;
      if (next) track('research_map_area', { area: next });
      return next;
    });
  }, []);

  const clearFilter = useCallback(() => {
    setArea(null);
    setPinned(null);
  }, []);

  const setHover = useCallback((id: string | null) => {
    setHoverRaw((prev) => (id === null && prev === null ? prev : id));
  }, []);

  const togglePinned = useCallback((id: string) => {
    setPinned((prev) => {
      const next = prev === id ? null : id;
      if (next) track('research_map_node', { id: next });
      return next;
    });
  }, []);

  const unpin = useCallback(() => setPinned(null), []);

  const clearAll = useCallback(() => {
    cancelClose();
    setHoverArea(null);
    setArea(null);
    setHoverRaw(null);
    setPinned(null);
  }, [cancelClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') clearAll();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [clearAll]);

  const focus = pinned ?? hover;

  /**
   * §5.3: areas always show. Works show when one of their areas is open.
   * Methods stay hidden until a work or method is focused.
   */
  const { open, visible } = useMemo(() => {
    const open = new Set<AreaId>();
    if (hoverArea) open.add(hoverArea);
    if (area) open.add(area);
    const focusNode = focus ? graph.byId[focus] : null;
    if (focusNode?.kind === 'work') for (const a of focusNode.areas) open.add(a);

    const visible = new Set<string>(AREA_IDS);
    for (const w of WORKS) {
      if (w.areas.some((a) => open.has(a))) visible.add(w.id);
    }
    if (focus) {
      visible.add(focus);
      for (const id of graph.adjacency[focus] ?? []) visible.add(id);
    }
    return { open, visible };
  }, [hoverArea, area, focus, graph]);

  const value: ResearchState = {
    graph,
    hoverArea,
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
    clearFilter,
    setHover,
    togglePinned,
    unpin,
    clearAll,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
