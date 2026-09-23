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
  Sparkles,
  ExternalLink,
  RefreshCw,
  FolderTree,
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
    try {
      const [tRes, cRes] = await Promise.all([
        fetch('/api/v1/admin/templates'),
        fetch('/api/v1/admin/categories'),
      ]);
      const tData = await tRes.json();
      const cData = await cRes.json();
      setTemplates(tData.templates || []);
      setCategories(cData.categories || []);
      if (cData.categories?.length > 0 && !newTemplate.category_id) {
        setNewTemplate((prev) => ({ ...prev, category_id: cData.categories[0].category_id }));
      }
    } catch (err) {
      console.error(err);
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Template Catalog Management</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
              Screen A3
            </Badge>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Author and publish ready-to-run prompt templates across categories. Prompts are guarded in the private database.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Author New Template
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, job, or tag..."
              className="pl-8 bg-slate-900 border-slate-700 text-xs h-9 text-slate-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-300 text-xs h-9"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-300 text-xs h-9"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>

        <div className="text-slate-400 shrink-0">
          Showing <strong>{filteredTemplates.length}</strong> of {templates.length} templates
        </div>
      </div>

      {/* Templates Table / Grid */}
      <div className="rounded-2xl border border-slate-800 bg-[#080d1a] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Preview & Template</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-center">Prompt Version</th>
                <th className="py-3 px-4 font-semibold text-center">Sample Tier</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-4 h-4 animate-spin inline-block mr-2 text-blue-500" />
                    Loading catalog templates...
                  </td>
                </tr>
              ) : filteredTemplates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No templates match active search and filters.
                  </td>
                </tr>
              ) : (
                filteredTemplates.map((tpl) => (
                  <tr key={tpl.template_id} className="hover:bg-slate-800/20 transition-colors">
                    {/* Preview & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 shrink-0 relative">
                          {tpl.preview_image ? (
                            <Image
                              src={tpl.preview_image}
                              alt={tpl.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <FileCode className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/admin/templates/${tpl.template_id}`}
                            className="font-semibold text-slate-200 hover:text-blue-400 transition-colors text-sm line-clamp-1"
                          >
                            {tpl.name}
                          </Link>
                          <p className="text-slate-400 text-[11px] line-clamp-1 max-w-md">
                            {tpl.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800/80 text-[11px] font-medium border border-slate-700/60">
                        {getCategoryName(tpl.category_id)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <Badge
                        variant={
                          tpl.status === 'published'
                            ? 'default'
                            : tpl.status === 'draft'
                            ? 'secondary'
                            : 'outline'
                        }
                        className={`text-[10px] uppercase font-semibold ${
                          tpl.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : tpl.status === 'draft'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {tpl.status}
                      </Badge>
                    </td>

                    {/* Version */}
                    <td className="py-3.5 px-4 text-center font-mono">
                      {tpl.current_version_id ? (
                        <span className="text-blue-400 font-medium">Active</span>
                      ) : (
                        <span className="text-amber-400 flex items-center justify-center gap-1 text-[11px]">
                          <AlertCircle className="w-3 h-3" /> No Prompt
                        </span>
                      )}
                    </td>

                    {/* Free Sample tag (05-MVP.md §3.3) */}
                    <td className="py-3.5 px-4 text-center">
                      {tpl.is_sample ? (
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold text-[10px] border border-indigo-500/20">
                          Free Sample
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Subscriber Only</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/admin/templates/${tpl.template_id}/versions`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-slate-300 hover:text-white text-xs"
                            title="Version History & Diffs"
                          >
                            <History className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            History
                          </Button>
                        </Link>
                        <Link href={`/admin/templates/${tpl.template_id}`}>
                          <Button
                            size="sm"
                            className="h-8 px-3 bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 text-xs"
                          >
                            <Edit3 className="w-3.5 h-3.5 mr-1" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TEMPLATE DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="border-slate-800 bg-[#0d1222] text-slate-100 max-w-lg">
          <DialogHeader>
            <DialogTitle>Author New Creation Template</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Creates the template entry. You will author and preview the prompt in the tabbed editor next.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs mt-2">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Template Name *</label>
              <Input
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="e.g. Minimalist Ceramic Cup on White"
                required
                className="bg-slate-900 border-slate-700 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Description (What it produces — FEAT-008) *
              </label>
              <textarea
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder="The user chooses from this alone behind the paywall before subscribing..."
                required
                rows={2}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Category Node</label>
                <select
                  value={newTemplate.category_id}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category_id: e.target.value })}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 text-xs"
                >
                  {categories.map((c) => (
                    <option key={c.category_id} value={c.category_id}>
                      {c.name} ({c.path})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Skill Difficulty</label>
                <select
                  value={newTemplate.difficulty}
                  onChange={(e) => setNewTemplate({ ...newTemplate, difficulty: e.target.value })}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 text-xs"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Tags (Comma-separated)</label>
              <Input
                value={newTemplate.tags}
                onChange={(e) => setNewTemplate({ ...newTemplate, tags: e.target.value })}
                placeholder="studio, product, white background"
                className="bg-slate-900 border-slate-700 text-slate-100 text-xs"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is_sample"
                checked={newTemplate.is_sample}
                onChange={(e) => setNewTemplate({ ...newTemplate, is_sample: e.target.checked })}
                className="rounded border-slate-700 bg-slate-900 text-blue-600"
              />
              <label htmlFor="is_sample" className="text-slate-300 font-medium">
                Designate as Free Sample (Prompt readable without subscription — 05-MVP §3.3)
              </label>
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
                Create & Author Prompt →
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
