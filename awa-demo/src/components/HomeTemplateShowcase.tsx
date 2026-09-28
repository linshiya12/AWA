'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { allTemplates, Template } from '@/lib/mockData';
import { TemplateCard } from '@/components/TemplateCard';
import { TemplateGallery } from '@/components/TemplateGallery';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const CATEGORIES = [
  { id: 'All', label: 'All' },
  { id: 'Image', label: 'Image' },
  { id: 'Video', label: 'Video' },
  { id: 'Slides', label: 'Slides' },
  { id: 'Websites', label: 'Websites' },
] as const;

export function HomeTemplateShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'alpha'>('recent');
  const [toolFilter, setToolFilter] = useState<string>('all');

  const filteredTemplates: Template[] = useMemo(() => {
    let result = [...allTemplates];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((t) => t.mainCategory === selectedCategory);
    } else {
      // For 'All', curate a balanced 16-item subset showcasing mixed aspect ratios across all 4 categories
      const curatedIds = [
        'tpl_1',              // Square 1:1 - Studio Product on white
        'tpl_img_aquatic',    // Portrait 3:4 - Aquatic Fragrance Spray
        'tpl_web_1',          // Landscape 16:9 - Dark SaaS Hero
        'tpl_2',              // Portrait 3:4 - Handheld Lifestyle Coffee
        'tpl_slide_1',        // Landscape 16:9 - Pitch Deck
        'tpl_video_1',        // Landscape 16:9 - Turntable Video Loop
        'tpl_video_reel',     // Vertical 4:5 - Dynamic Social Launch Reel
        'tpl_future_machine', // Landscape 16:9 - 3D Robotics Motion
        'tpl_img_couture',    // Portrait 3:4 - Editorial Leather Tote
        'tpl_4',              // Square 1:1 - Overhead Flat Lay
        'tpl_slide_edu',      // Landscape 16:9 - Executive Masterclass Deck
        'tpl_img_museum',     // Portrait 3:4 - Haute Couture Architectural Silhouette
        'tpl_video_2',        // Landscape 16:9 - Macro Fluid Splash Video
        'tpl_3d_timepiece',   // Landscape 16:9 - Haute Horology 3D Showcase
        'tpl_mind_ai',        // Landscape 16:9 - 3D Holographic Spatial Motion
        'tpl_web_bakery',     // Landscape 16:9 - Artisan Bakery & Cafe
      ];
      result = curatedIds
        .map((id) => allTemplates.find((t) => t.id === id))
        .filter(Boolean) as Template[];
    }

    // Tool filter
    if (toolFilter !== 'all') {
      const q = toolFilter.toLowerCase();
      result = result.filter((t) =>
        t.tools.some((tool) => tool.name.toLowerCase().includes(q) || tool.id.toLowerCase().includes(q)) ||
        t.models.some((m) => m.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'popular') {
      result.sort((a, b) => b.tags.length - a.tags.length);
    } else if (sortBy === 'alpha') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [selectedCategory, sortBy, toolFilter]);

  return (
    <section className="px-4 sm:px-6 max-w-7xl mx-auto mb-24">
      {/* 
        COMPACT CATEGORY BAR (Image, Video, Slides, Websites)
        Left: Clean pill buttons
        Right: Quiet Sort & Tool dropdowns in AWA dark-blue theme
      */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-2.5 border-b border-zinc-200/60 dark:border-[#94A3B8]/[0.12]">
        {/* Left: Category pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count =
              cat.id === 'All'
                ? allTemplates.length
                : allTemplates.filter((t) => t.mainCategory === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#6EA8FF] to-[#8AB4FF] text-[#020817] shadow-sm shadow-[#6EA8FF]/20 font-bold'
                    : 'text-zinc-600 dark:text-[#94A3B8] hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#0A1428]'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-black/20 text-[#020817]'
                      : 'bg-zinc-200/70 dark:bg-white/10 text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Compact dropdown controls in AWA dark blue identity */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-zinc-200 dark:border-[#94A3B8]/20 bg-zinc-50 dark:bg-[#0A1428]/60 text-zinc-700 dark:text-[#94A3B8] hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-[#6EA8FF]/40 transition-colors cursor-pointer"
              >
                <span>
                  {sortBy === 'recent'
                    ? 'Recent'
                    : sortBy === 'popular'
                    ? 'Popular'
                    : 'A-Z'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white dark:bg-[#0B1528] border-zinc-200 dark:border-[#94A3B8]/20 text-xs min-w-[120px] rounded-xl shadow-xl"
            >
              <DropdownMenuItem
                onClick={() => setSortBy('recent')}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>Recent</span>
                {sortBy === 'recent' && <Check className="w-3.5 h-3.5 text-blue-500" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('popular')}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>Popular</span>
                {sortBy === 'popular' && <Check className="w-3.5 h-3.5 text-blue-500" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortBy('alpha')}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>Alphabetical</span>
                {sortBy === 'alpha' && <Check className="w-3.5 h-3.5 text-blue-500" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tool Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-zinc-200 dark:border-[#94A3B8]/20 bg-zinc-50 dark:bg-[#0A1428]/60 text-zinc-700 dark:text-[#94A3B8] hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-[#6EA8FF]/40 transition-colors cursor-pointer"
              >
                <span>
                  {toolFilter === 'all'
                    ? 'All Tools'
                    : toolFilter === 'midjourney'
                    ? 'Midjourney'
                    : toolFilter === 'flux'
                    ? 'FLUX.1'
                    : toolFilter === 'runway'
                    ? 'Runway'
                    : toolFilter === 'spline'
                    ? 'Spline 3D'
                    : 'v0'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white dark:bg-[#0B1528] border-zinc-200 dark:border-[#94A3B8]/20 text-xs min-w-[130px] rounded-xl shadow-xl"
            >
              <DropdownMenuItem
                onClick={() => setToolFilter('all')}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>All Tools</span>
                {toolFilter === 'all' && <Check className="w-3.5 h-3.5 text-blue-500" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setToolFilter('midjourney')}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>Midjourney</span>
                {toolFilter === 'midjourney' && <Check className="w-3.5 h-3.5 text-blue-500" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setToolFilter('flux')}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>FLUX.1</span>
                {toolFilter === 'flux' && <Check className="w-3.5 h-3.5 text-blue-500" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setToolFilter('runway')}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>Runway</span>
                {toolFilter === 'runway' && <Check className="w-3.5 h-3.5 text-blue-500" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setToolFilter('v0')}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>v0</span>
                {toolFilter === 'v0' && <Check className="w-3.5 h-3.5 text-blue-500" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setToolFilter('spline')}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>Spline 3D</span>
                {toolFilter === 'spline' && <Check className="w-3.5 h-3.5 text-blue-500" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 4-COLUMN MASONRY TEMPLATE GALLERY */}
      <TemplateGallery
        templates={filteredTemplates}
        emptyState={
          <div className="text-center py-20 border border-dashed border-zinc-300 dark:border-[#94A3B8]/20 rounded-2xl">
            <p className="text-zinc-500 dark:text-[#94A3B8] text-sm mb-4">
              No templates found matching your active filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory('All');
                setToolFilter('all');
              }}
              className="rounded-full text-xs"
            >
              Reset Filters
            </Button>
          </div>
        }
      />

      {/* Bottom CTA to Gallery */}
      <div className="mt-14 text-center">
        <Button
          asChild
          size="lg"
          className="rounded-full px-8 py-6 bg-zinc-900 dark:bg-white text-white dark:text-[#020817] hover:bg-black dark:hover:bg-zinc-200 text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
        >
          <Link href="/templates">
            <span>Explore All {allTemplates.length} Templates in Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
