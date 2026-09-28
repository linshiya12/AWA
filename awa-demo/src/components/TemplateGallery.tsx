'use client';

import React from 'react';
import { Template } from '@/lib/mockData';
import { TemplateCard } from '@/components/TemplateCard';

interface TemplateGalleryProps {
  templates: Template[];
  className?: string;
  emptyState?: React.ReactNode;
}

/**
 * Reusable Masonry Template Gallery Component
 *
 * Implements a pure CSS multi-column masonry layout:
 * - 4 columns on wide desktop screens (xl:columns-4)
 * - 3 columns on standard desktop (lg:columns-3)
 * - 2 columns on tablet (sm:columns-2)
 * - 1 column on mobile (columns-1)
 *
 * Each template card maintains its natural aspect ratio (portrait, landscape, square)
 * with independent vertical stacking and uniform gaps.
 * Zero layout shifts, perfect SSR matching, and full keyboard navigation.
 */
export function TemplateGallery({
  templates,
  className = '',
  emptyState,
}: TemplateGalleryProps) {
  if (templates.length === 0) {
    return emptyState ? <>{emptyState}</> : null;
  }

  return (
    <div
      className={`columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 sm:gap-6 [column-fill:_balance] ${className}`}
      role="region"
      aria-label="AWA Templates Gallery"
    >
      {templates.map((template) => (
        <div
          key={template.id}
          className="break-inside-avoid w-full inline-block mb-5 sm:mb-6 align-top"
        >
          <TemplateCard template={template} />
        </div>
      ))}
    </div>
  );
}
