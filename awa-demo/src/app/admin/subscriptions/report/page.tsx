'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  CalendarCheck,
  Calendar,
  RefreshCw,
  Coins,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Percent,
  Layers,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
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

interface PlanBreakdownItem {
  plan_id: string;
  plan_name: string;
  term_length: string;
  price: number;
  currency: string;
  total_subscribers: number;
  active_subscribers: number;
  revenue: number;
  revenue_share_percentage: number;
}

interface ReportData {
  period: string;
  date_from: string | null;
  date_to: string | null;
  active_subscriptions: number;
  expired_subscriptions: number;
  upcoming_expirations: number;
  new_subscriptions: number;
  renewals: number;
  total_revenue: number;
  currency: string;
  revenue_note: string;
  plan_breakdown: PlanBreakdownItem[];
}

export default function AdminSubscriptionReportPage() {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [period, setPeriod] = useState<string>('all');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (period !== 'custom') {
        params.set('period', period);
      } else {
        if (fromDate) params.set('from', fromDate);
        if (toDate) params.set('to', toDate);
      }

      const res = await fetch(`/api/v1/admin/subscriptions/report?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to load subscription report: HTTP ${res.status}`);
      }
      const data = await res.json();
      setReport(data.report);
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [period, fromDate, toDate]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/subscriptions"
              className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Subscriptions
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Subscription & Revenue Report</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
              Screen A10
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Accounting and subscriber cohort breakdown by time period, revenue share, and plan performance (04 §4A, 06 §9.1).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchReport}
            className="text-xs h-9"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card className="p-4 border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mr-1">Period:</span>
            {[
              { id: 'all', label: 'All Time' },
              { id: 'this_month', label: 'This Month' },
              { id: 'last_month', label: 'Last Month' },
              { id: 'this_year', label: 'This Year' },
              { id: 'custom', label: 'Custom Range' },
            ].map((p) => (
              <Button
                key={p.id}
                type="button"
                variant={period === p.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPeriod(p.id)}
                className={`h-8 px-3 text-xs font-medium cursor-pointer ${
                  period === p.id
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {p.label}
              </Button>
            ))}
          </div>

          {/* Custom Date Inputs */}
          {period === 'custom' && (
            <div className="flex items-center gap-2 animate-in fade-in text-xs">
              <span className="text-slate-500">From:</span>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="text-xs h-8 px-2 w-36"
              />
              <span className="text-slate-500">To:</span>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="text-xs h-8 px-2 w-36"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Error state */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Report Generation Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={fetchReport} className="ml-4">
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Report Content */}
      {loading ? (
        // Loading state
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-20" />
                <Skeleton className="h-3 w-16" />
              </Card>
            ))}
          </div>
          <Card className="p-6 h-64">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-36 w-full rounded-xl" />
          </Card>
        </div>
      ) : report ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* 1. Active Subscriptions */}
            <Card className="p-4 border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-xs hover:border-slate-300 dark:hover:border-blue-800 transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
                <span className="font-medium">Active Subscribers</span>
                <Users className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {report.active_subscriptions}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Currently paid & active
              </p>
            </Card>

            {/* 2. Total Subscription Revenue */}
            <Card className="p-4 border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-xs hover:border-slate-300 dark:hover:border-blue-800 transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
                <span className="font-medium">Subscription Revenue</span>
                <Coins className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-300 font-mono">
                ₹{report.total_revenue.toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 truncate" title={report.revenue_note}>
                Verified paid only
              </p>
            </Card>

            {/* 3. New Subscriptions */}
            <Card className="p-4 border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-xs hover:border-slate-300 dark:hover:border-blue-800 transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
                <span className="font-medium">New Subscriptions</span>
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {report.new_subscriptions}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Started in period
              </p>
            </Card>

            {/* 4. Upcoming Expirations */}
            <Card className="p-4 border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-xs hover:border-slate-300 dark:hover:border-blue-800 transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
                <span className="font-medium">Expiring Soon (≤ 30d)</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-300 font-mono">
                {report.upcoming_expirations}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Renewal targets
              </p>
            </Card>

            {/* 5. Expired Subscriptions */}
            <Card className="p-4 border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-xs hover:border-slate-300 dark:hover:border-blue-800 transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
                <span className="font-medium">Expired Memberships</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold text-slate-700 dark:text-slate-300 font-mono">
                {report.expired_subscriptions}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Retain delivered prompts
              </p>
            </Card>

            {/* 6. Renewals */}
            <Card className="p-4 border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-xs hover:border-slate-300 dark:hover:border-blue-800 transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1.5">
                <span className="font-medium">Renewals</span>
                <CalendarCheck className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {report.renewals}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Repeat subscribers
              </p>
            </Card>
          </div>

          {/* Plan Breakdown Section */}
          <Card className="p-6 space-y-4 border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Breakdown by Plan
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Comparative performance and revenue contribution between Creator Yearly (₹199) and Studio Lifetime (₹999).
                </p>
              </div>

              <Badge variant="outline" className="text-xs font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20 px-3 py-1">
                Total Revenue: ₹{report.total_revenue.toLocaleString('en-IN')}
              </Badge>
            </div>

            {/* Plan Breakdown Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Plan Name</TableHead>
                  <TableHead className="font-semibold">Term & Price</TableHead>
                  <TableHead className="font-semibold text-center">Total Subscribers</TableHead>
                  <TableHead className="font-semibold text-center">Active Now</TableHead>
                  <TableHead className="font-semibold text-right">Revenue (INR)</TableHead>
                  <TableHead className="font-semibold text-right">Revenue Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.plan_breakdown.map((item) => (
                  <TableRow key={item.plan_id} className="transition-colors">
                    <TableCell>
                      <span className="font-semibold text-slate-900 dark:text-white block text-sm">
                        {item.plan_name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.plan_id}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div>
                        <span className="font-medium text-cyan-600 dark:text-cyan-300">₹{item.price}</span>
                        <span className="text-slate-500 text-[11px]"> / {item.term_length}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-center font-mono font-semibold text-slate-700 dark:text-slate-200">
                      {item.total_subscribers}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant="emerald" className="text-[10px] font-mono">
                        {item.active_subscribers} Active
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right font-mono font-bold text-cyan-600 dark:text-cyan-300">
                      ₹{item.revenue.toLocaleString('en-IN')}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-mono text-slate-700 dark:text-slate-300 font-medium text-xs">
                          {item.revenue_share_percentage}%
                        </span>
                        <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                            style={{ width: `${Math.min(100, item.revenue_share_percentage)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Integrity & Attribution Notice */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-[#090d18] p-4 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-900 dark:text-slate-200 text-xs block">
                Accounting & Evidence Integrity Guarantee
              </span>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                {report.revenue_note} In accordance with <code>07-DATABASE.md §5.6</code> and <code>06 §9.1</code>,
                revenue figures are aggregated directly from immutable payment transactions. Unpaid (pending or failed)
                subscriptions and complimentary manual admin grants are tracked for access control but strictly excluded
                from recognized revenue.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
