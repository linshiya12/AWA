'use client';

import React, { useState, useRef, useEffect, useCallback, useSyncExternalStore } from 'react';
import { GuidanceStep, Tool } from '@/lib/mockData';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Sparkles,
  ExternalLink,
  ZoomIn,
  Check,
  ChevronRight,
  ChevronLeft,
  Lock,
  Copy,
  Network,
  Maximize2,
  Terminal,
  Image as ImageIcon,
} from 'lucide-react';

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}

// Action phase labels mapped by step index
const PHASE_LABELS = [
  'Select External Tool',
  'Input & Staging',
  'Prompt & Optics',
  'Refinement & Parameters',
  'Review & Export',
  'Final Delivery',
];

// Distinct wire color definitions per step like the reference image
const WIRE_PALETTES = [
  { start: '#f59e0b', end: '#fb7185', portDot: 'bg-amber-400', portBorder: 'border-amber-400' },
  { start: '#38bdf8', end: '#818cf8', portDot: 'bg-sky-400', portBorder: 'border-sky-400' },
  { start: '#a855f7', end: '#ec4899', portDot: 'bg-purple-400', portBorder: 'border-purple-400' },
  { start: '#34d399', end: '#06b6d4', portDot: 'bg-emerald-400', portBorder: 'border-emerald-400' },
  { start: '#60a5fa', end: '#38bdf8', portDot: 'bg-blue-400', portBorder: 'border-blue-400' },
];

/**
 * Calculates real-time scale (0.92 -> 1.04) and opacity (0.75 -> 1.0)
 * based on each individual node's distance to the viewport center.
 */
function getNodeMotion(
  nodeCenterX: number,
  scrollLeft: number,
  containerWidth: number,
  prefersReducedMotion: boolean
) {
  if (prefersReducedMotion || containerWidth === 0) {
    return { scale: 1, opacity: 1, isCentered: true, zIndex: 10 };
  }

  const viewportCenter = scrollLeft + containerWidth / 2;
  const dist = Math.abs(nodeCenterX - viewportCenter);

  // Proximity radius: containerWidth * 0.44 or 420px
  const maxDist = Math.max(260, Math.min(containerWidth * 0.44, 430));

  if (dist >= maxDist) {
    return {
      scale: 0.92,
      opacity: 0.75,
      isCentered: false,
      zIndex: 10,
    };
  }

  // Smooth cosine easing from center (t=0) to edge (t=1)
  const t = dist / maxDist;
  const ease = (1 + Math.cos(Math.PI * t)) / 2; // 1 at center, 0 at edge

  const scale = Number((0.92 + 0.12 * ease).toFixed(3)); // 0.92 -> 1.04
  const opacity = Number((0.75 + 0.25 * ease).toFixed(3)); // 0.75 -> 1.0
  const isCentered = dist < 120;
  const zIndex = isCentered ? 30 : Math.round(10 + 15 * ease);

  return { scale, opacity, isCentered, zIndex };
}

interface TemplateGuidanceFlowProps {
  guidance: GuidanceStep[];
  tools: Tool[];
  templateTitle: string;
  categoryName: string;
  isSubscribed: boolean;
  onSubscribe: () => void;
}

