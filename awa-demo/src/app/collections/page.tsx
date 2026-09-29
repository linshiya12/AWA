'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAppContext, Collection } from '@/lib/AppContext';
import { allTemplates, Template } from '@/lib/mockData';
import { TemplateGallery } from '@/components/TemplateGallery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Bookmark,
  Plus,
  Trash2,
  ChevronRight,
  ArrowRight,
  FolderPlus,
  X,
} from 'lucide-react';

export default function CollectionsPage() {
  const { collections, createCollection, deleteCollection } = useAppContext();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');

  // Set default selected collection if not set
  const activeCollection: Collection | null = useMemo(() => {
    if (collections.length === 0) return null;
    if (selectedCollectionId) {
      const found = collections.find((c) => c.id === selectedCollectionId);
      if (found) return found;
    }
    return collections[0];
  }, [collections, selectedCollectionId]);

  // Templates inside active collection
  const collectionTemplates: Template[] = useMemo(() => {
    if (!activeCollection) return [];
    return activeCollection.templateIds
      .map((id) => allTemplates.find((t) => t.id === id))
      .filter((t): t is Template => t !== undefined);
  }, [activeCollection]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    const newId = createCollection(newCollectionName.trim());
    setSelectedCollectionId(newId);
    setNewCollectionName('');
    setIsCreatingNew(false);
  };

  return (
    <div className="min-h-screen bg-transparent dark:bg-[#0a0e1a] text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 pb-24">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center text-xs text-zinc-500 dark:text-zinc-400 gap-2">
          <Link href="/templates" className="hover:text-black dark:hover:text-white font-medium transition-colors">
            Templates
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
          <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Collections</span>
          {activeCollection && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-600" />
              <span className="text-zinc-600 dark:text-zinc-400 font-medium truncate max-w-[200px]">
                {activeCollection.name}
              </span>
            </>
          )}
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-blue-900/40 border border-zinc-200 dark:border-blue-800/40 text-xs text-zinc-700 dark:text-zinc-300 mb-2 font-medium">
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Saved Prompts</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-['var(--font-heading)']">
              Your Collections
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Organize and save prompt templates for your specific jobs and campaigns.
            </p>
          </div>

          <Button
            onClick={() => setIsCreatingNew(true)}
            className="self-start sm:self-auto rounded-full px-5 py-2 text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Collection</span>
          </Button>
        </div>

        {/* Dialog for Creating New Collection */}
        <Dialog open={isCreatingNew} onOpenChange={setIsCreatingNew}>
          <DialogContent className="max-w-md p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold font-['var(--font-heading)']">
                Create New Collection
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                Group prompt templates for clients, brand projects, or marketing campaigns.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4 my-2">
              <Input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="e.g. Q4 Holiday Campaigns, Amazon Product Launch..."
                autoFocus
                className="text-sm h-10"
              />

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreatingNew(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newCollectionName.trim()}
                  className="font-semibold"
                >
                  Create Collection
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Collections Row / Selector */}
        {collections.length > 0 ? (
          <div className="mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
              {collections.map((col) => {
                const isSelected = activeCollection?.id === col.id;
                return (
                  <div
                    key={col.id}
                    className={`group flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xs'
                        : 'bg-white dark:bg-blue-950/40 hover:bg-zinc-50 dark:hover:bg-blue-900/40 border-zinc-200 dark:border-blue-900/40 text-zinc-700 dark:text-zinc-300'
                    }`}
                    onClick={() => setSelectedCollectionId(col.id)}
                  >
                    <span>{col.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected
                          ? 'bg-zinc-800 dark:bg-zinc-200 text-zinc-200 dark:text-zinc-800'
                          : 'bg-zinc-100 dark:bg-blue-900/50 text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      {col.templateIds.length}
                    </span>

                    {/* Delete collection button */}
                    {collections.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete collection "${col.name}"?`)) {
                            deleteCollection(col.id);
                            if (activeCollection?.id === col.id) {
                              setSelectedCollectionId(null);
                            }
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-500 text-zinc-400 text-xs ml-1 transition-opacity cursor-pointer"
                        title="Delete this collection"
                        aria-label="Delete collection"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Empty Collections State */
          <div className="reference-card p-12 text-center max-w-lg mx-auto my-12">
            <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-blue-900/40 flex items-center justify-center mx-auto mb-4 text-zinc-600 dark:text-zinc-400">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 font-['var(--font-heading)']">
              No collections yet
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-6 max-w-sm mx-auto leading-relaxed">
              Create collections to organize prompt templates for your upcoming photography shoots or ad campaigns.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                onClick={() => setIsCreatingNew(true)}
                className="rounded-full px-5 text-xs font-semibold shadow-xs"
              >
                + Create First Collection
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full px-4 text-xs font-semibold"
              >
                <Link href="/templates">Browse Templates</Link>
              </Button>
            </div>
          </div>
        )}

        {/* Templates Inside Active Collection */}
        {activeCollection && (
          <section>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-200/80 dark:border-blue-900/40">
              <div>
                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {activeCollection.name}
                </h2>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {collectionTemplates.length} saved {collectionTemplates.length === 1 ? 'template' : 'templates'}
                </span>
              </div>

              <Link
                href="/templates"
                className="text-xs font-semibold text-zinc-800 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:underline flex items-center gap-1 transition-colors"
              >
                <span>+ Add more from Gallery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {collectionTemplates.length > 0 ? (
              <TemplateGallery templates={collectionTemplates} />
            ) : (
              /* Collection is empty */
              <div className="reference-card p-10 text-center max-w-md mx-auto my-8">
                <p className="text-sm text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                  This collection has no saved templates yet.
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
                  Browse the catalog and click the save button on any template to add it here.
                </p>
                <Button asChild className="rounded-full px-5 text-xs font-semibold shadow-xs">
                  <Link href="/templates" className="flex items-center gap-1.5">
                    <span>Browse Template Gallery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
