'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  BookmarkCheck,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  FolderLock,
  User as UserIcon,
  Calendar,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { CuratedCollection, UserCollectionWithDetails } from '@/lib/server/types';

export default function AdminCollectionsPage() {
  const [activeTab, setActiveTab] = useState<'curated' | 'user'>('curated');

  // --- Curated Collections State ---
  const [curatedList, setCuratedList] = useState<CuratedCollection[]>([]);
  const [curatedLoading, setCuratedLoading] = useState(true);
  const [curatedError, setCuratedError] = useState<string | null>(null);
  const [curatedSearch, setCuratedSearch] = useState('');
  const [curatedStatusFilter, setCuratedStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [curatedCounts, setCuratedCounts] = useState({ total: 0, active: 0, inactive: 0, totalTemplates: 0 });

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<CuratedCollection | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Status toggle loading state
  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);

  // --- User Collections State ---
  const [userList, setUserList] = useState<UserCollectionWithDetails[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState('');
  const [userCounts, setUserCounts] = useState({ total: 0, totalUsers: 0, avgTemplates: 0 });

  // Inspect User Collection Sheet
  const [inspectTarget, setInspectTarget] = useState<UserCollectionWithDetails | null>(null);

  // Notification Banner
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Fetch Curated Collections
  const fetchCuratedCollections = useCallback(async () => {
    try {
      setCuratedLoading(true);
      setCuratedError(null);
      const params = new URLSearchParams();
      if (curatedSearch) params.set('search', curatedSearch);
      if (curatedStatusFilter !== 'all') params.set('status', curatedStatusFilter);

      const res = await fetch(`/api/v1/admin/collections/curated?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to load curated collections (${res.status})`);
      }
      const data = await res.json();
      setCuratedList(data.collections || []);
      if (data.counts) {
        setCuratedCounts(data.counts);
      }
    } catch (err: unknown) {
      setCuratedError((err as Error).message || 'Failed to fetch curated collections');
    } finally {
      setCuratedLoading(false);
    }
  }, [curatedSearch, curatedStatusFilter]);

  // Fetch User Collections
  const fetchUserCollections = useCallback(async () => {
    try {
      setUserLoading(true);
      setUserError(null);
      const params = new URLSearchParams();
      if (userSearch) params.set('search', userSearch);

      const res = await fetch(`/api/v1/admin/collections/user?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to load user collections (${res.status})`);
      }
      const data = await res.json();
      setUserList(data.collections || []);
      if (data.counts) {
        setUserCounts(data.counts);
      }
    } catch (err: unknown) {
      setUserError((err as Error).message || 'Failed to fetch user collections');
    } finally {
      setUserLoading(false);
    }
  }, [userSearch]);

  useEffect(() => {
    fetchCuratedCollections();
  }, [fetchCuratedCollections]);

  useEffect(() => {
    if (activeTab === 'user') {
      fetchUserCollections();
    }
  }, [activeTab, fetchUserCollections]);

  // Handle status toggle (Activate / Deactivate)
  const handleToggleStatus = async (col: CuratedCollection) => {
    try {
      setToggleLoadingId(col.collection_id);
      const res = await fetch(`/api/v1/admin/collections/curated/${col.collection_id}/status`, {
        method: 'PATCH',
      });
      if (!res.ok) {
        throw new Error('Failed to update collection status');
      }
      const data = await res.json();
      showNotification(
        'success',
        data.collection.is_active
          ? `"${col.name}" is now Active and featured in recommendations.`
          : `"${col.name}" is now Inactive and removed from recommendations.`
      );
      fetchCuratedCollections();
    } catch (err: unknown) {
      showNotification('error', (err as Error).message || 'Failed to toggle status');
    } finally {
      setToggleLoadingId(null);
    }
  };

  // Handle delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/v1/admin/collections/curated/${deleteTarget.collection_id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete curated collection');
      }
      showNotification('success', `Collection "${deleteTarget.name}" deleted successfully.`);
      setDeleteTarget(null);
      fetchCuratedCollections();
    } catch (err: unknown) {
      showNotification('error', (err as Error).message || 'Failed to delete collection');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/admin" className="hover:underline">Admin</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 dark:text-slate-200 font-medium">Collections</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <BookmarkCheck className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            Collection Management
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Curate template recommendation collections for user discovery and inspect personal saved collections for customer support.
          </p>
        </div>

        {activeTab === 'curated' && (
          <Link href="/admin/collections/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/20 rounded-xl gap-2">
              <Plus className="w-4 h-4" />
              Create Curated Collection
            </Button>
          </Link>
        )}
      </div>

      {/* Two-Tab Segmented Switcher */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as 'curated' | 'user')}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 max-w-md bg-slate-100 dark:bg-slate-900/80 p-1 border border-slate-200 dark:border-slate-800 rounded-xl">
          <TabsTrigger
            value="curated"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#0c162e] data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm text-xs font-semibold flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Curated (Recommendations)
            <Badge
              variant="outline"
              className="ml-1 text-[10px] px-1.5 py-0 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
            >
              {curatedCounts.total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="user"
            className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-[#0c162e] data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm text-xs font-semibold flex items-center gap-2"
          >
            <FolderLock className="w-3.5 h-3.5" />
            User Collections (Support)
            <Badge
              variant="outline"
              className="ml-1 text-[10px] px-1.5 py-0 bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20"
            >
              {userCounts.total}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* ========================================================================= */}
        {/* TAB 1: CURATED RECOMMENDATION COLLECTIONS                                */}
        {/* ========================================================================= */}
        <TabsContent value="curated" className="space-y-6 mt-4 focus-visible:outline-none">
          {/* Metrics Overview Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <Card className="bg-white/80 dark:bg-[#0c162e]/70 border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Curated</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {curatedCounts.total}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Admin-managed groups</div>
              </CardContent>
            </Card>

            <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40">
              <CardContent className="p-4">
                <div className="text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Recommendations
                </div>
                <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-200 mt-1">
                  {curatedCounts.active}
                </div>
                <div className="text-[11px] text-emerald-600/80 dark:text-emerald-400/70 mt-0.5">Live on user feeds</div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/40">
              <CardContent className="p-4">
                <div className="text-xs font-medium text-amber-700 dark:text-amber-400">Inactive / Paused</div>
                <div className="text-2xl font-bold text-amber-900 dark:text-amber-200 mt-1">
                  {curatedCounts.inactive}
                </div>
                <div className="text-[11px] text-amber-600/80 dark:text-amber-400/70 mt-0.5">Excluded from feeds</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-[#0c162e]/70 border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Featured Templates</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                  {curatedCounts.totalTemplates}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Distinct catalog items</div>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filters Card */}
          <Card className="bg-white dark:bg-[#0c162e]/80 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={curatedSearch}
                  onChange={(e) => setCuratedSearch(e.target.value)}
                  placeholder="Search curated collections by name, slug, or theme..."
                  className="pl-9 h-10 bg-slate-50 dark:bg-[#070a14] border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  Status:
                </span>
                {(['all', 'active', 'inactive'] as const).map((st) => (
                  <Button
                    key={st}
                    variant={curatedStatusFilter === st ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCuratedStatusFilter(st)}
                    className={`h-8 px-3 rounded-lg text-xs capitalize ${
                      curatedStatusFilter === st
                        ? 'bg-blue-600 text-white'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {st}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchCuratedCollections}
                  className="h-8 px-2.5 rounded-lg border-slate-200 dark:border-slate-800 text-slate-500"
                  title="Refresh"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Curated Table */}
          <Card className="bg-white dark:bg-[#0c162e]/80 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                  <TableRow>
                    <TableHead className="w-16 text-center text-xs font-semibold">Order</TableHead>
                    <TableHead className="text-xs font-semibold">Collection Name</TableHead>
                    <TableHead className="text-xs font-semibold">Recommendation Status</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Templates</TableHead>
                    <TableHead className="text-xs font-semibold">Last Updated</TableHead>
                    <TableHead className="text-right text-xs font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {curatedLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-48 mb-1" /><Skeleton className="h-3 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto rounded-lg" /></TableCell>
                      </TableRow>
                    ))
                  ) : curatedError ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-rose-500">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500/80" />
                        <p className="font-semibold">{curatedError}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchCuratedCollections}
                          className="mt-3 text-xs"
                        >
                          Retry
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : curatedList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-16 text-slate-500 dark:text-slate-400">
                        <Layers className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                        <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                          No curated collections found
                        </p>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                          {curatedSearch || curatedStatusFilter !== 'all'
                            ? 'Try clearing your search query or adjusting the status filter.'
                            : 'Create your first recommendation collection to showcase curated templates to users.'}
                        </p>
                        {(!curatedSearch && curatedStatusFilter === 'all') && (
                          <Link href="/admin/collections/new">
                            <Button size="sm" className="mt-4 bg-blue-600 text-white rounded-xl text-xs gap-1.5">
                              <Plus className="w-3.5 h-3.5" />
                              Create Curated Collection
                            </Button>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    curatedList.map((col) => {
                      const isToggling = toggleLoadingId === col.collection_id;
                      return (
                        <TableRow
                          key={col.collection_id}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60 transition-colors"
                        >
                          {/* Order Priority */}
                          <TableCell className="text-center font-mono text-xs font-bold text-slate-400">
                            #{col.position}
                          </TableCell>

                          {/* Name & Description */}
                          <TableCell>
                            <div className="flex items-start gap-3">
                              {col.cover_image && (
                                <img
                                  src={col.cover_image}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800"
                                />
                              )}
                              <div>
                                <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                  {col.name}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-md mt-0.5">
                                  {col.description || 'No description provided.'}
                                </div>
                                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                                  slug: {col.slug}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          {/* Recommendation Status */}
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {col.is_active ? (
                                <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  Active (Recommended)
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                  Inactive (Hidden)
                                </Badge>
                              )}
                            </div>
                          </TableCell>

                          {/* Template Count */}
                          <TableCell className="text-center">
                            <Badge
                              variant="secondary"
                              className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                            >
                              {col.template_ids.length} {col.template_ids.length === 1 ? 'item' : 'items'}
                            </Badge>
                          </TableCell>

                          {/* Last Updated */}
                          <TableCell className="text-xs text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(col.updated_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </div>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Toggle Status Button */}
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isToggling}
                                onClick={() => handleToggleStatus(col)}
                                className={`h-8 px-2.5 rounded-lg text-xs font-medium border ${
                                  col.is_active
                                    ? 'border-amber-200 dark:border-amber-900/40 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                                    : 'border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                                }`}
                                title={col.is_active ? 'Deactivate from recommendations' : 'Activate in recommendations'}
                              >
                                {isToggling ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : col.is_active ? (
                                  'Deactivate'
                                ) : (
                                  'Activate'
                                )}
                              </Button>

                              {/* Edit Button */}
                              <Link href={`/admin/collections/${col.collection_id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 px-2.5 rounded-lg text-xs font-medium border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 gap-1"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  Edit
                                </Button>
                              </Link>

                              {/* Delete Button */}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeleteTarget(col)}
                                className="h-8 w-8 p-0 rounded-lg text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                title="Delete collection"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* ========================================================================= */}
        {/* TAB 2: USER SAVED COLLECTIONS (READ-ONLY SUPPORT VIEW)                   */}
        {/* ========================================================================= */}
        <TabsContent value="user" className="space-y-6 mt-4 focus-visible:outline-none">
          {/* Read-Only Notice Banner */}
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 text-blue-900 dark:text-blue-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-sm block mb-0.5">Read-Only Customer Support & Platform Reporting</span>
              User collections are personal lists saved by individual members. Administrators can inspect them to provide customer assistance, debug template issues, or evaluate platform usage patterns. To maintain member privacy, user collection contents are strictly read-only and no prompt text is exposed.
            </div>
          </div>

          {/* User Collections Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <Card className="bg-white/80 dark:bg-[#0c162e]/70 border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total User Collections</div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {userCounts.total}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Saved across active members</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-[#0c162e]/70 border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Curators (Users)</div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  {userCounts.totalUsers}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Distinct user accounts</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-[#0c162e]/70 border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg Templates / Collection</div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {userCounts.avgTemplates}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Templates saved per list</div>
              </CardContent>
            </Card>
          </div>

          {/* User Collections Search Toolbar */}
          <Card className="bg-white dark:bg-[#0c162e]/80 border-slate-200 dark:border-slate-800 shadow-sm">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Filter by collection name, owner email, or user ID..."
                  className="pl-9 h-10 bg-slate-50 dark:bg-[#070a14] border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchUserCollections}
                className="h-9 px-3 rounded-lg border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh User Data
              </Button>
            </CardContent>
          </Card>

          {/* User Collections Table */}
          <Card className="bg-white dark:bg-[#0c162e]/80 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
                  <TableRow>
                    <TableHead className="text-xs font-semibold">Collection Name</TableHead>
                    <TableHead className="text-xs font-semibold">Owner (Member Account)</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Saved Items</TableHead>
                    <TableHead className="text-xs font-semibold">Created Date</TableHead>
                    <TableHead className="text-xs font-semibold">Last Updated</TableHead>
                    <TableHead className="text-right text-xs font-semibold">Support Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-40 mb-1" /><Skeleton className="h-3 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32 mb-1" /><Skeleton className="h-3 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-12 mx-auto rounded-lg" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto rounded-lg" /></TableCell>
                      </TableRow>
                    ))
                  ) : userError ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-rose-500">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-rose-500/80" />
                        <p className="font-semibold">{userError}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchUserCollections}
                          className="mt-3 text-xs"
                        >
                          Retry
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : userList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-16 text-slate-500 dark:text-slate-400">
                        <FolderLock className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                        <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                          No user collections matched your filter
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Try searching for a different user email or collection keyword.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    userList.map((col) => (
                      <TableRow
                        key={col.collection_id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60"
                      >
                        {/* Name & Note */}
                        <TableCell>
                          <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                            {col.name}
                          </div>
                          {col.description && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                              {col.description}
                            </div>
                          )}
                          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                            ID: {col.collection_id}
                          </span>
                        </TableCell>

                        {/* Owner Account */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 text-xs font-semibold shrink-0">
                              <UserIcon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <div className="text-xs font-medium text-slate-900 dark:text-slate-200">
                                {col.user.display_name || 'Member'}
                              </div>
                              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                                {col.user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Template Count */}
                        <TableCell className="text-center">
                          <Badge
                            variant="secondary"
                            className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold"
                          >
                            {col.template_ids.length} templates
                          </Badge>
                        </TableCell>

                        {/* Created Date */}
                        <TableCell className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(col.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>

                        {/* Updated Date */}
                        <TableCell className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(col.updated_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>

                        {/* Action: Inspect */}
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setInspectTarget(col)}
                            className="h-8 px-3 rounded-lg text-xs font-medium border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Inspect Templates
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION DIALOG (CURATED COLLECTION)                           */}
      {/* ========================================================================= */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="max-w-md bg-white dark:bg-[#0c162e] border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-500" />
              Delete Curated Collection?
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 pt-2">
              Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-white">"{deleteTarget?.name}"</span>?
              <br /><br />
              This will remove the recommendation group. Contained templates ({deleteTarget?.template_ids.length}) and their version history will <span className="font-semibold text-slate-900 dark:text-white">not be deleted</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              disabled={deleteLoading}
              onClick={() => setDeleteTarget(null)}
              className="rounded-xl border-slate-200 dark:border-slate-700 text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteLoading}
              onClick={handleDeleteConfirm}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs gap-1.5"
            >
              {deleteLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* USER COLLECTION INSPECTION SHEET (READ-ONLY SUPPORT MODAL)               */}
      {/* ========================================================================= */}
      <Sheet open={!!inspectTarget} onOpenChange={(open) => { if (!open) setInspectTarget(null); }}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-xl p-0 flex flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d18]"
        >
          {/* Sheet Header */}
          <SheetHeader className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-left">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
              <FolderLock className="w-4 h-4" />
              User Saved Collection (Support Inspection)
            </div>
            <SheetTitle className="text-xl font-bold text-slate-900 dark:text-white">
              {inspectTarget?.name}
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Owned by <span className="font-semibold text-slate-700 dark:text-slate-300">{inspectTarget?.user.email}</span> ({inspectTarget?.user.display_name || 'Member'})
            </SheetDescription>
          </SheetHeader>

          {/* Sheet Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Metadata Card */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Collection ID</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px] select-all">
                  {inspectTarget?.collection_id}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Created</span>
                <span className="text-slate-700 dark:text-slate-300">
                  {inspectTarget?.created_at ? new Date(inspectTarget.created_at).toLocaleString() : '—'}
                </span>
              </div>
            </div>

            {inspectTarget?.description && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-slate-400 block text-[11px] mb-1">Member's Note:</span>
                <p className="text-slate-700 dark:text-slate-300 italic">{inspectTarget.description}</p>
              </div>
            )}

            {/* Contained Templates List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Contained Templates ({inspectTarget?.templates.length || 0})
                </h4>
                <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-300 dark:border-slate-700">
                  Read-Only
                </Badge>
              </div>

              {inspectTarget?.templates.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  This user collection contains no templates.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {inspectTarget?.templates.map((tpl, index) => (
                    <div
                      key={tpl.template_id}
                      className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono font-bold text-slate-400 w-4 text-center">
                          {index + 1}
                        </span>
                        {tpl.preview_image ? (
                          <img
                            src={tpl.preview_image}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-400">
                            <Layers className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                            {tpl.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {tpl.description}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                            >
                              {tpl.mainCategory || 'Image'}
                            </Badge>
                            {tpl.difficulty && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5 py-0 border-slate-200 dark:border-slate-700 text-slate-400 capitalize"
                              >
                                {tpl.difficulty}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/template/${tpl.template_id}`}
                        target="_blank"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-xs flex items-center gap-1 shrink-0 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40"
                        title="View Public Template Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sheet Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInspectTarget(null)}
              className="text-xs rounded-xl"
            >
              Close Inspection
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
