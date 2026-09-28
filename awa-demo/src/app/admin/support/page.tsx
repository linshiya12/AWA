'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  LifeBuoy,
  Search,
  Filter,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Image as ImageIcon,
  User as UserIcon,
  Send,
  Lock,
  MessageSquare,
  ShieldCheck,
  FileText,
  ExternalLink,
  X,
  CreditCard,
  UserCheck,
  Sparkles,
  Inbox,
  ArrowUpDown,
  CornerDownRight,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  SupportTicket,
  SupportTicketCategory,
  SupportTicketStatus,
  SupportTicketSummaryCounts,
  SupportTicketMessage,
} from '@/lib/server/types';

const CATEGORY_LABELS: Record<SupportTicketCategory, string> = {
  account: 'Account',
  subscription_or_payment: 'Subscription or Payment',
  credits: 'Credits & Allowance',
  prompt_customization: 'Prompt Customization',
  template_or_guidance: 'Template or Guidance',
  other: 'Other',
};

const STATUS_CONFIG: Record<
  SupportTicketStatus,
  { label: string; color: string; border: string; bg: string }
> = {
  open: {
    label: 'Open',
    color: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
  },
  waiting_for_user: {
    label: 'Waiting for User',
    color: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
  },
  resolved: {
    label: 'Resolved',
    color: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
  },
};

