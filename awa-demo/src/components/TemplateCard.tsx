'use client';

import React, { useState, useRef, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Play, ArrowUpRight, Layers, Box, Sparkles, Monitor } from 'lucide-react';
import { Template } from '@/lib/mockData';
import { SaveToCollectionPopover } from '@/components/SaveToCollectionPopover';

interface TemplateCardProps {
  template: Template;
  className?: string;
}

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function TemplateCard({ template, className = '' }: TemplateCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [imgError, setImgError] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Subscribe to prefers-reduced-motion
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );

  const isVideo = template.mainCategory === 'Video';
  const isSlides = template.mainCategory === 'Slides';
  const isWebsites = template.mainCategory === 'Websites';

  // 3D / Animated website detection
  const is3DWebsite =
    isWebsites &&
    (template.category === '3D Websites' ||
      template.category === '3D' ||
      template.category === 'Robotics' ||
      template.tags.includes('3D') ||
      template.tags.includes('WebGL') ||
      Boolean(template.media?.motionPreviewUrl));

  // Determine active motion video source
  const motionVideoUrl = isVideo
    ? template.media?.videoUrl
    : is3DWebsite
    ? template.media?.motionPreviewUrl || template.media?.videoUrl
    : undefined;

  const hasMotion = Boolean(motionVideoUrl && motionVideoUrl !== '#');

  // Resolved still preview image / poster
  const previewImage =
    template.media?.primaryImage ||
    template.media?.poster ||
    template.media?.thumbnail ||
    template.media?.desktopPreview ||
    '';

  // 1. IntersectionObserver: Preload video metadata when card is near viewport (200px rootMargin)
  useEffect(() => {
    const el = cardRef.current;
    if (!el || !hasMotion || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const nearObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsNearViewport(true);
            nearObserver.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    nearObserver.observe(el);
    return () => nearObserver.disconnect();
  }, [hasMotion]);

  // 2. IntersectionObserver: Autoplay/pause when card is directly visible in viewport
  useEffect(() => {
    const el = cardRef.current;
    if (!el || !hasMotion || typeof IntersectionObserver === 'undefined') return;

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.25 }
    );

    visibilityObserver.observe(el);
    return () => visibilityObserver.disconnect();
  }, [hasMotion]);

  // 3. Play/Pause coordination based on visibility, hover, and reduced-motion
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasMotion) return;

    const shouldPlay = (isVisible || isHovered) && !prefersReducedMotion;

    if (shouldPlay) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented by browser policy
        });
      }
    } else {
      video.pause();
    }
  }, [isVisible, isHovered, prefersReducedMotion, hasMotion]);

  return (
    <article
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col w-full transition-all duration-300 ${className}`}
    >
      {/* 
        1. MEDIA PREVIEW CONTAINER
        - Flowing natural aspect ratio: no fixed aspect-ratio wrapper!
        - Rounded corners: rounded-2xl
        - Clean dark-blue / neutral borders
        - Subtle hover scale on media without changing layout
      */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#070e1e] border border-slate-200/80 dark:border-blue-900/40 group-hover:border-slate-300 dark:group-hover:border-[#6EA8FF]/45 transition-all duration-300 shadow-2xs group-hover:shadow-md dark:group-hover:shadow-[0_12px_32px_rgba(2,12,32,0.85)]">
        {/* Base Still Preview / Poster */}
        {previewImage && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewImage}
            alt={`${template.name} preview result`}
            className={`w-full h-auto object-cover block transition-transform duration-300 ease-out group-hover:scale-[1.02] ${
              isPlaying ? 'opacity-0' : 'opacity-100'
            }`}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[4/3] flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-100 dark:from-[#0a1224] to-slate-200 dark:to-[#070d19]">
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 truncate max-w-[90%]">
              {template.name}
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
              {template.category}
            </span>
          </div>
        )}

        {/* Inline Motion Video Player (Videos & 3D Websites) */}
        {hasMotion && (
          <video
            ref={videoRef}
            src={motionVideoUrl}
            poster={previewImage}
            muted
            loop
            playsInline
            preload="metadata"
            onPlaying={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
              isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Subtle Minimal Badges (Bottom Left) */}
        <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none flex items-center gap-1.5 flex-wrap">
          {isVideo && (
            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1 border border-white/10 shadow-xs">
              <Play className={`w-2.5 h-2.5 fill-white ${isPlaying ? 'text-blue-400' : ''}`} />
              <span>{isPlaying ? 'Playing Preview' : 'Video Result'}</span>
            </span>
          )}

          {is3DWebsite && (
            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1 border border-white/10 shadow-xs">
              <Box className="w-2.5 h-2.5 text-sky-400" />
              <span>{isPlaying ? '3D Motion' : '3D WebGL'}</span>
            </span>
          )}

          {isSlides && (
            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1 border border-white/10 shadow-xs">
              <Layers className="w-2.5 h-2.5 text-purple-300" />
              <span>{template.media?.slides?.length || 4} Slides</span>
            </span>
          )}
        </div>

        {/* Accessible Separate Action: Save to Collection (Top Right) */}
        <div
          className="absolute top-2.5 right-2.5 z-20 transition-opacity duration-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <SaveToCollectionPopover
            templateId={template.id}
            templateName={template.name}
            variant="icon-only"
            className="w-7 h-7 sm:w-8 sm:h-8 shadow-sm backdrop-blur-md bg-black/40 hover:bg-black/75 border border-white/15 text-white rounded-full transition-all"
          />
        </div>

        {/* Stretched Clickable Overlay Link to Detail Page */}
        <Link
          href={`/template/${template.id}`}
          className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl cursor-pointer"
          aria-label={`Open template details for ${template.name}`}
        />
      </div>

      {/* 
        2. TEMPLATE TITLE & CATEGORY DIRECTLY BENEATH PREVIEW
        Matches reference image anatomy:
        - Title (font-semibold, crisp, hover color)
        - Small category/subcategory label directly below
        - Minimal icon on right
      */}
      <div className="mt-2.5 px-0.5 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <Link
            href={`/template/${template.id}`}
            className="block focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 rounded"
          >
            <h3 className="font-semibold text-sm sm:text-[15px] text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-[#6EA8FF] transition-colors line-clamp-1 leading-snug font-['var(--font-heading)']">
              {template.name}
            </h3>
          </Link>
          <p className="text-xs text-zinc-500 dark:text-[#94A3B8] mt-0.5 truncate font-normal">
            {template.category}
          </p>
        </div>

        <div className="shrink-0 pt-0.5 flex items-center text-zinc-400 dark:text-zinc-600 group-hover:text-blue-500 dark:group-hover:text-[#6EA8FF] transition-colors">
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </article>
  );
}
