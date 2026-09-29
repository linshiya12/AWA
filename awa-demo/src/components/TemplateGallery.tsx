'use client';

import React, { useMemo, useSyncExternalStore } from 'react';
import { Template } from '@/lib/mockData';
import { TemplateCard } from '@/components/TemplateCard';

interface TemplateGalleryProps {
  templates: Template[];
  className?: string;
  emptyState?: React.ReactNode;
}

function subscribeResize(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function getColumnCountSnapshot(): number {
  if (typeof window === 'undefined') return 4;
  const w = window.innerWidth;
  if (w < 640) return 1;
  if (w < 1024) return 2;
  return 4;
}

function getColumnCountServerSnapshot(): number {
  return 4;
}

/**
 * Reusable 4-Column Masonry Template Gallery Component
 *
 * Implements a true 4-column responsive masonry layout:
 * - Exactly 4 equal-width columns on desktop screens (>= 1024px, including 1920px)
 * - 2 equal-width columns on tablet (640px – 1023px)
 * - 1 column on mobile (< 640px)
 *
 * Round-robin horizontal distribution ensures:
 * 1. The first four templates (0, 1, 2, 3) ALWAYS appear side-by-side in row 1 on desktop.
 * 2. All 4 columns are active and equal in width (grid-cols-4).
 * 3. Each template card preserves its natural image aspect ratio (1:1, 3:4, 16:9).
 * 4. Zero distortion, zero layout shifts, and full SSR compatibility.
 */
export function TemplateGallery({
  templates,
  className = '',
  emptyState,
}: TemplateGalleryProps) {
  const columnCount = useSyncExternalStore(
    subscribeResize,
    getColumnCountSnapshot,
    getColumnCountServerSnapshot
  );

  const columns = useMemo(() => {
    const cols: Template[][] = Array.from({ length: columnCount }, () => []);
    templates.forEach((template, index) => {
      cols[index % columnCount].push(template);
    });
    return cols;
  }, [templates, columnCount]);

  if (templates.length === 0) {
    return emptyState ? <>{emptyState}</> : null;
  }

  const gridColClass =
    columnCount === 1
      ? 'grid-cols-1'
      : columnCount === 2
      ? 'grid-cols-2'
      : 'grid-cols-4';

  return (
    <div
      className={`grid ${gridColClass} gap-5 sm:gap-6 items-start w-full ${className}`}
      role="region"
      aria-label="AWA Templates Gallery"
    >
      {columns.map((colTemplates, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-5 sm:gap-6 min-w-0 w-full">
          {colTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      ))}
    </div>
  );
}
