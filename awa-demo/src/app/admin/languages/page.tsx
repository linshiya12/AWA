'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Languages,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Globe,
  Loader2,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Check,
  XCircle,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
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

interface TranslationProgress {
  language_id: string;
  total_templates: number;
  completed: number;
  pending: number;
  failed: number;
  in_progress: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'idle';
  updated_at: string;
}

interface Language {
  language_id: string;
  name: string;
  is_default: boolean;
  is_enabled: boolean;
  progress?: TranslationProgress;
}

export default function AdminLanguagesPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryingLangId, setRetryingLangId] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Add Language modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [langCode, setLangCode] = useState('');
  const [langName, setLangName] = useState('');
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async (isBackgroundPoll: boolean = false) => {
    if (!isBackgroundPoll) setLoading(true);
    setError(null);
    try {
      const lRes = await fetch('/api/v1/admin/languages');
      if (!lRes.ok) throw new Error('Failed to retrieve languages');
      const lData = await lRes.json();
      setLanguages(lData.languages || []);
    } catch (err: unknown) {
      console.error(err);
      if (!isBackgroundPoll) {
        setError((err as Error).message || 'Error communicating with localization backend');
      }
    } finally {
      if (!isBackgroundPoll) setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Live polling while any language is in_progress
  useEffect(() => {
    const hasActiveJob = languages.some(
      (l) => !l.is_default && (l.progress?.status === 'in_progress' || (l.progress?.in_progress ?? 0) > 0)
    );

    if (hasActiveJob) {
      pollingRef.current = setTimeout(() => {
        fetchData(true);
      }, 2500);
    }

    return () => {
      if (pollingRef.current) clearTimeout(pollingRef.current);
    };
  }, [languages]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!langCode.trim() || !langName.trim()) return;

    setIsSubmittingAdd(true);
    try {
      const res = await fetch('/api/v1/admin/languages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language_id: langCode.trim().toLowerCase(),
          name: langName.trim(),
        }),
      });

      if (res.ok) {
        setIsAddOpen(false);
        setLangCode('');
        setLangName('');
        setSuccessBanner(
          `Language '${langName}' added! Automatic background translation job queued for all published templates.`
        );
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add language');
      }
    } catch {
      alert('Error creating language');
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  const handleToggleEnable = async (lang: Language) => {
    try {
      const res = await fetch('/api/v1/admin/languages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language_id: lang.language_id,
          is_enabled: !lang.is_enabled,
        }),
      });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update language');
      }
    } catch {
      alert('Error updating language');
    }
  };

  const handleSetDefault = async (lang: Language) => {
    if (lang.is_default) return;
    try {
      const res = await fetch('/api/v1/admin/languages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language_id: lang.language_id,
          is_default: true,
        }),
      });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to set default language');
      }
    } catch {
      alert('Error updating default language');
    }
  };

  const handleRetryTranslation = async (lang: Language) => {
    setRetryingLangId(lang.language_id);
    try {
      const res = await fetch(`/api/v1/admin/languages/${lang.language_id}/retry`, {
        method: 'POST',
      });
      if (res.ok) {
        setSuccessBanner(`Retrying translation job for ${lang.name}. Running safely without duplicate rows.`);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to retry translation');
      }
    } catch {
      alert('Error triggering retry');
    } finally {
      setRetryingLangId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Languages className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Language Governance &amp; Automated Translation</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
              FEAT-039
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
            When a language is added and enabled, background translation jobs automatically translate both UI and Context prompts for all published templates without manual intervention.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData()}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Language
          </Button>
        </div>
      </div>

      {/* Success alert */}
      {successBanner && (
        <Alert className="border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <AlertTitle className="text-xs font-semibold">Background Job Dispatched</AlertTitle>
          <AlertDescription className="text-xs flex items-center justify-between mt-0.5">
            <span>{successBanner}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSuccessBanner(null)}
              className="h-6 px-2 text-xs text-emerald-800 dark:text-emerald-300"
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Error state */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Localization Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={() => fetchData()} className="ml-4">
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Languages & Translation Progress Table */}
      <Card className="overflow-hidden border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Language</TableHead>
              <TableHead className="font-semibold text-center">ISO Code</TableHead>
              <TableHead className="font-semibold text-center">Default Fallback</TableHead>
              <TableHead className="font-semibold text-center">Status on Frontend</TableHead>
              <TableHead className="font-semibold min-w-[280px]">Translation Progress (Published Templates)</TableHead>
              <TableHead className="font-semibold text-center">Job Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading state: Skeletons
              Array.from({ length: 4 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="w-4 h-4 rounded-full" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-12 mx-auto rounded font-mono" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-6 w-24 mx-auto rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-6 w-16 mx-auto rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-full rounded" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-6 w-20 mx-auto rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-16 ml-auto rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : languages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">No languages registered</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Add a language to automatically translate all template prompts and catalog names.
                      </p>
                    </div>
                    <Button size="sm" onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Register Language
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              languages.map((l) => {
                const prog = l.progress;
                const total = prog?.total_templates ?? 0;
                const completed = prog?.completed ?? 0;
                const pending = prog?.pending ?? 0;
                const failed = prog?.failed ?? 0;
                const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                const isComplete = !l.is_default && total > 0 && completed === total && failed === 0 && pending === 0;
                const hasFailures = (prog?.failed ?? 0) > 0;
                const isTranslating = prog?.status === 'in_progress' || (prog?.in_progress ?? 0) > 0;

                return (
                  <TableRow key={l.language_id} className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                    {/* Language Name */}
                    <TableCell className="font-semibold text-slate-900 dark:text-white text-sm">
                      <div className="flex items-center gap-2.5">
                        <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{l.name}</span>
                      </div>
                    </TableCell>

                    {/* ISO Code */}
                    <TableCell className="text-center font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                      {l.language_id}
                    </TableCell>

                    {/* Default Fallback */}
                    <TableCell className="text-center">
                      {l.is_default ? (
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                          Primary Default
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(l)}
                          className="h-6 px-2 text-[10px] text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        >
                          Make Default
                        </Button>
                      )}
                    </TableCell>

                    {/* Enabled */}
                    <TableCell className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleEnable(l)}
                        className="h-6 p-0 hover:bg-transparent cursor-pointer transition-transform active:scale-95"
                        aria-label={`Toggle enable status for ${l.name}`}
                      >
                        <Badge
                          variant={l.is_enabled ? 'emerald' : 'secondary'}
                          className="text-[10px] uppercase font-semibold cursor-pointer"
                        >
                          {l.is_enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </Button>
                    </TableCell>

                    {/* Translation Progress Breakdown */}
                    <TableCell>
                      {l.is_default ? (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Authoring Baseline (100% Native)</span>
                        </div>
                      ) : (
                        <div className="space-y-1.5 py-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                              {completed} / {total} Templates ({pct}%)
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] font-mono">
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold" title="Completed translations">
                                {completed} done
                              </span>
                              {pending > 0 && (
                                <span className="text-amber-500" title="Pending translation">
                                  • {pending} pending
                                </span>
                              )}
                              {failed > 0 && (
                                <span className="text-rose-500 font-bold" title="Failed translations">
                                  • {failed} failed
                                </span>
                              )}
                            </div>
                          </div>
                          <Progress
                            value={pct}
                            className={`h-2 rounded-full ${
                              hasFailures ? '[&>div]:bg-amber-500' : isComplete ? '[&>div]:bg-emerald-500' : '[&>div]:bg-blue-600'
                            }`}
                          />
                        </div>
                      )}
                    </TableCell>

                    {/* Job Status */}
                    <TableCell className="text-center">
                      {l.is_default ? (
                        <Badge variant="outline" className="text-[10px] bg-slate-500/10 text-slate-500 border-slate-500/30">
                          Baseline
                        </Badge>
                      ) : isTranslating ? (
                        <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 animate-pulse flex items-center gap-1 mx-auto w-fit">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          In Progress
                        </Badge>
                      ) : isComplete ? (
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 flex items-center gap-1 mx-auto w-fit">
                          <Check className="w-3 h-3" />
                          Complete
                        </Badge>
                      ) : hasFailures ? (
                        <Badge variant="rose" className="text-[10px] flex items-center gap-1 mx-auto w-fit">
                          <XCircle className="w-3 h-3" />
                          Failed ({failed})
                        </Badge>
                      ) : pending > 0 ? (
                        <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 flex items-center gap-1 mx-auto w-fit">
                          <Clock className="w-3 h-3" />
                          Pending ({pending})
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">
                          Idle
                        </Badge>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      {!l.is_default && (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={retryingLangId === l.language_id || isTranslating}
                            onClick={() => handleRetryTranslation(l)}
                            className="h-7 px-2.5 text-xs text-slate-700 dark:text-slate-300"
                            title="Safe to retry without creating duplicates"
                          >
                            {retryingLangId === l.language_id ? (
                              <Loader2 className="w-3 h-3 animate-spin mr-1" />
                            ) : (
                              <RotateCcw className="w-3 h-3 mr-1" />
                            )}
                            Retry
                          </Button>
                          <Link href="/admin/templates">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-blue-600 dark:text-blue-400">
                              Templates <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* ADD LANGUAGE MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add &amp; Enable New Language</DialogTitle>
            <DialogDescription className="text-xs">
              Configure a language for the platform (FEAT-039). Adding and enabling will automatically launch a background AI translation job across all published templates.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="lang_name">Language Name *</Label>
              <Input
                id="lang_name"
                value={langName}
                onChange={(e) => setLangName(e.target.value)}
                placeholder="e.g. Deutsch, Español, 日本語, Malayalam"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lang_code">ISO 639-1 Code (e.g. de, es, ja, ml) *</Label>
              <Input
                id="lang_code"
                value={langCode}
                onChange={(e) => setLangCode(e.target.value)}
                placeholder="es"
                required
                className="font-mono"
              />
              <p className="text-[11px] text-slate-500">
                Both UI Prompt and Context Prompt will be translated separately into this language.
              </p>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
              >
                {isSubmittingAdd ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> Starting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Add &amp; Start Translation
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
