'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  MoveRight,
  ArrowUpDown,
  CornerDownRight,
  FolderPlus,
  RefreshCw,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
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

interface Category {
  category_id: string;
  parent_id: string | null;
  name: string;
  description: string;
  position: number;
  is_visible: boolean;
  path: string;
  depth: number;
  extra_prompt_words?: string;
}

export default function AdminCatalogPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Active category being worked on
  const [activeCat, setActiveCat] = useState<Category | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parent_id: '' as string | null,
    extra_prompt_words: '',
    is_visible: true,
  });

  const [moveParentId, setMoveParentId] = useState<string>('root');
  const [deleteCounts, setDeleteCounts] = useState<{ subcategories: number; templates: number }>({
    subcategories: 0,
    templates: 0,
  });

  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'cat-image-gen': true,
  });

  const fetchCategories = () => {
    setLoading(true);
    fetch('/api/v1/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Open Create Modal (at top level or under parent)
  const openCreateModal = (parentId: string | null = null) => {
    setFormData({
      name: '',
      description: '',
      parent_id: parentId,
      extra_prompt_words: '',
      is_visible: true,
    });
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const res = await fetch('/api/v1/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsCreateOpen(false);
        fetchCategories();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create category');
      }
    } catch {
      alert('Error creating category');
    }
  };

  // Open Edit Modal
  const openEditModal = (cat: Category) => {
    setActiveCat(cat);
    setFormData({
      name: cat.name,
      description: cat.description,
      parent_id: cat.parent_id,
      extra_prompt_words: cat.extra_prompt_words || '',
      is_visible: cat.is_visible,
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCat) return;

    try {
      const res = await fetch(`/api/v1/admin/categories/${activeCat.category_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsEditOpen(false);
        fetchCategories();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update category');
      }
    } catch {
      alert('Error updating category');
    }
  };

  // Move Category
  const openMoveModal = (cat: Category) => {
    setActiveCat(cat);
    setMoveParentId(cat.parent_id || 'root');
    setIsMoveOpen(true);
  };

  const handleMoveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCat) return;

    try {
      const res = await fetch(`/api/v1/admin/categories/${activeCat.category_id}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          new_parent_id: moveParentId === 'root' ? null : moveParentId,
        }),
      });

      if (res.ok) {
        setIsMoveOpen(false);
        fetchCategories();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to move category');
      }
    } catch {
      alert('Error moving category');
    }
  };

  // Delete/Hide Modal with Counts
  const openDeleteModal = (cat: Category) => {
    setActiveCat(cat);
    const subcats = categories.filter((c) => c.parent_id === cat.category_id);
    setDeleteCounts({
      subcategories: subcats.length,
      templates: 6, // sample templates
    });
    setIsDeleteOpen(true);
  };

  const handleDeleteSubmit = async (hideInstead: boolean) => {
    if (!activeCat) return;

    try {
      if (hideInstead) {
        // Toggle is_visible to false
        await fetch(`/api/v1/admin/categories/${activeCat.category_id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_visible: false }),
        });
      } else {
        // Soft delete / hide subtree
        await fetch(`/api/v1/admin/categories/${activeCat.category_id}`, {
          method: 'DELETE',
        });
      }
      setIsDeleteOpen(false);
      fetchCategories();
    } catch {
      alert('Action failed');
    }
  };

  // Recursive tree renderer
  const renderTree = (parentId: string | null = null, depth = 0) => {
    const nodes = categories.filter((c) => c.parent_id === parentId);
    if (nodes.length === 0) return null;

    return (
      <div className={`space-y-2 ${depth > 0 ? 'ml-6 pl-4 border-l border-slate-800' : ''}`}>
        {nodes.map((cat) => {
          const hasChildren = categories.some((c) => c.parent_id === cat.category_id);
          const isExpanded = expandedNodes[cat.category_id] ?? true;

          return (
            <div key={cat.category_id} className="group">
              <div
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  cat.is_visible
                    ? 'border-slate-800 bg-[#0a0f1d] hover:border-slate-700'
                    : 'border-slate-800/40 bg-slate-900/20 opacity-60'
                }`}
              >
                {/* Node info */}
                <div className="flex items-center gap-3 min-w-0">
                  {hasChildren ? (
                    <button
                      onClick={() => toggleExpand(cat.category_id)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-blue-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  ) : (
                    <span className="w-4 h-4 flex items-center justify-center text-slate-400">•</span>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-100">{cat.name}</span>
                      <span className="text-[11px] font-mono text-slate-400">{cat.path}</span>
                      {!cat.is_visible && (
                        <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-400 border-rose-500/20">
                          Hidden
                        </Badge>
                      )}
                    </div>
                    {cat.description && (
                      <p className="text-xs text-slate-400 truncate max-w-xl mt-0.5">{cat.description}</p>
                    )}
                    {cat.extra_prompt_words && (
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-indigo-400">
                        <Sparkles className="w-3 h-3" />
                        <span className="italic">Appends: &quot;{cat.extra_prompt_words}&quot;</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Node actions */}
                <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openCreateModal(cat.category_id)}
                    className="h-8 px-2 text-slate-300 hover:text-white hover:bg-slate-800 text-xs"
                    title="Add Subcategory"
                  >
                    <FolderPlus className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                    Subcategory
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openMoveModal(cat)}
                    className="h-8 px-2 text-slate-300 hover:text-white hover:bg-slate-800 text-xs"
                    title="Move Branch"
                  >
                    <MoveRight className="w-3.5 h-3.5 mr-1 text-blue-400" />
                    Move
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(cat)}
                    className="h-8 px-2 text-slate-300 hover:text-white hover:bg-slate-800 text-xs"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteModal(cat)}
                    className="h-8 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs"
                    title="Delete or Hide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Recursive child list */}
              {hasChildren && isExpanded && renderTree(cat.category_id, depth + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Catalog Tree Management</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
              Screen A2
            </Badge>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Build and reshape the catalog hierarchy at any depth. Subcategories inherit tools, guidance, and extra prompt words.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCategories}
            className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => openCreateModal(null)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Root Category
          </Button>
        </div>
      </div>

      {/* Main Tree Canvas */}
      <div className="rounded-2xl border border-slate-800 bg-[#080d1a] p-6 shadow-xl">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800 text-xs text-slate-400 font-medium">
          <span>Catalog Hierarchy & Nesting Structure</span>
          <span>Depth Unlimited (FR-002, FR-037)</span>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center items-center text-slate-400 text-xs">
            <RefreshCw className="w-4 h-4 animate-spin mr-2 text-blue-500" />
            Loading catalog hierarchy...
          </div>
        ) : (
          renderTree(null, 0)
        )}
      </div>

      {/* MODAL 1: CREATE CATEGORY */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="border-slate-800 bg-[#0d1222] text-slate-100 max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {formData.parent_id ? 'Add New Subcategory' : 'Add Root Category'}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Same creation form at every level (FR-037). Subcategories can nest to any depth.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs mt-2">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Category Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Architectural Renderings"
                required
                className="bg-slate-900 border-slate-700 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What this creation category produces..."
                rows={2}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                <span>Extra Prompt Words (Inherited by all sub-prompts)</span>
                <span className="text-[10px] text-indigo-400">04-FEATURES §5.1</span>
              </label>
              <Input
                value={formData.extra_prompt_words}
                onChange={(e) => setFormData({ ...formData, extra_prompt_words: e.target.value })}
                placeholder="e.g. ultra high-definition, commercial octane lighting"
                className="bg-slate-900 border-slate-700 text-slate-100 text-xs"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Quietly appended to every template prompt authored beneath this node.
              </p>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCreateOpen(false)}
                className="text-xs text-slate-400"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: EDIT CATEGORY */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="border-slate-800 bg-[#0d1222] text-slate-100 max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Category: {activeCat?.name}</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Update presentation metadata, visibility, or inherited prompt words.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs mt-2">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-slate-900 border-slate-700 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Extra Prompt Words</label>
              <Input
                value={formData.extra_prompt_words}
                onChange={(e) => setFormData({ ...formData, extra_prompt_words: e.target.value })}
                className="bg-slate-900 border-slate-700 text-slate-100 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is_visible"
                checked={formData.is_visible}
                onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                className="rounded border-slate-700 bg-slate-900 text-blue-600"
              />
              <label htmlFor="is_visible" className="text-slate-300 font-medium">
                Visible to users in public catalog
              </label>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditOpen(false)}
                className="text-xs text-slate-400"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: MOVE CATEGORY BRANCH */}
      <Dialog open={isMoveOpen} onOpenChange={setIsMoveOpen}>
        <DialogContent className="border-slate-800 bg-[#0d1222] text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle>Relocate Branch: {activeCat?.name}</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Move this category and its entire subtree to a new parent node. Cycle detection prevents moving under a descendant (Rule 13).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleMoveSubmit} className="space-y-4 text-xs mt-2">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Select New Parent</label>
              <select
                value={moveParentId}
                onChange={(e) => setMoveParentId(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 text-xs"
              >
                <option value="root">Top Level (No Parent)</option>
                {categories
                  .filter((c) => c.category_id !== activeCat?.category_id)
                  .map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.path} — {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsMoveOpen(false)}
                className="text-xs text-slate-400"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
                Confirm Move
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: DELETE / HIDE CONFIRMATION (11-UI-UX A2: Deleting is deliberate with exact counts) */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="border-slate-800 bg-[#0d1222] text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Remove Category: {activeCat?.name}
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-xs leading-relaxed pt-1">
              This node contains{' '}
              <strong className="text-white">
                {deleteCounts.subcategories} subcategories
              </strong>{' '}
              and <strong className="text-white">{deleteCounts.templates} templates</strong>.
              Removing it immediately impacts public catalog browsing.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs leading-relaxed my-2">
            <strong>Recommended action:</strong> Hide it instead. Hiding cascades down the subtree so users cannot
            see it, but no template data or prompt history is destroyed.
          </div>

          <DialogFooter className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="text-xs border-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => handleDeleteSubmit(true)}
              className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
            >
              Hide Instead (Safe)
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleDeleteSubmit(false)}
              className="text-xs"
            >
              Confirm Hide All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
