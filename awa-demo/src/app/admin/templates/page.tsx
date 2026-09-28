'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileCode,
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  History,
  Edit3,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  RefreshCw,
  FolderTree,
  X,
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
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface Template {
  template_id: string;
  category_id: string;
  name: string;
  description: string;
  preview_image?: string;
  status: 'draft' | 'published' | 'hidden' | 'archived';
  current_version_id: string | null;
  position: number;
  is_sample: boolean;
  difficulty?: string;
  tags?: string[];
}

interface Category {
  category_id: string;
  name: string;
  path: string;
}

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Create Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category_id: '',
    preview_image: '/images/templates/tpl_1_wide.jpg',
    difficulty: 'beginner',
    is_sample: false,
    tags: 'studio, photography, ecommerce',
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tRes, cRes] = await Promise.all([
        fetch('/api/v1/admin/templates'),
        fetch('/api/v1/admin/categories'),
      ]);
      if (!tRes.ok || !cRes.ok) throw new Error('Failed to load templates catalog');
      const tData = await tRes.json();
      const cData = await cRes.json();
      setTemplates(tData.templates || []);
      setCategories(cData.categories || []);
      if (cData.categories?.length > 0 && !newTemplate.category_id) {
        setNewTemplate((prev) => ({ ...prev, category_id: cData.categories[0].category_id }));
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with catalog server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplate.name || !newTemplate.category_id) return;

    try {
      const res = await fetch('/api/v1/admin/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTemplate,
          tags: newTemplate.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsCreateOpen(false);
        fetchData();
        // Redirect straight to editor to author prompt
        window.location.href = `/admin/templates/${data.template.template_id}`;
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create template');
      }
    } catch {
      alert('Error creating template');
    }
  };

  const filteredTemplates = templates.filter((t) => {
    if (categoryFilter !== 'all' && t.category_id !== categoryFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesName = t.name.toLowerCase().includes(q);
      const matchesDesc = t.description.toLowerCase().includes(q);
      const matchesTags = t.tags?.some((tag) => tag.toLowerCase().includes(q));
      if (!matchesName && !matchesDesc && !matchesTags) return false;
    }
    return true;
  });

  const getCategoryName = (catId: string) => {
    const c = categories.find((cat) => cat.category_id === catId);
    return c ? c.name : catId;
  };

  const clearFilters = () => {
    setCategoryFilter('all');
    setStatusFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Template Catalog Management</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
              Screen A3
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Author and publish ready-to-run prompt templates across categories. Prompts are guarded in the private database.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Author New Template
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, job, or tag..."
              className="pl-8 text-xs h-9"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="h-6 w-6 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search query"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="w-44">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.category_id} value={c.category_id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-36">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(categoryFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-9 px-2.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className="text-slate-500 dark:text-slate-400 shrink-0 text-xs">
          Showing <strong className="text-slate-900 dark:text-slate-100">{filteredTemplates.length}</strong> of {templates.length} templates
        </div>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Catalog Loading Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={fetchData} className="ml-4">
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Templates Table */}
      <Card className="overflow-hidden border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Preview & Template</TableHead>
              <TableHead className="font-semibold">Category</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
              <TableHead className="font-semibold text-center">Prompt Version</TableHead>
              <TableHead className="font-semibold text-center">Sample Tier</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading State (Section 9: Skeletons matching row structure)
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-16 h-10 rounded-lg shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-64" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-16 mx-auto rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-4 w-12 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-20 mx-auto rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Skeleton className="h-8 w-16 rounded-lg" />
                      <Skeleton className="h-8 w-16 rounded-lg" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredTemplates.length === 0 ? (
              // Empty State (Section 9 & 10: Friendly illustration/message with CTA)
              <TableRow>
                <TableCell colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <FileCode className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                          ? 'No matching templates found'
                          : 'No templates created yet'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                          ? 'Try clearing the search query or changing active category and status filters.'
                          : 'Begin building the creation catalog by authoring your first template.'}
                      </p>
                    </div>
                    {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' ? (
                      <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs">
                        Clear Search & Filters
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => setIsCreateOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                        <Plus className="w-3.5 h-3.5 mr-1.5" /> Author First Template
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Populated State
              filteredTemplates.map((tpl) => (
                <TableRow key={tpl.template_id} className="transition-colors">
                  {/* Preview & Name */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shrink-0 relative">
                        {tpl.preview_image ? (
                          <Image
                            src={tpl.preview_image}
                            alt={tpl.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <FileCode className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/templates/${tpl.template_id}`}
                          className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm line-clamp-1"
                        >
                          {tpl.name}
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-1 max-w-md">
                          {tpl.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      {getCategoryName(tpl.category_id)}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        tpl.status === 'published'
                          ? 'emerald'
                          : tpl.status === 'draft'
                          ? 'amber'
                          : 'secondary'
                      }
                      className="text-[10px] uppercase font-semibold"
                    >
                      {tpl.status}
                    </Badge>
                  </TableCell>

                  {/* Version */}
                  <TableCell className="text-center font-mono">
                    {tpl.current_version_id ? (
                      <span className="text-blue-600 dark:text-blue-400 font-semibold text-xs">Active</span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1 text-[11px] font-medium">
                        <AlertCircle className="w-3 h-3" /> No Prompt
                      </span>
                    )}
                  </TableCell>

                  {/* Free Sample tag */}
                  <TableCell className="text-center">
                    {tpl.is_sample ? (
                      <Badge variant="outline" className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20">
                        Free Sample
                      </Badge>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">Subscriber Only</span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/admin/templates/${tpl.template_id}/versions`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          title="Version History & Diffs"
                        >
                          <History className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          History
                        </Button>
                      </Link>
                      <Link href={`/admin/templates/${tpl.template_id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs bg-blue-50/50 dark:bg-blue-600/10 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30 hover:bg-blue-100 dark:hover:bg-blue-600/20"
                        >
                          <Edit3 className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* CREATE TEMPLATE DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Author New Creation Template</DialogTitle>
            <DialogDescription className="text-xs">
              Creates the template entry. You will author and preview the prompt in the tabbed editor next.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="tpl_name">Template Name *</Label>
              <Input
                id="tpl_name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="e.g. Minimalist Ceramic Cup on White"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tpl_desc">
                Description (What it produces — FEAT-008) *
              </Label>
              <Textarea
                id="tpl_desc"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder="The user chooses from this alone behind the paywall before subscribing..."
                required
                rows={2}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category Node</Label>
                <Select
                  value={newTemplate.category_id}
                  onValueChange={(val) => setNewTemplate({ ...newTemplate, category_id: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.category_id} value={c.category_id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Skill Difficulty</Label>
                <Select
                  value={newTemplate.difficulty}
                  onValueChange={(val) => setNewTemplate({ ...newTemplate, difficulty: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tpl_tags">Tags (Comma-separated)</Label>
              <Input
                id="tpl_tags"
                value={newTemplate.tags}
                onChange={(e) => setNewTemplate({ ...newTemplate, tags: e.target.value })}
                placeholder="studio, product, white background"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="is_sample"
                checked={newTemplate.is_sample}
                onCheckedChange={(checked) => setNewTemplate({ ...newTemplate, is_sample: !!checked })}
              />
              <Label htmlFor="is_sample" className="text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
                Designate as Free Sample (Prompt readable without subscription — 05-MVP §3.3)
              </Label>
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
                Create & Author Prompt →
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
