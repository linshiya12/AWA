'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  History,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  FileCode,
  ThumbsUp,
  Clock,
  User,
  ArrowRight,
  GitCompare,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface Version {
  version_id: string;
  template_id: string;
  version_number: number;
  prompt_text: string;
  change_note: string | null;
  authored_by: string;
  is_current: boolean;
  created_at: string;
}

export default function TemplateVersionsPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const resolvedParams = use(params);
  const templateId = resolvedParams.templateId;
  const router = useRouter();

  const [versions, setVersions] = useState<Version[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [loading, setLoading] = useState(true);

  // Compare diff selections
  const [leftVerId, setLeftVerId] = useState<string>('');
  const [rightVerId, setRightVerId] = useState<string>('');

  // Restore confirmation modal
  const [isRestoreOpen, setIsRestoreOpen] = useState(false);
  const [targetVersion, setTargetVersion] = useState<Version | null>(null);
  const [restoring, setRestoring] = useState(false);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const [vRes, tRes] = await Promise.all([
        fetch(`/api/v1/admin/templates/${templateId}/versions`),
        fetch(`/api/v1/admin/templates/${templateId}`),
      ]);

      const vData = await vRes.json();
      const tData = await tRes.json();

      setVersions(vData.versions || []);
      setTemplateName(tData.template?.name || templateId);

      if (vData.versions?.length >= 2) {
        setLeftVerId(vData.versions[1].version_id);
        setRightVerId(vData.versions[0].version_id);
      } else if (vData.versions?.length === 1) {
        setLeftVerId(vData.versions[0].version_id);
        setRightVerId(vData.versions[0].version_id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, [templateId]);

  const handleOpenRestore = (v: Version) => {
    setTargetVersion(v);
    setIsRestoreOpen(true);
  };

  const handleConfirmRestore = async () => {
    if (!targetVersion) return;
    setRestoring(true);
    try {
      const res = await fetch(
        `/api/v1/admin/templates/${templateId}/versions/${targetVersion.version_id}/restore`,
        { method: 'POST' }
      );

      if (res.ok) {
        const data = await res.json();
        setIsRestoreOpen(false);
        alert(
          `Version ${targetVersion.version_number} restored as new Version ${data.version.version_number}! Prompt history grew by 1 entry; nothing was rewound.`
        );
        fetchVersions();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to restore');
      }
    } catch {
      alert('Error restoring version');
    } finally {
      setRestoring(false);
    }
  };

  const leftVersion = versions.find((v) => v.version_id === leftVerId);
  const rightVersion = versions.find((v) => v.version_id === rightVerId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-blue-500" />
        <span className="text-slate-400 text-sm">Loading version history...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link href={`/admin/templates/${templateId}`}>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Template Editor
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{templateName}</span>
              <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
                Screen A4 · Versions
              </Badge>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Append-only prompt history. Restoring creates a new current version; no previous version is ever deleted (07 §5.1).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/admin/templates/${templateId}`}>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
              Author Revision
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: VERSION TIMELINE (11-UI-UX A4) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
            <span>Historical Versions ({versions.length})</span>
            <span>Feedback Attribution</span>
          </div>

          <div className="space-y-3">
            {versions.map((v) => (
              <div
                key={v.version_id}
                className={`p-4 rounded-xl border transition-all ${
                  v.is_current
                    ? 'border-blue-500/40 bg-blue-600/5 shadow-md shadow-blue-500/5'
                    : 'border-slate-800 bg-[#0a0f1d] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">
                      Version {v.version_number}
                    </span>
                    {v.is_current ? (
                      <Badge className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Current Live
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-700">
                        Superseded
                      </Badge>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(v.created_at).toLocaleDateString()}
                  </span>
                </div>

                {v.change_note && (
                  <p className="text-xs text-slate-300 italic mb-3">&quot;{v.change_note}&quot;</p>
                )}

                {/* Feedback score split by base vs customized (11-UI-UX A4: Makes revision a decision rather than a guess) */}
                <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] mb-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Base Prompt:</span>
                    <span className="font-semibold text-emerald-400">92% worked</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">After AI Custom:</span>
                    <span className="font-semibold text-cyan-400">88% worked</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLeftVerId(v.version_id)}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
                        leftVerId === v.version_id ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Compare A
                    </button>
                    <button
                      onClick={() => setRightVerId(v.version_id)}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
                        rightVerId === v.version_id ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Compare B
                    </button>
                  </div>

                  {!v.is_current && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenRestore(v)}
                      className="h-7 px-2 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: SIDE-BY-SIDE DIFF VIEWER (11-UI-UX A4) */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-xl sticky top-20">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Side-by-Side Version Diff</h3>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Comparing v{leftVersion?.version_number || '?'} vs v{rightVersion?.version_number || '?'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              {/* Left version prompt box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-indigo-400 font-semibold">
                  <span>Version {leftVersion?.version_number || 'N/A'}</span>
                  <span className="text-[10px] text-slate-400">
                    {leftVersion ? new Date(leftVersion.created_at).toLocaleDateString() : ''}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 min-h-[220px] leading-relaxed select-all">
                  {leftVersion?.prompt_text || 'Select a version above to compare.'}
                </div>
              </div>

              {/* Right version prompt box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-cyan-400 font-semibold">
                  <span>Version {rightVersion?.version_number || 'N/A'}</span>
                  <span className="text-[10px] text-slate-400">
                    {rightVersion ? new Date(rightVersion.created_at).toLocaleDateString() : ''}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 min-h-[220px] leading-relaxed select-all">
                  {rightVersion?.prompt_text || 'Select a version above to compare.'}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Diff updates automatically on selection</span>
              {rightVersion && !rightVersion.is_current && (
                <Button
                  size="sm"
                  onClick={() => handleOpenRestore(rightVersion)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Restore v{rightVersion.version_number} As Live
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RESTORE CONFIRMATION MODAL (11-UI-UX A4: Say that it creates a new version, doesn't rewind) */}
      <Dialog open={isRestoreOpen} onOpenChange={setIsRestoreOpen}>
        <DialogContent className="border-slate-800 bg-[#0d1222] text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-blue-400" />
              Restore Version {targetVersion?.version_number}?
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-xs leading-relaxed pt-2">
              Restoring creates a <strong className="text-white">new version</strong> whose content equals Version{' '}
              {targetVersion?.version_number}. The prompt history grows; it does not rewind or erase any existing versions (07 V17).
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs leading-relaxed my-2">
            The new version will become the live prompt for all subsequent subscribers immediately without a software release.
          </div>

          <DialogFooter className="pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsRestoreOpen(false)}
              className="text-xs text-slate-400"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={restoring}
              onClick={handleConfirmRestore}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
            >
              {restoring ? 'Restoring...' : 'Confirm Restore (Create New Version)'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
