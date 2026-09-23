'use client';

import React, { useState, use, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { findTemplate, allTemplates, Tool } from '@/lib/mockData';
import { useAppContext, ERROR_MESSAGES } from '@/lib/AppContext';
import { TemplateImage, ToolTag } from '@/components/TemplateImage';
import { TemplateCard } from '@/components/TemplateCard';
import { SaveToCollectionPopover } from '@/components/SaveToCollectionPopover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Check,
  Copy,
  Heart,
  Lock,
  Unlock,
  Sparkles,
  Star,
  Eye,
  BookOpen,
  ExternalLink,
  ZoomIn,
  AlertCircle,
  X,
  ChevronRight,
  Play,
  Layers,
  Wand2,
} from 'lucide-react';

// Plausible mock statistics varied per template
interface TemplateStats {
  rating: string;
  copies: string;
  likes: number;
  views: string;
}

const TEMPLATE_STATS: Record<string, TemplateStats> = {
  tpl_1: {
    rating: '4.9',
    copies: '4.8k',
    likes: 342,
    views: '64.1k',
  },
  'plain-product-on-white': {
    rating: '4.9',
    copies: '4.8k',
    likes: 342,
    views: '64.1k',
  },
  tpl_2: {
    rating: '4.8',
    copies: '3.2k',
    likes: 289,
    views: '41.8k',
  },
  'lifestyle-context': {
    rating: '4.8',
    copies: '3.2k',
    likes: 289,
    views: '41.8k',
  },
  tpl_3: {
    rating: '4.9',
    copies: '5.6k',
    likes: 415,
    views: '72.4k',
  },
  'festive-banner': {
    rating: '4.9',
    copies: '5.6k',
    likes: 415,
    views: '72.4k',
  },
  tpl_4: {
    rating: '4.7',
    copies: '2.3k',
    likes: 194,
    views: '31.9k',
  },
  'flat-lay-composition': {
    rating: '4.7',
    copies: '2.3k',
    likes: 194,
    views: '31.9k',
  },
};

interface ReviewItem {
  id: string;
  rating: number;
  text: string;
  handle: string;
  date: string;
}

const REVIEWS_LIST: ReviewItem[] = [
  {
    id: 'rev_1',
    rating: 5,
    text: 'Lighting notes saved me two hours of trial and error in Midjourney v6.',
    handle: '@marcus_creative',
    date: '2 days ago',
  },
  {
    id: 'rev_2',
    rating: 5,
    text: 'The contact shadow instructions gave me a commercial-ready Shopify hero on the first roll.',
    handle: '@ecom_alex',
    date: '5 days ago',
  },
  {
    id: 'rev_3',
    rating: 5,
    text: "AWA Studio's templates are the only AI prompts our agency trusts for client deliverables.",
    handle: '@nordic_agency',
    date: '1 week ago',
  },
  {
    id: 'rev_4',
    rating: 4,
    text: 'Spot-on camera settings. Tweaked the lens focal length slightly for a wider shot, but the base structure is unmatched.',
    handle: '@studio_kai',
    date: '1 week ago',
  },
  {
    id: 'rev_5',
    rating: 5,
    text: 'Tack-sharp focus on the micro-textures. Never going back to naive prompting.',
    handle: '@elena_design',
    date: '2 weeks ago',
  },
];

// Nude gradient constant for buttons/CTAs (#e8c9a8 → #c17f59)
const NUDE_BTN_CLASSES =
  'bg-gradient-to-r from-[#e8c9a8] via-[#d59c77] to-[#c17f59] text-white font-bold hover:opacity-95 active:scale-[0.99] transition-all shadow-sm';

const NUDE_LOCKED_BTN_CLASSES =
  'bg-gradient-to-r from-[#e8c9a8]/50 via-[#d59c77]/50 to-[#c17f59]/50 grayscale-[40%] text-stone-800 dark:text-stone-200 font-bold border border-[#c17f59]/35 shadow-xs hover:opacity-95 transition-all';

