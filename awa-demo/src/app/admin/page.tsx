'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import {
  Users,
  CreditCard,
  FileCode,
  Sparkles,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowRight,
  Clock,
  ShieldCheck,
  Calendar,
  ExternalLink,
  ChevronRight,
  Layers,
  HelpCircle,
  Cpu,
  Flame,
  Activity,
  FolderTree,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types for Dashboard API Response
interface DashboardData {
  refreshedAt: string;
  period: '7d' | '30d' | '90d' | 'all';
  metrics: {
    activeSubscriptions: {
      count: number;
      previousCount: number | null;
      changePercent: number | null;
    };
    subscriptionRevenue: {
      amount: number;
      previousAmount: number | null;
      changePercent: number | null;
      transactionCount: number;
      currency: string;
    };
    publishedTemplates: {
      publishedCount: number;
      totalCount: number;
      ratio: number;
    };
    aiSpend: {
      spent: number;
      limit: number;
      percent: number;
      status: 'normal' | 'approaching' | 'paused';
      currency: string;
    };
  };
  trends: {
    points: Array<{
      date: string;
      label: string;
      revenue: number;
      subscriptions: number;
      aiSpend: number;
      cumulativeRevenue: number;
    }>;
    totalRevenue: number;
    averageDailyRevenue: number;
  };
  needsAttention: {
    expiringSubscriptions: {
      count: number;
      items: Array<{
        id: string;
        userEmail: string;
        userName: string;
        planName: string;
        daysRemaining: number;
        endsAt: string;
      }>;
      href: string;
    };
    failedPayments: {
      count: number;
      items: Array<{
        id: string;
        userEmail: string;
        amount: number;
        currency: string;
        providerReference: string;
        date: string;
      }>;
      href: string;
    };
    unpublishedTemplates: {
      count: number;
      items: Array<{
        id: string;
        name: string;
        status: string;
        issue: string;
      }>;
      href: string;
    };
    missingGuidanceOrMedia: {
      count: number;
      items: Array<{
        id: string;
        name: string;
        issue: string;
      }>;
      href: string;
    };
    catalogGaps: {
      count: number;
      items: Array<{
        type: string;
        templateId?: string;
        templateName?: string;
        message: string;
      }>;
      href: string;
    };
    spendCapWarning: {
      isWarning: boolean;
      isPaused: boolean;
      message: string | null;
      href: string;
    };
    totalIssuesCount: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'subscription' | 'payment' | 'template' | 'audit';
    title: string;
    description: string;
    timestamp: string;
    badge: {
      label: string;
      variant: 'emerald' | 'blue' | 'amber' | 'rose' | 'secondary';
    };
    amount?: string;
    actor?: string;
    link?: string;
  }>;
}

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTrendMetric, setActiveTrendMetric] = useState<'revenue' | 'subscriptions' | 'aiSpend'>('revenue');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const fetchDashboard = async (selectedPeriod: '7d' | '30d' | '90d' | 'all', isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await fetch(`/api/v1/admin/dashboard?period=${selectedPeriod}`);
      if (!res.ok) {
        throw new Error(`Failed to load operations metrics (${res.status})`);
      }
      const json: DashboardData = await res.json();
      setData(json);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || 'Unable to retrieve dashboard metrics');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard(period);
  }, [period]);

  // Format currency helper
  const formatCurrency = (val: number, currency: string = 'INR') => {
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${val.toLocaleString('en-IN')}`;
  };

  // Format relative or friendly time
  const formatRefreshTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatActivityTime = (isoString: string) => {
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // LOADING STATE SKELETON
  if (loading && !data) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div className="space-y-2">
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-48 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>

        {/* 4 Metric Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 space-y-3 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c162e]">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-3 w-full" />
            </Card>
          ))}
        </div>

        {/* Trends & Needs Attention Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <Card className="p-5 h-84 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c162e] space-y-4">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-56 w-full rounded-lg" />
            </Card>
          </div>
          <div className="lg:col-span-4">
            <Card className="p-5 h-84 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c162e] space-y-3">
              <Skeleton className="h-5 w-36" />
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </Card>
          </div>
        </div>

        {/* Recent Activity Skeleton */}
        <Card className="p-5 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c162e] space-y-3">
          <Skeleton className="h-5 w-36" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // ERROR STATE
  if (error || !data) {
    return (
      <div className="py-12">
        <Alert variant="destructive" className="max-w-xl mx-auto shadow-md">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Operations Dashboard Error</AlertTitle>
          <AlertDescription className="mt-2 flex items-center justify-between">
            <span>{error || 'Unable to retrieve administrative telemetry from backend.'}</span>
            <Button size="sm" variant="outline" onClick={() => fetchDashboard(period, true)} className="ml-4 text-xs">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { metrics, trends, needsAttention, recentActivity } = data;

  // Max value calculation for trend chart scaling
  const maxTrendValue = Math.max(
    ...trends.points.map((p) =>
      activeTrendMetric === 'revenue'
        ? p.revenue
        : activeTrendMetric === 'subscriptions'
        ? p.subscriptions
        : p.aiSpend
    ),
    1
  );

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Operations overview, catalog health, subscription revenue, and items requiring attention.
          </p>
        </div>

        {/* Date Filter & Refresh Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Data Refresh Time Indicator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mr-1 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Updated {formatRefreshTime(data.refreshedAt)}</span>
          </div>

          {/* Date Range Segmented Pill Filter */}
          <Tabs value={period} onValueChange={(val) => setPeriod(val as any)} className="w-auto">
            <TabsList className="h-8 p-0.5">
              <TabsTrigger value="7d" className="text-xs px-2.5 py-1">7D</TabsTrigger>
              <TabsTrigger value="30d" className="text-xs px-2.5 py-1">30D</TabsTrigger>
              <TabsTrigger value="90d" className="text-xs px-2.5 py-1">90D</TabsTrigger>
              <TabsTrigger value="all" className="text-xs px-2.5 py-1">All</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDashboard(period, true)}
            disabled={isRefreshing}
            className="h-8 text-xs font-medium bg-white dark:bg-[#0c162e] border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* 2. KEY METRICS CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Subscriptions */}
        <Card className="p-4 border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0c162e] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Subscriptions
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {metrics.activeSubscriptions.count}
              </span>
              {metrics.activeSubscriptions.changePercent !== null && (
                <span
                  className={`text-[11px] font-semibold flex items-center ${
                    metrics.activeSubscriptions.changePercent >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {metrics.activeSubscriptions.changePercent >= 0 ? '+' : ''}
                  {metrics.activeSubscriptions.changePercent}%
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Verified accounts</span>
            <Link
              href="/admin/subscriptions"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-0.5"
            >
              Manage <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>

        {/* Card 2: Subscription Revenue */}
        <Card className="p-4 border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0c162e] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Subscription Revenue
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {formatCurrency(metrics.subscriptionRevenue.amount, metrics.subscriptionRevenue.currency)}
              </span>
              {metrics.subscriptionRevenue.changePercent !== null && (
                <span
                  className={`text-[11px] font-semibold flex items-center ${
                    metrics.subscriptionRevenue.changePercent >= 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {metrics.subscriptionRevenue.changePercent >= 0 ? '+' : ''}
                  {metrics.subscriptionRevenue.changePercent}%
                </span>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{metrics.subscriptionRevenue.transactionCount} succeeded {metrics.subscriptionRevenue.transactionCount === 1 ? 'payment' : 'payments'}</span>
            <Link
              href="/admin/subscriptions/report"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-0.5"
            >
              Report <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>

        {/* Card 3: Published Templates */}
        <Card className="p-4 border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0c162e] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Published Templates
              </span>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileCode className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {metrics.publishedTemplates.publishedCount}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                / {metrics.publishedTemplates.totalCount} catalog total
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{metrics.publishedTemplates.ratio}% catalog active</span>
            <Link
              href="/admin/templates"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-0.5"
            >
              Catalog <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>

        {/* Card 4: AI Customization Spend */}
        <Card className="p-4 border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0c162e] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span>AI Spend vs Cap</span>
              </span>
              <Badge
                variant={
                  metrics.aiSpend.status === 'paused'
                    ? 'rose'
                    : metrics.aiSpend.status === 'approaching'
                    ? 'amber'
                    : 'outline'
                }
                className="text-[10px] px-1.5 py-0 font-mono"
              >
                {metrics.aiSpend.status === 'paused'
                  ? 'Paused'
                  : metrics.aiSpend.status === 'approaching'
                  ? 'Near Cap'
                  : 'Normal'}
              </Badge>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                ${metrics.aiSpend.spent.toFixed(2)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                / ${metrics.aiSpend.limit.toFixed(0)} cap
              </span>
            </div>

            {/* Subtle progress indicator */}
            <div className="mt-2 space-y-1">
              <Progress
                value={metrics.aiSpend.percent}
                className={`h-1.5 ${
                  metrics.aiSpend.status === 'paused'
                    ? '[&>div]:bg-rose-500'
                    : metrics.aiSpend.status === 'approaching'
                    ? '[&>div]:bg-amber-500'
                    : '[&>div]:bg-blue-500'
                }`}
              />
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{metrics.aiSpend.percent}% of budget used</span>
            <Link
              href="/admin/commerce"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-0.5"
            >
              Adjust Cap <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </Card>
      </div>

      {/* 3. TRENDS & 4. NEEDS ATTENTION ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SECTION 3: TRENDS (7 cols on lg) */}
        <div className="lg:col-span-7">
          <Card className="p-5 border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0c162e] shadow-xs flex flex-col justify-between h-full">
            <div>
              {/* Trends Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    Operations Trends
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Revenue, subscriptions, and AI customization spend over selected period.
                  </p>
                </div>

                {/* Metric Selector Tabs */}
                <Tabs
                  value={activeTrendMetric}
                  onValueChange={(val) => setActiveTrendMetric(val as any)}
                  className="self-start sm:self-auto"
                >
                  <TabsList className="h-8 p-0.5">
                    <TabsTrigger value="revenue" className="text-xs px-2.5 py-1 data-[state=checked]:text-emerald-600 dark:data-[state=checked]:text-emerald-400">
                      Revenue
                    </TabsTrigger>
                    <TabsTrigger value="subscriptions" className="text-xs px-2.5 py-1 data-[state=checked]:text-blue-600 dark:data-[state=checked]:text-blue-400">
                      Subscriptions
                    </TabsTrigger>
                    <TabsTrigger value="aiSpend" className="text-xs px-2.5 py-1 data-[state=checked]:text-purple-600 dark:data-[state=checked]:text-purple-400">
                      AI Spend
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Chart Canvas Area */}
              <div className="mt-4">
                {trends.points.length === 0 ? (
                  <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                    <Activity className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-xs font-medium text-slate-300">No activity in this period</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Switch to 90D or All to view longer history.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* SVG Chart */}
                    <div className="relative h-44 w-full">
                      <svg
                        className="w-full h-full overflow-visible"
                        viewBox="0 0 500 140"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          {/* Revenue Gradient */}
                          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                          </linearGradient>
                          {/* Subscriptions Gradient */}
                          <linearGradient id="subsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                          </linearGradient>
                          {/* AI Spend Gradient */}
                          <linearGradient id="aiSpendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.28" />
                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Horizontal Grid lines */}
                        {[0, 35, 70, 105].map((y) => (
                          <line
                            key={y}
                            x1="0"
                            y1={y}
                            x2="500"
                            y2={y}
                            stroke="currentColor"
                            className="text-slate-200 dark:text-slate-800/70"
                            strokeDasharray="4 4"
                            strokeWidth="1"
                          />
                        ))}

                        {/* Area Polygon */}
                        {(() => {
                          const pts = trends.points.map((p, idx) => {
                            const val =
                              activeTrendMetric === 'revenue'
                                ? p.revenue
                                : activeTrendMetric === 'subscriptions'
                                ? p.subscriptions
                                : p.aiSpend;
                            const x = (idx / (trends.points.length - 1 || 1)) * 500;
                            const y = 120 - (val / maxTrendValue) * 110;
                            return { x, y, val, label: p.label };
                          });

                          const pathD = pts.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
                          const areaD = `${pathD} L 500 120 L 0 120 Z`;
                          const strokeColor =
                            activeTrendMetric === 'revenue'
                              ? '#10b981'
                              : activeTrendMetric === 'subscriptions'
                              ? '#3b82f6'
                              : '#a855f7';
                          const fillUrl =
                            activeTrendMetric === 'revenue'
                              ? 'url(#revenueGradient)'
                              : activeTrendMetric === 'subscriptions'
                              ? 'url(#subsGradient)'
                              : 'url(#aiSpendGradient)';

                          return (
                            <>
                              <path d={areaD} fill={fillUrl} />
                              <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                              {pts.map((pt, i) => (
                                <circle
                                  key={i}
                                  cx={pt.x}
                                  cy={pt.y}
                                  r={hoveredPointIndex === i ? '5' : '3.5'}
                                  fill={strokeColor}
                                  className="transition-all cursor-pointer"
                                  onMouseEnter={() => setHoveredPointIndex(i)}
                                  onMouseLeave={() => setHoveredPointIndex(null)}
                                />
                              ))}
                            </>
                          );
                        })()}
                      </svg>

                      {/* Tooltip Overlay if hovered */}
                      {hoveredPointIndex !== null && trends.points[hoveredPointIndex] && (
                        <div
                          className="absolute pointer-events-none p-2 rounded-lg bg-slate-900/95 dark:bg-slate-950 text-white text-[11px] shadow-lg border border-slate-700 backdrop-blur-xs z-10 font-mono -translate-x-1/2 -top-2"
                          style={{
                            left: `${(hoveredPointIndex / (trends.points.length - 1 || 1)) * 100}%`,
                          }}
                        >
                          <div className="font-semibold text-slate-300">
                            {trends.points[hoveredPointIndex].label}
                          </div>
                          <div className="text-emerald-400 font-bold mt-0.5">
                            {activeTrendMetric === 'revenue'
                              ? `Revenue: ₹${trends.points[hoveredPointIndex].revenue}`
                              : activeTrendMetric === 'subscriptions'
                              ? `Subs: ${trends.points[hoveredPointIndex].subscriptions}`
                              : `AI Spend: $${trends.points[hoveredPointIndex].aiSpend.toFixed(2)}`}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Time Axis Labels */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-1">
                      {trends.points.map((p, idx) => (
                        <span key={idx} className="truncate max-w-[60px] text-center">
                          {p.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trends Summary Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Period Revenue</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">
                  {formatCurrency(trends.totalRevenue, 'INR')}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Daily Average</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">
                  ₹{trends.averageDailyRevenue}/day
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center justify-end">
                <Link
                  href="/admin/subscriptions/report"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1"
                >
                  Subscription Report <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </Card>
        </div>

        {/* SECTION 4: NEEDS ATTENTION (5 cols on lg) */}
        <div className="lg:col-span-5">
          <Card className="p-5 border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0c162e] shadow-xs flex flex-col justify-between h-full">
            <div>
              {/* Header with Issues Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <AlertTriangle
                    className={`w-4 h-4 ${
                      needsAttention.totalIssuesCount > 0
                        ? 'text-amber-500 dark:text-amber-400'
                        : 'text-emerald-500 dark:text-emerald-400'
                    }`}
                  />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Needs Attention
                  </h3>
                </div>

                <Badge
                  variant={needsAttention.totalIssuesCount > 0 ? 'amber' : 'emerald'}
                  className="text-[10px] font-mono px-2 py-0.5"
                >
                  {needsAttention.totalIssuesCount > 0
                    ? `${needsAttention.totalIssuesCount} ${
                        needsAttention.totalIssuesCount === 1 ? 'Action Required' : 'Actions Required'
                      }`
                    : 'All Operational'}
                </Badge>
              </div>

              {/* Actionable Issues List or Success Message */}
              <div className="mt-3.5 space-y-2.5 max-h-[300px] overflow-y-auto pr-0.5">
                {needsAttention.totalIssuesCount === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">All systems operational</p>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400/90 mt-0.5">
                        No expiring subscriptions, failed payments, draft templates, or catalog gaps detected.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Item 1: Expiring Subscriptions */}
                    {needsAttention.expiringSubscriptions.count > 0 && (
                      <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 text-xs space-y-1.5">
                        <div className="flex items-center justify-between font-medium">
                          <span className="text-amber-900 dark:text-amber-200 font-semibold flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            {needsAttention.expiringSubscriptions.count} Expiring Subscription
                            {needsAttention.expiringSubscriptions.count > 1 ? 's' : ''}
                          </span>
                          <Link
                            href={needsAttention.expiringSubscriptions.href}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-[11px]"
                          >
                            Review →
                          </Link>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          {needsAttention.expiringSubscriptions.items[0]?.userName} (
                          {needsAttention.expiringSubscriptions.items[0]?.userEmail}) expires in{' '}
                          <span className="font-semibold text-amber-600 dark:text-amber-400">
                            {needsAttention.expiringSubscriptions.items[0]?.daysRemaining} days
                          </span>
                          .
                        </p>
                      </div>
                    )}

                    {/* Item 2: Failed Payments */}
                    {needsAttention.failedPayments.count > 0 && (
                      <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/20 text-xs space-y-1.5">
                        <div className="flex items-center justify-between font-medium">
                          <span className="text-rose-900 dark:text-rose-200 font-semibold flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                            {needsAttention.failedPayments.count} Failed Payment
                            {needsAttention.failedPayments.count > 1 ? 's' : ''}
                          </span>
                          <Link
                            href={needsAttention.failedPayments.href}
                            className="text-rose-600 dark:text-rose-400 hover:underline font-medium text-[11px]"
                          >
                            Investigate →
                          </Link>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          {needsAttention.failedPayments.items[0]?.userEmail} failed transaction of{' '}
                          <span className="font-semibold text-rose-600 dark:text-rose-400">
                            ₹{needsAttention.failedPayments.items[0]?.amount}
                          </span>
                          .
                        </p>
                      </div>
                    )}

                    {/* Item 3: Unpublished or Incomplete Templates */}
                    {needsAttention.unpublishedTemplates.count > 0 && (
                      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs space-y-1.5">
                        <div className="flex items-center justify-between font-medium">
                          <span className="text-slate-900 dark:text-slate-200 font-semibold flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5 text-blue-500" />
                            {needsAttention.unpublishedTemplates.count} Unpublished Template
                            {needsAttention.unpublishedTemplates.count > 1 ? 's' : ''}
                          </span>
                          <Link
                            href={needsAttention.unpublishedTemplates.href}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-[11px]"
                          >
                            Review →
                          </Link>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                          {needsAttention.unpublishedTemplates.items[0]?.name}:{' '}
                          {needsAttention.unpublishedTemplates.items[0]?.issue}
                        </p>
                      </div>
                    )}

                    {/* Item 4: Missing Guidance or Media */}
                    {needsAttention.missingGuidanceOrMedia.count > 0 && (
                      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs space-y-1.5">
                        <div className="flex items-center justify-between font-medium">
                          <span className="text-slate-900 dark:text-slate-200 font-semibold flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-indigo-500" />
                            {needsAttention.missingGuidanceOrMedia.count} Missing Guidance or Media
                          </span>
                          <Link
                            href={needsAttention.missingGuidanceOrMedia.href}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-[11px]"
                          >
                            Add Steps →
                          </Link>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                          {needsAttention.missingGuidanceOrMedia.items[0]?.name}:{' '}
                          {needsAttention.missingGuidanceOrMedia.items[0]?.issue}
                        </p>
                      </div>
                    )}

                    {/* Item 5: Catalog Gaps */}
                    {needsAttention.catalogGaps.count > 0 && (
                      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs space-y-1.5">
                        <div className="flex items-center justify-between font-medium">
                          <span className="text-slate-900 dark:text-slate-200 font-semibold flex items-center gap-1.5">
                            <FolderTree className="w-3.5 h-3.5 text-cyan-500" />
                            {needsAttention.catalogGaps.count} Catalog Gap
                            {needsAttention.catalogGaps.count > 1 ? 's' : ''}
                          </span>
                          <Link
                            href={needsAttention.catalogGaps.href}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-[11px]"
                          >
                            Resolve →
                          </Link>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                          {needsAttention.catalogGaps.items[0]?.templateName || 'Catalog'}:{' '}
                          {needsAttention.catalogGaps.items[0]?.message}
                        </p>
                      </div>
                    )}

                    {/* Item 6: Spend Cap Warning */}
                    {needsAttention.spendCapWarning.isWarning && (
                      <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 text-xs space-y-1.5">
                        <div className="flex items-center justify-between font-medium">
                          <span className="text-amber-900 dark:text-amber-200 font-semibold flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                            AI Spend Cap Alert
                          </span>
                          <Link
                            href={needsAttention.spendCapWarning.href}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-[11px]"
                          >
                            Adjust →
                          </Link>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          {needsAttention.spendCapWarning.message}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Needs Attention Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Automated integrity checks</span>
              <Link
                href="/admin/catalog"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1"
              >
                Inspect Catalog <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* 5. RECENT ACTIVITY TABLE */}
      <Card className="p-5 border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0c162e] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Recent Operations Activity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live chronological log of subscriptions, payments, template updates, and audit events.
            </p>
          </div>

          <Link href="/admin/audit">
            <Button variant="outline" size="sm" className="h-8 text-xs font-medium">
              View Audit Log <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Compact Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 dark:border-slate-800/80 hover:bg-transparent">
                <TableHead className="text-xs font-medium h-9">Event</TableHead>
                <TableHead className="text-xs font-medium h-9">Details</TableHead>
                <TableHead className="text-xs font-medium h-9">Status</TableHead>
                <TableHead className="text-xs font-medium h-9">Amount</TableHead>
                <TableHead className="text-xs font-medium h-9 text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-xs text-slate-400">
                    No recent activity records found.
                  </TableCell>
                </TableRow>
              ) : (
                recentActivity.map((act) => (
                  <TableRow
                    key={act.id}
                    className="border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/60 dark:hover:bg-slate-900/40 text-xs"
                  >
                    <TableCell className="font-semibold text-slate-900 dark:text-slate-200 py-2.5">
                      <div className="flex items-center gap-2">
                        {act.type === 'payment' ? (
                          <CreditCard className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : act.type === 'subscription' ? (
                          <Users className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        ) : act.type === 'template' ? (
                          <FileCode className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                        )}
                        <span>{act.title}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-slate-600 dark:text-slate-400 py-2.5 max-w-[280px] truncate">
                      {act.link ? (
                        <Link href={act.link} className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline">
                          {act.description}
                        </Link>
                      ) : (
                        act.description
                      )}
                    </TableCell>

                    <TableCell className="py-2.5">
                      <Badge
                        variant={act.badge.variant}
                        className="text-[10px] font-mono px-2 py-0"
                      >
                        {act.badge.label}
                      </Badge>
                    </TableCell>

                    <TableCell className="font-mono text-slate-700 dark:text-slate-300 py-2.5 font-medium">
                      {act.amount || '—'}
                    </TableCell>

                    <TableCell className="text-right text-slate-400 font-mono text-[11px] py-2.5 whitespace-nowrap">
                      {formatActivityTime(act.timestamp)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
