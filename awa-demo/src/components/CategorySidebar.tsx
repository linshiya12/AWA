'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/lib/AppContext';
import { CategoryNode, getAllTemplateIdsUnderNode, getNodePath, allTemplates, MODELS } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronDown, Filter, X, Check, Layers } from 'lucide-react';

interface CategorySidebarProps {
  tree: CategoryNode[];
  activeCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  selectedModels?: string[];
  onToggleModel?: (model: string) => void;
  onClearModelFilters?: () => void;
  modelCounts?: Record<string, number>;
  className?: string;
}

export function CategorySidebar({
  tree,
  activeCategoryId,
  onSelectCategory,
  selectedModels = [],
  onToggleModel,
  onClearModelFilters,
  modelCounts,
  className = '',
}: CategorySidebarProps) {
  const { isSidebarOpen, closeSidebar } = useAppContext();

  // Set of expanded node IDs
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(['image-generation', 'product-photography'])
  );

  // Auto-expand ancestors when activeCategoryId changes
  useEffect(() => {
    if (activeCategoryId) {
      const path = getNodePath(tree, activeCategoryId);
      if (path.length > 0) {
        setExpandedIds((prev) => {
          const next = new Set(prev);
          path.forEach((node) => next.add(node.id));
          return next;
        });
      }
    }
  }, [activeCategoryId, tree]);

  // Handle ESC key to close sidebar
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isSidebarOpen) {
        closeSidebar();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, closeSidebar]);

  const toggleExpand = (nodeId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const renderNode = (node: CategoryNode, depth = 0) => {
    const hasChildren = Boolean(node.children && node.children.length > 0);
    const isExpanded = expandedIds.has(node.id);
    const isActive = activeCategoryId === node.id;
    const templateCount = getAllTemplateIdsUnderNode(node).length;

    return (
      <div key={node.id} className="relative">
        <div
          className={`group flex items-center justify-between rounded-xl my-0.5 transition-all text-xs ${
            isActive
              ? 'bg-black dark:bg-white text-white dark:text-black font-semibold shadow-xs'
              : 'hover:bg-zinc-100 dark:hover:bg-blue-900/30 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
          }`}
          style={{ paddingLeft: `${depth * 14 + 8}px`, paddingRight: '10px' }}
        >
          {/* Left: Expand Arrow (if has children) + Category Name */}
          <div className="flex items-center gap-1.5 py-2 flex-1 min-w-0">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node.id);
                }}
                className={`w-5 h-5 flex items-center justify-center rounded transition-transform shrink-0 ${
                  isActive
                    ? 'text-zinc-300 dark:text-zinc-600 hover:text-white dark:hover:text-black'
                    : 'text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-blue-800/40'
                }`}
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <span className="w-5 h-5 flex items-center justify-center shrink-0">
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-amber-400' : 'bg-zinc-300 dark:bg-zinc-600'}`} />
              </span>
            )}

            {/* Category Name: clicking selects category */}
            <button
              type="button"
              onClick={() => {
                onSelectCategory(node.id);
              }}
              className="text-left truncate flex-1 focus:outline-none tracking-tight leading-snug cursor-pointer"
              title={node.name}
            >
              {node.name}
            </button>
          </div>

          {/* Right: Template Count Badge */}
          {templateCount > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono shrink-0 ml-1.5 leading-none ${
                isActive
                  ? 'bg-zinc-800 dark:bg-zinc-200 text-zinc-200 dark:text-zinc-800 font-bold'
                  : 'bg-zinc-100 dark:bg-blue-900/40 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200'
              }`}
            >
              {templateCount}
            </span>
          )}
        </div>

        {/* Indented Children with connecting tree line */}
        {hasChildren && isExpanded && (
          <div className="relative pl-3 ml-2.5 border-l border-zinc-200 dark:border-blue-900/40 space-y-0.5">
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative z-50">
      {/* Semi-transparent backdrop behind sidebar */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      {/* Sliding Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white dark:bg-[#0a0e1a] border-r border-zinc-200 dark:border-blue-900/40 shadow-2xl p-5 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        } ${className}`}
      >
        {/* Drawer Header with Title and Close Button */}
        <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-zinc-100 dark:border-blue-900/40">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-black dark:text-white" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-['var(--font-heading)']">
              Filters &amp; Categories
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
              {allTemplates.length} prompts
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={closeSidebar}
              className="h-7 w-7 rounded-lg text-zinc-500 hover:text-black dark:hover:text-white"
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Container with Category Tree and Model Filters */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1 no-scrollbar">
          {/* Category Section */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 px-1 flex items-center gap-1.5">
              <Layers className="w-3 h-3" />
              <span>Category</span>
            </div>

            {/* "All Categories" Root Option */}
            <div className="mb-1.5">
              <button
                type="button"
                onClick={() => {
                  onSelectCategory(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                  activeCategoryId === null
                    ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xs'
                    : 'bg-zinc-50 dark:bg-blue-950/40 hover:bg-zinc-100 dark:hover:bg-blue-900/40 border-zinc-200 dark:border-blue-800/40 text-zinc-800 dark:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeCategoryId === null ? 'bg-amber-400 animate-pulse' : 'bg-zinc-400'
                    }`}
                  />
                  <span>All Categories</span>
                </div>
                <span className={`text-[10px] font-mono ${activeCategoryId === null ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500'}`}>
                  {allTemplates.length}
                </span>
              </button>
            </div>

            {/* Category Tree Navigation */}
            <div className="space-y-0.5">
              {tree.map((node) => renderNode(node, 0))}
            </div>
          </div>

          {/* Vertical Filter by Model Section */}
          <div className="pt-4 border-t border-zinc-200/80 dark:border-blue-900/40">
            {/* Header & Clear filters text link */}
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-['var(--font-heading)']">
                Filter by Model
              </span>
              {selectedModels.length > 0 && onClearModelFilters && (
                <button
                  type="button"
                  onClick={onClearModelFilters}
                  className="text-xs text-[#c17f59] dark:text-[#e8c9a8] hover:underline font-semibold transition-colors cursor-pointer"
                >
                  Clear filters
                </button>
              )}
            </div>

            {/* Vertical list of checkboxes */}
            <div className="space-y-1">
              {MODELS.map((model) => {
                const isChecked = selectedModels.includes(model);
                const count = modelCounts ? modelCounts[model] : undefined;

                return (
                  <label
                    key={model}
                    onClick={(e) => {
                      e.preventDefault();
                      onToggleModel?.(model);
                    }}
                    className={`flex items-center justify-between py-2 px-2.5 rounded-xl cursor-pointer transition-all text-xs select-none ${
                      isChecked
                        ? 'bg-zinc-100 dark:bg-blue-900/40 font-medium text-zinc-900 dark:text-zinc-100'
                        : 'hover:bg-zinc-50 dark:hover:bg-blue-950/30 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-zinc-900 dark:bg-white border border-zinc-900 dark:border-white text-white dark:text-black shadow-2xs'
                            : 'border border-zinc-300 dark:border-blue-800/60 bg-white dark:bg-blue-950/40 hover:border-zinc-400'
                        }`}
                      >
                        {isChecked && (
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        )}
                      </div>
                      <span className="truncate">{model}</span>
                    </div>

                    {typeof count === 'number' && (
                      <span
                        className={`text-[10px] font-mono ml-2 shrink-0 ${
                          isChecked ? 'text-zinc-900 dark:text-zinc-100 font-bold' : 'text-zinc-400 dark:text-zinc-500'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Footer with Active Filters info & Done button */}
        <div className="pt-3.5 mt-2 border-t border-zinc-200 dark:border-blue-900/40 flex items-center justify-between text-xs">
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {activeCategoryId || selectedModels.length > 0 ? (
              <span className="text-zinc-900 dark:text-zinc-100 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>Filters active</span>
              </span>
            ) : (
              <span>All prompts</span>
            )}
          </div>

          <Button
            type="button"
            size="sm"
            onClick={closeSidebar}
            className="rounded-xl px-4 text-xs font-semibold"
          >
            Done
          </Button>
        </div>
      </aside>
    </div>
  );
}
