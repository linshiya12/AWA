'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Heart,
  Bookmark,
  BarChart3,
  TrendingUp,
  Search,
  Download,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Eye,
  Layers,
  Sparkles,
  Clock,
  AlertCircle,
  Calendar,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  FolderLock,
  ShieldCheck,
  Info,
  X,
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

import {
  templateEngagementService,
  DateRangeOption,
  SortOption,
  TemplateEngagementItem,
  EngagementSummary,
} from '@/lib/services/templateEngagementService';

const DATE_RANGE_LABELS: Record<DateRangeOption, string> = {
  allTime: 'All Time',
  today: 'Today',
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  '90d': 'Last 90 Days',
  thisYear: 'This Year',
};

const SORT_LABELS: Record<SortOption, string> = {
  likes: 'Most Likes',
  saves: 'Most Saves',
  engagement: 'Highest Engagement',
  recent: 'Recently Updated',
};

export default function AdminTemplateEngagementPage() {
  // --- View State ---
  const [activeTab, setActiveTab] = useState<'liked' | 'saved' | 'all'>('liked');
  const [dateRange, setDateRange] = useState<DateRangeOption>('allTime');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('likes');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // --- Data State ---
  const [summary, setSummary] = useState<EngagementSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [items, setItems] = useState<TemplateEngagementItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableError, setTableError] = useState<string | null>(null);

  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);

  // --- Inspection Drawer State ---
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateEngagementItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // --- Export State ---
  const [isExporting, setIsExporting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Debounce search query (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync tab with sort default
  const handleTabChange = (val: 'liked' | 'saved' | 'all') => {
    setActiveTab(val);
    setCurrentPage(1);
    if (val === 'liked') {
      setSortBy('likes');
    } else if (val === 'saved') {
      setSortBy('saves');
    } else {
      setSortBy('engagement');
    }
  };

  // Load Categories on mount
  useEffect(() => {
    templateEngagementService.getCategories().then(setCategories);
  }, []);

  // Fetch Summary Cards
  const fetchSummary = useCallback(async () => {
    try {
      setSummaryLoading(true);
      const res = await templateEngagementService.getEngagementSummary(dateRange);
      setSummary(res);
    } catch {
      // Graceful fallback
    } finally {
      setSummaryLoading(false);
    }
  }, [dateRange]);

  // Fetch Table Data
  const fetchTableData = useCallback(async () => {
    try {
      setTableLoading(true);
      setTableError(null);

      const res = await templateEngagementService.getTemplateEngagement({
        search: debouncedSearch,
        category: selectedCategory,
        dateRange,
        sortBy,
        page: currentPage,
        pageSize,
      });

      setItems(res.items);
      setTotalItems(res.totalItems);
      setTotalPages(res.totalPages);
    } catch (err: unknown) {
      setTableError(
        (err as Error).message || 'Unable to load template engagement data.'
      );
    } finally {
      setTableLoading(false);
    }
  }, [debouncedSearch, selectedCategory, dateRange, sortBy, currentPage, pageSize]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchTableData();
  }, [fetchTableData]);

  // Handle Export CSV
  const handleExport = async () => {
    try {
      setIsExporting(true);
      const csv = await templateEngagementService.generateExportCsv(
        dateRange,
        selectedCategory === 'all' ? undefined : selectedCategory
      );

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `awa-template-engagement-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showNotification('success', 'Aggregate engagement metrics exported to CSV.');
    } catch {
      showNotification('error', 'Failed to generate export file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Open Template Detail Sheet
  const handleOpenDetail = (item: TemplateEngagementItem) => {
    setSelectedTemplate(item);
    setIsDetailOpen(true);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedCategory('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(searchQuery.trim() || selectedCategory !== 'all');

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. NOTIFICATION BANNER                                                   */}
      {/* ========================================================================= */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl flex items-center justify-between shadow-sm border transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-xs font-semibold underline ml-4 hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PAGE HEADER & DATE FILTER & EXPORT                                    */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/admin/templates" className="hover:underline">
              Templates
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 dark:text-slate-200 font-medium">
              Engagement
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-blue-600 dark:text-blue-400 shrink-0" />
            Template Engagement
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Monitor template likes and saves to understand which templates are most popular with users.
          </p>
        </div>

        {/* Global Controls: Date Range Filter + Export */}
        <div className="flex items-center gap-2.5 self-start md:self-center">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 hidden sm:inline-block" />
            <Select
              value={dateRange}
              onValueChange={(val) => {
                setDateRange(val as DateRangeOption);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[140px] sm:w-[155px] h-9 text-xs">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="allTime">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isExporting || tableLoading}
            className="h-9 px-3 rounded-xl text-xs gap-1.5 font-medium border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Download className="w-3.5 h-3.5" />
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SUMMARY CARDS                                                         */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Likes */}
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c162e]/90 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Likes</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 fill-rose-500/20" />
            </div>
          </div>
          {summaryLoading ? (
            <Skeleton className="h-8 w-24 my-1" />
          ) : (
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {summary?.totalLikes.toLocaleString() ?? 0}
            </div>
          )}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Aggregated {DATE_RANGE_LABELS[dateRange].toLowerCase()}
          </p>
        </Card>

        {/* Card 2: Total Saves */}
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c162e]/90 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Saves</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Bookmark className="w-3.5 h-3.5 fill-amber-500/20" />
            </div>
          </div>
          {summaryLoading ? (
            <Skeleton className="h-8 w-24 my-1" />
          ) : (
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {summary?.totalSaves.toLocaleString() ?? 0}
            </div>
          )}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Bookmarked {DATE_RANGE_LABELS[dateRange].toLowerCase()}
          </p>
        </Card>

        {/* Card 3: Templates Liked */}
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c162e]/90 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Liked Templates</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          {summaryLoading ? (
            <Skeleton className="h-8 w-16 my-1" />
          ) : (
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {summary?.likedTemplatesCount ?? 0}
            </div>
          )}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            With &gt; 0 likes recorded
          </p>
        </Card>

        {/* Card 4: Templates Saved */}
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c162e]/90 shadow-sm p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Saved Templates</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          {summaryLoading ? (
            <Skeleton className="h-8 w-16 my-1" />
          ) : (
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {summary?.savedTemplatesCount ?? 0}
            </div>
          )}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            With &gt; 0 saves recorded
          </p>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 4. MAIN TABS: MOST LIKED / MOST SAVED / ALL ENGAGEMENT                   */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Tabs
            value={activeTab}
            onValueChange={(val) => handleTabChange(val as 'liked' | 'saved' | 'all')}
            className="w-full sm:w-auto"
          >
            <TabsList className="bg-slate-100 dark:bg-slate-900/80 p-1 border border-slate-200 dark:border-slate-800 rounded-xl">
              <TabsTrigger
                value="liked"
                className="rounded-lg text-xs font-semibold px-3 py-1.5 gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-[#0c162e] data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-xs"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Most Liked
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="rounded-lg text-xs font-semibold px-3 py-1.5 gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-[#0c162e] data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-xs"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                Most Saved
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="rounded-lg text-xs font-semibold px-3 py-1.5 gap-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-[#0c162e] data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-xs"
              >
                <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                All Engagement
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <p className="text-xs text-slate-500 dark:text-slate-400 hidden lg:block">
            {activeTab === 'liked' && 'Templates with the highest number of user likes.'}
            {activeTab === 'saved' && 'Templates with the highest number of user saves.'}
            {activeTab === 'all' && 'Combined template engagement overview sorted by your preferences.'}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 5. SEARCH & FILTERS BAR                                                  */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input (Debounced) */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search templates or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 h-9 text-xs rounded-xl bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            {/* Category Filter */}
            <div className="w-full sm:w-[170px]">
              <Select
                value={selectedCategory}
                onValueChange={(val) => {
                  setSelectedCategory(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name} ({c.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort Dropdown */}
            <div className="w-full sm:w-[160px]">
              <Select
                value={sortBy}
                onValueChange={(val) => {
                  setSortBy(val as SortOption);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="likes">Most Likes</SelectItem>
                  <SelectItem value="saves">Most Saves</SelectItem>
                  <SelectItem value="engagement">Highest Engagement</SelectItem>
                  <SelectItem value="recent">Recently Updated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 px-2.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                title="Reset filters"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 6. ENGAGEMENT TABLE & MOBILE CARDS                                       */}
        {/* ========================================================================= */}
        <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c162e]/90 shadow-sm overflow-hidden">
          {/* Error State */}
          {tableError && (
            <div className="p-8 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-500 mx-auto flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {tableError}
              </p>
              <Button
                size="sm"
                onClick={fetchTableData}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try Again
              </Button>
            </div>
          )}

          {/* Loading Skeleton */}
          {!tableError && tableLoading && (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-2 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                  <Skeleton className="w-8 h-6" />
                  <Skeleton className="h-6 flex-1" />
                  <Skeleton className="w-24 h-6 hidden sm:block" />
                  <Skeleton className="w-20 h-6" />
                  <Skeleton className="w-20 h-6" />
                  <Skeleton className="w-16 h-8" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!tableError && !tableLoading && items.length === 0 && (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 mx-auto flex items-center justify-center">
                <Filter className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  {hasActiveFilters ? 'No Templates Found' : 'No Engagement Data'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  {hasActiveFilters
                    ? 'No templates match your current search or category filter.'
                    : 'Template engagement data will appear here when users start liking or saving templates.'}
                </p>
              </div>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="rounded-xl text-xs"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Table Data (Desktop View) */}
          {!tableError && !tableLoading && items.length > 0 && (
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-14 text-center">Rank</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">
                      <span className="flex items-center justify-end gap-1">
                        <Heart className="w-3 h-3 text-rose-500" />
                        Likes
                      </span>
                    </TableHead>
                    <TableHead className="text-right">
                      <span className="flex items-center justify-end gap-1">
                        <Bookmark className="w-3 h-3 text-amber-500" />
                        Saves
                      </span>
                    </TableHead>
                    <TableHead className="text-right">
                      <span className="flex items-center justify-end gap-1">
                        <BarChart3 className="w-3 h-3 text-indigo-500" />
                        Total
                      </span>
                    </TableHead>
                    <TableHead className="w-28 text-right">Last Updated</TableHead>
                    <TableHead className="w-24 text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => {
                    const rank = (currentPage - 1) * pageSize + index + 1;
                    const rankFormatted = rank < 10 ? `0${rank}` : `${rank}`;

                    return (
                      <TableRow
                        key={item.templateId}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 cursor-pointer transition-colors"
                        onClick={() => handleOpenDetail(item)}
                      >
                        {/* Rank */}
                        <TableCell className="font-mono text-center text-xs font-semibold text-slate-400">
                          {rankFormatted}
                        </TableCell>

                        {/* Template Name & Badges */}
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                              {item.templateName}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                              <span className="font-mono">{item.templateId}</span>
                              {item.collections.length > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="text-blue-600 dark:text-blue-400">
                                    {item.collections.length} collection{item.collections.length > 1 ? 's' : ''}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Category */}
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-[11px] font-medium border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                          >
                            {item.category}
                          </Badge>
                        </TableCell>

                        {/* Likes */}
                        <TableCell className="text-right font-medium text-slate-900 dark:text-slate-100 text-xs">
                          {item.likes.toLocaleString()}
                        </TableCell>

                        {/* Saves */}
                        <TableCell className="text-right font-medium text-slate-900 dark:text-slate-100 text-xs">
                          {item.saves.toLocaleString()}
                        </TableCell>

                        {/* Total Engagement */}
                        <TableCell className="text-right font-semibold text-blue-600 dark:text-blue-400 text-xs">
                          {item.totalEngagement.toLocaleString()}
                        </TableCell>

                        {/* Last Updated */}
                        <TableCell className="text-right text-[11px] text-slate-500 dark:text-slate-400">
                          {new Date(item.updatedAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </TableCell>

                        {/* Action */}
                        <TableCell
                          className="text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDetail(item)}
                            className="h-8 px-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Mobile Card List (< sm screens) */}
          {!tableError && !tableLoading && items.length > 0 && (
            <div className="block sm:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
              {items.map((item, index) => {
                const rank = (currentPage - 1) * pageSize + index + 1;
                const rankFormatted = rank < 10 ? `0${rank}` : `${rank}`;

                return (
                  <div
                    key={item.templateId}
                    className="p-4 space-y-2.5 active:bg-slate-50 dark:active:bg-slate-900/50"
                    onClick={() => handleOpenDetail(item)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-semibold text-slate-400">
                            #{rankFormatted}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                          >
                            {item.category}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                          {item.templateName}
                        </h4>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/60 text-center">
                      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-1.5">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                          <Heart className="w-3 h-3 text-rose-500" /> Likes
                        </div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">
                          {item.likes.toLocaleString()}
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-1.5">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                          <Bookmark className="w-3 h-3 text-amber-500" /> Saves
                        </div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white mt-0.5">
                          {item.saves.toLocaleString()}
                        </div>
                      </div>

                      <div className="bg-blue-50/50 dark:bg-blue-950/30 rounded-lg p-1.5">
                        <div className="text-[10px] text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1">
                          <BarChart3 className="w-3 h-3" /> Total
                        </div>
                        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                          {item.totalEngagement.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. PAGINATION BAR                                                        */}
          {/* ========================================================================= */}
          {!tableError && !tableLoading && totalItems > 0 && (
            <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
              <div>
                Showing{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {Math.min(currentPage * pageSize, totalItems)}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {totalItems}
                </span>{' '}
                templates
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="h-8 px-2.5 rounded-lg text-xs"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                    // Show compact page numbers
                    if (
                      pg === 1 ||
                      pg === totalPages ||
                      Math.abs(pg - currentPage) <= 1
                    ) {
                      return (
                        <Button
                          key={pg}
                          variant={currentPage === pg ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pg)}
                          className={`h-8 w-8 p-0 rounded-lg text-xs font-semibold ${
                            currentPage === pg
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {pg}
                        </Button>
                      );
                    } else if (
                      pg === 2 && currentPage > 3 ||
                      pg === totalPages - 1 && currentPage < totalPages - 2
                    ) {
                      return (
                        <span key={pg} className="px-1 text-slate-400 text-xs">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="h-8 px-2.5 rounded-lg text-xs"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 8. ENGAGEMENT OVER TIME / HISTORICAL TREND CARD (REQ 14)                  */}
      {/* ========================================================================= */}
      <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c162e]/90 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Engagement Over Time
            </h3>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] font-mono border-slate-200 dark:border-slate-800 text-slate-500"
          >
            Analytics Pipeline
          </Badge>
        </div>
        <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-center space-y-1.5">
          <Clock className="w-6 h-6 text-slate-400 mx-auto mb-1" />
          <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Engagement trends will appear once historical analytics data is available.
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Time-series trend lines for likes and saves will activate once continuous event logging is linked to the analytics service.
          </p>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* 9. TEMPLATE DETAIL SHEET (INSPECTION DRAWER)                              */}
      {/* ========================================================================= */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md p-0 flex flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d18]"
        >
          {selectedTemplate && (
            <>
              {/* Sheet Header */}
              <SheetHeader className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-left space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-semibold uppercase px-1.5 py-0.5 border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  >
                    {selectedTemplate.mainCategory}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0.5 border-slate-200 dark:border-slate-800 text-slate-500"
                  >
                    {selectedTemplate.status}
                  </Badge>
                </div>
                <SheetTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedTemplate.templateName}
                </SheetTitle>
                <SheetDescription className="text-xs font-mono text-slate-500">
                  ID: {selectedTemplate.templateId}
                </SheetDescription>
              </SheetHeader>

              {/* Sheet Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Engagement Breakdown Metrics */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Engagement Breakdown ({DATE_RANGE_LABELS[dateRange]})
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Likes */}
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        Likes
                      </div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">
                        {selectedTemplate.likes.toLocaleString()}
                      </div>
                    </div>

                    {/* Saves */}
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
                        <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                        Saves
                      </div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">
                        {selectedTemplate.saves.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Total & Ratio Cards */}
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="p-3.5 rounded-xl border border-blue-200/80 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20">
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                        Total Engagement
                      </div>
                      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {selectedTemplate.totalEngagement.toLocaleString()}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60">
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                        Like / Save Ratio
                      </div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">
                        {selectedTemplate.likeSaveRatio !== null
                          ? `${selectedTemplate.likeSaveRatio}x`
                          : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Metadata & Timestamps */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Template Attributes
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="text-slate-500">Category</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {selectedTemplate.category}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="text-slate-500">Format</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {selectedTemplate.mainCategory}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                      <span className="text-slate-500">First Published</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        {new Date(selectedTemplate.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Last Updated</span>
                      <span className="font-mono text-slate-700 dark:text-slate-300">
                        {new Date(selectedTemplate.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Associated Collections (Read-Only Context) */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <FolderLock className="w-3.5 h-3.5 text-slate-500" />
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Featured in Collections (Read-Only)
                    </h4>
                  </div>
                  {selectedTemplate.collections.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTemplate.collections.map((colName) => (
                        <Badge
                          key={colName}
                          variant="outline"
                          className="text-[11px] py-1 px-2.5 bg-slate-100/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          {colName}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      This template is not currently attached to any curated collections.
                    </p>
                  )}
                </div>

                <Separator />

                {/* Privacy Assurance Card */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white font-medium">
                      Privacy Protected:
                    </strong>{' '}
                    Metrics reflect aggregate user interactions. User identities, personal bookmarks, and prompt details are strictly protected.
                  </div>
                </div>
              </div>

              {/* Sheet Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDetailOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Close
                </Button>
                <Link href={`/admin/templates/${selectedTemplate.templateId}`}>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs gap-1.5"
                  >
                    Open in Template Editor
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
