'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Template, Category, Subcategory, GuidanceStep } from '@/lib/mockData';
import { useAppContext } from '@/lib/AppContext';
import { TemplateImage } from '@/components/TemplateImage';
import { TemplateCard } from '@/components/TemplateCard';
import { TemplateGuidanceFlow } from '@/components/TemplateGuidanceFlow';
import { SaveToCollectionPopover } from '@/components/SaveToCollectionPopover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Check,
  Copy,
  Heart,
  Lock,
  Star,
  ExternalLink,
  ChevronRight,
  Monitor,
  Smartphone,
  Box,
  Code2,
  Sparkles,
  Edit3,
  RotateCcw,
} from 'lucide-react';

interface TemplateStats {
  rating: string;
  copies: string;
  likes: number;
  views: string;
}

const TEMPLATE_STATS: Record<string, TemplateStats> = {
  tpl_1: { rating: '4.9', copies: '4.8k', likes: 342, views: '64.1k' },
  'plain-product-on-white': { rating: '4.9', copies: '4.8k', likes: 342, views: '64.1k' },
  tpl_2: { rating: '4.8', copies: '3.2k', likes: 289, views: '41.8k' },
  tpl_3: { rating: '4.9', copies: '5.6k', likes: 415, views: '72.4k' },
  tpl_4: { rating: '4.7', copies: '2.3k', likes: 194, views: '31.9k' },
  tpl_video_1: { rating: '4.9', copies: '3.9k', likes: 378, views: '58.4k' },
  tpl_slide_1: { rating: '4.9', copies: '5.1k', likes: 420, views: '69.0k' },
  tpl_web_1: { rating: '4.9', copies: '6.2k', likes: 512, views: '84.3k' },
  tpl_3d_robotics: { rating: '5.0', copies: '4.4k', likes: 490, views: '76.8k' },
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
    text: 'Lighting architecture notes saved me two hours of trial and error in Midjourney v6.',
    handle: '@marcus_creative',
    date: '2 days ago',
  },
  {
    id: 'rev_2',
    rating: 5,
    text: 'The contact shadow instructions and macro optics produced a commercial-ready asset on the first run.',
    handle: '@ecom_alex',
    date: '5 days ago',
  },
  {
    id: 'rev_3',
    rating: 5,
    text: "AWA's dual prompts for websites are fantastic: UI prompt in v0 and context prompt in Claude yielded a complete product page.",
    handle: '@nordic_agency',
    date: '1 week ago',
  },
  {
    id: 'rev_4',
    rating: 5,
    text: 'Spot-on parameters. Tweaked the lens focal length slightly for a wider shot, but the base structure is unmatched.',
    handle: '@studio_kai',
    date: '1 week ago',
  },
  {
    id: 'rev_5',
    rating: 5,
    text: 'Tack-sharp micro-textures and pristine WebGL guidance. Never going back to naive prompting.',
    handle: '@elena_design',
    date: '2 weeks ago',
  },
];

interface TemplateDetailClientProps {
  template: Template;
  category: Category;
  subcategory: Subcategory;
  similarTemplates: Template[];
  isServerSubscribed: boolean;
}

