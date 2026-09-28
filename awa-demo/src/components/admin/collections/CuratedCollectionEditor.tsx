'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookmarkCheck,
  Sparkles,
  ArrowLeft,
  Save,
  Plus,
  Search,
  ArrowUp,
  ArrowDown,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sun,
  Moon,
  Check,
  ChevronRight,
  Layers,
  HelpCircle,
  FolderLock,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CuratedCollection, Template, Category } from '@/lib/server/types';

interface CuratedCollectionEditorProps {
  initialData?: CuratedCollection;
  isEdit?: boolean;
}

export default function CuratedCollectionEditor({
  initialData,
  isEdit = false,
}: CuratedCollectionEditorProps) {
  const router = useRouter();

  // Form State
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(Boolean(initialData?.slug));
  const [description, setDescription] = useState(initialData?.description || '');
  const [isActive, setIsActive] = useState<boolean>(initialData?.is_active ?? true);
  const [position, setPosition] = useState<number>(initialData?.position ?? 1);
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>(
    initialData?.template_ids || []
  );

  // Catalog Data
  const [allTemplates, setAllTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Template Browser Filters
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Preview Settings
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');

  // Submission & Validation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Show toast notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Helper to generate slug from name
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Auto-generate slug when name changes if not manually edited
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(val));
    }
    if (errors.name) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.name;
        return copy;
      });
    }
  };

  const handleSlugChange = (val: string) => {
    setIsSlugManuallyEdited(true);
    setSlug(generateSlug(val));
    if (errors.slug) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.slug;
        return copy;
      });
    }
  };

  // Load templates and categories from admin APIs
  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoadingData(true);
        const [templatesRes, categoriesRes] = await Promise.all([
          fetch('/api/v1/admin/templates'),
          fetch('/api/v1/admin/categories'),
        ]);

        if (templatesRes.ok) {
          const tData = await templatesRes.json();
          setAllTemplates(tData.templates || []);
        }

        if (categoriesRes.ok) {
          const cData = await categoriesRes.json();
          setCategories(cData.categories || []);
        }
      } catch (err) {
        console.error('Failed to load catalog data:', err);
      } finally {
        setLoadingData(false);
      }
    }

    loadCatalog();
  }, []);

  // Category map for quick lookup
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => {
      map.set(c.category_id, c.name);
    });
    return map;
  }, [categories]);

  // Map of template by ID
  const templateMap = useMemo(() => {
    const map = new Map<string, Template>();
    allTemplates.forEach((t) => {
      map.set(t.template_id, t);
    });
    return map;
  }, [allTemplates]);

  // Selected templates in full objects
  const selectedTemplates = useMemo(() => {
    return selectedTemplateIds
      .map((id) => templateMap.get(id))
      .filter((t): t is Template => Boolean(t));
  }, [selectedTemplateIds, templateMap]);

  // Filtered catalog templates for the browser
  const filteredCatalogTemplates = useMemo(() => {
    return allTemplates.filter((t) => {
      // Category filter
      if (selectedCategoryFilter !== 'all' && t.category_id !== selectedCategoryFilter) {
        return false;
      }
      // Search filter
      if (catalogSearch.trim()) {
        const q = catalogSearch.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesDesc = (t.description || '').toLowerCase().includes(q);
        const catName = (categoryMap.get(t.category_id) || '').toLowerCase();
        const matchesCat = catName.includes(q);
        const matchesTags = (t.tags || []).some((tag) => tag.toLowerCase().includes(q));
        return matchesName || matchesDesc || matchesCat || matchesTags;
      }
      return true;
    });
  }, [allTemplates, selectedCategoryFilter, catalogSearch, categoryMap]);

  // Template Selection Actions (Prevent Duplicates!)
  const handleAddTemplate = (templateId: string) => {
    if (selectedTemplateIds.includes(templateId)) {
      showNotification('error', 'This template is already added to the collection.');
      return;
    }
    setSelectedTemplateIds((prev) => [...prev, templateId]);
    if (errors.templates) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.templates;
        return copy;
      });
    }
  };

  const handleRemoveTemplate = (templateId: string) => {
    setSelectedTemplateIds((prev) => prev.filter((id) => id !== templateId));
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setSelectedTemplateIds((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= selectedTemplateIds.length - 1) return;
    setSelectedTemplateIds((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  // Form Validation
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3) {
      errs.name = 'Collection name is required (minimum 3 characters).';
    }
    if (!slug.trim()) {
      errs.slug = 'Slug identifier is required.';
    }
    if (selectedTemplateIds.length === 0) {
      errs.templates = 'At least one template must be added to the collection.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showNotification('error', 'Please resolve the highlighted validation errors before saving.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Deduplicate selected templates (strictly guarantee no duplicates)
      const uniqueTemplateIds = Array.from(new Set(selectedTemplateIds));

      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        is_active: isActive,
        position: Number(position) || 1,
        template_ids: uniqueTemplateIds,
      };

      const url = isEdit
        ? `/api/v1/admin/collections/curated/${initialData?.collection_id}`
        : '/api/v1/admin/collections/curated';

      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to ${isEdit ? 'update' : 'create'} collection`);
      }

      showNotification(
        'success',
        `Collection "${name}" has been ${isEdit ? 'updated' : 'created'} successfully!`
      );

      // Redirect after brief delay
      setTimeout(() => {
        router.push('/admin/collections');
      }, 1000);
    } catch (err: unknown) {
      showNotification('error', (err as Error).message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between shadow-lg border transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-semibold underline ml-4 hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/admin/collections" className="hover:underline">
              Collections
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 dark:text-slate-200 font-medium">
              {isEdit ? `Edit: ${initialData?.name || 'Collection'}` : 'New Collection'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            {isEdit ? 'Edit Curated Collection' : 'Create Curated Collection'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Curate template recommendations for user discovery, configure ordering, and preview
            the recommendation section.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/collections">
            <Button
              variant="outline"
              className="rounded-xl border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancel
            </Button>
          </Link>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/20 rounded-xl gap-2 min-w-[140px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEdit ? 'Save Changes' : 'Publish Collection'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Grid: Form Details & Selected Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Collection Information & Configuration (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-[#0c162e]/70 backdrop-blur-md rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Collection Details
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Define the title, recommendation slug, and description shown to members.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Collection Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>
                    Collection Name <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{name.length}/60</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Cinematic Video Masters, SaaS Launch Kit"
                  maxLength={60}
                  className={`rounded-xl ${
                    errors.name
                      ? 'border-rose-500 focus-visible:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Slug Identifier */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>
                    URL Slug <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Unique identifier</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono select-none">
                    col/
                  </span>
                  <Input
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="cinematic-video-masters"
                    className={`pl-11 font-mono text-xs rounded-xl ${
                      errors.slug
                        ? 'border-rose-500 focus-visible:ring-rose-500'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                </div>
                {errors.slug && (
                  <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.slug}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Recommendation Description
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain why this curated collection is recommended and how creators can use these templates together..."
                  rows={3}
                  className="rounded-xl border-slate-200 dark:border-slate-800 text-xs"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Displayed below the collection title on recommendation blocks.
                </p>
              </div>

              {/* Display Order */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Display Order Priority
                </label>
                <Input
                  type="number"
                  min={1}
                  max={999}
                  value={position}
                  onChange={(e) => setPosition(parseInt(e.target.value, 10) || 1)}
                  className="rounded-xl border-slate-200 dark:border-slate-800 text-xs w-28 font-mono"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Lower numbers (e.g. 1) are featured topmost on the user recommendations page.
                </p>
              </div>

              {/* Active / Inactive Status Switch */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Recommendation Status
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsActive(true)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-300" />
                    Active (Live)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsActive(false)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                      !isActive
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-300" />
                    Inactive (Draft)
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isActive
                    ? 'Active: This collection will be featured on the recommendations feed.'
                    : 'Inactive: Excluded from user recommendations without deleting its templates or history.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Ordered Templates & Live Reordering (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-[#0c162e]/70 backdrop-blur-md rounded-2xl">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Collection Templates & Ordering ({selectedTemplates.length})
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Arrange the template display order using the Up and Down arrows.
                </CardDescription>
              </div>
              {selectedTemplateIds.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTemplateIds([])}
                  className="text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 h-7 px-2"
                >
                  Clear All
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {errors.templates && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errors.templates}
                </div>
              )}

              {selectedTemplates.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center flex flex-col items-center justify-center p-6 text-slate-500 dark:text-slate-400">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 flex items-center justify-center mb-3">
                    <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    No templates added yet
                  </h4>
                  <p className="text-xs max-w-sm mt-1">
                    Select templates from the catalog browser below to add them to this curated
                    collection. Duplicate templates are automatically prevented.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {selectedTemplates.map((template, index) => {
                    const isFirst = index === 0;
                    const isLast = index === selectedTemplates.length - 1;
                    const catName = categoryMap.get(template.category_id) || 'General';

                    return (
                      <div
                        key={template.template_id}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 hover:border-blue-500/40 transition-all group"
                      >
                        {/* Position Badge & Thumbnail & Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900/40">
                            {index + 1}
                          </span>

                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-800">
                            <Image
                              src={template.preview_image || '/images/templates/tpl_1_wide.jpg'}
                              alt={template.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                              {template.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                {catName}
                              </span>
                              <span className="text-[10px] text-slate-400">•</span>
                              <Badge
                                variant="outline"
                                className="text-[9px] px-1 py-0 h-4 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-normal"
                              >
                                {template.difficulty || 'beginner'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Order & Remove Actions */}
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={isFirst}
                            onClick={() => handleMoveUp(index)}
                            className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            disabled={isLast}
                            onClick={() => handleMoveDown(index)}
                            className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveTemplate(template.template_id)}
                            className="h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Remove from Collection"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Template Catalog Browser */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-[#0c162e]/70 backdrop-blur-md rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Browse & Add Templates from Catalog
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Search published catalog templates. Clicking &ldquo;Add to Collection&rdquo; prevents duplicate
                additions.
              </CardDescription>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <Input
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Search templates by name, tag..."
                className="pl-9 text-xs rounded-xl border-slate-200 dark:border-slate-800"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1">
            <button
              type="button"
              onClick={() => setSelectedCategoryFilter('all')}
              className={`text-xs px-3 py-1 rounded-lg font-medium transition-all shrink-0 ${
                selectedCategoryFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Categories ({allTemplates.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.category_id}
                type="button"
                onClick={() => setSelectedCategoryFilter(cat.category_id)}
                className={`text-xs px-3 py-1 rounded-lg font-medium transition-all shrink-0 ${
                  selectedCategoryFilter === cat.category_id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {loadingData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800"
                />
              ))}
            </div>
          ) : filteredCatalogTemplates.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No templates match your search criteria</p>
              <p className="text-xs mt-1">Try clearing the search query or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredCatalogTemplates.map((template) => {
                const isSelected = selectedTemplateIds.includes(template.template_id);
                const catName = categoryMap.get(template.category_id) || 'General';

                return (
                  <div
                    key={template.template_id}
                    className={`relative rounded-xl border transition-all flex flex-col justify-between overflow-hidden ${
                      isSelected
                        ? 'border-blue-500/50 bg-blue-50/30 dark:bg-blue-950/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-32 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <Image
                        src={template.preview_image || '/images/templates/tpl_1_wide.jpg'}
                        alt={template.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 flex gap-1">
                        <Badge
                          variant="secondary"
                          className="bg-black/60 backdrop-blur-md text-white text-[10px] px-1.5 py-0 border-0"
                        >
                          {catName}
                        </Badge>
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1 shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                          {template.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                          {template.description || 'No description provided.'}
                        </p>
                      </div>

                      {/* Action Button: Prevent Duplicates */}
                      <div className="pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 capitalize font-mono">
                          {template.difficulty || 'beginner'}
                        </span>
                        {isSelected ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="h-7 text-xs px-2.5 rounded-lg border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 cursor-default"
                          >
                            <Check className="w-3 h-3 mr-1 text-blue-600 dark:text-blue-400" />
                            Added
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleAddTemplate(template.template_id)}
                            className="h-7 text-xs px-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* LIVE RECOMMENDATION PREVIEW (Dual-Theme: Light & Dark)                     */}
      {/* ========================================================================= */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-md bg-white dark:bg-[#0c162e]/70 backdrop-blur-md rounded-2xl overflow-hidden">
        <CardHeader className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 pb-3 flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                Live Recommendation Preview
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real-time demonstration of how this curated collection appears on the user discovery
              recommendations section.
            </CardDescription>
          </div>

          {/* Theme Preview Switcher */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
            <button
              type="button"
              onClick={() => setPreviewTheme('light')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                previewTheme === 'light'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              Light
            </button>
            <button
              type="button"
              onClick={() => setPreviewTheme('dark')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                previewTheme === 'dark'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              Dark
            </button>
          </div>
        </CardHeader>

        {/* Mockup Canvas */}
        <CardContent
          className={`p-6 transition-colors ${
            previewTheme === 'dark'
              ? 'bg-[#0A0E1A] text-white'
              : 'bg-slate-50 text-slate-900'
          }`}
        >
          {/* Mock recommendation section container */}
          <div className="space-y-5 max-w-5xl mx-auto">
            {/* Status indicator bar in preview */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono tracking-wide uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Featured Recommendation
                </span>
                <span className="text-xs text-slate-400">Position #{position}</span>
              </div>

              {isActive ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live in Recommendations
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Inactive (Hidden from users)
                </div>
              )}
            </div>

            {/* Collection Title & Description */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                {name || 'Untitled Recommendation Collection'}
              </h3>
              <p
                className={`text-xs sm:text-sm mt-1 max-w-2xl ${
                  previewTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {description ||
                  'Curated prompt engineering templates designed to accelerate your creative workflow.'}
              </p>
            </div>

            {/* Template Card Carousel / Grid in Exact Order */}
            {selectedTemplates.length === 0 ? (
              <div
                className={`py-12 border-2 border-dashed rounded-2xl text-center p-6 ${
                  previewTheme === 'dark'
                    ? 'border-slate-800 text-slate-400'
                    : 'border-slate-300 text-slate-500'
                }`}
              >
                <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No templates selected for preview</p>
                <p className="text-xs mt-1">
                  Add templates above to preview the recommendation card carousel in real time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
                {selectedTemplates.map((template, idx) => {
                  const catName = categoryMap.get(template.category_id) || 'Curated';
                  return (
                    <div
                      key={template.template_id}
                      className={`group relative rounded-2xl overflow-hidden border transition-all ${
                        previewTheme === 'dark'
                          ? 'bg-[#0f172a] border-slate-800 hover:border-blue-500/50 shadow-md'
                          : 'bg-white border-slate-200 hover:border-blue-500/50 shadow-sm'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="relative h-36 w-full bg-slate-800 overflow-hidden">
                        <Image
                          src={template.preview_image || '/images/templates/tpl_1_wide.jpg'}
                          alt={template.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="text-[10px] font-mono font-bold bg-black/60 text-white px-2 py-0.5 rounded-md backdrop-blur-md">
                            #{idx + 1}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <span className="text-[10px] font-medium text-blue-500 tracking-wider uppercase">
                          {catName}
                        </span>
                        <h4 className="text-xs font-semibold mt-0.5 line-clamp-1">
                          {template.name}
                        </h4>
                        <p
                          className={`text-[11px] line-clamp-2 mt-1 ${
                            previewTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          {template.description}
                        </p>

                        <div className="mt-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400 font-mono capitalize">
                            {template.difficulty || 'beginner'}
                          </span>
                          <span className="text-[11px] font-semibold text-blue-500 flex items-center gap-1 group-hover:underline">
                            View Guide
                            <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
