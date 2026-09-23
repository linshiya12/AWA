'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  allTemplates,
  categoryTree,
  findNodeById,
  getAllTemplateIdsUnderNode,
  MODELS,
  CategoryNode,
} from '@/lib/mockData';
import { TemplateCard } from '@/components/TemplateCard';
import { CategorySidebar } from '@/components/CategorySidebar';
import { useAppContext } from '@/lib/AppContext';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

export default function Home() {
  const {
    searchQuery,
    activeSort,
    setActiveSort,
  } = useAppContext();

  // Sidebar active category: null = all
  const [activeSidebarCategoryId, setActiveSidebarCategoryId] = useState<string | null>(null);
  // Model filters (OR logic within group)
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const toggleModel = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  const clearModelFilters = () => {
    setSelectedModels([]);
  };

  const resetAllFilters = () => {
    setActiveSidebarCategoryId(null);
    setSelectedModels([]);
  };

  // Active category node
  const activeNode: CategoryNode | null = useMemo(() => {
    if (!activeSidebarCategoryId) return null;
    return findNodeById(categoryTree, activeSidebarCategoryId);
  }, [activeSidebarCategoryId]);

  // Model counts (dynamically contextual to active category if selected)
  const modelCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const baseList = activeNode
      ? allTemplates.filter((t) => getAllTemplateIdsUnderNode(activeNode).includes(t.id))
      : allTemplates;

    MODELS.forEach((model) => {
      counts[model] = baseList.filter(
        (t) =>
          t.models.some((m) => m.toLowerCase().includes(model.toLowerCase())) ||
          t.tools.some((tool) => tool.name.toLowerCase().includes(model.toLowerCase()))
      ).length;
    });
    return counts;
  }, [activeNode]);

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let list = [...allTemplates];

    // 1. Category filter (AND logic)
    if (activeNode) {
      const allowedIds = getAllTemplateIdsUnderNode(activeNode);
      list = list.filter((t) => allowedIds.includes(t.id));
    }

    // 2. Model filter (OR logic within this filter group)
    if (selectedModels.length > 0) {
      list = list.filter((template) => {
        return selectedModels.some(
          (model) =>
            template.models.some((m) => m.toLowerCase().includes(model.toLowerCase())) ||
            template.tools.some((t) => t.name.toLowerCase().includes(model.toLowerCase()))
        );
      });
    }

    // 3. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.produces.toLowerCase().includes(q) ||
          t.models.some((m) => m.toLowerCase().includes(q)) ||
          t.tools.some((tool) => tool.name.toLowerCase().includes(q))
      );
    }

    // 4. Sorting
    if (activeSort === 'popular') {
      list = [...list].sort((a, b) => b.charCount - a.charCount);
    } else if (activeSort === 'top_rated') {
      list = [...list].sort((a, b) => a.difficulty.localeCompare(b.difficulty));
    }

    return list;
  }, [activeNode, selectedModels, searchQuery, activeSort]);

  return (
    <div className="min-h-screen bg-transparent dark:bg-[#0a0e1a] flex flex-col justify-between transition-colors duration-200">
      {/* Category & Filter Sidebar Drawer */}
      <CategorySidebar
        tree={categoryTree}
        activeCategoryId={activeSidebarCategoryId}
        onSelectCategory={(id) => setActiveSidebarCategoryId(id)}
        selectedModels={selectedModels}
        onToggleModel={toggleModel}
        onClearModelFilters={clearModelFilters}
        modelCounts={modelCounts}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-20 w-full">
        {/* SECONDARY SORT TAB ROW */}
        <section className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-zinc-200/80 dark:border-blue-900/40 mb-6">
          <div className="flex items-center gap-5 sm:gap-6 text-sm">
              <button
                type="button"
                onClick={() => setActiveSort('latest')}
                className={`transition-colors relative py-1 cursor-pointer ${
                  activeSort === 'latest'
                    ? 'font-bold text-zinc-900 dark:text-zinc-100 after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black dark:after:bg-white'
                    : 'font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                Latest
              </button>
              <button
                type="button"
                onClick={() => setActiveSort('popular')}
                className={`transition-colors relative py-1 cursor-pointer ${
                  activeSort === 'popular'
                    ? 'font-bold text-zinc-900 dark:text-zinc-100 after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black dark:after:bg-white'
                    : 'font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                Most popular
              </button>
              <button
                type="button"
                onClick={() => setActiveSort('top_rated')}
                className={`transition-colors relative py-1 cursor-pointer ${
                  activeSort === 'top_rated'
                    ? 'font-bold text-zinc-900 dark:text-zinc-100 after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black dark:after:bg-white'
                    : 'font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                Top rated
              </button>
            </div>

          {activeNode && (
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span>Category:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-blue-900/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-zinc-200 dark:border-blue-800/40 flex items-center gap-1.5">
                <span>{activeNode.name}</span>
                <button
                  onClick={() => setActiveSidebarCategoryId(null)}
                  className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                  title="Clear category filter"
                  aria-label="Clear category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}
        </section>

        {/* 4-COLUMN GALLERY GRID with full card details */}
        <section>
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="reference-card p-12 text-center max-w-lg mx-auto my-12">
              <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-blue-900/40 backdrop-blur-md flex items-center justify-center mx-auto mb-4 text-zinc-600 dark:text-zinc-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 font-['var(--font-heading)']">
                No templates match these filters
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                No templates matched your current category or model filters.
              </p>
              <Button
                onClick={resetAllFilters}
                className="rounded-full px-5 text-xs font-semibold"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-blue-900/40 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400 bg-white dark:bg-[#0a0e1a]">
        <p>AWA · AI Creation Guide Platform — Production Ready Prompt Catalog</p>
      </footer>
    </div>
  );
}