export function TemplateGuidanceFlow({
  guidance,
  tools,
  templateTitle,
  categoryName,
  isSubscribed,
  onSubscribe,
}: TemplateGuidanceFlowProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedLightboxStep, setSelectedLightboxStep] = useState<GuidanceStep | null>(null);
  const [copiedTipIndex, setCopiedTipIndex] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [lightboxImageFailed, setLightboxImageFailed] = useState(false);

  // Real-time scroll state for continuous node zoom
  const [scrollState, setScrollState] = useState({
    scrollLeft: 0,
    containerWidth: 1000,
  });

  // Active dragging state
  const [isDragging, setIsDragging] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Drag-to-scroll tracking refs
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedSignificantlyRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const primaryTool = tools[0] || {
    id: 'external-tool',
    name: 'External AI Tool',
    url: 'https://v0.dev',
  };

  // If a template lacks guidance steps, show clear content-missing state for admins (Req 4)
  if (!guidance || guidance.length === 0) {
    return (
      <section
        className="scroll-mt-24 my-8"
        id="section-guide"
        aria-label="Step-by-step guidance workflow graph"
      >
        <div className="rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/20 p-8 text-center max-w-3xl mx-auto shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Network className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 mb-2 font-['var(--font-heading)']">
            Guidance Steps &amp; Media Pending Publication
          </h3>
          <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-lg mx-auto mb-4 leading-relaxed">
            Dedicated step-by-step guidance steps and matching media for <strong className="text-slate-800 dark:text-zinc-200">{templateTitle}</strong> are not yet configured.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-100/70 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-mono">
            Admin Note: Configure template-specific steps and matching media in Admin &gt; Templates &gt; Guidance.
          </div>
        </div>
      </section>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // CANVAS GEOMETRY & COORDINATES (FREE-FLOWING NODE GRAPH)
  // ─────────────────────────────────────────────────────────────
  const CARD_WIDTH_INST = 285;
  const CARD_HEIGHT_INST = 220;
  const CARD_WIDTH_VIS = 340;
  const CARD_HEIGHT_VIS = 285;
  const CARD_WIDTH_COMP = 230;

  const GAP_INTERNAL = 54; // Distance between instruction node and visual node in same step
  const GAP_STEP = 72;     // Distance between visual node and next step's instruction node
  const PADDING_LEFT = 50;
  const PADDING_RIGHT = 140;
  const CANVAS_HEIGHT = 640; // Generous height prevents any clipping of scaled nodes & shadows

  const STEP_SPAN = CARD_WIDTH_INST + GAP_INTERNAL + CARD_WIDTH_VIS + GAP_STEP;
  const totalCanvasWidth = PADDING_LEFT + guidance.length * STEP_SPAN - GAP_STEP + CARD_WIDTH_COMP + PADDING_RIGHT;

  // Varied vertical positions along the path (free-flowing like reference image)
  const getNodeYPositions = (idx: number) => {
    const isEven = idx % 2 === 0;
    return {
      instY: isEven ? 50 : 265,
      visY: isEven ? 240 : 55,
    };
  };

  // Real-time scroll listener with requestAnimationFrame
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (rafIdRef.current) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const scrollL = el.scrollLeft;
      const clientW = el.clientWidth;

      setScrollState({
        scrollLeft: scrollL,
        containerWidth: clientW,
      });

      setCanScrollLeft(scrollL > 10);
      setCanScrollRight(scrollL < el.scrollWidth - clientW - 15);

      // Compute which step is nearest to center
      const centerPoint = scrollL + clientW * 0.42;
      const computedIndex = Math.min(
        guidance.length - 1,
        Math.max(0, Math.floor((centerPoint - PADDING_LEFT) / STEP_SPAN))
      );
      setActiveStepIndex(computedIndex);
    });
  }, [guidance.length, STEP_SPAN]);

  // Reset active step index and scroll offset when template changes
  useEffect(() => {
    setActiveStepIndex(0);
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollLeft = 0;
    }
  }, [templateTitle, guidance]);

  // Keep container dimensions synced with ResizeObserver
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleResize = () => {
      setScrollState((prev) => ({
        ...prev,
        containerWidth: el.clientWidth,
      }));
      handleScroll();
    };

    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(el);

    el.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      ro.disconnect();
      el.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [handleScroll]);

  // Smooth scroll to step
  const scrollToStep = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const targetX = Math.max(0, PADDING_LEFT + index * STEP_SPAN - 20);
    el.scrollTo({
      left: targetX,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
    setActiveStepIndex(index);
  };

  const scrollPrev = () => {
    const targetIdx = Math.max(0, activeStepIndex - 1);
    scrollToStep(targetIdx);
  };

  const scrollNext = () => {
    const targetIdx = Math.min(guidance.length - 1, activeStepIndex + 1);
    scrollToStep(targetIdx);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollPrev();
    }
  };

  // Click-and-drag mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    hasMovedSignificantlyRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = x - startXRef.current;

    if (Math.abs(walk) > 5) {
      hasMovedSignificantlyRef.current = true;
    }
    el.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    setTimeout(() => {
      hasMovedSignificantlyRef.current = false;
    }, 120);
  };

  const handleCopyTip = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTipIndex(index);
    setTimeout(() => setCopiedTipIndex(null), 2000);
  };

  const viewportCenter = scrollState.scrollLeft + scrollState.containerWidth / 2;

  return (
    <section
      className="scroll-mt-24"
      id="section-guide"
      aria-label="Step-by-step guidance workflow graph"
    >
      {/* ─────────────────────────────────────────────────────────────
          CANVAS HEADER (DISCREET CONTROLS, STEP COUNTER, PREV/NEXT)
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300">
              <Network className="w-3.5 h-3.5" />
              <span>Interactive Workflow Graph</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
              {categoryName} • {guidance.length} Connected Steps
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-['var(--font-heading)']">
            How to run this prompt
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-0.5 max-w-2xl leading-relaxed">
            Follow the connected node path for <strong className="text-slate-900 dark:text-zinc-200">{templateTitle}</strong> in{' '}
            <strong className="text-slate-900 dark:text-zinc-200">{primaryTool.name}</strong> from input parameters to final generation.
          </p>
        </div>

        {/* Step Counter, Drag Hint & Prev/Next Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Step X of Y Indicator */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-blue-900/50 text-xs shadow-xs">
            <span className="font-semibold text-slate-900 dark:text-zinc-100 font-mono">
              Step {activeStepIndex + 1} of {guidance.length}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-slate-500 dark:text-zinc-400 font-medium hidden sm:inline">
              {PHASE_LABELS[activeStepIndex] || 'Action'}
            </span>
          </div>

          {/* Discreet Previous and Next Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollLeft}
              className={`p-2 rounded-xl border border-slate-200 dark:border-blue-900/60 bg-white dark:bg-[#0c1424] text-slate-700 dark:text-zinc-300 transition-all ${
                canScrollLeft
                  ? 'hover:bg-slate-50 dark:hover:bg-blue-950/80 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer shadow-xs'
                  : 'opacity-40 cursor-not-allowed'
              }`}
              title="Previous Node"
              aria-label="Previous node"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollRight}
              className={`p-2 rounded-xl border border-slate-200 dark:border-blue-900/60 bg-white dark:bg-[#0c1424] text-slate-700 dark:text-zinc-300 transition-all ${
                canScrollRight
                  ? 'hover:bg-slate-50 dark:hover:bg-blue-950/80 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer shadow-xs'
                  : 'opacity-40 cursor-not-allowed'
              }`}
              title="Next Node"
              aria-label="Next node"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          HORIZONTALLY SCROLLABLE WORKFLOW CANVAS
          ───────────────────────────────────────────────────────────── */}
      <div
        className="relative rounded-3xl border border-slate-200/90 dark:border-blue-900/40 bg-slate-100/70 dark:bg-[#070b14] shadow-inner overflow-hidden focus:outline-none"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label="Interactive horizontal workflow canvas"
      >
        {/* Subtle Canvas Dot Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(100, 116, 139, 0.35) 1.2px, transparent 1.2px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        {/* Ambient Radial Backlight Glow tracking the active viewport center */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700 opacity-40 dark:opacity-60"
          style={{
            background: `radial-gradient(circle 550px at ${viewportCenter}px 50%, rgba(37, 99, 235, 0.12), transparent 75%)`,
          }}
          aria-hidden="true"
        />

        {/* Drag / Trackpad helper pill */}
        <div className="absolute bottom-3 left-4 z-20 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-white/90 dark:bg-[#0a1222]/80 backdrop-blur-md border border-slate-200/80 dark:border-blue-900/40 text-slate-600 dark:text-zinc-400 shadow-xs">
          <span>↔ Drag canvas, swipe trackpad, or use arrow keys</span>
        </div>

        {/* Horizontally scrollable canvas track with hidden scrollbars */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="relative w-full overflow-x-auto overflow-y-hidden cursor-grab active:cursor-grabbing select-none py-8 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          style={{
            height: `${CANVAS_HEIGHT}px`,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Inner Canvas Surface with calculated width */}
          <div
            className="relative h-full"
            style={{
              width: `${totalCanvasWidth}px`,
              minWidth: '100%',
            }}
          >
            {/* ─────────────────────────────────────────────────────────
                CONTINUOUS SVG BÉZIER SPLINE CONNECTING WIRES
                Connects from actual node ports to node ports
                ───────────────────────────────────────────────────────── */}
            <svg
              className="absolute inset-0 pointer-events-none w-full h-full z-0"
              style={{ width: `${totalCanvasWidth}px`, height: `${CANVAS_HEIGHT}px` }}
              aria-hidden="true"
            >
              <defs>
                {/* Dynamic gradients per step wire */}
                {WIRE_PALETTES.map((palette, pIdx) => (
                  <linearGradient
                    key={`gradient-wire-${pIdx}`}
                    id={`wireGradient-${pIdx}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor={palette.start} />
                    <stop offset="100%" stopColor={palette.end} />
                  </linearGradient>
                ))}

                <filter id="canvasGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {guidance.map((step, idx) => {
                const { instY, visY } = getNodeYPositions(idx);
                const instX = PADDING_LEFT + idx * STEP_SPAN;
                const visX = instX + CARD_WIDTH_INST + GAP_INTERNAL;
                const palette = WIRE_PALETTES[idx % WIRE_PALETTES.length];

                // 1. Port coordinates from Instruction Right Port -> Visual Left Port
                const pInstOutX = instX + CARD_WIDTH_INST;
                const pInstOutY = instY + CARD_HEIGHT_INST / 2;
                const pVisInX = visX;
                const pVisInY = visY + CARD_HEIGHT_VIS / 2;

                const dx1 = (pVisInX - pInstOutX) * 0.52;
                const pathInstToVis = `M ${pInstOutX} ${pInstOutY} C ${pInstOutX + dx1} ${pInstOutY}, ${pVisInX - dx1} ${pVisInY}, ${pVisInX} ${pVisInY}`;

                // Calculate progress state for wire 1
                const isWire1Completed = viewportCenter >= pVisInX;
                const isWire1Active = viewportCenter >= pInstOutX && viewportCenter < pVisInX;

                // 2. Port coordinates from Visual Right Port -> Next Instruction Left Port
                let pathVisToNext = '';
                let isWire2Completed = false;
                let isWire2Active = false;

                if (idx < guidance.length - 1) {
                  const nextPos = getNodeYPositions(idx + 1);
                  const nextInstX = PADDING_LEFT + (idx + 1) * STEP_SPAN;
                  const nextInstY = nextPos.instY;

                  const pVisOutX = visX + CARD_WIDTH_VIS;
                  const pVisOutY = visY + CARD_HEIGHT_VIS / 2;
                  const pNextInX = nextInstX;
                  const pNextInY = nextInstY + CARD_HEIGHT_INST / 2;

                  const dx2 = (pNextInX - pVisOutX) * 0.52;
                  pathVisToNext = `M ${pVisOutX} ${pVisOutY} C ${pVisOutX + dx2} ${pVisOutY}, ${pNextInX - dx2} ${pNextInY}, ${pNextInX} ${pNextInY}`;

                  isWire2Completed = viewportCenter >= pNextInX;
                  isWire2Active = viewportCenter >= pVisOutX && viewportCenter < pNextInX;
                } else {
                  // Connect last visual node to the Completion Node
                  const compX = PADDING_LEFT + guidance.length * STEP_SPAN - GAP_STEP + 36;
                  const compY = 220;

                  const pVisOutX = visX + CARD_WIDTH_VIS;
                  const pVisOutY = visY + CARD_HEIGHT_VIS / 2;
                  const pCompInX = compX;
                  const pCompInY = compY + CARD_HEIGHT_INST / 2;

                  const dx2 = (pCompInX - pVisOutX) * 0.52;
                  pathVisToNext = `M ${pVisOutX} ${pVisOutY} C ${pVisOutX + dx2} ${pVisOutY}, ${pCompInX - dx2} ${pCompInY}, ${pCompInX} ${pCompInY}`;

                  isWire2Completed = viewportCenter >= pCompInX;
                  isWire2Active = viewportCenter >= pVisOutX && viewportCenter < pCompInX;
                }

                return (
                  <g key={`wire-connection-${step.step}`}>
                    {/* Wire 1: Instruction Node to Visual Node */}
                    {/* Glow outline */}
                    <path
                      d={pathInstToVis}
                      fill="none"
                      stroke={
                        isWire1Active
                          ? palette.start
                          : isWire1Completed
                          ? palette.end
                          : 'currentColor'
                      }
                      className={
                        isWire1Active || isWire1Completed
                          ? ''
                          : 'text-slate-300/40 dark:text-blue-900/30'
                      }
                      strokeWidth={isWire1Active ? 6 : isWire1Completed ? 3.5 : 2}
                      strokeOpacity={isWire1Active ? 0.35 : isWire1Completed ? 0.2 : 0.08}
                      filter={isWire1Active ? 'url(#canvasGlow)' : undefined}
                    />

                    {/* Main wire stroke */}
                    <path
                      d={pathInstToVis}
                      fill="none"
                      stroke={
                        isWire1Active || isWire1Completed
                          ? `url(#wireGradient-${idx % WIRE_PALETTES.length})`
                          : 'currentColor'
                      }
                      strokeWidth={isWire1Active ? 2.8 : isWire1Completed ? 2.2 : 1.8}
                      strokeDasharray={
                        isWire1Active && !prefersReducedMotion ? '6 4' : undefined
                      }
                      className={
                        isWire1Active && !prefersReducedMotion
                          ? 'animate-[dash_15s_linear_infinite]'
                          : isWire1Active || isWire1Completed
                          ? ''
                          : 'text-slate-300/90 dark:text-blue-900/50'
                      }
                    />

                    {/* Wire 2: Visual Node to Next Node */}
                    {pathVisToNext && (
                      <>
                        <path
                          d={pathVisToNext}
                          fill="none"
                          stroke={
                            isWire2Active
                              ? palette.end
                              : isWire2Completed
                              ? palette.start
                              : 'currentColor'
                          }
                          className={
                            isWire2Active || isWire2Completed
                              ? ''
                              : 'text-slate-300/40 dark:text-blue-900/30'
                          }
                          strokeWidth={isWire2Active ? 6 : isWire2Completed ? 3.5 : 2}
                          strokeOpacity={isWire2Active ? 0.35 : isWire2Completed ? 0.2 : 0.08}
                          filter={isWire2Active ? 'url(#canvasGlow)' : undefined}
                        />
                        <path
                          d={pathVisToNext}
                          fill="none"
                          stroke={
                            isWire2Active || isWire2Completed
                              ? `url(#wireGradient-${idx % WIRE_PALETTES.length})`
                              : 'currentColor'
                          }
                          strokeWidth={isWire2Active ? 2.8 : isWire2Completed ? 2.2 : 1.8}
                          strokeDasharray={
                            isWire2Active && !prefersReducedMotion ? '6 4' : undefined
                          }
                          className={
                            isWire2Active && !prefersReducedMotion
                              ? 'animate-[dash_15s_linear_infinite]'
                              : isWire2Active || isWire2Completed
                              ? ''
                              : 'text-slate-300/90 dark:text-blue-900/50'
                          }
                        />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* ─────────────────────────────────────────────────────────
                INDIVIDUAL FREE-FLOWING WORKFLOW NODES
                (Instruction Nodes & Visual Nodes with Center-Based Zoom)
                ───────────────────────────────────────────────────────── */}
            {guidance.map((step, idx) => {
              const { instY, visY } = getNodeYPositions(idx);
              const instX = PADDING_LEFT + idx * STEP_SPAN;
              const visX = instX + CARD_WIDTH_INST + GAP_INTERNAL;

              // Node Centers for real-time proximity-based zoom
              const instCenterX = instX + CARD_WIDTH_INST / 2;
              const visCenterX = visX + CARD_WIDTH_VIS / 2;

              const instMotion = getNodeMotion(
                instCenterX,
                scrollState.scrollLeft,
                scrollState.containerWidth,
                prefersReducedMotion
              );

              const visMotion = getNodeMotion(
                visCenterX,
                scrollState.scrollLeft,
                scrollState.containerWidth,
                prefersReducedMotion
              );

              const palette = WIRE_PALETTES[idx % WIRE_PALETTES.length];
              const stepNumStr = step.step < 10 ? `0${step.step}` : `${step.step}`;

              // Subscriber gating: lock from step 3 onwards if not subscribed
              const isStepLocked = !isSubscribed && idx >= 2;

              return (
                <React.Fragment key={`workflow-step-${step.step}`}>
                  {/* ─────────────────────────────────────────────────
                      1. COMPACT INSTRUCTION NODE
                      (High-contrast, elegant typography in light and dark mode)
                      ───────────────────────────────────────────────── */}
                  <div
                    className={`absolute rounded-2xl p-4 transition-all ${
                      instMotion.isCentered
                        ? 'ring-2 ring-blue-500 shadow-xl shadow-blue-500/10 dark:shadow-[0_12px_40px_rgba(30,58,138,0.5)]'
                        : 'shadow-sm hover:shadow-md'
                    } ${
                      isStepLocked
                        ? 'bg-slate-50 dark:bg-[#12141c]/80 backdrop-blur-md border border-amber-500/30 text-slate-900 dark:text-white'
                        : 'bg-white dark:bg-[#0f1422] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-blue-900/50'
                    }`}
                    style={{
                      left: `${instX}px`,
                      top: `${instY}px`,
                      width: `${CARD_WIDTH_INST}px`,
                      height: `${CARD_HEIGHT_INST}px`,
                      transform: prefersReducedMotion ? undefined : `scale(${instMotion.scale})`,
                      opacity: prefersReducedMotion ? 1 : instMotion.opacity,
                      transformOrigin: 'center center',
                      zIndex: instMotion.zIndex,
                      transition: isDragging
                        ? 'none'
                        : prefersReducedMotion
                        ? 'none'
                        : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease',
                      willChange: isDragging ? 'transform, opacity' : 'auto',
                    }}
                  >
                    {/* Node Header Bar */}
                    <div className="flex items-center justify-between gap-1 mb-2.5 pb-2 border-b border-slate-100 dark:border-white/10">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Terminal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="text-xs font-semibold text-slate-600 dark:text-zinc-300 tracking-wide font-mono truncate">
                          {step.actionText ? `${step.actionText} · ` : ''}Step {stepNumStr}
                        </span>
                      </div>

                      {step.actionUrl && (
                        <a
                          href={step.actionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-0.5 cursor-pointer shrink-0"
                          title={step.actionText ? `Open ${step.actionText}` : `Open ${(step as any).toolOrAction || primaryTool.name}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {/* Step Title */}
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight line-clamp-2 mb-1.5 font-['var(--font-heading)']">
                      {step.title}
                    </h3>

                    {/* Instructions Content */}
                    <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-3 mb-2.5">
                      {step.description}
                    </p>

                    {/* Parameter / Tip Chip */}
                    <div className="mt-auto pt-2 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs">
                      {step.tip ? (
                        <div className="flex items-center justify-between w-full gap-1.5">
                          <span className="text-slate-500 dark:text-zinc-400 truncate text-[11px]" title={step.tip}>
                            <strong className="text-amber-600 dark:text-amber-400 font-semibold">Tip:</strong> {step.tip}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyTip(step.tip!, idx)}
                            className="shrink-0 p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                            title="Copy parameter"
                          >
                            {copiedTipIndex === idx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 dark:text-zinc-400 font-mono text-[11px] truncate">
                          Action: {(step as any).toolOrAction || primaryTool.name}
                        </span>
                      )}
                    </div>

                    {/* Circular Output Port on Right Edge */}
                    <div
                      className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-[#0f1422] border-2 ${palette.portBorder} flex items-center justify-center shadow-xs z-20 transition-all ${
                        instMotion.isCentered ? 'scale-125 shadow-blue-400/50' : ''
                      }`}
                      title="Output to visual inspection"
                      aria-hidden="true"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${palette.portDot}`} />
                    </div>
                  </div>

                  {/* ─────────────────────────────────────────────────
                      2. STUDIO VISUAL NODE
                      (Polished preview container in both themes)
                      ───────────────────────────────────────────────── */}
                  <div
                    className={`absolute rounded-2xl overflow-hidden transition-all ${
                      visMotion.isCentered
                        ? 'ring-2 ring-indigo-500/80 shadow-xl shadow-indigo-500/10 dark:shadow-[0_16px_45px_rgba(10,25,65,0.6)]'
                        : 'shadow-md hover:shadow-lg'
                    } ${
                      isStepLocked
                        ? 'bg-slate-50 dark:bg-[#0f121a]/90 backdrop-blur-md border border-amber-500/30'
                        : 'bg-white dark:bg-[#0f1422] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-blue-900/50'
                    }`}
                    style={{
                      left: `${visX}px`,
                      top: `${visY}px`,
                      width: `${CARD_WIDTH_VIS}px`,
                      height: `${CARD_HEIGHT_VIS}px`,
                      transform: prefersReducedMotion ? undefined : `scale(${visMotion.scale})`,
                      opacity: prefersReducedMotion ? 1 : visMotion.opacity,
                      transformOrigin: 'center center',
                      zIndex: visMotion.zIndex,
                      transition: isDragging
                        ? 'none'
                        : prefersReducedMotion
                        ? 'none'
                        : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease',
                      willChange: isDragging ? 'transform, opacity' : 'auto',
                    }}
                  >
                    {/* Visual Card Top Header Bar */}
                    <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-[#090b12] text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full ${palette.portDot} shrink-0`} />
                        <span className="font-semibold text-slate-800 dark:text-zinc-200 text-xs truncate max-w-[170px]">
                          {step.actionText || (step as any).toolOrAction || primaryTool.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200/70 dark:bg-white/10 text-slate-700 dark:text-zinc-300 font-semibold">
                          Inspect
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (!hasMovedSignificantlyRef.current && !isStepLocked) {
                              setSelectedLightboxStep(step);
                            }
                          }}
                          className="text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors p-0.5 cursor-pointer"
                          title="Zoom preview"
                          disabled={isStepLocked}
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Viewport Image Preview */}
                    <div
                      className="relative w-full h-[195px] bg-slate-100 dark:bg-[#05060a] cursor-pointer group overflow-hidden flex items-center justify-center"
                      onClick={() => {
                        if (!hasMovedSignificantlyRef.current && !isStepLocked) {
                          setSelectedLightboxStep(step);
                        }
                      }}
                    >
                      {failedImages[idx] || !step.image ? (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-slate-100 dark:bg-[#070b14] border border-dashed border-slate-300 dark:border-blue-900/40">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center mb-1.5 text-blue-600 dark:text-blue-400">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 line-clamp-1">
                            {step.title}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5 truncate max-w-full">
                            {step.image_alt || `Step ${step.step} Output`}
                          </span>
                        </div>
                      ) : step.image.endsWith('.mp4') || step.image.endsWith('.webm') ? (
                        <video
                          src={step.image}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                            isStepLocked ? 'blur-xs opacity-40' : ''
                          }`}
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={step.image}
                          alt={step.image_alt || `Step ${step.step}: ${step.title}`}
                          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                            isStepLocked ? 'blur-xs opacity-40' : ''
                          }`}
                          loading="lazy"
                          onError={() => setFailedImages((prev) => ({ ...prev, [idx]: true }))}
                        />
                      )}

                      {/* Hover Overlay */}
                      {!isStepLocked && (
                        <div className="absolute inset-0 bg-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold shadow-lg">
                            <Maximize2 className="w-3 h-3" />
                            Inspect Output
                          </span>
                        </div>
                      )}

                      {/* Locked State Overlay */}
                      {isStepLocked && (
                        <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                          <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-1.5">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-white mb-1">
                            Subscriber Only
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSubscribe();
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs cursor-pointer"
                          >
                            Unlock Guide
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="flex items-center justify-between px-3.5 py-2 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-[#090b12] text-xs text-slate-500 dark:text-zinc-400 font-mono">
                      <span>
                        {categoryName.includes('Video')
                          ? '16:9 • 4K UHD 60fps'
                          : categoryName.includes('Slide')
                          ? '16:9 • Vector PDF'
                          : categoryName.includes('Web')
                          ? 'Responsive • Next.js + Tailwind'
                          : '1024 × 1024 • Master Raw'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (!hasMovedSignificantlyRef.current && !isStepLocked) {
                            setSelectedLightboxStep(step);
                          }
                        }}
                        className="px-2.5 py-0.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-600/30 dark:hover:bg-blue-600/50 dark:text-blue-300 dark:border-blue-500/30 font-sans font-semibold text-xs cursor-pointer transition-colors"
                        disabled={isStepLocked}
                      >
                        Review
                      </button>
                    </div>

                    {/* Left Port (Receives Wire from Instruction Node) */}
                    <div
                      className={`absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-[#0f1422] border-2 ${palette.portBorder} flex items-center justify-center shadow-xs z-20 transition-all ${
                        visMotion.isCentered ? 'scale-125 shadow-blue-400/50' : ''
                      }`}
                      title="Input from instruction"
                      aria-hidden="true"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${palette.portDot}`} />
                    </div>

                    {/* Right Port (Outputs Wire to Next Node) */}
                    <div
                      className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-[#0f1422] border-2 ${palette.portBorder} flex items-center justify-center shadow-xs z-20 transition-all ${
                        visMotion.isCentered ? 'scale-125 shadow-blue-400/50' : ''
                      }`}
                      title="Output to next step"
                      aria-hidden="true"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${palette.portDot}`} />
                    </div>
                  </div>
                </React.Fragment>
              );
            })}

            {/* ─────────────────────────────────────────────────────────
                FINAL COMPLETION TERMINAL NODE
                ───────────────────────────────────────────────────────── */}
            {(() => {
              const compX = PADDING_LEFT + guidance.length * STEP_SPAN - GAP_STEP + 36;
              const compY = 220;
              const compCenterX = compX + CARD_WIDTH_COMP / 2;
              const compMotion = getNodeMotion(
                compCenterX,
                scrollState.scrollLeft,
                scrollState.containerWidth,
                prefersReducedMotion
              );

              return (
                <div
                  className={`absolute rounded-2xl p-4 border border-emerald-300 dark:border-emerald-500/40 bg-white dark:bg-[#0d1624] text-slate-900 dark:text-white shadow-md flex flex-col justify-center text-center ${
                    compMotion.isCentered
                      ? 'ring-2 ring-emerald-500 shadow-emerald-500/20'
                      : ''
                  }`}
                  style={{
                    left: `${compX}px`,
                    top: `${compY}px`,
                    width: `${CARD_WIDTH_COMP}px`,
                    height: `${CARD_HEIGHT_INST}px`,
                    transform: prefersReducedMotion ? undefined : `scale(${compMotion.scale})`,
                    opacity: prefersReducedMotion ? 1 : compMotion.opacity,
                    transformOrigin: 'center center',
                    zIndex: compMotion.zIndex,
                    transition: isDragging
                      ? 'none'
                      : prefersReducedMotion
                      ? 'none'
                      : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease',
                  }}
                >
                  {/* Left Port receiving final wire */}
                  <div
                    className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-[#0d1624] border-2 border-emerald-400 flex items-center justify-center shadow-xs z-20"
                    title="Final rendered output"
                    aria-hidden="true"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </div>

                  <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white font-['var(--font-heading)']">
                    Workflow Complete
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 leading-relaxed">
                    Your asset for {templateTitle} is ready for production.
                  </p>
                  <div className="mt-2.5 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                    <Sparkles className="w-3 h-3" />
                    <span>100% Verified</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          FULLSCREEN LIGHTBOX MODAL FOR ZOOMED INSPECTION
          ───────────────────────────────────────────────────────────── */}
      <Dialog
        open={!!selectedLightboxStep}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLightboxStep(null);
            setLightboxImageFailed(false);
          }
        }}
      >
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white dark:bg-[#0c1424] border border-slate-200 dark:border-blue-900/60 text-slate-900 dark:text-white shadow-2xl">
          {selectedLightboxStep && (
            <div>
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-blue-950 bg-slate-50 dark:bg-[#070b14]">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/50">
                    STEP 0{selectedLightboxStep.step}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {selectedLightboxStep.title}
                  </h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                  {primaryTool.name}
                </span>
              </div>

              {/* High-Resolution Preview Canvas */}
              <div className="p-6 bg-slate-100 dark:bg-zinc-950 flex flex-col items-center justify-center max-h-[70vh] overflow-auto">
                {lightboxImageFailed || !selectedLightboxStep.image ? (
                  <div className="py-14 px-8 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/40 flex items-center justify-center mb-3 text-blue-600 dark:text-blue-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">Visual Preview Unavailable</h4>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm">
                      {selectedLightboxStep.image_alt || 'The guidance preview asset could not be loaded.'}
                    </p>
                  </div>
                ) : selectedLightboxStep.image.endsWith('.mp4') || selectedLightboxStep.image.endsWith('.webm') ? (
                  <div className="flex flex-col items-center">
                    <video
                      src={selectedLightboxStep.image}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="max-h-[60vh] w-auto rounded-xl border border-slate-200 dark:border-blue-900/30 shadow-2xl"
                    />
                    {selectedLightboxStep.image_alt && (
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400 mt-2 font-mono">
                        Alt: {selectedLightboxStep.image_alt}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedLightboxStep.image}
                      alt={selectedLightboxStep.image_alt || selectedLightboxStep.title}
                      className="max-h-[60vh] w-auto object-contain rounded-xl border border-slate-200 dark:border-blue-900/30 shadow-2xl"
                      onError={() => setLightboxImageFailed(true)}
                    />
                    {selectedLightboxStep.image_alt && (
                      <span className="text-[11px] text-slate-500 dark:text-zinc-400 mt-2 font-mono">
                        Alt: {selectedLightboxStep.image_alt}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer Description */}
              <div className="p-6 bg-white dark:bg-[#0c1424] border-t border-slate-200 dark:border-blue-950 space-y-2">
                <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
                  {selectedLightboxStep.description}
                </p>
                {selectedLightboxStep.tip && (
                  <p className="text-xs text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 p-3 rounded-xl border border-blue-200 dark:border-blue-800/40">
                    <strong>Pro Tip:</strong> {selectedLightboxStep.tip}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
