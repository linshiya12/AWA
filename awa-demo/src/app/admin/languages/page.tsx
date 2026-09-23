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

interface Translation {
  translation_id: string;
  language_id: string;
  entity_type: string;
  entity_id: string;
  field_name: string;
  translated_text: string;
}

export default function AdminLanguagesPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Language modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [langCode, setLangCode] = useState('');
  const [langName, setLangName] = useState('');

  // Translation edit state
  const [selectedLang, setSelectedLang] = useState<string>('es');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lRes, tRes] = await Promise.all([
        fetch('/api/v1/admin/languages'),
        fetch('/api/v1/admin/translations'),
      ]);
      const lData = await lRes.json();
      const tData = await tRes.json();
      setLanguages(lData.languages || []);
      setTranslations(tData.translations || []);
    } catch (err) {
      console.error(err);
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
      alert('Error adding language');
    }
  };

  const handleToggleEnable = async (lang: Language) => {
    // Guard: Cannot disable default language (07 V19 & 11-UI-UX A8)
    if (lang.is_default && lang.is_enabled) {
      alert('Cannot disable the default language (English). Set another language as default first.');
      return;
    }

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
        alert(err.error || 'Failed to toggle status');
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
          is_enabled: true,
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
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Language & Translation Governance</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
              Screen A8
            </Badge>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage multi-language presentation. Untranslated content automatically resolves to the default language fallback (FEAT-039).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Language
          </Button>
        </div>
      </div>

      {/* Languages Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#080d1a] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Language</th>
                <th className="py-3 px-4 font-semibold text-center">ISO Code</th>
                <th className="py-3 px-4 font-semibold text-center">Default Fallback</th>
                <th className="py-3 px-4 font-semibold text-center">Enabled on Frontend</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-4 h-4 animate-spin inline-block mr-2 text-blue-500" />
                    Loading languages...
                  </td>
                </tr>
              ) : (
                languages.map((l) => (
                  <tr key={l.language_id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white text-sm flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span>{l.name}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-cyan-400 font-bold">
                      {l.language_id}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {l.is_default ? (
                        <Badge className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Primary Default
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(l)}
                          className="h-6 px-2 text-[10px] text-slate-400 hover:text-white"
                        >
                          Make Default
                        </Button>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleEnable(l)}
                        className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase border transition-all ${
                          l.is_enabled
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {l.is_enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLang(l.language_id)}
                        className="h-8 text-xs text-blue-400 hover:text-blue-300"
                      >
                        View Translations →
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Translations Overview Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Languages className="w-4 h-4 text-blue-400" />
              Active Translations Matrix: &apos;{selectedLang}&apos;
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Specific field translations stored in the public database (07 §4.9). Untranslated content silently renders default English fallback.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {translations
            .filter((t) => t.language_id === selectedLang)
            .map((t) => (
              <div
                key={t.translation_id}
                className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[10px] uppercase text-cyan-400 border-cyan-500/30">
                      {t.entity_type} · {t.field_name}
                    </Badge>
                    <span className="font-mono text-slate-400 text-[11px]">{t.entity_id}</span>
                  </div>
                  <span className="text-white font-medium">&quot;{t.translated_text}&quot;</span>
                </div>
                <Badge className="text-[10px] bg-emerald-500/10 text-emerald-400">Active</Badge>
              </div>
            ))}

          {translations.filter((t) => t.language_id === selectedLang).length === 0 && (
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-400 text-center">
              No custom translations registered for this language yet. All catalog fields fall back to default English.
            </div>
          )}
        </div>
      </div>

      {/* ADD LANGUAGE MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="border-slate-800 bg-[#0d1222] text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Language</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Configure a language for the interface and catalog (FEAT-039). It will immediately become selectable once enabled.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs mt-2">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Language Name *</label>
              <Input
                value={langName}
                onChange={(e) => setLangName(e.target.value)}
                placeholder="e.g. Deutsch, 日本語, മലയാളം"
                required
                className="bg-slate-900 border-slate-700 text-slate-100 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">ISO Code (e.g. de, ja, ml) *</label>
              <Input
                value={langCode}
                onChange={(e) => setLangCode(e.target.value)}
                placeholder="de"
                required
                className="bg-slate-900 border-slate-700 text-slate-100 font-mono text-xs"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddOpen(false)}
                className="text-xs text-slate-400"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
                Add Language
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
