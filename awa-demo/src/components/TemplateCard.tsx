'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, ArrowUpRight } from 'lucide-react';
import { Template } from '@/lib/mockData';
import { SaveToCollectionPopover } from '@/components/SaveToCollectionPopover';

interface TemplateCardProps {
  template: Template;
  className?: string;
}

export function TemplateCard({ template, className = '' }: TemplateCardProps) {
  const [imgError, setImgError] = useState(false);
  const isVideo = template.mainCategory === 'Video';
  const thumbnail = template.media?.thumbnail || '';

  return (
    <div
      className={`group relative flex flex-col rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c1427]/85 hover:border-zinc-300 dark:hover:border-blue-500/40 hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgba(10,25,60,0.6)] hover:-translate-y-1 transition-all duration-200 cursor-pointer ${className}`}
    >
      {/* 1. Top Wide Preview Media (16:9) */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-zinc-100 dark:bg-[#060b18] border-b border-zinc-100 dark:border-blue-900/30">
        {thumbnail && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={template.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-zinc-50 dark:from-[#0a1224] to-zinc-100 dark:to-[#070d19]">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate max-w-[90%]">
              {template.name}
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
              {template.category}
            </span>
          </div>
        )}

        {/* Video Play Indicator */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-10 h-10 rounded-full bg-black/45 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-lg transition-transform duration-200 group-hover:scale-110">
              <Play className="w-4 h-4 ml-0.5 fill-white text-white" />
            </div>
          </div>
        )}

        {/* Bookmark Icon Button on Image */}
        <div
          className="absolute top-2.5 right-2.5 z-20"
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
            className="w-7 h-7 sm:w-8 sm:h-8 shadow-sm backdrop-blur-md"
          />
        </div>
      </div>

      {/* 2. Bottom Content: Title & Short Metadata Line */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between gap-1.5">
            <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-[#6EA8FF] transition-colors truncate font-['var(--font-heading)'] leading-snug">
              {template.name}
            </h3>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 group-hover:text-blue-500 dark:group-hover:text-[#6EA8FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </div>
          <p className="text-xs text-zinc-500 dark:text-[#94A3B8] mt-1 flex items-center gap-1.5 truncate">
            <span>{template.category}</span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span
              className={
                template.difficulty === 'Easy'
                  ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                  : template.difficulty === 'Medium'
                  ? 'text-amber-600 dark:text-amber-400 font-medium'
                  : 'text-purple-600 dark:text-purple-400 font-medium'
              }
            >
              {template.difficulty}
            </span>
          </p>
        </div>
      </div>

      {/* 3. Stretched Clickable Overlay Link */}
      <Link
        href={`/template/${template.id}`}
        className="absolute inset-0 z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl"
        aria-label={`Open ${template.name}`}
      />
    </div>
  );
}
