'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  FolderTree,
  FileCode,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  Clock,
  Layers,
  ThumbsUp,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ReportData {
  contentGaps: Array<{
    type: 'missing_tool' | 'missing_guidance' | 'missing_prompt' | 'withdrawn_tool_assigned';
    templateId?: string;
    templateName?: string;
    message: string;
  }>;
  spendStatus: {
    spent: number;
    limit: number;
    percent: number;
    isApproaching: boolean;
    isPaused: boolean;
  };
  versionFeedback: Array<{
    templateId: string;
    templateName: string;
    versionNumber: number;
    baseSuccessRate: number;
    customizedSuccessRate: number;
    totalFeedback: number;
  }>;
  demandSignals: Array<{
    unmetNeedId: string;
    categoryName: string;
    description: string;
    submittedAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [reports, setReports] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = () => {
    setLoading(true);
    fetch('/api/v1/admin/reports')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load reports');
        return res.json();
      })
      .then((data) => setReports(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading || !reports) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <p className="text-sm text-slate-400">Loading catalog evidence & dashboard metrics...</p>
        </div>
      </div>
    );
  }

  const { spendStatus, contentGaps, versionFeedback, demandSignals } = reports;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Administrative Dashboard</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
              Screen A1
            </Badge>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time catalog health, AI cost ceiling, prompt quality attribution, and user demand signals.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchReports}
            className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh Signals
          </Button>
          <Link href="/admin/templates">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
              Manage Templates
            </Button>
          </Link>
        </div>
      </div>

      {/* TOP ROW: PRIMARY PANELS (11-UI-UX A1: Spend against cap & Content gaps MUST be visible without clicking) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PANEL 1: SPEND AGAINST CAP (FEAT-043 — The number that stops a surprise invoice) */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-full">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -z-10" />

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-semibold tracking-wider text-slate-400 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-blue-400" />
                  AI Customization Spend Cap (FEAT-043)
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Monthly Limit
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white tracking-tight">
                  ${spendStatus.spent.toFixed(2)}
                </span>
                <span className="text-sm text-slate-400 font-medium">/ ${spendStatus.limit.toFixed(2)} limit</span>
              </div>

              {/* Spend gauge progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>Usage to date: {spendStatus.percent}%</span>
                  <span>{spendStatus.isApproaching ? 'Warning: Near Threshold' : 'Normal Operations'}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      spendStatus.isPaused
                        ? 'bg-rose-500'
                        : spendStatus.isApproaching
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-400'
                    }`}
                    style={{ width: `${Math.min(100, spendStatus.percent)}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                If the cap binds, customization automatically pauses with no budget mentioned to subscribers.
                Prompt access is never affected (NFR-001).
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Rate Limit: 20 calls/hr/user</span>
              <Link href="/admin/commerce" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                Configure Cap <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* PANEL 2: CONTENT GAPS (FEAT-038 & FR-045 — Directs authoring capacity where it matters) */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-xs uppercase font-semibold tracking-wider text-slate-300">
                    Detected Catalog Gaps (FEAT-038)
                  </span>
                </div>
                <Badge
                  variant={contentGaps.length > 0 ? 'rose' : 'default'}
                  className="text-[11px] font-mono"
                >
                  {contentGaps.length} {contentGaps.length === 1 ? 'Gap' : 'Gaps'}
                </Badge>
              </div>

              <p className="text-xs text-slate-400 mt-1">
                Automated detection of missing prompts, unassigned tools, or orphaned references.
              </p>

              <div className="mt-4 space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {contentGaps.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Catalog is complete! All templates have published prompts, assigned tools, and guidance.</span>
                  </div>
                ) : (
                  contentGaps.map((gap, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-slate-800/80 bg-slate-900/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        <div className="truncate">
                          <span className="font-semibold text-slate-200">{gap.templateName || 'Catalog'}</span>
                          <span className="text-slate-400 ml-2">— {gap.message}</span>
                        </div>
                      </div>
                      {gap.templateId && (
                        <Link
                          href={`/admin/templates/${gap.templateId}`}
                          className="shrink-0 text-blue-400 hover:text-blue-300 font-medium ml-3 text-[11px]"
                        >
                          Resolve →
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Evaluates live catalog integrity across all categories</span>
              <Link href="/admin/templates" className="text-blue-400 hover:text-blue-300">
                Audit Catalog →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND ROW: ATTRIBUTION QUALITY & RECENT DEMAND SIGNALS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* PANEL 3: VERSION ATTRIBUTION & FEEDBACK (07 §6.5 — Split Base vs Customized) */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-cyan-400" />
                  Prompt Quality & Attribution (FEAT-044)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Attribution isolates whether prompt rewrites improve outcomes without data contamination.
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] bg-slate-800 text-slate-300">
                2-Value Scale (Worked / Failed)
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 font-medium">Template</th>
                    <th className="py-2.5 font-medium text-center">Version</th>
                    <th className="py-2.5 font-medium text-center">Base Prompt Success</th>
                    <th className="py-2.5 font-medium text-center">Customized Success</th>
                    <th className="py-2.5 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {versionFeedback.slice(0, 5).map((row) => (
                    <tr key={row.templateId} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 font-medium text-slate-200">{row.templateName}</td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[11px]">
                          v{row.versionNumber}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-emerald-400 font-semibold">{row.baseSuccessRate}%</span>
                      </td>
                      <td className="py-3 text-center">
                        <span className="text-cyan-400 font-semibold">{row.customizedSuccessRate}%</span>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/templates/${row.templateId}/versions`}
                          className="text-blue-400 hover:text-blue-300 font-medium"
                        >
                          History →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* PANEL 4: DEMAND SIGNALS / UNMET NEEDS (07 §6.6 — Revealed user demand) */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  User Demand Signals (FEAT-029)
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Unmet Needs</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                What creators searched or described when nothing in the catalog fitted.
              </p>

              <div className="space-y-3">
                {demandSignals.map((item) => (
                  <div
                    key={item.unmetNeedId}
                    className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-medium">
                        {item.categoryName}
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {new Date(item.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed italic">
                      &quot;{item.description}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Demand reveals template gaps</span>
              <Link href="/admin/templates" className="text-blue-400 hover:text-blue-300">
                Author New Template →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
