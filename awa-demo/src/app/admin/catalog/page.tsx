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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
    fetch('/api/v1/admin/categories')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to retrieve catalog tree');
        return res.json();
      })
      .then((data) => {
        setCategories(data.categories || []);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'Error communicating with catalog backend');
      })
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

  // Open Edit Modal
  const openEditModal = (cat: Category) => {
    setActiveCat(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      parent_id: cat.parent_id,
      extra_prompt_words: cat.extra_prompt_words || '',
      is_visible: cat.is_visible,
    });
    setIsEditOpen(true);
  };

  // Open Move Modal
  const openMoveModal = (cat: Category) => {
    setActiveCat(cat);
    setMoveParentId(cat.parent_id || 'root');
    setIsMoveOpen(true);
  };

  // Handle Create Submit
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

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCat || !formData.name.trim()) return;

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

  // Handle Move Submit (Checks cycle detection)
  const handleMoveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCat) return;

    const targetParentId = moveParentId === 'root' ? null : moveParentId;

    try {
      const res = await fetch(`/api/v1/admin/categories/${activeCat.category_id}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parent_id: targetParentId }),
      });

      if (res.ok) {
        setIsMoveOpen(false);
        fetchCategories();
      } else {
        const err = await res.json();
        alert(err.error || 'Cannot move category');
      }
    } catch {
      alert('Error moving category');
    }
  };

  // Open Delete Confirmation Modal
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
      <div className={`space-y-2 ${depth > 0 ? 'ml-6 pl-4 border-l border-slate-200 dark:border-slate-800' : ''}`}>
        {nodes.map((cat) => {
          const hasChildren = categories.some((c) => c.parent_id === cat.category_id);
          const isExpanded = expandedNodes[cat.category_id] ?? true;

          return (
            <div key={cat.category_id} className="group">
              <div
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  cat.is_visible
                    ? 'border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-xs hover:border-slate-300 dark:hover:border-blue-800/60'
                    : 'border-slate-200/40 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/20 opacity-60'
                }`}
              >
                {/* Node info */}
                <div className="flex items-center gap-3 min-w-0">
                  {hasChildren ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpand(cat.category_id)}
                      className="h-7 w-7 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                      aria-label={isExpanded ? `Collapse ${cat.name}` : `Expand ${cat.name}`}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </Button>
                  ) : (
                    <span className="w-4 h-4 flex items-center justify-center text-slate-300 dark:text-slate-600 text-xs">•</span>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{cat.name}</span>
                      <span className="text-[11px] font-mono text-slate-400">{cat.path}</span>
                      {!cat.is_visible && (
                        <Badge variant="rose" className="text-[10px]">
                          Hidden
                        </Badge>
                      )}
                    </div>
                    {cat.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xl mt-0.5">{cat.description}</p>
                    )}
                    {cat.extra_prompt_words && (
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-indigo-600 dark:text-indigo-400">
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
                    className="h-8 px-2 text-xs"
                    title="Add Subcategory"
                  >
                    <FolderPlus className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                    Subcategory
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openMoveModal(cat)}
                    className="h-8 px-2 text-xs"
                    title="Move Branch"
                  >
                    <MoveRight className="w-3.5 h-3.5 mr-1 text-blue-500" />
                    Move
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(cat)}
                    className="h-8 px-2 text-xs"
                    title="Edit Category"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteModal(cat)}
                    className="h-8 px-2 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-500/10 text-xs"
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Catalog Tree Management</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
              Screen A2
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse, reorder, relocate, and maintain the hierarchy of creation categories. Cycle detection prevents invalid parents (Rule 13).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCategories}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => openCreateModal(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Top-Level Category
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Catalog Tree Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={fetchCategories} className="ml-4">
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Tree Content */}
      <Card className="p-6 border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-md">
        {loading ? (
          // Tree Loading Skeletons
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="ml-6 pl-4 border-l border-slate-200 dark:border-slate-800 space-y-3">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        ) : categories.length === 0 ? (
          // Empty State
          <div className="py-16 text-center">
            <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <FolderTree className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">No categories found</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Begin structuring the prompt catalog by creating your first top-level category.
                </p>
              </div>
              <Button size="sm" onClick={() => openCreateModal(null)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Top-Level Category
              </Button>
            </div>
          </div>
        ) : (
          renderTree(null, 0)
        )}
      </Card>

      {/* MODAL 1: CREATE CATEGORY */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {formData.parent_id ? 'Add New Subcategory' : 'Add Top-Level Category'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Categories group templates and pass down tool recommendations and extra prompt words.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat_name">Category Name *</Label>
              <Input
                id="cat_name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Photography, Logo Design"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat_desc">Description</Label>
              <Textarea
                id="cat_desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Explains what kind of creative tasks this category solves..."
                rows={2}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat_extra">
                Extra Prompt Words (Appended automatically to templates)
              </Label>
              <Input
                id="cat_extra"
                value={formData.extra_prompt_words}
                onChange={(e) => setFormData({ ...formData, extra_prompt_words: e.target.value })}
                placeholder="e.g. 8k, cinematic, studio lighting"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCreateOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                Create Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: EDIT CATEGORY */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category: {activeCat?.name}</DialogTitle>
            <DialogDescription className="text-xs">
              Modifications immediately update public navigation and search facets.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="edit_cat_name">Category Name *</Label>
              <Input
                id="edit_cat_name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_cat_desc">Description</Label>
              <Textarea
                id="edit_cat_desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit_cat_extra">Extra Prompt Words Appended</Label>
              <Input
                id="edit_cat_extra"
                value={formData.extra_prompt_words}
                onChange={(e) => setFormData({ ...formData, extra_prompt_words: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="is_visible"
                checked={formData.is_visible}
                onCheckedChange={(checked) => setFormData({ ...formData, is_visible: !!checked })}
              />
              <Label htmlFor="is_visible" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                Visible to users in public catalog
              </Label>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: MOVE CATEGORY BRANCH */}
      <Dialog open={isMoveOpen} onOpenChange={setIsMoveOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Relocate Branch: {activeCat?.name}</DialogTitle>
            <DialogDescription className="text-xs">
              Move this category and its entire subtree to a new parent node. Cycle detection prevents moving under a descendant (Rule 13).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleMoveSubmit} className="space-y-4 text-xs mt-2">
            <div className="space-y-1.5">
              <Label>Select New Parent</Label>
              <Select value={moveParentId} onValueChange={setMoveParentId}>
                <SelectTrigger className="w-full text-xs">
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="root">Top Level (No Parent)</SelectItem>
                  {categories
                    .filter((c) => c.category_id !== activeCat?.category_id)
                    .map((c) => (
                      <SelectItem key={c.category_id} value={c.category_id}>
                        {c.path} — {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsMoveOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                Confirm Move
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: DELETE / HIDE CONFIRMATION */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Remove Category: {activeCat?.name}
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed pt-1">
              This node contains{' '}
              <strong className="text-slate-900 dark:text-white">
                {deleteCounts.subcategories} subcategories
              </strong>{' '}
              and <strong className="text-slate-900 dark:text-white">{deleteCounts.templates} templates</strong>.
              Removing it immediately impacts public catalog browsing.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs leading-relaxed my-2">
            <strong>Recommended action:</strong> Hide it instead. Hiding cascades down the subtree so users cannot
            see it, but no template data or prompt history is destroyed.
          </div>

          <DialogFooter className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => handleDeleteSubmit(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
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
