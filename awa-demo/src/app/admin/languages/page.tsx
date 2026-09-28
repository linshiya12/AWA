'use client';

import React, { useState, useEffect } from 'react';
import {
  Languages,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Globe,
  Check,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
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

interface Language {
  language_id: string;
  name: string;
  is_default: boolean;
  is_enabled: boolean;
}

export default function AdminLanguagesPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add Language modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [langCode, setLangCode] = useState('');
  const [langName, setLangName] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const lRes = await fetch('/api/v1/admin/languages');
      if (!lRes.ok) throw new Error('Failed to retrieve languages');
      const lData = await lRes.json();
      setLanguages(lData.languages || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with localization backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!langCode.trim() || !langName.trim()) return;

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
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add language');
      }
    } catch {
      alert('Error creating language');
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Languages className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Language Governance</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
              Screen A8
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage multi-language presentation. Untranslated content automatically resolves to the default language fallback (FEAT-039).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
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

      {/* Error state */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Localization Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={fetchData} className="ml-4">
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Languages Table */}
      <Card className="overflow-hidden border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Language</TableHead>
              <TableHead className="font-semibold text-center">ISO Code</TableHead>
              <TableHead className="font-semibold text-center">Default Fallback</TableHead>
              <TableHead className="font-semibold text-center">Enabled on Frontend</TableHead>
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
                </TableRow>
              ))
            ) : languages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">No languages registered</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Add a language to enable localized prompt guidance and category names.
                      </p>
                    </div>
                    <Button size="sm" onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                      <Plus className="w-3.5 h-3.5 mr-1.5" /> Register Language
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              languages.map((l) => (
                <TableRow key={l.language_id} className="transition-colors">
                  <TableCell className="font-semibold text-slate-900 dark:text-white text-sm">
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{l.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    {l.language_id}
                  </TableCell>

                  <TableCell className="text-center">
                    {l.is_default ? (
                      <Badge variant="emerald" className="text-[10px]">
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* ADD LANGUAGE MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Language</DialogTitle>
            <DialogDescription className="text-xs">
              Configure a language for the interface and catalog (FEAT-039). It will immediately become selectable once enabled.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="lang_name">Language Name *</Label>
              <Input
                id="lang_name"
                value={langName}
                onChange={(e) => setLangName(e.target.value)}
                placeholder="e.g. Deutsch, 日本語, Malayalam"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="lang_code">ISO Code (e.g. de, ja, ml) *</Label>
              <Input
                id="lang_code"
                value={langCode}
                onChange={(e) => setLangCode(e.target.value)}
                placeholder="de"
                required
                className="font-mono"
              />
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
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                Add Language
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