export function TemplateDetailClient({
  template,
  category,
  subcategory,
  similarTemplates,
  isServerSubscribed: _isServerSubscribed,
}: TemplateDetailClientProps) {
  const router = useRouter();

  const { isSubscribed, subscribe, toggleSubscribed, credits } = useAppContext();

  const isWebsite = template.mainCategory === 'Websites';
  const categoryName = category.name;
  const subName = subcategory.name;
  const catId = category.id;
  const subId = subcategory.id;

  // Prompts and guidance state (guaranteed empty when unsubscribed)
  const [currentPrompt, setCurrentPrompt] = useState<string>(isSubscribed ? template.basePrompt : '');
  const [currentUiPrompt, setCurrentUiPrompt] = useState<string>(isSubscribed ? template.uiPrompt || '' : '');
  const [currentContextPrompt, setCurrentContextPrompt] = useState<string>(
    isSubscribed ? template.contextPrompt || '' : ''
  );
  const [guidanceList, setGuidanceList] = useState<GuidanceStep[]>(
    template.guidance || []
  );

  // Synchronize state immediately when template changes
  React.useEffect(() => {
    setGuidanceList(template.guidance || []);
    if (isSubscribed) {
      setCurrentPrompt(template.basePrompt || '');
      setCurrentUiPrompt(template.uiPrompt || '');
      setCurrentContextPrompt(template.contextPrompt || '');
    }
  }, [template.id, template.guidance, template.basePrompt, template.uiPrompt, template.contextPrompt, isSubscribed]);

  // Tab and Customization state
  const [activePromptTab, setActivePromptTab] = useState<'ui' | 'context'>('ui');
  const [isCustomizingContext, setIsCustomizingContext] = useState(false);
  const [userThoughts, setUserThoughts] = useState('');
  const [customizedContextPrompt, setCustomizedContextPrompt] = useState<string | null>(null);

  // Copy feedback states
  const [isUiCopied, setIsUiCopied] = useState(false);
  const [isContextCopied, setIsContextCopied] = useState(false);
  const [isCustomizedCopied, setIsCustomizedCopied] = useState(false);
  const [isDualCopied, setIsDualCopied] = useState(false);

  // Modals & UI controls
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [activeDetailImageIndex, setActiveDetailImageIndex] = useState(0);

  // Synchronize protected prompts and guidance with subscription entitlement
  // When unsubscribed: wipe prompts and lock guidance step 3+
  // When subscribed: fetch protected payload from secure server API endpoint if not already loaded
  React.useEffect(() => {
    if (isSubscribed) {
      fetch(`/api/v1/templates/${template.id}/prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-awa-subscribed': 'true',
        },
        body: JSON.stringify({}),
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Subscription required');
        })
        .then((data) => {
          if (data.uiPrompt) setCurrentUiPrompt(data.uiPrompt);
          if (data.contextPrompt) setCurrentContextPrompt(data.contextPrompt);
          if (data.promptText) setCurrentPrompt(data.promptText);
          if (data.guidance && Array.isArray(data.guidance) && data.guidance.length > 0) {
            setGuidanceList(data.guidance);
          }
        })
        .catch(() => {
          if (template.uiPrompt) setCurrentUiPrompt(template.uiPrompt);
          if (template.contextPrompt) setCurrentContextPrompt(template.contextPrompt);
          if (template.basePrompt) setCurrentPrompt(template.basePrompt);
          if (template.guidance && template.guidance.length > 0) {
            setGuidanceList(template.guidance);
          }
        });
    } else {
      setCurrentPrompt('');
      setCurrentUiPrompt('');
      setCurrentContextPrompt('');
      if (template.guidance && template.guidance.length > 0) {
        setGuidanceList(template.guidance);
      }
      setCustomizedContextPrompt(null);
      setIsCustomizingContext(false);
    }
  }, [isSubscribed, template.id, template.uiPrompt, template.contextPrompt, template.basePrompt, template.guidance]);

  const hasMotionPreview = Boolean(template.media.motionPreviewUrl || template.media.videoUrl);
  const [webDeviceView, setWebDeviceView] = useState<'motion' | 'desktop' | 'mobile'>(
    hasMotionPreview ? 'motion' : 'desktop'
  );

  // Local Like button toggle state
  const [isLiked, setIsLiked] = useState(false);
  const [likeDelta, setLikeDelta] = useState(0);

  const rawStats = TEMPLATE_STATS[template.id] || {
    rating: '4.9',
    copies: '3.8k',
    likes: 310,
    views: '52.4k',
  };
  const displayedLikes = rawStats.likes + likeDelta;

  // Preset thought suggestion for the compact input box
  const thoughtPreset = useMemo(() => {
    switch (template.id) {
      case 'tpl_1':
      case 'plain-product-on-white':
        return 'Targeting minimalist Scandinavian cafes: artisan matte-glazed ceramic tumbler with warm earth-tone speckled finish.';
      case 'tpl_web_1':
        return 'Targeting iOS engineers: add an interactive Swift concurrency playground and live sandbox widget.';
      case 'tpl_video_1':
        return 'For an organic skincare line: frosted glass dropper bottle on raw cut travertine stone.';
      case 'tpl_slide_1':
        return 'For a Seed-stage developer tools startup: emphasizing telemetry pipelines and 99.99% reliability.';
      default:
        return 'Targeting eco-conscious boutique buyers: focus on handcrafted sustainable materials and premium organic textures.';
    }
  }, [template.id]);

  // Copy Handlers
  const handleCopyUiPrompt = () => {
    if (isSubscribed) {
      navigator.clipboard.writeText(currentUiPrompt || currentPrompt);
      setIsUiCopied(true);
      setTimeout(() => setIsUiCopied(false), 2500);
    } else {
      setShowPlansModal(true);
    }
  };

  const handleCopyContextPrompt = () => {
    if (isSubscribed) {
      navigator.clipboard.writeText(currentContextPrompt);
      setIsContextCopied(true);
      setTimeout(() => setIsContextCopied(false), 2500);
    } else {
      setShowPlansModal(true);
    }
  };

  const handleCopyCustomizedPrompt = () => {
    if (isSubscribed && customizedContextPrompt) {
      navigator.clipboard.writeText(customizedContextPrompt);
      setIsCustomizedCopied(true);
      setTimeout(() => setIsCustomizedCopied(false), 2500);
    }
  };

  const handleCopyBothPrompts = () => {
    if (isSubscribed) {
      const activeContext = customizedContextPrompt || currentContextPrompt;
      const combined = [
        currentUiPrompt ? `[UI & IMPLEMENTATION PROMPT]\n${currentUiPrompt}` : '',
        activeContext ? `[BUSINESS CONTEXT PROMPT]\n${activeContext}` : '',
      ]
        .filter(Boolean)
        .join('\n\n') || currentPrompt;
      navigator.clipboard.writeText(combined);
      setIsDualCopied(true);
      setTimeout(() => setIsDualCopied(false), 2500);
    } else {
      setShowPlansModal(true);
    }
  };

  // Context Customization Handlers (No AI call, No credit deduction)
  const handleApplyCustomization = () => {
    const thoughts = userThoughts.trim();
    if (!thoughts) return;

    const baseContext = currentContextPrompt || template.contextPrompt || '';
    const combined = `${baseContext.trim()}\n\n### Custom Context & User Requirements:\n${thoughts}`;
    setCustomizedContextPrompt(combined);
    setIsCustomizingContext(false);
  };

  const handleResetCustomization = () => {
    setCustomizedContextPrompt(null);
    setUserThoughts('');
    setIsCustomizingContext(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-32">
      {/* ═══════════════════════════════════════════════════════════════
          1. TOP SECTION: BREADCRUMBS, TITLE, DESCRIPTION, CATEGORY, TOOLS
          ═══════════════════════════════════════════════════════════════ */}
      <header className="mb-8">
        {/* Navigation & Breadcrumbs Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
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
              className="rounded-full text-xs font-semibold px-3 h-8 gap-1.5 bg-white dark:bg-[#0d1c3a]/60 border-zinc-200 dark:border-blue-800/40 text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white"
              title="Return to gallery"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to gallery</span>
            </Button>

            {/* Quick Demo Mode Switcher (Subscribed vs Guest) */}
            <button
              type="button"
              onClick={toggleSubscribed}
              className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                isSubscribed
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25'
                  : 'bg-amber-500/15 border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25'
              }`}
              title="Click to toggle between Subscribed and Guest mode"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isSubscribed ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>{isSubscribed ? 'Subscribed Mode (Unlocked)' : 'Guest Mode (Locked)'}</span>
              <span className="text-[10px] opacity-60 underline ml-0.5">Switch</span>
            </button>
          </div>

          {/* Breadcrumb Links */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center text-xs text-zinc-500 dark:text-zinc-400 gap-1.5"
          >
            <Link
              href="/templates"
              className="hover:text-zinc-900 dark:hover:text-white transition-colors font-medium"
            >
              Templates
            </Link>
            <ChevronRight className="w-3 h-3 text-zinc-400" />
            <Link
              href={`/category/${catId}`}
              className="hover:text-zinc-900 dark:hover:text-white transition-colors font-medium"
            >
              {categoryName}
            </Link>
            <ChevronRight className="w-3 h-3 text-zinc-400" />
            <Link
              href={`/category/${catId}/${subId}`}
              className="font-semibold text-zinc-900 dark:text-zinc-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {subName}
            </Link>
          </nav>
        </div>

        {/* Category & Attributes Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <Badge
            variant="outline"
            className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300"
          >
            {template.mainCategory} • {template.category}
          </Badge>

          <Badge
            variant="outline"
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-[#0c162e] border-zinc-200 dark:border-blue-900/50 text-zinc-600 dark:text-zinc-300"
          >
            {template.difficulty}
          </Badge>

          {isWebsite && (
            <Badge
              variant="outline"
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300"
            >
              Dual Prompt (UI & Context)
            </Badge>
          )}

          {template.category === '3D Websites' && (
            <Badge
              variant="outline"
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/50 text-amber-700 dark:text-amber-300"
            >
              3D WebGL Motion
            </Badge>
          )}
        </div>

        {/* Template Title (H1) */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white font-['var(--font-heading)'] leading-tight mb-2">
          {template.title}
        </h1>

        {/* Short Description */}
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-4xl leading-relaxed mb-4">
          {template.description}
        </p>

        {/* Supported AI Tools Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-zinc-200/80 dark:border-blue-900/40">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Supported AI Tools:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {template.tools.map((tool) => (
              <a
                key={tool.id}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`${tool.name}: ${tool.reason}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#0c162e] border border-zinc-200 dark:border-blue-800/50 text-zinc-800 dark:text-zinc-200 hover:border-blue-400 dark:hover:border-blue-600 transition-all shadow-2xs group"
              >
                {tool.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tool.logo}
                    alt={tool.name}
                    className="w-3.5 h-3.5 rounded object-contain shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white text-[9px] flex items-center justify-center font-bold">
                    {tool.name.charAt(0)}
                  </span>
                )}
                <span>{tool.name}</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">
                  ({tool.qualityLabel})
                </span>
                <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-blue-500 ml-0.5 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          2. LARGE RELEVANT PREVIEW & COMPACT DESKTOP ACTION PANEL
          (Public template preview remains fully visible)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-12">
        {/* LEFT COLUMN: Large Visual Focus Preview */}
        <div className="lg:col-span-8 w-full">
          {/* IMAGE CATEGORY PREVIEW */}
          {template.mainCategory === 'Image' && (
            <div className="space-y-3">
              <div className="rounded-3xl border border-zinc-200/80 dark:border-blue-700/40 bg-white dark:bg-gradient-to-b dark:from-[#0d1c3a] dark:via-[#0a1429] dark:to-[#070e1e] backdrop-blur-xl p-3 shadow-md dark:shadow-[0_12px_40px_rgba(10,25,65,0.45)] overflow-hidden transition-all">
                <TemplateImage
                  images={[
                    (template.media.gallery || [])[activeDetailImageIndex] ||
                      template.media.primaryImage ||
                      template.media.thumbnail,
                  ]}
                  alt={template.name}
                  aspectRatio="1:1"
                  previewAccent={template.previewAccent}
                  subtitle={template.subtitle}
                  charCount={template.charCount}
                  className="rounded-2xl"
                />
              </div>

              {/* Gallery Thumbnails */}
              {template.media.gallery && template.media.gallery.length > 1 && (
                <div className="p-2 rounded-2xl bg-white/80 dark:bg-[#0c162e]/90 backdrop-blur-md border border-zinc-200/80 dark:border-blue-900/50 shadow-xs flex gap-2.5 overflow-x-auto no-scrollbar">
                  {template.media.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveDetailImageIndex(idx)}
                      className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        idx === activeDetailImageIndex
                          ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-sm opacity-100 scale-102'
                          : 'border-zinc-200 dark:border-blue-950 opacity-60 hover:opacity-100'
                      }`}
                      title={`View image variation ${idx + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${template.name} preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIDEO CATEGORY PREVIEW */}
          {template.mainCategory === 'Video' && (
            <div className="rounded-3xl border border-zinc-200/80 dark:border-blue-700/40 bg-zinc-950 p-2 shadow-md dark:shadow-[0_12px_40px_rgba(10,25,65,0.45)] overflow-hidden">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                {template.media.videoUrl ? (
                  <video
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={template.media.poster || template.media.thumbnail}
                    src={template.media.videoUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 text-zinc-400">
                    <p className="text-sm">Video preview unavailable</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SLIDES CATEGORY PREVIEW */}
          {template.mainCategory === 'Slides' && (
            <div className="space-y-3">
              <div className="rounded-3xl border border-zinc-200/80 dark:border-blue-700/40 bg-white dark:bg-[#0c162e] p-3 shadow-md dark:shadow-[0_12px_40px_rgba(10,25,65,0.45)] overflow-hidden">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      (template.media.slides || [])[activeDetailImageIndex] ||
                      template.media.primaryImage ||
                      template.media.thumbnail
                    }
                    alt={`${template.name} slide ${activeDetailImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Slide Navigation Thumbnails */}
              {template.media.slides && template.media.slides.length > 1 && (
                <div className="p-2 rounded-2xl bg-white/80 dark:bg-[#0c162e]/90 backdrop-blur-md border border-zinc-200/80 dark:border-blue-900/50 shadow-xs flex gap-2.5 overflow-x-auto no-scrollbar">
                  {template.media.slides.map((slide, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveDetailImageIndex(idx)}
                      className={`relative w-28 aspect-[16/9] shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        idx === activeDetailImageIndex
                          ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-sm opacity-100 scale-102'
                          : 'border-zinc-200 dark:border-blue-950 opacity-60 hover:opacity-100'
                      }`}
                      title={`View slide ${idx + 1}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide}
                        alt={`Slide thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WEBSITES CATEGORY PREVIEW */}
          {isWebsite && (
            <div className="space-y-4">
              {/* Responsive Device Switcher Tabs */}
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Interactive View:
                </span>
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-[#0a1224] border border-zinc-200 dark:border-blue-900/50">
                  {hasMotionPreview && (
                    <button
                      type="button"
                      onClick={() => setWebDeviceView('motion')}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        webDeviceView === 'motion'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                      }`}
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>3D Motion</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setWebDeviceView('desktop')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      webDeviceView === 'desktop'
                        ? 'bg-white dark:bg-blue-600 text-zinc-900 dark:text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setWebDeviceView('mobile')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      webDeviceView === 'mobile'
                        ? 'bg-white dark:bg-blue-600 text-zinc-900 dark:text-white shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

              {/* 3D Motion View */}
              {webDeviceView === 'motion' && hasMotionPreview ? (
                <div className="rounded-2xl border border-zinc-200 dark:border-blue-800/40 overflow-hidden bg-black flex flex-col shadow-sm">
                  <div className="h-8 bg-zinc-900 flex items-center px-4 justify-between border-b border-zinc-800 shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className="bg-black/60 text-[10px] font-mono px-3 py-0.5 rounded text-zinc-400">
                      WebGL 3D Interaction Preview
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">
                      Live Motion
                    </span>
                  </div>
                  <div className="relative aspect-[16/10] bg-black">
                    <video
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={template.media.poster || template.media.desktopPreview}
                      src={template.media.motionPreviewUrl || template.media.videoUrl}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : webDeviceView === 'desktop' ? (
                /* Desktop Browser Mockup View */
                <div className="rounded-2xl border border-zinc-200 dark:border-blue-800/40 overflow-hidden bg-white dark:bg-[#080d19] flex flex-col shadow-sm">
                  <div className="h-8 bg-zinc-200 dark:bg-[#080d19] flex items-center px-4 gap-2 border-b border-zinc-300 dark:border-blue-800/40 shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <div className="mx-auto bg-white/60 dark:bg-black/40 text-[10px] font-mono px-4 py-0.5 rounded text-zinc-600 dark:text-zinc-400 truncate max-w-[220px]">
                      aura://preview/{template.id}
                    </div>
                  </div>
                  <div className="p-0 bg-white dark:bg-[#080d19] relative aspect-[16/10] overflow-y-auto no-scrollbar">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={template.media.desktopPreview || template.media.thumbnail}
                      alt={template.name}
                      className="w-full object-cover object-top"
                    />
                  </div>
                </div>
              ) : (
                /* Mobile Phone Frame Mockup View */
                <div className="py-4 flex justify-center bg-zinc-50 dark:bg-[#080d19]/60 rounded-2xl border border-zinc-200 dark:border-blue-900/40">
                  <div className="relative w-[280px] aspect-[9/18] rounded-3xl overflow-hidden shadow-2xl border-4 border-zinc-800 dark:border-zinc-700 bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        template.media.mobilePreview ||
                        template.media.desktopPreview ||
                        template.media.thumbnail
                      }
                      alt={`${template.name} mobile view`}
                      className="w-full h-full object-contain bg-black"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Compact Action Panel beside Preview on Desktop */}
        <div className="lg:col-span-4 w-full lg:sticky lg:top-20 space-y-4">
          <div className="rounded-3xl border border-zinc-200/80 dark:border-blue-700/40 bg-white dark:bg-[#0c162e]/90 backdrop-blur-xl p-5 sm:p-6 shadow-md dark:shadow-[0_12px_40px_rgba(10,25,65,0.45)]">
            {/* Header: Access Status & Save/Like */}
            <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-zinc-100 dark:border-blue-900/40">
              <button
                type="button"
                onClick={toggleSubscribed}
                className="flex items-center gap-2 text-left cursor-pointer group hover:opacity-85 transition-opacity"
                title="Click to toggle member / visitor mode"
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isSubscribed ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <div>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                    {isSubscribed ? 'Active Creator Pass' : 'Guest Access (Locked)'}
                  </span>
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 underline decoration-dotted">
                    {isSubscribed ? 'Click to preview locked' : 'Click to unlock pass'}
                  </span>
                </div>
              </button>

              {/* Like toggle & Save to Collection */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsLiked(!isLiked);
                    setLikeDelta((prev) => (isLiked ? prev - 1 : prev + 1));
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                    isLiked
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-500 shadow-2xs'
                      : 'bg-zinc-50 dark:bg-blue-950/40 border-zinc-200 dark:border-blue-800/40 text-zinc-500 dark:text-zinc-400 hover:text-rose-500'
                  }`}
                  title={isLiked ? 'Unlike' : 'Like'}
                  aria-label={isLiked ? 'Unlike template' : 'Like template'}
                >
                  <Heart
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isLiked ? 'scale-110 fill-rose-500 text-rose-500' : ''
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

            {/* Primary Action Button in Right Column */}
            <div className="mb-4">
              {!isSubscribed ? (
                <Button
                  asChild
                  className="w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  <Link href="/pricing">
                    <Lock className="w-4 h-4" />
                    <span>View Plans</span>
                  </Link>
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={handleCopyUiPrompt}
                    className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                  >
                    {isUiCopied ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Copied UI Prompt!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy UI Prompt</span>
                      </>
                    )}
                  </Button>

                  {customizedContextPrompt ? (
                    <Button
                      onClick={handleCopyCustomizedPrompt}
                      className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    >
                      {isCustomizedCopied ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Copied Customized Prompt!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Customized Prompt</span>
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCopyContextPrompt}
                      className="w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    >
                      {isContextCopied ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Copied Context Prompt!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Context Prompt</span>
                        </>
                      )}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={handleCopyBothPrompts}
                    className="w-full py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-xs border-zinc-200 dark:border-blue-800/40 text-zinc-700 dark:text-zinc-200"
                  >
                    {isDualCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3] text-blue-600" />
                        <span>Copied Both Prompts!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Both Prompts (Combined)</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Transparent Customization & Allowance Info */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#070b16] border border-zinc-200/80 dark:border-blue-900/40 text-xs space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Context Customization:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Unlimited (0 credits)
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-zinc-200/60 dark:border-blue-900/30">
                <span className="text-zinc-500 dark:text-zinc-400">AI Rewrite Balance:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {credits} credits
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                Your pass allows instant, client-side Context Customization with zero credit deductions.
              </p>
            </div>

            {/* Boundary Line Statement */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/40 text-xs text-blue-900 dark:text-blue-200 leading-relaxed mb-4">
              <span className="font-semibold block mb-0.5 text-blue-950 dark:text-blue-100">
                Where to run this:
              </span>
              Take this prompt to your chosen AI tool ({template.tools.map((t) => t.name).join(', ')}). AWA provides the engineered parameters and structure; the external tool generates your final asset.
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-blue-900/30 text-center">
              <div className="p-2 rounded-xl bg-zinc-50 dark:bg-blue-950/20">
                <div className="flex items-center justify-center gap-1 font-bold text-xs text-zinc-900 dark:text-zinc-100">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{rawStats.rating}</span>
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Rating</div>
              </div>

              <div className="p-2 rounded-xl bg-zinc-50 dark:bg-blue-950/20">
                <div className="flex items-center justify-center gap-1 font-bold text-xs text-zinc-900 dark:text-zinc-100">
                  <Copy className="w-3 h-3 text-zinc-400" />
                  <span>{rawStats.copies}</span>
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Copied</div>
              </div>

              <div className="p-2 rounded-xl bg-zinc-50 dark:bg-blue-950/20">
                <div className="flex items-center justify-center gap-1 font-bold text-xs text-zinc-900 dark:text-zinc-100">
                  <Heart className="w-3 h-3 text-rose-500" />
                  <span>{displayedLikes}</span>
                </div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Likes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. CONTENT SECTIONS: PROMPT & STEP-BY-STEP GUIDANCE FLOW
          (Protected prompt and guidance content never exposed when unsubscribed)
          ═══════════════════════════════════════════════════════════════ */}

      {!isSubscribed ? (
        /* ───────────────────────────────────────────────────────────
            SECTION 3: LOCKED CARD (UNSUBSCRIBED / GUEST)
            One compact, polished locked card with short explanation & View Plans.
            Prompts, customization controls, and How to Run guidance are hidden.
            Protected prompt and guidance content is not sent to the browser.
            ─────────────────────────────────────────────────────────── */
        <section className="mb-14 scroll-mt-24" id="section-prompt-locked">
          <Card className="rounded-3xl border border-zinc-200/90 dark:border-blue-900/50 bg-white dark:bg-[#0c162e] p-8 sm:p-12 shadow-sm text-center flex flex-col items-center justify-center max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-2xs">
              <Lock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight font-['var(--font-heading)'] mb-2.5">
              Subscribe to access this template’s prompts and How to Run guidance
            </CardTitle>
            <CardDescription className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 max-w-lg">
              Unlock the complete production UI Prompt and Context Prompt, engineered camera and lighting settings, and step-by-step guidance.
            </CardDescription>
            <Button
              asChild
              className="px-7 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-all shadow-xs gap-2"
            >
              <Link href="/pricing">
                <span>View Plans</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          </Card>
        </section>
      ) : (
        /* ───────────────────────────────────────────────────────────
            SECTION 3: UNLOCKED PROMPTS & STEP-BY-STEP GUIDANCE
            Two clear tabs: UI Prompt and Context Prompt (with dedicated Copy buttons).
            Separate Customize card removed. Only Context Prompt can be customized.
            Guidance flow visible for subscribed users.
            ─────────────────────────────────────────────────────────── */
        <div className="space-y-12">
          <section className="scroll-mt-24" id="section-prompt">
            <Tabs
              value={activePromptTab}
              onValueChange={(v) => setActivePromptTab(v as 'ui' | 'context')}
              className="w-full"
            >
              {/* Header & Tabs Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-200/80 dark:border-blue-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-['var(--font-heading)']">
                      Template Prompts
                    </h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Two specialized blueprints engineered for visual generation and domain context.
                    </p>
                  </div>
                </div>

                {/* Shadcn TabsList with UI Prompt & Context Prompt */}
                <TabsList className="bg-zinc-100 dark:bg-[#070b16] border border-zinc-200/80 dark:border-blue-900/50 p-1 rounded-2xl h-auto">
                  <TabsTrigger
                    value="ui"
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>UI Prompt</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="context"
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Context Prompt</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* ───────────────────────────────────────────────────
                  TAB 1: UI PROMPT (Fixed & Unchanged)
                  ─────────────────────────────────────────────────── */}
              <TabsContent value="ui" className="m-0">
                <Card className="rounded-3xl border border-blue-200/80 dark:border-blue-900/60 bg-white dark:bg-[#0a0e1a] p-6 sm:p-8 shadow-xs relative">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-zinc-100 dark:border-blue-950">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                          UI &amp; Visual Design Prompt
                        </h3>
                        <Badge
                          variant="outline"
                          className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/40"
                        >
                          {template.tools.map((t) => t.name).join(' • ') || 'Visual AI Engine'}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                        Defines visual design, camera optics, lighting architecture, composition, color palette, and generation parameters.
                      </p>
                    </div>

                    {/* DEDICATED COPY BUTTON FOR UI PROMPT */}
                    <Button
                      onClick={handleCopyUiPrompt}
                      className="py-2.5 px-5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shrink-0 bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                    >
                      {isUiCopied ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Copied UI Prompt!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy UI Prompt</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {/* UI Prompt Text Box */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-zinc-50 dark:bg-[#070b14] border border-zinc-200/80 dark:border-slate-800/80 font-mono text-xs sm:text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap select-text">
                    {currentUiPrompt || template.uiPrompt || currentPrompt || template.basePrompt}
                  </div>

                  {/* Footer helper */}
                  <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-blue-950 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400 font-mono">
                      {(currentUiPrompt || template.uiPrompt || currentPrompt || template.basePrompt).length} characters • UI Prompt is preserved unchanged
                    </span>
                    <button
                      type="button"
                      onClick={() => setActivePromptTab('context')}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Customize Context Prompt</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Card>
              </TabsContent>

              {/* ───────────────────────────────────────────────────
                  TAB 2: CONTEXT PROMPT (Customizable with User Thoughts)
                  ─────────────────────────────────────────────────── */}
              <TabsContent value="context" className="m-0 space-y-6">
                {/* Context Customization Input Panel (Revealed when Customize Context is clicked) */}
                {isCustomizingContext && (
                  <Card className="rounded-3xl border border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-5 sm:p-6 shadow-sm">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Edit3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            Customize Context with Your Thoughts
                          </h4>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-white dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 text-[10px] font-bold"
                        >
                          0 Credits Required
                        </Badge>
                      </div>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        Add your specific thoughts, audience, campaign tone, or product requirements. Clicking Apply Customization creates a copyable prompt combining this blueprint with your thoughts without AI calls or credit costs.
                      </p>

                      {/* Compact Thought Preset Chip */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                          Quick Idea:
                        </span>
                        <button
                          type="button"
                          onClick={() => setUserThoughts(thoughtPreset)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-white dark:bg-emerald-900/40 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 font-mono transition-all text-left truncate max-w-full cursor-pointer"
                          title="Click to fill thought example"
                        >
                          &ldquo;{thoughtPreset}&rdquo;
                        </button>
                      </div>

                      {/* Compact Input Box */}
                      <Textarea
                        value={userThoughts}
                        onChange={(e) => setUserThoughts(e.target.value)}
                        placeholder="Enter your thoughts (e.g., target audience demographics, specific brand aesthetic, key product selling points, or scenario context)..."
                        className="w-full min-h-[88px] text-xs sm:text-sm bg-white dark:bg-[#070b16] border-emerald-200 dark:border-emerald-900/60 focus-visible:ring-emerald-500"
                        rows={3}
                      />

                      {/* Action buttons */}
                      <div className="flex items-center justify-end gap-2.5 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsCustomizingContext(false)}
                          className="text-xs font-semibold"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleApplyCustomization}
                          disabled={!userThoughts.trim()}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                        >
                          Apply Customization
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* DUAL DISPLAY WHEN CUSTOMIZED: Show both Customized and Original versions */}
                {customizedContextPrompt ? (
                  <div className="space-y-6">
                    {/* 1. CUSTOMIZED CONTEXT PROMPT CARD */}
                    <Card className="rounded-3xl border border-emerald-300/90 dark:border-emerald-700/60 bg-emerald-50/20 dark:bg-emerald-950/20 p-6 sm:p-8 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-emerald-200/60 dark:border-emerald-900/40">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold text-xs px-2.5 py-0.5">
                              Customized Version
                            </Badge>
                            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                              Combined with user thoughts • 0 credits deducted
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                            Customized Context Prompt
                          </h3>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                            Ready to copy and paste into Claude, ChatGPT, or your production prompting workflow.
                          </p>
                        </div>

                        {/* Action Buttons for Customized Version */}
                        <div className="flex items-center gap-2 flex-wrap shrink-0">
                          <Button
                            onClick={handleCopyCustomizedPrompt}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm gap-2 shadow-xs"
                          >
                            {isCustomizedCopied ? (
                              <>
                                <Check className="w-4 h-4 stroke-[3]" />
                                <span>Copied Customized Prompt!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                <span>Copy Customized Prompt</span>
                              </>
                            )}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsCustomizingContext(true)}
                            className="text-xs font-semibold gap-1.5 border-zinc-300 dark:border-blue-900"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Thoughts</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetCustomization}
                            className="text-xs font-semibold text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Reset</span>
                          </Button>
                        </div>
                      </div>

                      {/* Customized Prompt Text */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#070b14] border border-emerald-200/80 dark:border-emerald-900/40 font-mono text-xs sm:text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap select-text">
                        {customizedContextPrompt}
                      </div>

                      <div className="mt-4 pt-3 border-t border-emerald-100 dark:border-emerald-950/60 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                        <span>{customizedContextPrompt.length} characters</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                          Customized prompt ready
                        </span>
                      </div>
                    </Card>

                    {/* 2. ORIGINAL CONTEXT BLUEPRINT CARD */}
                    <Card className="rounded-3xl border border-zinc-200/80 dark:border-blue-900/60 bg-white dark:bg-[#0a0e1a] p-6 sm:p-8 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-zinc-100 dark:border-blue-950">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700"
                            >
                              Original Blueprint
                            </Badge>
                            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                              Original Context Prompt
                            </h3>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                            The base production template context blueprint before your thoughts were combined.
                          </p>
                        </div>

                        {/* Separate Copy Button for Original Context */}
                        <Button
                          variant="outline"
                          onClick={handleCopyContextPrompt}
                          className="text-xs font-bold gap-1.5 shrink-0 border-zinc-300 dark:border-blue-900 text-zinc-800 dark:text-zinc-200"
                        >
                          {isContextCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-600" />
                              <span>Copied Original!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Original Prompt</span>
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Original Prompt Text */}
                      <div className="p-5 sm:p-6 rounded-2xl bg-zinc-50 dark:bg-[#070b14] border border-zinc-200/80 dark:border-slate-800/80 font-mono text-xs sm:text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap select-text">
                        {currentContextPrompt || template.contextPrompt || currentPrompt || template.basePrompt}
                      </div>
                    </Card>
                  </div>
                ) : (
                  /* SINGLE DISPLAY WHEN NOT CUSTOMIZED */
                  <Card className="rounded-3xl border border-emerald-200/80 dark:border-emerald-900/60 bg-white dark:bg-[#0a0e1a] p-6 sm:p-8 shadow-xs relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-zinc-100 dark:border-blue-950">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                            Context &amp; Content Prompt
                          </h3>
                          <Badge
                            variant="outline"
                            className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40"
                          >
                            Claude • ChatGPT • Domain Context
                          </Badge>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                          Defines subject identity, commercial purpose, target audience, and narrative content requirements.
                        </p>
                      </div>

                      {/* Action buttons in Context Prompt Tab */}
                      <div className="flex items-center gap-2 flex-wrap shrink-0">
                        {/* CUSTOMIZE CONTEXT BUTTON */}
                        <Button
                          variant="outline"
                          onClick={() => setIsCustomizingContext(!isCustomizingContext)}
                          className="py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border-emerald-300 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isCustomizingContext ? 'Close Box' : 'Customize Context'}</span>
                        </Button>

                        {/* SEPARATE COPY BUTTON FOR CONTEXT PROMPT */}
                        <Button
                          onClick={handleCopyContextPrompt}
                          className="py-2.5 px-5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                        >
                          {isContextCopied ? (
                            <>
                              <Check className="w-4 h-4 stroke-[3]" />
                              <span>Copied Context Prompt!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copy Context Prompt</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Context Prompt Text Box */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-zinc-50 dark:bg-[#070b14] border border-zinc-200/80 dark:border-slate-800/80 font-mono text-xs sm:text-sm leading-relaxed text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap select-text">
                      {currentContextPrompt || template.contextPrompt || currentPrompt || template.basePrompt}
                    </div>

                    {/* Footer helper */}
                    <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-blue-950 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <span className="text-zinc-500 dark:text-zinc-400 font-mono">
                        {(currentContextPrompt || template.contextPrompt || currentPrompt || template.basePrompt).length} characters
                      </span>
                      <button
                        type="button"
                        onClick={() => setActivePromptTab('ui')}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Switch to UI Prompt</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </Card>
                )}

                {/* Quick Combined Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Need both prompts bundled together for your generation pipeline?
                  </span>
                  <Button
                    variant="outline"
                    onClick={handleCopyBothPrompts}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-blue-950/40 hover:bg-zinc-200 dark:hover:bg-blue-900/50 border-zinc-200 dark:border-blue-800/40 text-zinc-700 dark:text-zinc-200"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isDualCopied ? 'Copied Both Prompts!' : 'Copy Both Prompts Combined'}</span>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      )}

      {/* ───────────────────────────────────────────────────
          SECTION 3B: STEP-BY-STEP GUIDANCE (CONNECTED VISUAL FLOW)
          Rendered for all users: previewable steps 1-2, locked step 3+ for guests;
          fully unlocked for subscribed users.
          ─────────────────────────────────────────────────── */}
      <div className="mb-14">
        <TemplateGuidanceFlow
          key={template.id}
          guidance={guidanceList.length > 0 ? guidanceList : template.guidance || []}
          tools={template.tools}
          templateTitle={template.title}
          categoryName={categoryName}
          isSubscribed={isSubscribed}
          onSubscribe={subscribe}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          4. BOTTOM SECTION: RATINGS & REVIEWS & SIMILAR TEMPLATES
          ═══════════════════════════════════════════════════════════════ */}

      {/* RATINGS & REVIEWS */}
      <section className="mb-12 pt-8 border-t border-slate-200/90 dark:border-blue-900/40">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight font-['var(--font-heading)'] mb-1">
            Ratings & Reviews
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-zinc-100">4.9</span>
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">
              based on 182 verified creator reviews
            </span>
          </div>
        </div>

        {/* Reviews Cards: Balanced 2-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {REVIEWS_LIST.slice(0, 4).map((review) => (
            <div
              key={review.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-blue-950/30 border border-slate-200/90 dark:border-blue-900/40 shadow-xs flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-zinc-200 leading-relaxed">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-blue-900/30">
                <p className="text-xs font-bold text-slate-900 dark:text-zinc-100">{review.handle}</p>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500">{review.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SIMILAR TEMPLATES */}
      <section className="pt-8 border-t border-slate-200/90 dark:border-blue-900/40">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight font-['var(--font-heading)']">
              Similar Templates
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Production-tested prompts in {categoryName}
            </p>
          </div>

          <Link
            href="/templates"
            className="text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline flex items-center gap-1 transition-colors"
          >
            <span>View all in gallery</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {similarTemplates.map((sim) => (
            <TemplateCard key={sim.id} template={sim} />
          ))}
        </div>
      </section>

      {/* Plans Modal */}
      <Dialog open={showPlansModal} onOpenChange={setShowPlansModal}>
        <DialogContent className="max-w-md p-6 sm:p-8">
          <DialogHeader className="mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Creator Subscription
            </span>
            <DialogTitle className="text-xl font-bold font-['var(--font-heading)'] mt-1">
              Unlock All AWA Prompts &amp; Guidance
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              A subscription lets you see and copy every prompt and guidance step. Instant Context Customization is included at zero credit cost.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-blue-950/40 border border-zinc-200 dark:border-blue-900/40 my-3 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Monthly Creator Pass
              </span>
              <span className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100">
                $19<span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">/mo</span>
              </span>
            </div>
            <ul className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1.5">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Full access to read and copy all catalog UI &amp; Context prompts</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Unlimited client-side Context Customization with zero credit costs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Unrestricted access to the interactive How to Run visual guidance flow</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>8 AI model adaptation credits included monthly</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={() => {
              subscribe();
              setShowPlansModal(false);
            }}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs"
          >
            Start Subscription (Instant Unlock)
          </Button>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 text-center mt-2">
            Demo Mode: Click to activate instant full access
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