export default function TemplateDetailPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const router = useRouter();
  const { templateId } = use(params);

  // Locate the template within mockCatalog
  const match = findTemplate(templateId);
  if (!match) {
    notFound();
  }

  const { template, category, subcategory } = match;
  const categoryName = category.name;
  const subName = subcategory.name;
  const catId = category.id;
  const subId = subcategory.id;

  const {
    isSubscribed,
    credits,
    subscribe,
    unsubscribe,
    toggleSubscribed,
    customize,
    errorState,
    clearError,
    triggerError,
  } = useAppContext();

  const isWebsite = template.mainCategory === 'Websites';

  const [currentPrompt, setCurrentPrompt] = useState(template.basePrompt);
  const [currentUiPrompt, setCurrentUiPrompt] = useState(template.uiPrompt || '');
  const [currentContextPrompt, setCurrentContextPrompt] = useState(template.contextPrompt || '');
  const [activePromptTab, setActivePromptTab] = useState<'ui' | 'context' | 'all'>('ui');
  const [isUiCopied, setIsUiCopied] = useState(false);
  const [isContextCopied, setIsContextCopied] = useState(false);
  const [isAllCopied, setIsAllCopied] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [customizeInput, setCustomizeInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [hasCustomized, setHasCustomized] = useState(false);
  const [showSubscribeGate, setShowSubscribeGate] = useState(false);
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [activeDetailImageIndex, setActiveDetailImageIndex] = useState(0);
  const [selectedGuidanceModalImage, setSelectedGuidanceModalImage] = useState<string | null>(null);

  // Local Like button toggle state (distinct from Save)
  const [isLiked, setIsLiked] = useState(false);
  const [likeDelta, setLikeDelta] = useState(0);

  // Template-specific demo preset
  const getDemoPreset = () => {
    switch (template.id) {
      case 'tpl_web_1':
        return 'Change target audience to mobile iOS developers and add an interactive Swift code playground.';
      case 'tpl_web_2':
        return 'Change specialization to luxury fashion 3D packaging and typography director.';
      case 'tpl_web_3':
        return 'Change the 3 features to fintech payments: 1) Instant ACH, 2) Global FX Rails, 3) Real-Time Fraud Shield.';
      case 'tpl_future_machine':
        return 'Change focus to surgical robotic arms with sub-millimeter haptic feedback sensors.';
      case 'tpl_quantum_human':
        return 'Change to sleep telemetry tracking with REM-stage binaural frequency modulation.';
      case 'tpl_mind_ai':
        return 'Change color scheme to high-contrast neon solar flare with instant Unity engine mesh export.';
      case 'tpl_web_bakery':
        return 'Add a weekly sourdough bread subscription box with doorstep weekend delivery.';
      default:
        return 'Make it a leather wallet, vertical for a phone listing.';
    }
  };

  const DEMO_PRESET_QUERY = getDemoPreset();

  // Stats for this template
  const rawStats = TEMPLATE_STATS[template.id] || {
    rating: '4.8',
    copies: '3.4k',
    likes: 291,
    views: '53.2k',
  };

  const displayedLikes = rawStats.likes + likeDelta;

  const primaryTool: Tool = template.tools[0] || {
    id: 'midjourney',
    name: 'Midjourney',
    logo: '/images/tools/midjourney.png',
  };

  // Pull 4 similar templates from same category/catalog
  const similarTemplates = useMemo(() => {
    const candidates = allTemplates.filter((t) => t.id !== template.id);
    const sameMainCat = candidates.filter((t) => t.mainCategory === template.mainCategory);
    const sameSubCat = sameMainCat.filter((t) => t.category === template.category);
    const otherSubCat = sameMainCat.filter((t) => t.category !== template.category);
    const otherMainCat = candidates.filter((t) => t.mainCategory !== template.mainCategory);
    return [...sameSubCat, ...otherSubCat, ...otherMainCat].slice(0, 4);
  }, [template]);

  const handleCopyPrompt = () => {
    if (isSubscribed) {
      navigator.clipboard.writeText(currentPrompt);
      setIsCopied(true);
      setShowSubscribeGate(false);
      setTimeout(() => setIsCopied(false), 3000);
    } else {
      setShowSubscribeGate(true);
    }
  };

  const handleCopyUiPrompt = () => {
    if (isSubscribed) {
      navigator.clipboard.writeText(currentUiPrompt || currentPrompt);
      setIsUiCopied(true);
      setShowSubscribeGate(false);
      setTimeout(() => setIsUiCopied(false), 2500);
    } else {
      setShowSubscribeGate(true);
    }
  };

  const handleCopyContextPrompt = () => {
    if (isSubscribed) {
      navigator.clipboard.writeText(currentContextPrompt);
      setIsContextCopied(true);
      setShowSubscribeGate(false);
      setTimeout(() => setIsContextCopied(false), 2500);
    } else {
      setShowSubscribeGate(true);
    }
  };

  const handleCopyAllPrompts = () => {
    if (isSubscribed) {
      const combined = [
        currentUiPrompt ? `[UI & IMPLEMENTATION PROMPT]\n${currentUiPrompt}` : '',
        currentContextPrompt ? `[BUSINESS CONTEXT PROMPT]\n${currentContextPrompt}` : '',
      ]
        .filter(Boolean)
        .join('\n\n') || currentPrompt;
      navigator.clipboard.writeText(combined);
      setIsAllCopied(true);
      setIsCopied(true);
      setShowSubscribeGate(false);
      setTimeout(() => {
        setIsAllCopied(false);
        setIsCopied(false);
      }, 3000);
    } else {
      setShowSubscribeGate(true);
    }
  };

  const handleSubscribeInstant = () => {
    subscribe();
    setShowPlansModal(false);
    setShowSubscribeGate(false);
    if (isWebsite) {
      handleCopyAllPrompts();
    } else {
      navigator.clipboard.writeText(currentPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  const handleCustomize = async (queryToUse?: string) => {
    const query = queryToUse || customizeInput;
    if (!query.trim()) return;

    setIsCustomizing(true);
    clearError();

    try {
      if (isWebsite && currentContextPrompt) {
        const revisedContext = await customize(currentContextPrompt, query);
        setCurrentContextPrompt(revisedContext);
        setHasCustomized(true);
        setCustomizeInput('');
      } else {
        const revised = await customize(template!.basePrompt, query);
        setCurrentPrompt(revised);
        setHasCustomized(true);
        setCustomizeInput('');
      }
    } catch {
      // Error handled by AppContext
    } finally {
      setIsCustomizing(false);
    }
  };

  const resetToOriginal = () => {
    setCurrentPrompt(template!.basePrompt);
    setCurrentUiPrompt(template!.uiPrompt || '');
    setCurrentContextPrompt(template!.contextPrompt || '');
    setHasCustomized(false);
    clearError();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-32">
      {/* Navigation Bar: Back Action & Breadcrumb Path & Quick Demo State Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (typeof window !== 'undefined' && window.history.length > 1) {
                router.back();
              } else {
                router.push('/templates');
              }
            }}
            className="rounded-full text-xs font-semibold px-3.5 h-8 gap-2 bg-zinc-100 dark:bg-blue-900/30 border-zinc-200/80 dark:border-blue-800/40"
            title="Return to template gallery"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to gallery</span>
          </Button>

          {/* Quick Demo State Switcher */}
          <button
            type="button"
            onClick={toggleSubscribed}
            className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border transition-all shadow-2xs cursor-pointer ${isSubscribed
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25'
                : 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25'
              }`}
            title="Click to toggle between Subscribed and Guest mode"
          >
            <span className={`w-2 h-2 rounded-full ${isSubscribed ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            <span>{isSubscribed ? 'Subscribed Mode (Click to Lock)' : 'Guest Mode (Click to Unlock)'}</span>
            <span className="text-[10px] opacity-60 underline">Switch</span>
          </button>
        </div>

        <nav className="flex flex-wrap items-center text-xs text-zinc-400 dark:text-zinc-500 gap-1.5 truncate">
          <Link href="/templates" className="hover:text-black dark:hover:text-white transition-colors font-medium">Templates</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/category/${catId}`} className="hover:text-black dark:hover:text-white transition-colors font-medium">{categoryName}</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/category/${catId}/${subId}`} className="hover:text-black dark:hover:text-white transition-colors font-medium">{subName}</Link>
        </nav>
      </div>

      {/* ═══════════════════════════════════════════
          TOP SECTION — TWO-COLUMN LAYOUT
          ═══════════════════════════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-12">

        {/* LEFT COLUMN — Dynamic Media Layout based on Category */}
        <div className="lg:col-span-6 w-full">
          {template.mainCategory === 'Image' && (
            <>
              <div className="rounded-3xl border border-zinc-200/80 dark:border-blue-700/40 bg-white dark:bg-gradient-to-b dark:from-[#0d1c3a] dark:via-[#0a1429] dark:to-[#070e1e] backdrop-blur-xl p-3 shadow-md dark:shadow-[0_12px_40px_rgba(10,25,65,0.45)] overflow-hidden transition-all">
                <TemplateImage
                  images={[((template.media.gallery || [])[activeDetailImageIndex] || template.media.primaryImage || '')]}
                  alt={template.name}
                  aspectRatio="1:1"
                  previewAccent={template.previewAccent}
                  subtitle={template.subtitle}
                  charCount={template.charCount}
                  className="rounded-2xl"
                />
              </div>
              {template.media.gallery && template.media.gallery.length > 1 && (
                <div className="p-2.5 mt-4 rounded-2xl bg-white/80 dark:bg-[#0c162e]/90 backdrop-blur-md border border-zinc-200/80 dark:border-blue-900/50 shadow-sm flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                  {template.media.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveDetailImageIndex(idx)}
                      className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${idx === activeDetailImageIndex
                          ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-md shadow-blue-500/20 opacity-100 scale-102'
                          : 'border-zinc-200 dark:border-blue-950 opacity-60 hover:opacity-100 hover:border-blue-400/50'
                        }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`${template.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {template.mainCategory === 'Video' && (
            <div className="rounded-3xl border border-zinc-200/80 dark:border-blue-700/40 bg-zinc-950 dark:bg-gradient-to-b dark:from-[#0d1c3a] dark:via-[#0a1429] dark:to-[#070e1e] p-3 shadow-md dark:shadow-[0_12px_40px_rgba(10,25,65,0.45)] overflow-hidden">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={template.media.poster} alt={template.name} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl transition-transform group-hover:scale-110">
                    <Play className="w-6 h-6 ml-1 fill-white" />
                  </div>
                </div>
              </div>
              {template.media.gallery && template.media.gallery.length > 1 && (
                <div className="p-2.5 mt-3 rounded-2xl bg-white/80 dark:bg-[#0c162e]/90 backdrop-blur-md border border-zinc-200/80 dark:border-blue-900/50 shadow-sm flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {template.media.gallery.map((frame, idx) => (
                    <div key={idx} className="relative w-24 aspect-video shrink-0 rounded-lg overflow-hidden border border-zinc-200 dark:border-blue-900/40 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={frame} alt={`Frame ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {template.mainCategory === 'Slides' && (
            <div className="rounded-3xl border border-zinc-200/80 dark:border-blue-700/40 bg-zinc-100 dark:bg-gradient-to-b dark:from-[#0d1c3a] dark:via-[#0a1429] dark:to-[#070e1e] backdrop-blur-md p-4 shadow-md dark:shadow-[0_12px_40px_rgba(10,25,65,0.45)]">
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg border border-zinc-200 dark:border-blue-800/40 bg-white dark:bg-[#080d19] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={template.media.slides?.[activeDetailImageIndex] || template.media.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                  {activeDetailImageIndex + 1} / {template.media.slides?.length || 1}
                </div>
              </div>
              {template.media.slides && template.media.slides.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-4 p-2 rounded-2xl bg-white/60 dark:bg-[#0c162e]/70 border border-zinc-200/60 dark:border-blue-900/40">
                  {template.media.slides.map((slide, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveDetailImageIndex(idx)}
                      className={`relative aspect-video rounded-md overflow-hidden border-2 transition-all cursor-pointer ${idx === activeDetailImageIndex
                          ? 'border-blue-500 opacity-100 shadow-md scale-105'
                          : 'border-transparent opacity-50 hover:opacity-100'
                        }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={slide} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {template.mainCategory === 'Websites' && (
            <div className="rounded-3xl border border-zinc-200/80 dark:border-blue-700/40 bg-zinc-100 dark:bg-gradient-to-b dark:from-[#0d1c3a] dark:via-[#0a1429] dark:to-[#070e1e] backdrop-blur-md shadow-md dark:shadow-[0_12px_40px_rgba(10,25,65,0.45)] overflow-hidden flex flex-col">
              <div className="h-8 bg-zinc-200 dark:bg-[#080d19] flex items-center px-4 gap-2 border-b border-zinc-300 dark:border-blue-800/40 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                <div className="mx-auto bg-white/50 dark:bg-black/40 text-[9px] font-mono px-4 py-0.5 rounded text-zinc-500 dark:text-zinc-400 truncate max-w-[200px]">
                  localhost:3000
                </div>
              </div>
              <div className="p-0 bg-white dark:bg-[#080d19] relative aspect-[16/10] overflow-y-auto no-scrollbar">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={template.media.desktopPreview || template.media.thumbnail} alt={template.name} className="w-full object-cover object-top" />
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-6 flex flex-col justify-start">

          {/* Top Row: Primary tool badge (left) & Like + Save icons (right) */}
          <div className="flex items-center justify-between gap-2 mb-3">
            {/* Primary recommended tool badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-blue-900/30 backdrop-blur-md border border-zinc-200 dark:border-blue-800/40 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
              {primaryTool.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={primaryTool.logo}
                  alt={primaryTool.name}
                  className="w-4 h-4 rounded object-contain shrink-0"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="w-4 h-4 rounded-full bg-black text-white text-[9px] flex items-center justify-center font-bold">
                  {primaryTool.name.charAt(0)}
                </span>
              )}
              <span>{primaryTool.name}</span>
            </div>

            {/* Like button AND Save/bookmark icon */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsLiked(!isLiked);
                  setLikeDelta((prev) => (isLiked ? prev - 1 : prev + 1));
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${isLiked
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-500 shadow-2xs'
                    : 'bg-white dark:bg-blue-900/30 backdrop-blur-md hover:bg-zinc-50 dark:hover:bg-blue-900/50 border-zinc-200 dark:border-blue-800/40 text-zinc-500 dark:text-zinc-400 hover:text-rose-500 shadow-2xs'
                  }`}
                title={isLiked ? 'Unlike template' : 'Like template'}
                aria-label={isLiked ? 'Unlike template' : 'Like template'}
              >
                <Heart
                  className={`w-4 h-4 transition-transform duration-200 ${isLiked ? 'scale-110 fill-rose-500 text-rose-500' : ''
                    }`}
                />
              </button>

              <SaveToCollectionPopover
                templateId={template.id}
                templateName={template.name}
                variant="icon-only"
              />
            </div>
          </div>

          {/* Template name — large, bold title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-['var(--font-heading)'] leading-tight mb-1.5">
            {template.title}
          </h1>

          {/* Meta line: category/breadcrumb path */}
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-4">
            {categoryName} › {subName}
          </p>

          {/* STATS ROW — horizontal row of small stat items with Lucide icons */}
          <div className="flex items-center gap-4 sm:gap-5 pb-4 mb-5 border-b border-zinc-200/80 dark:border-blue-900/40 text-xs text-zinc-600 dark:text-zinc-400 flex-wrap">
            {/* Rating */}
            <div className="flex items-center gap-1 font-semibold text-zinc-900 dark:text-zinc-100" title="Average Rating">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{rawStats.rating}</span>
            </div>

            {/* Prompt Copied Users Count */}
            <div className="flex items-center gap-1" title="Prompt copied users count">
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span>{rawStats.copies} copied</span>
            </div>

            {/* Like count */}
            <div className={`flex items-center gap-1 font-medium transition-colors ${isLiked ? 'text-rose-600 dark:text-rose-400' : ''}`} title="Likes">
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-zinc-400'}`} />
              <span>{displayedLikes}</span>
            </div>

            {/* Views */}
            <div className="flex items-center gap-1" title="Views">
              <Eye className="w-3.5 h-3.5 text-zinc-400" />
              <span>{rawStats.views} views</span>
            </div>
          </div>

          {/* Primary CTA button */}
          <button
            type="button"
            onClick={() => {
              if (!isSubscribed) {
                setShowSubscribeGate(true);
                return;
              }
              if (isWebsite) {
                handleCopyAllPrompts();
              } else {
                navigator.clipboard.writeText(currentPrompt);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              }
            }}
            className={`w-full py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 mb-4 transition-all cursor-pointer ${isSubscribed ? NUDE_BTN_CLASSES : NUDE_LOCKED_BTN_CLASSES
              }`}
          >
            {!isSubscribed ? (
              <>
                <Lock className="w-4 h-4" />
                <span>{isWebsite ? 'Copy Dual Prompts (Locked)' : 'Copy Prompt (Locked)'}</span>
              </>
            ) : isWebsite ? (
              isAllCopied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Copied Both Prompts!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Dual Prompts (UI & Context)</span>
                </>
              )
            ) : isCopied ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>

          {/* Inline subscription gate message */}
          {showSubscribeGate && !isSubscribed && (
            <div className="mb-4 p-4 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/50 dark:bg-rose-950/20 text-sm text-rose-800 dark:text-rose-200 flex flex-col gap-3">
              <p>You need an active subscription to copy this premium prompt.</p>
              <Button
                size="sm"
                onClick={subscribe}
                className="self-start text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
              >
                Demo Unlock (Subscribe)
              </Button>
            </div>
          )}

          {/* Tool/model badges if template supports more than one engine */}
          {template.tools.length > 1 && (
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Supported engines:</span>
              <div className="flex items-center gap-1.5">
                {template.tools.map((tool) => (
                  <ToolTag key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#0c162e]/80 backdrop-blur-md border border-zinc-200/80 dark:border-blue-900/40">
            <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed font-normal">
              {template.description}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          MIDDLE SECTION — PROMPT, CUSTOMIZE, GUIDANCE
          ═══════════════════════════════════════════ */}

      {/* PROMPT DISPLAY */}
      <section className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-['var(--font-heading)']">
                {isWebsite ? 'Template Prompts' : 'The Prompt'}
              </h2>
              {isWebsite && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Dual Prompt: UI & Business Context
                </span>
              )}
            </div>
            {isWebsite && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Specialized prompts for external AI generation tools (v0, Cursor, Framer AI, Claude, ChatGPT). AWA does not host or execute code directly.
              </p>
            )}
          </div>
        </div>

        {/* Distinct Card Treatment with Nude/Terracotta Border Accent */}
        <div className="bg-white dark:bg-[#0a0e1a] border-2 border-[#e8c9a8]/70 dark:border-[#e8c9a8]/40 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden transition-all duration-300">
          {/* Thinking Shimmer Overlay during AI Customization */}
          {isCustomizing && (
            <div className="absolute inset-0 z-30 rounded-3xl bg-white/95 dark:bg-[#0a0e1a]/95 backdrop-blur-xs flex flex-col items-center justify-center p-6">
              <div className="w-10 h-10 border-2 border-zinc-300 dark:border-blue-800 border-t-[#c17f59] rounded-full animate-spin mb-3" />
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 animate-pulse">
                Adapting prompt with AI...
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs text-center">
                {isWebsite
                  ? 'Preserving component structure, Tailwind styling, and responsive layout while updating your business context'
                  : 'Preserving studio lighting, optics, and camera parameters while updating your subject'}
              </p>
            </div>
          )}

          {/* Formatted Prompt Copy */}
          {!isSubscribed ? (
            <div className="relative rounded-2xl overflow-hidden bg-zinc-50 dark:bg-blue-950/30 backdrop-blur-md border border-zinc-200 dark:border-blue-900/40 p-8 flex flex-col items-center justify-center min-h-[280px]">
              {/* Blurred background text effect */}
              <div className="absolute inset-0 select-none opacity-20 dark:opacity-10 pointer-events-none filter blur-[5px]" aria-hidden="true">
                <p className="p-6 font-sans text-sm leading-relaxed text-zinc-900 dark:text-zinc-100">
                  {isWebsite
                    ? `${template.uiPrompt || template.basePrompt}\n\n${template.contextPrompt || ''}`
                    : template.basePrompt}
                </p>
              </div>

              {/* Lock Overlay */}
              <div className="relative z-10 flex flex-col items-center text-center max-w-sm mx-auto">
                <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-blue-900/30 backdrop-blur-md text-zinc-500 dark:text-zinc-400 flex items-center justify-center mb-4 shadow-sm border border-zinc-200 dark:border-blue-800/40">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 font-['var(--font-heading)']">
                  {isWebsite ? 'Website Prompts Locked' : 'Premium Prompt Locked'}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                  {isWebsite
                    ? 'Subscribe to unlock both the UI Prompt (for code generators) and Context Prompt (for LLM reasoning) for this template.'
                    : 'Subscribe to unlock the exact prompt, camera settings, and lighting architecture used to generate this result.'}
                </p>
                <button
                  onClick={subscribe}
                  className={`px-8 py-3 rounded-xl shadow-sm ${NUDE_BTN_CLASSES} cursor-pointer`}
                >
                  Subscribe to Unlock
                </button>
              </div>
            </div>
          ) : isWebsite ? (
            /* DUAL PROMPT VIEW FOR WEBSITE TEMPLATES */
            <div className="space-y-6">
              {/* Tab Selector */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-zinc-100 dark:bg-slate-900/80 border border-zinc-200 dark:border-blue-900/40">
                <button
                  type="button"
                  onClick={() => setActivePromptTab('ui')}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activePromptTab === 'ui'
                      ? 'bg-white dark:bg-blue-600 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-300" />
                  <span>1. UI Prompt (Visual & Implementation)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePromptTab('context')}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activePromptTab === 'context'
                      ? 'bg-white dark:bg-emerald-600 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-300" />
                  <span>2. Context Prompt (Business Purpose & Copy)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePromptTab('all')}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activePromptTab === 'all'
                      ? 'bg-white dark:bg-slate-800 text-zinc-900 dark:text-white shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <span>Both Prompts</span>
                </button>
              </div>

              {/* TAB 1: UI PROMPT */}
              {activePromptTab === 'ui' && (
                <div className="space-y-4">
                  {/* Tool Guidance Banner */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-900 dark:text-blue-200">UI Prompt Purpose:</span>
                        <span className="text-blue-700 dark:text-blue-300">Layout, components, typography, colors, responsive behavior, interactions, accessibility</span>
                      </div>
                      <p className="text-[11px] text-blue-600/90 dark:text-blue-300/80">
                        Paste this into your generative code tool to construct the interactive frontend component.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-blue-700/80 dark:text-blue-300/80">Best with:</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 font-semibold text-blue-800 dark:text-blue-200 text-[10px]">v0</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 font-semibold text-blue-800 dark:text-blue-200 text-[10px]">Cursor</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 font-semibold text-blue-800 dark:text-blue-200 text-[10px]">Framer AI</span>
                      <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/60 font-semibold text-blue-800 dark:text-blue-200 text-[10px]">Lovable</span>
                    </div>
                  </div>

                  {/* UI Prompt Content */}
                  <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-[#070b14] border border-zinc-200/80 dark:border-slate-800/80 font-mono text-xs sm:text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap select-text">
                    {currentUiPrompt || currentPrompt}
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleCopyUiPrompt}
                        className={`py-3 px-6 rounded-xl ${NUDE_BTN_CLASSES} flex items-center justify-center gap-2 shadow-xs cursor-pointer text-xs sm:text-sm`}
                      >
                        {isUiCopied ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Copied UI Prompt! ✓</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy UI Prompt</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyAllPrompts}
                        className="py-3 px-4 rounded-xl border border-zinc-300 dark:border-blue-800/60 bg-zinc-100 dark:bg-blue-950/40 hover:bg-zinc-200 dark:hover:bg-blue-900/50 text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Both Prompts</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePromptTab('context')}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Next: Review Context Prompt</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: CONTEXT PROMPT */}
              {activePromptTab === 'context' && (
                <div className="space-y-4">
                  {/* Tool Guidance Banner */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-900 dark:text-emerald-200">Context Prompt Purpose:</span>
                        <span className="text-emerald-700 dark:text-emerald-300">Product identity, target audience, business goals, page sections, tone of voice, CTAs</span>
                      </div>
                      <p className="text-[11px] text-emerald-600/90 dark:text-emerald-300/80">
                        Paste this into your LLM or system prompt to populate realistic domain copy instead of generic lorem ipsum.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                      <span className="text-[10px] uppercase font-bold text-emerald-700/80 dark:text-emerald-300/80">Best with:</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 font-semibold text-emerald-800 dark:text-emerald-200 text-[10px]">Claude 3.7</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 font-semibold text-emerald-800 dark:text-emerald-200 text-[10px]">ChatGPT-4o</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 font-semibold text-emerald-800 dark:text-emerald-200 text-[10px]">System Prompt</span>
                    </div>
                  </div>

                  {/* Context Prompt Content */}
                  <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-[#070b14] border border-zinc-200/80 dark:border-slate-800/80 font-mono text-xs sm:text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap select-text">
                    {currentContextPrompt}
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleCopyContextPrompt}
                        className={`py-3 px-6 rounded-xl ${NUDE_BTN_CLASSES} flex items-center justify-center gap-2 shadow-xs cursor-pointer text-xs sm:text-sm`}
                      >
                        {isContextCopied ? (
                          <>
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Copied Context Prompt! ✓</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Context Prompt</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleCopyAllPrompts}
                        className="py-3 px-4 rounded-xl border border-zinc-300 dark:border-blue-800/60 bg-zinc-100 dark:bg-blue-950/40 hover:bg-zinc-200 dark:hover:bg-blue-900/50 text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer transition-all"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Both Prompts</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePromptTab('ui')}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to UI Prompt</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: BOTH PROMPTS (COMBINED) */}
              {activePromptTab === 'all' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-slate-900/60 border border-zinc-200 dark:border-blue-900/30 text-xs text-zinc-600 dark:text-zinc-300 flex items-center justify-between">
                    <span>Combined bundle with clear [UI & IMPLEMENTATION PROMPT] and [BUSINESS CONTEXT PROMPT] headers.</span>
                    <span className="font-mono text-[11px] text-zinc-400">
                      {(currentUiPrompt + currentContextPrompt).length} total chars
                    </span>
                  </div>

                  <div className="space-y-4 p-6 rounded-2xl bg-zinc-50 dark:bg-[#070b14] border border-zinc-200/80 dark:border-slate-800/80 font-mono text-xs sm:text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap select-text">
                    <div className="text-blue-600 dark:text-blue-400 font-bold border-b border-blue-500/20 pb-2">
                      [UI & IMPLEMENTATION PROMPT]
                    </div>
                    <div>{currentUiPrompt || currentPrompt}</div>

                    <div className="text-emerald-600 dark:text-emerald-400 font-bold border-b border-emerald-500/20 pb-2 pt-4">
                      [BUSINESS CONTEXT PROMPT]
                    </div>
                    <div>{currentContextPrompt}</div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleCopyAllPrompts}
                      className={`py-3 px-6 rounded-xl ${NUDE_BTN_CLASSES} flex items-center justify-center gap-2 shadow-xs cursor-pointer text-xs sm:text-sm`}
                    >
                      {isAllCopied ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Copied Both Prompts to Clipboard! ✓</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Both Prompts</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* STANDARD PROMPT VIEW FOR IMAGE/VIDEO TEMPLATES */
            <>
              <div className="space-y-4 font-sans text-sm sm:text-base leading-relaxed text-zinc-900 dark:text-zinc-100 select-text">
                {currentPrompt.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('Lighting:')) {
                    return (
                      <div key={idx} className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border-l-3 border-[#c17f59] text-zinc-800 dark:text-zinc-200">
                        <span className="text-xs font-bold text-stone-900 dark:text-amber-300 uppercase tracking-wider block mb-1">
                          Lighting Architecture
                        </span>
                        <p className="text-zinc-700 dark:text-zinc-300 text-sm">
                          {paragraph.replace('Lighting: ', '')}
                        </p>
                      </div>
                    );
                  }
                  if (paragraph.startsWith('Camera & Optics:')) {
                    return (
                      <div key={idx} className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border-l-3 border-[#c17f59] text-zinc-800 dark:text-zinc-200">
                        <span className="text-xs font-bold text-stone-900 dark:text-rose-300 uppercase tracking-wider block mb-1">
                          Camera & Optics Settings
                        </span>
                        <p className="text-zinc-700 dark:text-zinc-300 text-sm">
                          {paragraph.replace('Camera & Optics: ', '')}
                        </p>
                      </div>
                    );
                  }
                  if (paragraph.startsWith('Parameters:')) {
                    return (
                      <div key={idx} className="p-3.5 rounded-xl bg-zinc-100 dark:bg-blue-950/40 border border-zinc-200 dark:border-blue-900/40 font-mono text-xs text-zinc-800 dark:text-zinc-300">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1 font-sans">
                          Parameters
                        </span>
                        <code>{paragraph.replace('Parameters: ', '')}</code>
                      </div>
                    );
                  }

                  return (
                    <p key={idx} className="text-zinc-900 dark:text-zinc-100 font-medium text-base leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* COPY BUTTON */}
              <div className="mt-8 flex flex-col items-start gap-3">
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className={`py-3 px-6 rounded-xl ${NUDE_BTN_CLASSES} flex items-center justify-center gap-2 shadow-xs cursor-pointer`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Copied to Clipboard! ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Prompt</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {/* CUSTOMIZE PANEL (available when unlocked) */}
          {isSubscribed && (
            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-blue-900/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-1.5">
                    <Wand2 className="w-4 h-4 text-amber-500" />
                    Customize this prompt
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {isWebsite
                      ? 'Adapt the business context, audience, or branding in plain English while keeping layout architecture intact.'
                      : 'Adapt the subject or framing in plain English.'}
                  </p>
                </div>

                {/* Credit meter */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-blue-900/30 backdrop-blur-md border border-zinc-200 dark:border-blue-800/40 text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400">Uses 1 credit.</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {credits} credits remaining
                  </span>
                </div>
              </div>

              {/* Demo script preset shortcut */}
              <div className="mb-3 flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Demo preset:</span>
                <button
                  onClick={() => setCustomizeInput(DEMO_PRESET_QUERY)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-blue-900/30 backdrop-blur-md hover:bg-zinc-200 dark:hover:bg-blue-900/50 border border-zinc-200 dark:border-blue-800/40 text-zinc-800 dark:text-zinc-300 text-xs font-mono transition-all text-left truncate max-w-full cursor-pointer"
                  title="Click to fill script preset"
                >
                  &ldquo;{DEMO_PRESET_QUERY}&rdquo;
                </button>
              </div>

              {/* Input field & Submit Action with Nude Gradient */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={customizeInput}
                  onChange={(e) => setCustomizeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isCustomizing && customizeInput.trim()) {
                      handleCustomize();
                    }
                  }}
                  placeholder={
                    isWebsite
                      ? 'e.g., Change business to an organic matcha cafe with a tea subscription service'
                      : 'e.g., Make it a leather wallet, vertical for a phone listing.'
                  }
                  disabled={isCustomizing}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-blue-950/40 border border-zinc-300 dark:border-blue-800/40 focus:border-[#c17f59] dark:focus:border-blue-500 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm focus:outline-none transition-colors"
                />

                <button
                  onClick={() => handleCustomize()}
                  disabled={isCustomizing || !customizeInput.trim()}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${isCustomizing
                      ? 'bg-gradient-to-r from-[#e8c9a8] via-[#d59c77] to-[#c17f59] text-white animate-pulse cursor-wait shadow-sm'
                      : !customizeInput.trim()
                        ? 'bg-zinc-200 dark:bg-blue-900/30 text-zinc-500 dark:text-zinc-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#e8c9a8] via-[#d59c77] to-[#c17f59] text-white hover:opacity-95 active:scale-[0.99] shadow-sm'
                    }`}
                >
                  {isCustomizing ? 'Customizing...' : 'Customize'}
                </button>
              </div>

              {/* Feedback and Back to original option */}
              <div className="mt-3 flex items-center justify-between text-xs">
                <div>
                  {hasCustomized && (
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                      ✓ 1 credit used, {credits} remaining
                    </span>
                  )}
                </div>

                {hasCustomized && (
                  <button
                    onClick={resetToOriginal}
                    className="text-[#c17f59] dark:text-[#e8c9a8] hover:underline font-semibold cursor-pointer"
                  >
                    Back to original prompt
                  </button>
                )}
              </div>

              {/* Error States with exact specified wording */}
              {errorState && ERROR_MESSAGES[errorState] && (
                <div className="mt-4 p-4 rounded-2xl border border-amber-300 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-950/20 text-amber-950 dark:text-amber-200">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-400">
                          {ERROR_MESSAGES[errorState].title}
                        </span>
                        {ERROR_MESSAGES[errorState].noCreditUsed && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white dark:bg-amber-900/40 text-zinc-700 dark:text-amber-100 border border-amber-200 dark:border-amber-700/50">
                            No credit was used
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {ERROR_MESSAGES[errorState].message}
                      </p>
                    </div>

                    <button
                      onClick={clearError}
                      className="text-xs text-zinc-600 dark:text-amber-200 hover:text-black dark:hover:text-white px-2 py-1 rounded bg-white dark:bg-amber-900/40 border border-amber-200 dark:border-amber-700/50 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Failure state demo triggers - gated by Dev toggle */}
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-blue-900/40 flex flex-col gap-2">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowDevPanel(!showDevPanel)}
                    className="text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Dev Tools</span>
                    <ChevronRight className={`w-3 h-3 transition-transform ${showDevPanel ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {showDevPanel && (
                  <div className="flex items-center gap-2 flex-wrap text-[11px] text-zinc-500 animate-in fade-in duration-200">
                    <span>Test Failure Fallbacks (§4):</span>
                    <button
                      onClick={() => triggerError('capacity_paused')}
                      className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-blue-900/30 hover:bg-zinc-200 dark:hover:bg-blue-900/50 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                    >
                      503 Paused
                    </button>
                    <button
                      onClick={() => triggerError('unusable_request')}
                      className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-blue-900/30 hover:bg-zinc-200 dark:hover:bg-blue-900/50 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                    >
                      422 Unusable
                    </button>
                    <button
                      onClick={() => triggerError('out_of_credits')}
                      className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-blue-900/30 hover:bg-zinc-200 dark:hover:bg-blue-900/50 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                    >
                      402 Out of credits
                    </button>
                    {errorState && (
                      <button
                        onClick={clearError}
                        className="px-2 py-0.5 rounded text-zinc-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                      >
                        Clear error
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STEP-BY-STEP VISUAL GUIDANCE SECTION (GATED TO SUBSCRIBERS)
          ═══════════════════════════════════════════ */}
      <section className="mb-20 pt-8 border-t border-zinc-200/80 dark:border-blue-900/40" id="step-by-step-guide">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3 ${isSubscribed
                ? 'bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400'
                : 'bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400'
              }`}>
              {isSubscribed ? (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Visual Tutorial</span>
                  <span className="text-blue-400/50">•</span>
                  <span>{template.mainCategory} Workflow</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Subscriber-Only Tutorial</span>
                  <span className="text-amber-500/50">•</span>
                  <span>{template.mainCategory} Workflow</span>
                </>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-['var(--font-heading)']">
              How to Create This
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
              {isSubscribed ? (
                <>Step-by-step visual guidance tailored specifically for <strong className="text-zinc-900 dark:text-zinc-200">{template.title}</strong> using <strong className="text-zinc-900 dark:text-zinc-200">{template.tools.map((t) => t.name).join(' and ')}</strong>.</>
              ) : (
                <>Complete step-by-step visual guidance tailored specifically for <strong className="text-zinc-900 dark:text-zinc-200">{template.title}</strong>. Subscribe to unlock the full interactive tutorial, camera optical parameters, and generation settings.</>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={toggleSubscribed}
              className={`inline-flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl border transition-all shadow-xs cursor-pointer ${isSubscribed
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25'
                }`}
              title="Toggle between Guest (Locked) and Subscribed (Unlocked) modes"
            >
              <span className={`w-2 h-2 rounded-full ${isSubscribed ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span>{isSubscribed ? 'Subscribed Mode (Click to Lock Steps)' : 'Guest Mode (Click to Unlock Steps)'}</span>
            </button>

            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-blue-950/40 border border-zinc-200/60 dark:border-blue-800/40 flex items-center gap-1.5">
              {!isSubscribed && (
                <Lock className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>{template.guidance.length} Visual Steps {isSubscribed ? '(Unlocked)' : '(Locked)'}</span>
            </span>
          </div>
        </div>

        {/* Gated Guidance Content: Single Card for Unsubscribed, Full Steps Sequence for Subscribed */}
        {!isSubscribed ? (
          /* Single Locked Guidance Card */
          <div className="rounded-3xl border border-zinc-200/80 dark:border-blue-900/50 bg-white/90 dark:bg-[#0c162e]/80 backdrop-blur-xl p-8 sm:p-12 shadow-sm text-center flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-blue-500/15 border border-amber-500/20 dark:border-blue-500/30 text-amber-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-2 font-['var(--font-heading)']">
              Step-by-step guidance is available for subscribers
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-6 max-w-md">
              Unlock the complete {template.guidance.length}-step guide with tool setups and visual workflow diagrams.
            </p>
            <button
              onClick={subscribe}
              className={`px-8 py-3 rounded-xl font-bold text-sm shadow-sm transition-all cursor-pointer ${NUDE_BTN_CLASSES}`}
            >
              Subscribe
            </button>
          </div>
        ) : (
          /* UNLOCKED STEPS LIST FOR SUBSCRIBED USERS */
          <div className="space-y-12 sm:space-y-16">
            {template.guidance.map((step, idx) => {
              const isEven = idx % 2 === 1; // Alternating layout
              const stepNumberFormatted = step.step < 10 ? `0${step.step}` : `${step.step}`;

              return (
                <div
                  key={step.step}
                  className={`flex flex-col ${isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'
                    } gap-8 lg:gap-12 items-center rounded-3xl p-6 sm:p-8 bg-zinc-50/60 dark:bg-[#0a1224]/80 border border-zinc-200/80 dark:border-blue-900/40 transition-all hover:border-blue-400/40 dark:hover:border-blue-700/60 shadow-xs`}
                >
                  {/* Text Content Column */}
                  <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-4">
                    {/* Step Number & Category Indicator */}
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-mono text-sm font-black shadow-md shadow-blue-500/20">
                        {stepNumberFormatted}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
                        Step {step.step} of {template.guidance.length}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight font-['var(--font-heading)'] leading-snug">
                      {step.title}
                    </h3>

                    {/* Step Detailed Explanation */}
                    <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                      {step.description}
                    </p>

                    {/* Pro Tip Callout Card */}
                    {step.tip && (
                      <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/40 flex items-start gap-3 mt-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-xs sm:text-sm text-blue-950 dark:text-blue-200 leading-relaxed">
                          <strong className="font-semibold block text-blue-900 dark:text-blue-300 mb-0.5">
                            Pro Tip
                          </strong>
                          {step.tip}
                        </div>
                      </div>
                    )}

                    {/* Action Link / Recommended Tool Button */}
                    {step.actionText && (
                      <div className="pt-2">
                        <a
                          href={step.actionUrl || primaryTool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-blue-900/40 hover:bg-zinc-100 dark:hover:bg-blue-800/60 text-zinc-900 dark:text-white border border-zinc-200 dark:border-blue-700/50 transition-all hover:scale-[1.02] shadow-2xs group"
                        >
                          <span>{step.actionText}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Visual Graphic Column */}
                  <div className="w-full lg:w-1/2">
                    <div
                      onClick={() => setSelectedGuidanceModalImage(step.image)}
                      className="cursor-pointer group relative rounded-2xl sm:rounded-3xl border border-zinc-200/80 dark:border-blue-700/40 bg-white dark:bg-gradient-to-b dark:from-[#0d1c3a] dark:via-[#0a1429] dark:to-[#070e1e] backdrop-blur-xl p-2.5 sm:p-3.5 shadow-md dark:shadow-[0_12px_40px_rgba(10,25,65,0.45)] overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-500/60"
                      title="Click to view high-resolution visual guide"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={step.image}
                        alt={`${step.title} visual illustration`}
                        className="w-full h-auto rounded-xl sm:rounded-2xl transition-transform duration-300 group-hover:scale-[1.01]"
                        loading="lazy"
                      />

                      {/* Hover Zoom Overlay Badge */}
                      <div className="absolute bottom-5 right-5 z-10 px-2.5 py-1.5 rounded-lg bg-zinc-900/85 text-white text-[11px] font-medium backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-md">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Click to enlarge</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Lightbox for Guidance Images using Shadcn Dialog */}
        <Dialog
          open={Boolean(selectedGuidanceModalImage)}
          onOpenChange={(open) => !open && setSelectedGuidanceModalImage(null)}
        >
          <DialogContent className="max-w-5xl p-2 sm:p-4 bg-zinc-900 dark:bg-zinc-900 border-zinc-800">
            {selectedGuidanceModalImage && (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedGuidanceModalImage}
                  alt="Enlarged guidance diagram"
                  className="w-full h-auto max-h-[82vh] object-contain rounded-2xl mx-auto"
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </section>

      {/* ═══════════════════════════════════════════
          BOTTOM SECTION — RATINGS & REVIEWS & SIMILAR
          ═══════════════════════════════════════════ */}

      {/* REVIEWS SECTION */}
      <section className="mb-16">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-['var(--font-heading)'] mb-1">
            Ratings & Reviews
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">4.9</span>
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
              based on 182 verified ratings
            </span>
          </div>
        </div>

        {/* Reviews Cards List */}
        <div className="space-y-3">
          {REVIEWS_LIST.map((review) => (
            <div
              key={review.id}
              className="p-5 rounded-2xl bg-white dark:bg-blue-950/30 border border-zinc-200 dark:border-blue-900/40 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              <div className="sm:text-right shrink-0">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{review.handle}</p>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{review.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SIMILAR TEMPLATES SECTION */}
      <section className="pt-8 border-t border-zinc-200 dark:border-blue-900/40">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-['var(--font-heading)']">
              Similar Templates
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              More production-tested prompts in {categoryName}
            </p>
          </div>

          <Link
            href="/templates"
            className="text-xs font-semibold text-zinc-800 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:underline flex items-center gap-1"
          >
            <span>View all in gallery</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {similarTemplates.map((sim) => (
            <TemplateCard key={sim.id} template={sim} />
          ))}
        </div>
      </section>

      {/* Plans Modal using Shadcn Dialog */}
      <Dialog open={showPlansModal} onOpenChange={setShowPlansModal}>
        <DialogContent className="max-w-md p-6 sm:p-8">
          <DialogHeader className="mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">P4 · Plans</span>
            <DialogTitle className="text-xl font-bold font-['var(--font-heading)'] mt-1">
              AWA Creator Subscription
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              A subscription lets you see and copy every prompt. Credits let you adapt them.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-blue-950/40 border border-zinc-200 dark:border-blue-900/40 my-3 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">Monthly Pass</span>
              <span className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                $19<span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">/mo</span>
              </span>
            </div>
            <ul className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1.5">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Full access to see and copy all catalog prompt templates</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>8 AI customization credits included</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Continuous model updates &amp; maintenance</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={handleSubscribeInstant}
            className={`w-full py-3.5 rounded-full ${NUDE_BTN_CLASSES} text-sm`}
          >
            Start Subscription (Instant Unlock)
          </Button>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 text-center mt-2">
            Pitch Demo Mode: Instant unlock
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
