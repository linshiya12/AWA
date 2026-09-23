'use client';

import React, { useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

interface TemplateImageProps {
  images?: string[];
  alt: string;
  previewAccent?: string;
  subtitle?: string;
  charCount?: number;
  aspectRatio?: '16:9' | '4:3' | '16:10' | '1:1';
  className?: string;
  isVideo?: boolean;
}

export function TemplateImage({
  images = [],
  alt,
  previewAccent = 'from-amber-100/50 via-rose-50/40 to-transparent',
  subtitle,
  charCount,
  aspectRatio = '16:9',
  className = '',
  isVideo = false,
}: TemplateImageProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentImage = images[activeIndex];
  const [hasError, setHasError] = useState(!currentImage);

  useEffect(() => {
    setHasError(!currentImage);
  }, [currentImage]);

  const aspectClass =
    aspectRatio === '16:9'
      ? 'aspect-[16/9]'
      : aspectRatio === '4:3'
      ? 'aspect-[4/3]'
      : aspectRatio === '16:10'
      ? 'aspect-[16/10]'
      : 'aspect-square';

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(index);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      className={`relative w-full ${aspectClass} bg-zinc-50 dark:bg-gradient-to-b dark:from-[#0d1b38] dark:to-[#0a1224] backdrop-blur-md border border-zinc-200/80 dark:border-blue-900/50 rounded-xl overflow-hidden flex items-center justify-center ${className} group/carousel`}
    >
      {currentImage && !hasError ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt={`${alt} - Image ${activeIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
            onError={() => setHasError(true)}
          />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                <Play className="w-5 h-5 ml-0.5 fill-white" />
              </div>
            </div>
          )}
          
          {/* Carousel Controls */}
          {images.length > 1 && (
            <>
              {/* Left/Right Arrows */}
              <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity pointer-events-none">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-7 h-7 rounded-full bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black text-zinc-800 dark:text-zinc-200 shadow-sm flex items-center justify-center pointer-events-auto backdrop-blur-md transition-colors cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-7 h-7 rounded-full bg-white/80 dark:bg-black/60 hover:bg-white dark:hover:bg-black text-zinc-800 dark:text-zinc-200 shadow-sm flex items-center justify-center pointer-events-auto backdrop-blur-md transition-colors cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dots */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-auto">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => handleDotClick(e, idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === activeIndex
                        ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.5)] scale-125'
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="w-full h-full relative flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-zinc-50 dark:from-[#0c162e] to-zinc-100 dark:to-[#080d19]">
          <div
            className={`absolute inset-0 bg-gradient-to-tr ${previewAccent} opacity-60 transition-opacity`}
          />

          <div className="relative z-10 w-full max-w-[190px] rounded-xl border border-zinc-200 dark:border-blue-800/40 bg-white/90 dark:bg-[#0c162e]/90 backdrop-blur-md shadow-2xs flex flex-col items-center justify-center p-3 text-center transition-transform duration-300">
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 flex items-center justify-center mb-1.5 text-amber-600 dark:text-amber-400">
              <Camera className="w-4 h-4" />
            </div>
            {subtitle && (
              <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight line-clamp-1">
                {subtitle}
              </span>
            )}
            {charCount && (
              <span className="text-[9px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                {charCount} characters
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface ToolTagProps {
  tool: {
    id?: string;
    name: string;
    logo?: string;
  };
}

export function ToolTag({ tool }: ToolTagProps) {
  const [logoError, setLogoError] = useState(!tool.logo);

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#0c162e]/90 backdrop-blur-md hover:bg-zinc-50 dark:hover:bg-blue-900/40 border border-zinc-200 dark:border-blue-800/40 text-xs text-zinc-700 dark:text-zinc-300 shadow-2xs transition-colors">
      {tool.logo && !logoError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tool.logo}
          alt={tool.name}
          className="w-3.5 h-3.5 rounded object-contain shrink-0"
          onError={() => setLogoError(true)}
        />
      ) : (
        <span className="w-3.5 h-3.5 rounded bg-zinc-100 dark:bg-blue-950/60 text-zinc-700 dark:text-zinc-300 text-[9px] font-bold flex items-center justify-center shrink-0">
          {tool.name.charAt(0)}
        </span>
      )}
      <span className="font-medium text-[11px] text-zinc-800 dark:text-zinc-200">{tool.name}</span>
    </div>
  );
}
