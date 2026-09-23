'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/lib/AppContext';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bookmark, Check, Plus, FolderPlus } from 'lucide-react';

interface SaveToCollectionPopoverProps {
  templateId: string;
  templateName?: string;
  variant?: 'icon-only' | 'button';
  className?: string;
}

export function SaveToCollectionPopover({
  templateId,
  templateName,
  variant = 'icon-only',
  className = '',
}: SaveToCollectionPopoverProps) {
  const {
    collections,
    isTemplateSaved,
    getTemplateCollections,
    addTemplateToCollection,
    removeTemplateFromCollection,
    createCollection,
  } = useAppContext();

  const [isOpen, setIsOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);

  const isSaved = isTemplateSaved(templateId);
  const savedIn = getTemplateCollections(templateId);

  const handleToggleCollection = (
    e: React.MouseEvent,
    collectionId: string,
    currentlyIn: boolean
  ) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentlyIn) {
      removeTemplateFromCollection(collectionId, templateId);
    } else {
      addTemplateToCollection(collectionId, templateId);
    }
  };

  const handleCreateCollection = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!newCollectionName.trim()) return;

    createCollection(newCollectionName.trim(), templateId);
    setNewCollectionName('');
    setShowCreateInput(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {variant === 'button' ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={`rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              isSaved
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/50 text-amber-800 dark:text-amber-300 shadow-2xs'
                : 'bg-white/90 dark:bg-blue-900/30 backdrop-blur-md hover:bg-zinc-50 dark:hover:bg-blue-900/50 border-zinc-200 dark:border-blue-800/40 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white shadow-2xs'
            } ${className}`}
            title={isSaved ? `Saved in ${savedIn.length} collection(s)` : 'Save to collection'}
          >
            <Bookmark
              className={`w-4 h-4 ${
                isSaved ? 'text-amber-500 fill-amber-500' : 'text-zinc-500 dark:text-zinc-400'
              }`}
            />
            <span>{isSaved ? `Saved (${savedIn.length})` : 'Save to Collection'}</span>
          </Button>
        ) : (
          <button
            type="button"
            className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              isSaved
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/50 text-amber-500 dark:text-amber-400 shadow-xs'
                : 'bg-white/90 dark:bg-blue-950/60 backdrop-blur-md hover:bg-white dark:hover:bg-blue-900/60 border-zinc-200 dark:border-blue-800/40 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white shadow-xs'
            } ${className}`}
            title={isSaved ? `Saved in ${savedIn.length} collection(s)` : 'Save to collection'}
            aria-label="Save to collection"
          >
            <Bookmark
              className={`w-4 h-4 ${
                isSaved ? 'text-amber-500 fill-amber-500' : 'text-zinc-600 dark:text-zinc-400'
              }`}
            />
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-68 p-3.5">
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-zinc-100 dark:border-blue-900/40">
          <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-1.5">
            <FolderPlus className="w-3.5 h-3.5 text-blue-500" />
            Save to collection
          </span>
          <span className="text-[10px] text-teal-700 dark:text-teal-400 font-semibold px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/40 border border-teal-200/50 dark:border-teal-800/30">
            Free feature
          </span>
        </div>

        {templateName && (
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mb-2.5 font-medium">
            {templateName}
          </p>
        )}

        {/* Existing Collections List */}
        <div className="max-h-40 overflow-y-auto space-y-1 mb-2.5 pr-1 no-scrollbar">
          {collections.length === 0 ? (
            <p className="text-zinc-400 dark:text-zinc-500 text-[11px] italic py-1">
              No collections created yet.
            </p>
          ) : (
            collections.map((col) => {
              const inThisCollection = col.templateIds.includes(templateId);
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={(e) => handleToggleCollection(e, col.id, inThisCollection)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-all text-xs cursor-pointer ${
                    inThisCollection
                      ? 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/50 text-amber-900 dark:text-amber-100 font-medium'
                      : 'hover:bg-zinc-100/70 dark:hover:bg-blue-950/50 border border-transparent text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <span className="truncate pr-2">{col.name}</span>
                  <span className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                      {col.templateIds.length}
                    </span>
                    <span
                      className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                        inThisCollection
                          ? 'bg-amber-500 border-amber-500 text-white font-bold'
                          : 'border-zinc-300 dark:border-zinc-600'
                      }`}
                    >
                      {inThisCollection && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Add New Collection Form */}
        <div className="pt-2 border-t border-zinc-100 dark:border-blue-900/40">
          {showCreateInput ? (
            <form onSubmit={handleCreateCollection} className="space-y-2">
              <Input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Collection name..."
                autoFocus
                className="h-8 text-xs"
              />
              <div className="flex items-center gap-1.5">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newCollectionName.trim()}
                  className="flex-1 h-7 text-[11px] font-semibold"
                >
                  Create & Save
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateInput(false)}
                  className="h-7 text-[11px] px-2"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowCreateInput(true)}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-zinc-100/70 dark:bg-blue-950/40 hover:bg-zinc-200/70 dark:hover:bg-blue-900/40 text-zinc-700 dark:text-zinc-300 font-medium text-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New collection</span>
            </button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
