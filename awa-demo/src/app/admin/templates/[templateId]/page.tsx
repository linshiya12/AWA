'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Save,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileCode,
  Wrench,
  BookOpen,
  Image as ImageIcon,
  Sliders,
  Languages,
  History,
  Lock,
  ExternalLink,
  Plus,
  Trash2,
  RefreshCw,
  Layers,
  HelpCircle,
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

interface TemplateDetails {
  template: {
    template_id: string;
    category_id: string;
    name: string;
    description: string;
    preview_image?: string;
    status: 'draft' | 'published' | 'hidden';
    current_version_id: string | null;
    is_sample: boolean;
    difficulty?: string;
    tags?: string[];
  };
  category: {
    category_id: string;
    name: string;
    path: string;
    extra_prompt_words?: string;
  };
  attributes: Array<{
    attribute_id: string;
    attribute_type: string;
    attribute_value: string;
  }>;
  resolvedTools: Array<{
    assignment_id: string;
    tool_id: string;
    model_id: string | null;
    isInherited: boolean;
    tool: {
      tool_id: string;
      name: string;
      reasoning: string;
      destination: string;
    };
    model?: {
      name: string;
    };
  }>;
  guidance: {
    guidance_id: string;
    presentation: string;
    isInherited: boolean;
    steps: Array<{
      step_id: string;
      position: number;
      instruction: string;
    }>;
  } | null;
  currentVersion: {
    version_id: string;
    version_number: number;
    prompt_text: string;
    ui_prompt?: string | null;
    context_prompt?: string | null;
    change_note: string | null;
    created_at: string;
  } | null;
}

