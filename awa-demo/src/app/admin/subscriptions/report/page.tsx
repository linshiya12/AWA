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
              className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Subscription Management
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            <span>Subscription Report & Analytics</span>
            <Badge variant="outline" className="text-xs bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
              Screen A9-R
            </Badge>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Live metrics, subscription revenue attribution, active vs. expired breakdown, and plan adoption (04 §4A, 07 §5.5).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/admin/subscriptions">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700 bg-slate-900 text-slate-300 hover:text-white text-xs h-9"
            >
              <CalendarCheck className="w-3.5 h-3.5 mr-1.5" />
              Manage Subscriptions
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchReport}
            className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs h-9"
            title="Refresh report metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Date Period Filter Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#080d1a] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => {
              setPeriod('all');
              setFromDate('');
              setToDate('');
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              period === 'all' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => {
              setPeriod('30d');
              setFromDate('');
              setToDate('');
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              period === '30d' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => {
              setPeriod('90d');
              setFromDate('');
              setToDate('');
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              period === '90d' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 90 Days
          </button>
          <button
            onClick={() => {
              setPeriod('year');
              setFromDate('');
              setToDate('');
            }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              period === 'year' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            This Year
          </button>
        </div>

        {/* Custom Date Range */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">Custom Range:</span>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPeriod('custom');
            }}
            className="bg-slate-900 border-slate-700 text-[11px] h-8 text-slate-300 w-32 px-2"
          />
          <span className="text-slate-500">to</span>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPeriod('custom');
            }}
            className="bg-slate-900 border-slate-700 text-[11px] h-8 text-slate-300 w-32 px-2"
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      {loading && !report ? (
        <div className="rounded-2xl border border-slate-800 bg-[#080d1a] p-12 text-center text-slate-400 text-xs">
          <RefreshCw className="w-5 h-5 animate-spin inline-block mr-2 text-cyan-400" />
          Calculating metrics from real private database records...
        </div>
      ) : report ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* 1. Active Subscriptions */}
            <div className="rounded-xl border border-slate-800 bg-[#080d1a] p-4 shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
                <span className="font-medium">Active Memberships</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {report.active_subscriptions}
              </div>
              <p className="text-[11px] text-emerald-400 mt-1 font-medium">
                Entitled to prompt text (FR-026)
              </p>
            </div>

            {/* 2. Total Subscription Revenue */}
            <div className="rounded-xl border border-slate-800 bg-[#080d1a] p-4 shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
                <span className="font-medium">Subscription Revenue</span>
                <Coins className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-cyan-300 font-mono">
                ₹{report.total_revenue.toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-slate-400 mt-1 truncate" title={report.revenue_note}>
                Verified paid transactions only
              </p>
            </div>

            {/* 3. New Subscriptions */}
            <div className="rounded-xl border border-slate-800 bg-[#080d1a] p-4 shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
                <span className="font-medium">New Subscriptions</span>
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {report.new_subscriptions}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Started in period
              </p>
            </div>

            {/* 4. Upcoming Expirations */}
            <div className="rounded-xl border border-slate-800 bg-[#080d1a] p-4 shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
                <span className="font-medium">Expiring Soon (≤ 30d)</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-amber-300 font-mono">
                {report.upcoming_expirations}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Annual renewal targets
              </p>
            </div>

            {/* 5. Expired Subscriptions */}
            <div className="rounded-xl border border-slate-800 bg-[#080d1a] p-4 shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
                <span className="font-medium">Expired Memberships</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-bold text-slate-300 font-mono">
                {report.expired_subscriptions}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Retain delivered prompts
              </p>
            </div>

            {/* 6. Renewals */}
            <div className="rounded-xl border border-slate-800 bg-[#080d1a] p-4 shadow-sm hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
                <span className="font-medium">Renewals</span>
                <CalendarCheck className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {report.renewals}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Repeat subscribers
              </p>
            </div>
          </div>

          {/* Plan Breakdown Section */}
          <div className="rounded-2xl border border-slate-800 bg-[#080d1a] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  Breakdown by Plan
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Comparative performance and revenue contribution between Creator Yearly (₹199) and Studio Lifetime (₹999).
                </p>
              </div>

              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
                Total Revenue: ₹{report.total_revenue.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Plan Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Plan Name</th>
                    <th className="py-2.5 px-3 font-semibold">Term & Price</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Total Subscribers</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Active Now</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Revenue (INR)</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Revenue Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {report.plan_breakdown.map((item) => (
                    <tr key={item.plan_id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-semibold text-white block">
                          {item.plan_name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.plan_id}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-300">
                        <div>
                          <span className="font-medium text-cyan-300">₹{item.price}</span>
                          <span className="text-slate-500 text-[11px]"> / {item.term_length}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center font-mono font-semibold text-slate-200">
                        {item.total_subscribers}
                      </td>

                      <td className="py-3 px-3 text-center">
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
                          {item.active_subscribers} Active
                        </Badge>
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-cyan-300">
                        ₹{item.revenue.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-mono text-slate-300 font-medium text-xs">
                            {item.revenue_share_percentage}%
                          </span>
                          <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                              style={{ width: `${Math.min(100, item.revenue_share_percentage)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Integrity & Attribution Notice */}
          <div className="rounded-xl border border-slate-800 bg-[#090d18] p-4 text-xs text-slate-400 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-slate-200 text-xs block">
                Accounting & Evidence Integrity Guarantee
              </span>
              <p className="text-[11px] leading-relaxed text-slate-400">
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