export default function AdminSupportPage() {
  // --- List & Filters State ---
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [counts, setCounts] = useState<SupportTicketSummaryCounts>({
    total: 0,
    open: 0,
    in_progress: 0,
    waiting_for_user: 0,
    resolved: 0,
    unread: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  // Active admin users list for assignment
  const [adminUsers, setAdminUsers] = useState<
    Array<{ user_id: string; name: string; email: string }>
  >([]);

  // --- Inspection Drawer State ---
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ticketDetail, setTicketDetail] = useState<{
    ticket: SupportTicket;
    userProfile: {
      user_id: string;
      email: string;
      display_name: string | null;
      role: string;
      status: string;
      allowance_balance: number;
      created_at: string;
      last_seen_at: string;
    } | null;
    relatedTemplate: {
      template_id: string;
      name: string;
      category: string;
      mainCategory: string;
      preview_image?: string;
    } | null;
  } | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // --- Reply Composer State ---
  const [replyType, setReplyType] = useState<'reply' | 'internal_note'>('reply');
  const [replyContent, setReplyContent] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // --- Status & Assign Change State ---
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingAssign, setUpdatingAssign] = useState(false);

  // Notification Toast
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Tickets List
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (categoryFilter !== 'all') params.set('category', categoryFilter);
      if (dateFilter !== 'all') params.set('dateRange', dateFilter);
      params.set('page', currentPage.toString());
      params.set('pageSize', pageSize.toString());

      const res = await fetch(`/api/v1/admin/support?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load support tickets');

      const data = await res.json();
      setTickets(data.tickets || []);
      setCounts(data.counts);
      setTotalItems(data.totalItems || 0);
      setTotalPages(data.totalPages || 1);
      if (data.adminUsers) setAdminUsers(data.adminUsers);
    } catch (err: unknown) {
      setError((err as Error).message || 'Unable to connect to support database');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, statusFilter, categoryFilter, dateFilter, currentPage, pageSize]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Fetch Single Ticket Detail
  const fetchTicketDetail = async (ticketId: string) => {
    try {
      setLoadingDetail(true);
      const res = await fetch(`/api/v1/admin/support/${ticketId}`);
      if (!res.ok) throw new Error('Failed to load ticket details');
      const data = await res.json();
      setTicketDetail(data);
      // Mark as read in local state
      setTickets((prev) =>
        prev.map((t) => (t.ticket_id === ticketId ? { ...t, is_read_by_admin: true } : t))
      );
    } catch (err: unknown) {
      showNotification('error', (err as Error).message || 'Error loading ticket');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleOpenDrawer = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setDrawerOpen(true);
    fetchTicketDetail(ticketId);
  };

  // Submit Admin Reply or Internal Note
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketId || !replyContent.trim()) return;

    try {
      setIsSendingReply(true);
      const isInternal = replyType === 'internal_note';

      const res = await fetch(`/api/v1/admin/support/${selectedTicketId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent.trim(),
          is_internal_note: isInternal,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit response');
      }

      showNotification(
        'success',
        isInternal ? 'Internal note added to ticket.' : 'Public reply sent to user.'
      );

      setReplyContent('');
      fetchTicketDetail(selectedTicketId);
      fetchTickets();
    } catch (err: unknown) {
      showNotification('error', (err as Error).message || 'Failed to send message');
    } finally {
      setIsSendingReply(false);
    }
  };

  // Change Ticket Status
  const handleUpdateStatus = async (newStatus: SupportTicketStatus) => {
    if (!selectedTicketId) return;

    try {
      setUpdatingStatus(true);
      const res = await fetch(`/api/v1/admin/support/${selectedTicketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update status');
      }

      showNotification('success', `Status updated to ${STATUS_CONFIG[newStatus].label}.`);
      fetchTicketDetail(selectedTicketId);
      fetchTickets();
    } catch (err: unknown) {
      showNotification('error', (err as Error).message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Assign Ticket to Admin
  const handleAssignTicket = async (assigneeId: string) => {
    if (!selectedTicketId) return;

    try {
      setUpdatingAssign(true);
      const res = await fetch(`/api/v1/admin/support/${selectedTicketId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assigned_to_user_id: assigneeId === 'unassigned' ? null : assigneeId,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to assign ticket');
      }

      showNotification('success', 'Ticket assignment updated.');
      fetchTicketDetail(selectedTicketId);
      fetchTickets();
    } catch (err: unknown) {
      showNotification('error', (err as Error).message || 'Failed to assign ticket');
    } finally {
      setUpdatingAssign(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setDateFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
      statusFilter !== 'all' ||
      categoryFilter !== 'all' ||
      dateFilter !== 'all'
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <Link href="/admin" className="hover:underline">
              Admin
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 dark:text-slate-200 font-medium">User Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <LifeBuoy className="w-7 h-7 text-blue-600 dark:text-blue-400 shrink-0" />
            User Support Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Review user-submitted tickets, reply with guidance, add internal notes, and track resolution workflows.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchTickets}
          disabled={loading}
          className="h-9 px-3 rounded-xl text-xs gap-1.5 font-medium border-slate-200 dark:border-slate-800 self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Database
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* 1. STATUS SUMMARY METRIC CARDS                                           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Tickets */}
        <Card
          onClick={() => {
            setStatusFilter('all');
            setCurrentPage(1);
          }}
          className={`rounded-2xl border bg-white dark:bg-[#0c162e]/90 p-4 shadow-xs cursor-pointer transition-all hover:border-slate-300 dark:hover:border-slate-700 ${
            statusFilter === 'all'
              ? 'border-blue-500/50 ring-1 ring-blue-500/20 shadow-sm'
              : 'border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total</span>
            <Inbox className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {counts.total}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {counts.unread > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                {counts.unread} unread
              </span>
            ) : (
              'All tickets'
            )}
          </div>
        </Card>

        {/* Open */}
        <Card
          onClick={() => {
            setStatusFilter('open');
            setCurrentPage(1);
          }}
          className={`rounded-2xl border bg-white dark:bg-[#0c162e]/90 p-4 shadow-xs cursor-pointer transition-all hover:border-blue-300 dark:hover:border-blue-800 ${
            statusFilter === 'open'
              ? 'border-blue-500 ring-1 ring-blue-500/30 shadow-sm'
              : 'border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Open</span>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {counts.open}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting triage</div>
        </Card>

        {/* In Progress */}
        <Card
          onClick={() => {
            setStatusFilter('in_progress');
            setCurrentPage(1);
          }}
          className={`rounded-2xl border bg-white dark:bg-[#0c162e]/90 p-4 shadow-xs cursor-pointer transition-all hover:border-purple-300 dark:hover:border-purple-800 ${
            statusFilter === 'in_progress'
              ? 'border-purple-500 ring-1 ring-purple-500/30 shadow-sm'
              : 'border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {counts.in_progress}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Assigned & active</div>
        </Card>

        {/* Waiting for User */}
        <Card
          onClick={() => {
            setStatusFilter('waiting_for_user');
            setCurrentPage(1);
          }}
          className={`rounded-2xl border bg-white dark:bg-[#0c162e]/90 p-4 shadow-xs cursor-pointer transition-all hover:border-amber-300 dark:hover:border-amber-800 ${
            statusFilter === 'waiting_for_user'
              ? 'border-amber-500 ring-1 ring-amber-500/30 shadow-sm'
              : 'border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Waiting for User</span>
            <AlertCircle className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {counts.waiting_for_user}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting user response</div>
        </Card>

        {/* Resolved */}
        <Card
          onClick={() => {
            setStatusFilter('resolved');
            setCurrentPage(1);
          }}
          className={`rounded-2xl border bg-white dark:bg-[#0c162e]/90 p-4 shadow-xs cursor-pointer transition-all hover:border-emerald-300 dark:hover:border-emerald-800 ${
            statusFilter === 'resolved'
              ? 'border-emerald-500 ring-1 ring-emerald-500/30 shadow-sm'
              : 'border-slate-200/80 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {counts.resolved}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Closed inquiries</div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & FILTER BAR                                                   */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by subject, user name, email, or #ticket..."
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

        {/* Dropdown Filters */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Status Select */}
          <div className="w-full sm:w-[150px]">
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="waiting_for_user">Waiting for User</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Select */}
          <div className="w-full sm:w-[170px]">
            <Select
              value={categoryFilter}
              onValueChange={(val) => {
                setCategoryFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="prompt_customization">Prompt Customization</SelectItem>
                <SelectItem value="template_or_guidance">Template or Guidance</SelectItem>
                <SelectItem value="credits">Credits & Allowance</SelectItem>
                <SelectItem value="subscription_or_payment">Subscription or Payment</SelectItem>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Filter */}
          <div className="w-full sm:w-[130px]">
            <Select
              value={dateFilter}
              onValueChange={(val) => {
                setDateFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-9 px-2 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              title="Reset all filters"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. TICKET TABLE & MOBILE CARDS                                           */}
      {/* ========================================================================= */}
      <Card className="rounded-2xl border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c162e]/90 shadow-sm overflow-hidden">
        {/* Error State */}
        {error && (
          <div className="p-8 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-500 mx-auto flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{error}</p>
            <Button size="sm" onClick={fetchTickets} className="rounded-xl text-xs gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </Button>
          </div>
        )}

        {/* Loading Skeleton */}
        {!error && loading && (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 py-2 border-b border-slate-100 dark:border-slate-800/60 last:border-0"
              >
                <Skeleton className="w-12 h-6" />
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
        {!error && !loading && tickets.length === 0 && (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 mx-auto flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                {hasActiveFilters ? 'No Matching Support Tickets' : 'No Support Tickets Found'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                {hasActiveFilters
                  ? 'No tickets match your active search or filter parameters.'
                  : 'User inquiries and technical questions will appear here once submitted.'}
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

        {/* Desktop Table View */}
        {!error && !loading && tickets.length > 0 && (
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-16 text-center">Ticket</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>User Account</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-right">Last Updated</TableHead>
                  <TableHead className="w-28 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((t) => {
                  const statusInfo = STATUS_CONFIG[t.status] || STATUS_CONFIG.open;
                  const isUnread = !t.is_read_by_admin;

                  return (
                    <TableRow
                      key={t.ticket_id}
                      onClick={() => handleOpenDrawer(t.ticket_id)}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-900/40 cursor-pointer transition-colors ${
                        isUnread ? 'bg-amber-500/[0.04] dark:bg-amber-500/[0.03]' : ''
                      }`}
                    >
                      {/* Ticket Number & Unread dot */}
                      <TableCell className="font-mono text-center text-xs font-semibold text-slate-400">
                        <div className="flex items-center justify-center gap-1.5">
                          {isUnread && (
                            <span
                              className="w-1.5 h-1.5 rounded-full bg-amber-500"
                              title="Unread message"
                            />
                          )}
                          <span>#{t.ticket_number}</span>
                        </div>
                      </TableCell>

                      {/* Subject */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <div
                            className={`text-xs sm:text-sm font-semibold transition-colors ${
                              isUnread
                                ? 'text-slate-900 dark:text-white font-bold'
                                : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {t.subject}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <span>{t.messages.length} message{t.messages.length > 1 ? 's' : ''}</span>
                            {t.related_template_id && (
                              <>
                                <span>•</span>
                                <span className="font-mono text-blue-600 dark:text-blue-400">
                                  {t.related_template_id}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* User Account */}
                      <TableCell>
                        <div className="text-xs">
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {t.user_name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {t.user_email}
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-medium border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300"
                        >
                          {CATEGORY_LABELS[t.category]}
                        </Badge>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
                        >
                          {statusInfo.label}
                        </Badge>
                      </TableCell>

                      {/* Assigned Admin */}
                      <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                        {t.assigned_to_name ? (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                            <UserCheck className="w-3 h-3 text-blue-500" />
                            {t.assigned_to_name}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Unassigned</span>
                        )}
                      </TableCell>

                      {/* Last Updated */}
                      <TableCell className="text-right text-[11px] text-slate-500 dark:text-slate-400">
                        {new Date(t.updated_at).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
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
                          onClick={() => handleOpenDrawer(t.ticket_id)}
                          className="h-8 px-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg"
                        >
                          Inspect &amp; Reply
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Mobile View (< sm screens) */}
        {!error && !loading && tickets.length > 0 && (
          <div className="block sm:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
            {tickets.map((t) => {
              const statusInfo = STATUS_CONFIG[t.status] || STATUS_CONFIG.open;

              return (
                <div
                  key={t.ticket_id}
                  onClick={() => handleOpenDrawer(t.ticket_id)}
                  className="p-4 space-y-2.5 active:bg-slate-50 dark:active:bg-slate-900/50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-semibold text-slate-400">
                          #{t.ticket_number}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[9px] px-1.5 py-0 ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
                        >
                          {statusInfo.label}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1.5 py-0 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                        >
                          {CATEGORY_LABELS[t.category]}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                        {t.subject}
                      </h4>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                    <span>{t.user_name}</span>
                    <span>{new Date(t.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {!error && !loading && totalItems > 0 && (
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
              tickets
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

      {/* ========================================================================= */}
      {/* 4. TICKET INSPECTION & REPLY DRAWER (SHADCN SHEET)                       */}
      {/* ========================================================================= */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-2xl p-0 flex flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d18]"
        >
          {loadingDetail && (
            <div className="p-8 space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}

          {!loadingDetail && ticketDetail && (
            <>
              {/* Drawer Header */}
              <SheetHeader className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 text-left space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      #{ticketDetail.ticket.ticket_number}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        STATUS_CONFIG[ticketDetail.ticket.status]?.bg
                      } ${STATUS_CONFIG[ticketDetail.ticket.status]?.color} ${
                        STATUS_CONFIG[ticketDetail.ticket.status]?.border
                      }`}
                    >
                      {STATUS_CONFIG[ticketDetail.ticket.status]?.label}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      {CATEGORY_LABELS[ticketDetail.ticket.category]}
                    </Badge>
                  </div>

                  {/* Quick Status Dropdown */}
                  <div className="w-[140px]">
                    <Select
                      value={ticketDetail.ticket.status}
                      disabled={updatingStatus}
                      onValueChange={(val) => handleUpdateStatus(val as SupportTicketStatus)}
                    >
                      <SelectTrigger className="h-8 text-xs font-medium">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="waiting_for_user">Waiting for User</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <SheetTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {ticketDetail.ticket.subject}
                </SheetTitle>
              </SheetHeader>

              {/* Drawer Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* 1. User Profile & Credit Balance Context Box */}
                {ticketDetail.userProfile && (
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {ticketDetail.userProfile.display_name || ticketDetail.userProfile.email}
                          </span>
                          <span className="text-[11px] text-slate-400 ml-1.5 font-mono">
                            ({ticketDetail.userProfile.email})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className="text-[10px] uppercase font-mono px-1.5 py-0 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                        >
                          {ticketDetail.userProfile.role}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400">
                      <div>
                        Credit Balance:{' '}
                        <strong className="text-slate-900 dark:text-white font-semibold">
                          {ticketDetail.userProfile.allowance_balance} customizations
                        </strong>
                      </div>
                      <Link
                        href={`/admin/users?search=${encodeURIComponent(
                          ticketDetail.userProfile.email
                        )}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        Adjust Credits in User Management
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}

                {/* 2. Related Template & Attempt Details */}
                {(ticketDetail.relatedTemplate || ticketDetail.ticket.related_attempt_id) && (
                  <div className="p-3.5 rounded-xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/20 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="font-semibold text-slate-900 dark:text-white">
                          Attached Record Details
                        </span>
                      </div>
                    </div>

                    {ticketDetail.relatedTemplate && (
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <div className="space-y-0.5">
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {ticketDetail.relatedTemplate.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Category: {ticketDetail.relatedTemplate.category} ({ticketDetail.relatedTemplate.mainCategory})
                          </div>
                        </div>
                        <Link
                          href={`/admin/templates/${ticketDetail.relatedTemplate.template_id}`}
                          className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                        >
                          Open in Editor
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    )}

                    {ticketDetail.ticket.related_attempt_id && (
                      <div className="text-[11px] text-slate-600 dark:text-slate-400">
                        Customization Attempt ID:{' '}
                        <code className="font-mono text-slate-900 dark:text-white font-semibold">
                          {ticketDetail.ticket.related_attempt_id}
                        </code>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Assignment Selector */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 text-xs">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Assigned Curator:
                    </span>
                  </div>

                  <div className="w-[180px]">
                    <Select
                      value={ticketDetail.ticket.assigned_to_user_id || 'unassigned'}
                      disabled={updatingAssign}
                      onValueChange={handleAssignTicket}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Assign Admin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        {adminUsers.map((a) => (
                          <SelectItem key={a.user_id} value={a.user_id}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* 4. Full Conversation Timeline (User + Admin + Internal Notes) */}
                <div className="space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Conversation History ({ticketDetail.ticket.messages.length})</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Earliest first
                    </span>
                  </h4>

                  <div className="space-y-3.5">
                    {ticketDetail.ticket.messages.map((msg, index) => {
                      const isUser = msg.sender_role === 'user';
                      const isInternal = msg.is_internal_note;

                      return (
                        <div
                          key={msg.message_id || index}
                          className={`rounded-2xl p-4 text-xs sm:text-sm space-y-2 border transition-all ${
                            isInternal
                              ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-100 shadow-xs'
                              : isUser
                              ? 'bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                              : 'bg-blue-50/70 dark:bg-[#0c162e] border-blue-200/80 dark:border-blue-900/60 text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 pb-2 border-b border-black/5 dark:border-white/5">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  isInternal
                                    ? 'bg-amber-500 text-white'
                                    : isUser
                                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                                    : 'bg-blue-600 text-white'
                                }`}
                              >
                                {isInternal ? '!' : isUser ? 'U' : 'A'}
                              </span>

                              <span className="font-semibold text-xs">
                                {msg.sender_name}
                              </span>

                              {isInternal ? (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] px-1.5 py-0 bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-500/40 flex items-center gap-1 font-bold uppercase tracking-wider"
                                >
                                  <Lock className="w-2.5 h-2.5" />
                                  Internal Note (Hidden from User)
                                </Badge>
                              ) : isUser ? (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] px-1.5 py-0 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                                >
                                  User Inquiry
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] px-1.5 py-0 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                                >
                                  Official Admin Reply
                                </Badge>
                              )}
                            </div>

                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(msg.created_at).toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>

                          <div className="leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                          </div>

                          {/* Attachment Image Preview */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-1.5">
                              <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                                <Paperclip className="w-3 h-3" /> Attached Screenshot
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {msg.attachments.map((att) => (
                                  <a
                                    key={att.attachment_id}
                                    href={att.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 flex items-center gap-2 hover:border-blue-500 transition-colors"
                                  >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={att.url}
                                      alt={att.file_name}
                                      className="w-10 h-10 object-cover rounded"
                                    />
                                    <span className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline">
                                      {att.file_name}
                                    </span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* 5. Reply / Internal Note Composer */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80">
                      <button
                        type="button"
                        onClick={() => setReplyType('reply')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          replyType === 'reply'
                            ? 'bg-white dark:bg-[#0c162e] text-blue-600 dark:text-blue-400 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        Reply to User
                      </button>
                      <button
                        type="button"
                        onClick={() => setReplyType('internal_note')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                          replyType === 'internal_note'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <Lock className="w-3 h-3" />
                        Internal Note
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-400">
                      {replyType === 'internal_note'
                        ? 'Hidden from user • Admins only'
                        : 'User will see this reply'}
                    </span>
                  </div>

                  <form onSubmit={handleSendReply} className="space-y-3">
                    <Textarea
                      rows={3}
                      placeholder={
                        replyType === 'internal_note'
                          ? 'Add internal curator note, debugging details, or verification notes...'
                          : 'Write response to user...'
                      }
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      required
                      className={`text-xs rounded-xl ${
                        replyType === 'internal_note'
                          ? 'border-amber-400/60 dark:border-amber-700/60 bg-amber-50/20 dark:bg-amber-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80'
                      }`}
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {replyType === 'reply' && 'Moves status to Waiting for User'}
                      </span>

                      <Button
                        type="submit"
                        size="sm"
                        disabled={isSendingReply || !replyContent.trim()}
                        className={`rounded-xl text-xs gap-1.5 px-4 ${
                          replyType === 'internal_note'
                            ? 'bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {isSendingReply ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            {replyType === 'internal_note'
                              ? 'Save Internal Note'
                              : 'Send Reply'}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Close Drawer
                </Button>

                {ticketDetail.ticket.status !== 'resolved' ? (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus('resolved')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Ticket Resolved
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus('open')}
                    className="rounded-xl text-xs gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reopen Ticket
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