export default function TemplateEditorPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const resolvedParams = use(params);
  const templateId = resolvedParams.templateId;
  const router = useRouter();

  const [data, setData] = useState<TemplateDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'details' | 'prompt' | 'tools' | 'guidance' | 'media' | 'attributes' | 'translations'
  >('prompt');

  // Form states
  const [detailsForm, setDetailsForm] = useState({
    name: '',
    description: '',
    difficulty: 'beginner',
    is_sample: false,
    preview_image: '',
    tags: '',
  });

  const [promptText, setPromptText] = useState('');
  const [uiPrompt, setUiPrompt] = useState('');
  const [contextPrompt, setContextPrompt] = useState('');
  const [changeNote, setChangeNote] = useState('');
  const [savingPrompt, setSavingPrompt] = useState(false);

  // Preview Gate Modal (UR-§8 & 11-UI-UX A3: Preview is the quality gate)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{
    finalPrompt: string;
    extraWordsAppended: string | null;
  } | null>(null);

  // Tools state
  const [availableTools, setAvailableTools] = useState<any[]>([]);
  const [newToolId, setNewToolId] = useState('');

  // Guidance state
  const [guidanceSteps, setGuidanceSteps] = useState<string[]>([]);

  // Attributes state
  const [attributesList, setAttributesList] = useState<
    Array<{ attribute_type: string; attribute_value: string }>
  >([]);

  // Translations state
  const [languages, setLanguages] = useState<any[]>([]);
  const [translations, setTranslations] = useState<Record<string, { name: string; description: string }>>({});

  const fetchTemplate = async () => {
    setLoading(true);
    try {
      const [tplRes, toolsRes, langRes] = await Promise.all([
        fetch(`/api/v1/admin/templates/${templateId}`),
        fetch('/api/v1/admin/tools'),
        fetch('/api/v1/admin/languages'),
      ]);

      if (!tplRes.ok) {
        alert('Template not found');
        router.push('/admin/templates');
        return;
      }

      const tplData: TemplateDetails = await tplRes.json();
      const toolsData = await toolsRes.json();
      const langData = await langRes.json();

      setData(tplData);
      setAvailableTools(toolsData.tools || []);
      setLanguages(langData.languages || []);

      // Populate forms
      setDetailsForm({
        name: tplData.template.name,
        description: tplData.template.description,
        difficulty: tplData.template.difficulty || 'beginner',
        is_sample: tplData.template.is_sample,
        preview_image: tplData.template.preview_image || '',
        tags: tplData.template.tags?.join(', ') || '',
      });

      if (tplData.currentVersion) {
        setPromptText(tplData.currentVersion.prompt_text || '');
        setUiPrompt(tplData.currentVersion.ui_prompt || '');
        setContextPrompt(tplData.currentVersion.context_prompt || '');
      }

      setAttributesList(
        tplData.attributes.map((a) => ({
          attribute_type: a.attribute_type,
          attribute_value: a.attribute_value,
        }))
      );

      if (tplData.guidance) {
        setGuidanceSteps(tplData.guidance.steps.map((s) => s.instruction));
      } else {
        setGuidanceSteps([
          'Paste this prompt into the recommended AI tool prompt box.',
          'Review generated results and upscale the highest fidelity output.',
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  // Handle Details Save
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/v1/admin/templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: detailsForm.name,
          description: detailsForm.description,
          difficulty: detailsForm.difficulty,
          is_sample: detailsForm.is_sample,
          preview_image: detailsForm.preview_image,
          tags: detailsForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        alert('Template details saved.');
        fetchTemplate();
      }
    } catch {
      alert('Error saving details');
    }
  };

  // Live Preview Modal Trigger (Rule: Preview Quality Gate)
  const handleTriggerPreview = async () => {
    let effectivePrompt = promptText.trim();
    if (!effectivePrompt && (uiPrompt.trim() || contextPrompt.trim())) {
      effectivePrompt = [
        uiPrompt.trim() ? `[UI & IMPLEMENTATION PROMPT]\n${uiPrompt.trim()}` : '',
        contextPrompt.trim() ? `[BUSINESS CONTEXT PROMPT]\n${contextPrompt.trim()}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');
    }

    if (!effectivePrompt) {
      alert('Write a prompt before previewing.');
      return;
    }
    try {
      const res = await fetch(`/api/v1/admin/templates/${templateId}/versions/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt_text: effectivePrompt }),
      });
      const preview = await res.json();
      setPreviewData(preview);
      setIsPreviewOpen(true);
    } catch {
      alert('Error generating live preview');
    }
  };

  // Save / Publish Prompt (Enforces two-step write: writes private DB first, updates public pointer)
  const handleSavePrompt = async (publishImmediately: boolean) => {
    let effectivePrompt = promptText.trim();
    if (!effectivePrompt && (uiPrompt.trim() || contextPrompt.trim())) {
      effectivePrompt = [
        uiPrompt.trim() ? `[UI & IMPLEMENTATION PROMPT]\n${uiPrompt.trim()}` : '',
        contextPrompt.trim() ? `[BUSINESS CONTEXT PROMPT]\n${contextPrompt.trim()}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');
    }

    if (!effectivePrompt && !uiPrompt.trim() && !contextPrompt.trim()) {
      alert('Prompt text cannot be empty');
      return;
    }

    setSavingPrompt(true);
    try {
      const res = await fetch(`/api/v1/admin/templates/${templateId}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt_text: effectivePrompt || promptText,
          ui_prompt: uiPrompt.trim() || undefined,
          context_prompt: contextPrompt.trim() || undefined,
          change_note: changeNote || (publishImmediately ? 'Published new prompt version' : 'Draft version'),
          publish: publishImmediately,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setIsPreviewOpen(false);
        setChangeNote('');
        alert(
          publishImmediately
            ? `Prompt published live as Version ${result.version.version_number}! Users will now receive this prompt without a software release.`
            : 'Draft version saved to private database.'
        );
        fetchTemplate();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to save version');
      }
    } catch {
      alert('Error saving prompt version');
    } finally {
      setSavingPrompt(false);
    }
  };

  // Add Direct Tool Assignment
  const handleAddToolAssignment = async () => {
    if (!newToolId) return;
    try {
      const res = await fetch('/api/v1/admin/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope_type: 'template',
          scope_id: templateId,
          tool_id: newToolId,
        }),
      });
      if (res.ok) {
        setNewToolId('');
        fetchTemplate();
      }
    } catch {
      alert('Error assigning tool');
    }
  };

  // Save Guidance Steps
  const handleSaveGuidance = async () => {
    try {
      const res = await fetch('/api/v1/admin/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope_type: 'template',
          scope_id: templateId,
          presentation: 'written',
          steps: guidanceSteps,
        }),
      });
      if (res.ok) {
        alert('Guidance steps saved.');
        fetchTemplate();
      }
    } catch {
      alert('Error saving guidance');
    }
  };

  // Save Attributes
  const handleSaveAttributes = async () => {
    try {
      const res = await fetch(`/api/v1/admin/templates/${templateId}/attributes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attributes: attributesList }),
      });
      if (res.ok) {
        alert('Filter attributes saved.');
        fetchTemplate();
      }
    } catch {
      alert('Error saving attributes');
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-blue-500" />
        <span className="text-slate-400 text-sm">Loading template editor...</span>
      </div>
    );
  }

  const { template, category, resolvedTools, guidance, currentVersion } = data;

  const TABS = [
    { id: 'prompt', label: 'Prompt Authoring', icon: FileCode, badge: currentVersion ? `v${currentVersion.version_number}` : 'Missing' },
    { id: 'details', label: 'Details', icon: Sliders },
    { id: 'tools', label: 'AI Tools & Models', icon: Wrench, count: resolvedTools.length },
    { id: 'guidance', label: 'Guidance Steps', icon: BookOpen, count: guidanceSteps.length },
    { id: 'media', label: 'Media', icon: ImageIcon },
    { id: 'attributes', label: 'Filter Attributes', icon: Sparkles, count: attributesList.length },
    { id: 'translations', label: 'Translations', icon: Languages },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link href="/admin/templates">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Templates
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">{template.name}</h1>
              <Badge
                variant={template.status === 'published' ? 'default' : 'secondary'}
                className="text-[10px] uppercase font-semibold"
              >
                {template.status}
              </Badge>
              {template.is_sample && (
                <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/30">
                  Free Sample
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Node: <span className="text-slate-200 font-medium">{category.name}</span> ({category.path})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href={`/admin/templates/${templateId}/versions`}>
            <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs">
              <History className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              Version History
            </Button>
          </Link>
          <Link href={`/template/${templateId}`} target="_blank">
            <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              View Public Card
            </Button>
          </Link>
        </div>
      </div>

      {/* 7 Tabs Bar (11-UI-UX A3) */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 overflow-x-auto pb-px">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#0e1424] text-blue-400 border-t-2 border-x border-blue-500 border-x-slate-800'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    tab.badge === 'Missing'
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
              {tab.count !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREA */}
      <div className="rounded-2xl border border-slate-800 bg-[#0a0f1d] p-6 shadow-xl">
        {/* TAB 1: PROMPT AUTHORING & PREVIEW (QUALITY GATE) */}
        {activeTab === 'prompt' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-blue-400" />
                  Prompt Content & Live Quality Gate
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  The curated prompt is the core product. Stored strictly in the private database; never exposed in public endpoints.
                </p>
              </div>

              {currentVersion && (
                <div className="text-right">
                  <span className="text-[11px] text-slate-400">Current live version:</span>
                  <span className="ml-1.5 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-xs font-semibold">
                    Version {currentVersion.version_number}
                  </span>
                </div>
              )}
            </div>

            {/* Check if website template */}
            {category.name === 'Websites' || category.path.includes('website') || template.tags?.includes('Web') ? (
              <div className="space-y-6">
                <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/5 text-xs text-blue-300 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-blue-200">Dual Prompt Architecture (Websites):</span> Website templates deliver two separate prompts: a <strong>UI Prompt</strong> for generative code tools (v0, Cursor, Framer, Lovable) and a <strong>Context Prompt</strong> for LLM product intelligence (Claude, ChatGPT).
                  </div>
                </div>

                {/* 1. UI Prompt */}
                <div className="space-y-2 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
                  <label className="block text-xs font-semibold text-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      1. UI Prompt (Visual Design, Components, Layout & Styling) *
                    </span>
                    <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                      {uiPrompt.length} chars
                    </span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Describes visual design and implementation: layout, components, typography, colors, responsive behavior, interactions, and accessibility. Optimized for v0, Framer, Cursor, Lovable, Bolt.
                  </p>
                  <textarea
                    value={uiPrompt}
                    onChange={(e) => setUiPrompt(e.target.value)}
                    placeholder="Describe UI layout, React components, Tailwind tokens, dark mode, responsive behavior..."
                    rows={6}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-4 text-slate-100 text-xs font-mono leading-relaxed focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* 2. Context Prompt */}
                <div className="space-y-2 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
                  <label className="block text-xs font-semibold text-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      2. Context Prompt (Business Identity, Audience & Goals) *
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {contextPrompt.length} chars
                    </span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Describes what the website is for: product identity, target audience, primary goals, page sections, content direction, tone, and calls to action. Optimized for LLM system prompts (ChatGPT, Claude).
                  </p>
                  <textarea
                    value={contextPrompt}
                    onChange={(e) => setContextPrompt(e.target.value)}
                    placeholder="Describe business purpose, audience personas, key page sections, brand tone, and CTAs..."
                    rows={6}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-4 text-slate-100 text-xs font-mono leading-relaxed focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Collapsible Unified Prompt for legacy compatibility */}
                <details className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/30 text-xs">
                  <summary className="cursor-pointer text-slate-400 hover:text-slate-200 font-medium">
                    View Unified Prompt Text (Concatenated for single-prompt API backwards compatibility)
                  </summary>
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder="Leave blank to automatically synthesize from UI and Context prompts above..."
                      rows={5}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-300 text-xs font-mono"
                    />
                  </div>
                </details>
              </div>
            ) : (
              /* Single prompt textarea for standard templates */
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Prompt Text (Standard Natural Language) *</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {promptText.length} characters
                  </span>
                </label>
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Write finished, ready-to-run prompt text..."
                  rows={6}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 p-4 text-slate-100 text-sm font-mono leading-relaxed focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            )}

            {/* Category Extra Words Banner (04 §5.1) */}
            {category.extra_prompt_words && (
              <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-xs text-indigo-300 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-indigo-200">Category Inheritance Notice:</span> The parent category{' '}
                  <strong className="text-white">&quot;{category.name}&quot;</strong> has standing extra prompt words:{' '}
                  <span className="italic font-mono text-white">&quot;{category.extra_prompt_words}&quot;</span>.
                  These are automatically appended to the final user prompt. Click Preview below to view the combined prompt.
                </div>
              </div>
            )}

            {/* Change note input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Version Change Note (Visible in version history diffs)
              </label>
              <Input
                value={changeNote}
                onChange={(e) => setChangeNote(e.target.value)}
                placeholder="e.g. Swapped studio focal length to 85mm; reduced background specular glare"
                className="bg-slate-900 border-slate-700 text-xs"
              />
            </div>

            {/* Action Bar (UR-§8 & 11-UI-UX A3: Preview is the quality gate) */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Writes Private Database first, then updates Public current pointer (06 §5.4).</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTriggerPreview}
                  className="border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs flex-1 sm:flex-none"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                  Preview Before Publish
                </Button>

                <Button
                  type="button"
                  disabled={savingPrompt || !promptText.trim()}
                  onClick={() => handleSavePrompt(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex-1 sm:flex-none"
                >
                  {savingPrompt ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                  Publish Live (v{currentVersion ? currentVersion.version_number + 1 : 1})
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TEMPLATE DETAILS */}
        {activeTab === 'details' && (
          <form onSubmit={handleSaveDetails} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Template Name</label>
              <Input
                value={detailsForm.name}
                onChange={(e) => setDetailsForm({ ...detailsForm, name: e.target.value })}
                required
                className="bg-slate-900 border-slate-700 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Description (What it produces — shown behind the paywall)
              </label>
              <textarea
                value={detailsForm.description}
                onChange={(e) => setDetailsForm({ ...detailsForm, description: e.target.value })}
                rows={3}
                required
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Skill Difficulty</label>
                <select
                  value={detailsForm.difficulty}
                  onChange={(e) => setDetailsForm({ ...detailsForm, difficulty: e.target.value })}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 text-xs"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Tags</label>
                <Input
                  value={detailsForm.tags}
                  onChange={(e) => setDetailsForm({ ...detailsForm, tags: e.target.value })}
                  className="bg-slate-900 border-slate-700 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is_sample_edit"
                checked={detailsForm.is_sample}
                onChange={(e) => setDetailsForm({ ...detailsForm, is_sample: e.target.checked })}
                className="rounded border-slate-700 bg-slate-900 text-blue-600"
              />
              <label htmlFor="is_sample_edit" className="text-slate-300 font-medium">
                Free Sample Template (Readable without subscription — 05-MVP.md §3.3)
              </label>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
                Save Details
              </Button>
            </div>
          </form>
        )}

        {/* TAB 3: TOOLS & INHERITANCE (11-UI-UX A3: Inheritance must be visible!) */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-400" />
                  Recommended AI Tools & Inheritance (FEAT-035)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Shows what is inherited from parent categories versus direct template overrides.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={newToolId}
                  onChange={(e) => setNewToolId(e.target.value)}
                  className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200"
                >
                  <option value="">Select tool to assign...</option>
                  {availableTools.map((t) => (
                    <option key={t.tool_id} value={t.tool_id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <Button size="sm" onClick={handleAddToolAssignment} className="bg-blue-600 hover:bg-blue-500 text-xs">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Override / Assign
                </Button>
              </div>
            </div>

            {/* Resolved tools list */}
            <div className="space-y-3">
              {resolvedTools.map((asgn) => (
                <div
                  key={asgn.assignment_id}
                  className="p-4 rounded-xl border border-slate-800 bg-[#0d1222] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 text-xs">
                      {asgn.tool.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{asgn.tool.name}</span>
                        {asgn.model && (
                          <span className="text-xs font-mono text-cyan-400">({asgn.model.name})</span>
                        )}
                        {asgn.isInherited ? (
                          <Badge variant="outline" className="text-[10px] bg-slate-800 text-slate-400 border-slate-700">
                            Inherited from {category.name}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] bg-blue-500/20 text-blue-300 border-blue-500/30">
                            Direct Override
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{asgn.tool.reasoning}</p>
                    </div>
                  </div>

                  {!asgn.isInherited && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        await fetch(`/api/v1/admin/assignments?id=${asgn.assignment_id}`, { method: 'DELETE' });
                        fetchTemplate();
                      }}
                      className="text-rose-400 hover:text-rose-300 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Remove Override
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GUIDANCE STEPS (FEAT-036) */}
        {activeTab === 'guidance' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  Step-by-Step Guidance Walkthrough (FEAT-036)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ordered instructions showing creators exactly how to run the prompt on external tools.
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setGuidanceSteps([...guidanceSteps, ''])}
                className="bg-blue-600 hover:bg-blue-500 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Step
              </Button>
            </div>

            <div className="space-y-3">
              {guidanceSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 font-bold text-xs flex items-center justify-center shrink-0 mt-1.5">
                    {idx + 1}
                  </span>
                  <textarea
                    value={step}
                    onChange={(e) => {
                      const next = [...guidanceSteps];
                      next[idx] = e.target.value;
                      setGuidanceSteps(next);
                    }}
                    rows={2}
                    className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setGuidanceSteps(guidanceSteps.filter((_, i) => i !== idx));
                    }}
                    className="text-rose-400 hover:text-rose-300 p-2 mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <Button onClick={handleSaveGuidance} className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
                Save Guidance Steps
              </Button>
            </div>
          </div>
        )}

        {/* TAB 5: MEDIA */}
        {activeTab === 'media' && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              Preview Card Image & Media Assets (FEAT-031)
            </h3>
            <p className="text-slate-400">
              Representative image or video shown on the 16:9 card in public catalogs and showcases.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Image Presentation URL</label>
                <Input
                  value={detailsForm.preview_image}
                  onChange={(e) => setDetailsForm({ ...detailsForm, preview_image: e.target.value })}
                  placeholder="/images/templates/tpl_1_wide.jpg"
                  className="bg-slate-900 border-slate-700 text-xs mb-3"
                />
                <Button onClick={handleSaveDetails} size="sm" className="bg-blue-600 hover:bg-blue-500 text-xs">
                  Update Media Reference
                </Button>
              </div>

              <div>
                <span className="block text-slate-300 font-medium mb-1">Current Card Aspect (16:9)</span>
                <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-900 relative">
                  {detailsForm.preview_image ? (
                    <Image
                      src={detailsForm.preview_image}
                      alt={template.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      No Preview
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ATTRIBUTES (FEAT-004) */}
        {activeTab === 'attributes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Template Filter Attributes (FEAT-004)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Attributes used by catalog filter controls (style, mood, format, orientation, difficulty).
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setAttributesList([...attributesList, { attribute_type: 'style', attribute_value: '' }])}
                className="bg-blue-600 hover:bg-blue-500 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Tag
              </Button>
            </div>

            <div className="space-y-3">
              {attributesList.map((attr, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <select
                    value={attr.attribute_type}
                    onChange={(e) => {
                      const next = [...attributesList];
                      next[idx].attribute_type = e.target.value;
                      setAttributesList(next);
                    }}
                    className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200"
                  >
                    <option value="style">Style</option>
                    <option value="format">Format / Orientation</option>
                    <option value="mood">Mood</option>
                    <option value="difficulty">Difficulty</option>
                  </select>

                  <Input
                    value={attr.attribute_value}
                    onChange={(e) => {
                      const next = [...attributesList];
                      next[idx].attribute_value = e.target.value;
                      setAttributesList(next);
                    }}
                    placeholder="e.g. minimalist, 16:9, luxury, octane"
                    className="bg-slate-900 border-slate-700 text-xs flex-1"
                  />

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAttributesList(attributesList.filter((_, i) => i !== idx));
                    }}
                    className="text-rose-400 hover:text-rose-300 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <Button onClick={handleSaveAttributes} className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
                Save Attributes
              </Button>
            </div>
          </div>
        )}

        {/* TAB 7: TRANSLATIONS (FEAT-039) */}
        {activeTab === 'translations' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Languages className="w-4 h-4 text-blue-400" />
                Language Content Variations (FEAT-039)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Per-language overrides for template title and description. Untranslated fields automatically fall back to default English (never blank).
              </p>
            </div>

            <div className="space-y-4">
              {languages
                .filter((l) => !l.is_default)
                .map((lang) => (
                  <div key={lang.language_id} className="p-4 rounded-xl border border-slate-800 bg-[#0d1222] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 text-xs">
                        {lang.name} ({lang.language_id})
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Fallback: English (Default)
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Translated Name (Fallback: &quot;{template.name}&quot;)
                      </label>
                      <Input
                        placeholder={template.name}
                        className="bg-slate-900 border-slate-700 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Translated Description
                      </label>
                      <textarea
                        placeholder={template.description}
                        rows={2}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 text-xs"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* LIVE PREVIEW QUALITY GATE DIALOG (11-UI-UX A3 & UR-§8) */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="border-slate-800 bg-[#0d1222] text-slate-100 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Eye className="w-5 h-5 text-blue-400" />
              Live Subscriber Prompt Preview (Quality Gate)
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              This is the exact string a paying subscriber will copy and take to external tools (Midjourney, FLUX, etc.).
            </DialogDescription>
          </DialogHeader>

          {previewData && (
            <div className="space-y-4 text-xs my-2">
              <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 font-mono text-sm leading-relaxed text-blue-100 select-all">
                {previewData.finalPrompt}
              </div>

              {previewData.extraWordsAppended && (
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 text-[11px]">
                  <strong>Note:</strong> Appended extra category prompt words:{' '}
                  <span className="text-cyan-400 font-mono">&quot;{previewData.extraWordsAppended}&quot;</span>.
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsPreviewOpen(false)}
              className="text-xs text-slate-400"
            >
              Back to Editing
            </Button>
            <Button
              type="button"
              disabled={savingPrompt}
              onClick={() => handleSavePrompt(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
            >
              Approve & Publish Live →
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
