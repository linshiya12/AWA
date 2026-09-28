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
  Upload,
  ChevronUp,
  ChevronDown,
  ZoomIn,
  Check,
  X,
  FileText,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface AdminGuidanceStepItem {
  step_id: string;
  position: number;
  title: string;
  instruction: string;
  tip: string;
  media_id: string | null;
  image_url: string | null;
  image_alt: string | null;
  media?: {
    media_id: string;
    storage_reference: string;
    original_filename: string;
    size: number;
    kind: string;
  } | null;
  isUploading?: boolean;
  uploadProgress?: number;
  validationError?: string | null;
  imageLoadError?: boolean;
}

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
      title?: string;
      tip?: string;
      media_id?: string | null;
      image_url?: string | null;
      image_alt?: string | null;
      media?: {
        media_id: string;
        storage_reference: string;
        original_filename: string;
        size: number;
        kind: 'image' | 'video';
      } | null;
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

const PRESET_COLLECTIONS = [
  {
    category: 'Image Generation (Midjourney / FLUX)',
    presets: [
      { url: '/images/guidance/tpl_1/step-1.svg', title: 'Open Midjourney / Tool Prompt Box', alt: 'Midjourney web UI with prompt bar focused' },
      { url: '/images/guidance/tpl_1/step-2.svg', title: 'Tune Aspect Ratio & Stylize', alt: 'Midjourney parameter controls --ar 16:9 and --stylize 250' },
      { url: '/images/guidance/tpl_1/step-3.svg', title: 'Seed Consistency & Variations', alt: 'Midjourney grid results and seed setting' },
      { url: '/images/guidance/tpl_1/step-4.svg', title: 'High Fidelity Upscale', alt: 'Upscale Subtle button selected in Midjourney' },
      { url: '/images/guidance/tpl_1/step-5.svg', title: 'Vary Region & Inpainting', alt: 'Midjourney inpainting brush highlighting region' },
      { url: '/images/guidance/tpl_1/step-6.svg', title: 'Master Export & Resolution', alt: 'Full resolution image download panel' },
    ],
  },
  {
    category: 'Video Generation (Runway / Pika)',
    presets: [
      { url: '/images/guidance/tpl_video_1/step-1.svg', title: 'Create Runway Gen-3 Session', alt: 'Runway dashboard new video generation workspace' },
      { url: '/images/guidance/tpl_video_1/step-2.svg', title: 'Configure Camera Motion & Prompt', alt: 'Camera control panel pan right and slow tilt up' },
      { url: '/images/guidance/tpl_video_1/step-3.svg', title: 'Motion Brush & Velocity Tuning', alt: 'Runway motion brush highlighting fluid dynamics' },
      { url: '/images/guidance/tpl_video_1/step-4.svg', title: 'Seed & Resolution Locking', alt: 'Seed parameter fixed with 4K resolution toggle' },
      { url: '/images/guidance/tpl_video_1/step-5.svg', title: 'Keyframe Lip Sync & Audio', alt: 'Timeline audio sync and voiceover track' },
      { url: '/images/guidance/tpl_video_1/step-6.svg', title: 'Export ProRes & MP4 Video', alt: 'Export video dialog at 60fps' },
    ],
  },
  {
    category: 'Presentation Slides (Gamma / Deck)',
    presets: [
      { url: '/images/guidance/tpl_slide_1/step-1.svg', title: 'Generate New Deck from Prompt', alt: 'Gamma App prompt generator box' },
      { url: '/images/guidance/tpl_slide_1/step-2.svg', title: 'Apply Visual Theme & Typography', alt: 'Theme selector with dark obsidian palette' },
      { url: '/images/guidance/tpl_slide_1/step-3.svg', title: 'Refine Slide Cards & Layouts', alt: 'Grid view of generated presentation cards' },
      { url: '/images/guidance/tpl_slide_1/step-4.svg', title: 'AI Visual Replacement & Icons', alt: 'AI image replace popup within slide block' },
      { url: '/images/guidance/tpl_slide_1/step-5.svg', title: 'Export Presentation PDF & PPTX', alt: 'Export dialog showing PDF and PowerPoint options' },
    ],
  },
  {
    category: 'Websites & Apps (v0 / Cursor / Framer)',
    presets: [
      { url: '/images/guidance/tpl_web_1/step-1.svg', title: 'Initialize v0 Generative Workspace', alt: 'v0.dev chat prompt interface with React toggle' },
      { url: '/images/guidance/tpl_web_1/step-2.svg', title: 'Inject Dual UI & Context Prompt', alt: 'Dual prompt specification pasted into workspace' },
      { url: '/images/guidance/tpl_web_1/step-3.svg', title: 'Interactive Component Preview', alt: 'Interactive canvas rendering responsive hero section' },
      { url: '/images/guidance/tpl_web_1/step-4.svg', title: 'Tailwind Tokens & Dark Mode Review', alt: 'Tailwind CSS classes inspected in code editor panel' },
      { url: '/images/guidance/tpl_web_1/step-5.svg', title: 'Mobile Responsive Viewport Testing', alt: 'Responsive preview mode testing mobile layout' },
      { url: '/images/guidance/tpl_web_1/step-6.svg', title: 'Export Next.js Project Code', alt: 'Code export modal with copy command for Next.js' },
    ],
  },
];

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
  const [guidanceSteps, setGuidanceSteps] = useState<AdminGuidanceStepItem[]>([]);
  const [guidancePresentation, setGuidancePresentation] = useState<'written' | 'recorded' | 'both'>('written');
  const [guidanceIsInherited, setGuidanceIsInherited] = useState(false);
  const [guidanceStatusMsg, setGuidanceStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSavingGuidance, setIsSavingGuidance] = useState(false);
  const [previewLightboxStep, setPreviewLightboxStep] = useState<AdminGuidanceStepItem | null>(null);
  const [presetModalStepIndex, setPresetModalStepIndex] = useState<number | null>(null);

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

      if (tplData.guidance && tplData.guidance.steps && tplData.guidance.steps.length > 0) {
        setGuidancePresentation((tplData.guidance.presentation as any) || 'written');
        setGuidanceIsInherited(Boolean(tplData.guidance.isInherited));
        setGuidanceSteps(
          tplData.guidance.steps.map((s, idx) => ({
            step_id: s.step_id || `step-${idx + 1}`,
            position: s.position !== undefined ? s.position : idx + 1,
            title: s.title || `Step ${idx + 1}`,
            instruction: s.instruction || '',
            tip: s.tip || '',
            media_id: s.media_id || null,
            image_url: s.image_url || s.media?.storage_reference || null,
            image_alt: s.image_alt || null,
            media: s.media || null,
            isUploading: false,
            uploadProgress: 0,
            validationError: null,
            imageLoadError: false,
          }))
        );
      } else {
        setGuidancePresentation('written');
        setGuidanceIsInherited(false);
        setGuidanceSteps([
          {
            step_id: `step-temp-1`,
            position: 1,
            title: 'Open Recommended Tool',
            instruction: 'Paste this prompt into the recommended AI tool prompt box.',
            tip: 'Verify tool aspect ratio and seed settings before submission.',
            media_id: null,
            image_url: null,
            image_alt: null,
            isUploading: false,
            uploadProgress: 0,
            validationError: null,
            imageLoadError: false,
          },
          {
            step_id: `step-temp-2`,
            position: 2,
            title: 'Review and Upscale',
            instruction: 'Review generated results and upscale the highest fidelity output.',
            tip: 'Save intermediate iterations to your project library.',
            media_id: null,
            image_url: null,
            image_alt: null,
            isUploading: false,
            uploadProgress: 0,
            validationError: null,
            imageLoadError: false,
          },
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

  // Save Guidance Steps Walkthrough
  const handleSaveGuidance = async () => {
    setIsSavingGuidance(true);
    setGuidanceStatusMsg(null);
    try {
      const res = await fetch('/api/v1/admin/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope_type: 'template',
          scope_id: templateId,
          presentation: guidancePresentation,
          steps: guidanceSteps.map((s, idx) => ({
            step_id: s.step_id.startsWith('step-temp') ? undefined : s.step_id,
            position: idx + 1,
            title: s.title || `Step ${idx + 1}`,
            instruction: s.instruction,
            tip: s.tip,
            media_id: s.media_id || null,
            image_url: s.image_url || null,
            image_alt: s.image_alt || null,
          })),
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to save guidance walkthrough');
      }

      setGuidanceStatusMsg({
        type: 'success',
        text: 'Step-by-step guidance walkthrough with images saved successfully.',
      });
      await fetchTemplate();
    } catch (err: any) {
      setGuidanceStatusMsg({
        type: 'error',
        text: err.message || 'Error saving guidance walkthrough',
      });
    } finally {
      setIsSavingGuidance(false);
    }
  };

  // Add new step
  const handleAddGuidanceStep = async () => {
    const nextPos = guidanceSteps.length + 1;
    const newStepItem: AdminGuidanceStepItem = {
      step_id: `step-temp-${Date.now()}`,
      position: nextPos,
      title: `Step ${nextPos}`,
      instruction: '',
      tip: '',
      media_id: null,
      image_url: null,
      image_alt: null,
      isUploading: false,
      uploadProgress: 0,
      validationError: null,
      imageLoadError: false,
    };

    if (data?.guidance?.guidance_id) {
      try {
        const res = await fetch('/api/v1/admin/guidance/steps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guidance_id: data.guidance.guidance_id,
            position: nextPos,
            title: newStepItem.title,
            instruction: 'Describe the action required in this step...',
            tip: '',
          }),
        });
        if (res.ok) {
          const created = await res.json();
          newStepItem.step_id = created.step.step_id;
          newStepItem.instruction = created.step.instruction;
        }
      } catch {
        // Local state fallback
      }
    }

    setGuidanceSteps((prev) => [...prev, newStepItem]);
  };

  // Delete step
  const handleDeleteGuidanceStep = async (index: number) => {
    const targetStep = guidanceSteps[index];
    if (!targetStep) return;

    if (targetStep.step_id && !targetStep.step_id.startsWith('step-temp')) {
      try {
        const res = await fetch(`/api/v1/admin/guidance/steps/${targetStep.step_id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          const errData = await res.json();
          setGuidanceStatusMsg({
            type: 'error',
            text: errData.error || 'Failed to delete step',
          });
          return;
        }
      } catch {
        setGuidanceStatusMsg({
          type: 'error',
          text: 'Error deleting guidance step from server',
        });
        return;
      }
    }

    const updated = guidanceSteps
      .filter((_, i) => i !== index)
      .map((s, idx) => ({ ...s, position: idx + 1 }));
    setGuidanceSteps(updated);
    setGuidanceStatusMsg({
      type: 'success',
      text: `Step ${index + 1} deleted. Media retention rules applied safely.`,
    });
  };

  // Move step up or down
  const handleStepMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= guidanceSteps.length) return;

    const newSteps = [...guidanceSteps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;

    const reindexed = newSteps.map((s, idx) => ({ ...s, position: idx + 1 }));
    setGuidanceSteps(reindexed);

    if (data?.guidance?.guidance_id && !reindexed.some((s) => s.step_id.startsWith('step-temp'))) {
      try {
        await fetch('/api/v1/admin/guidance/steps', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guidance_id: data.guidance.guidance_id,
            ordered_step_ids: reindexed.map((s) => s.step_id),
          }),
        });
      } catch {
        // local state remains updated
      }
    }
  };

  // Upload or replace step image
  const handleStepImageUpload = async (index: number, file: File) => {
    const step = guidanceSteps[index];
    if (!step) return;

    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!supportedTypes.includes(file.type)) {
      setGuidanceSteps((prev) =>
        prev.map((s, i) =>
          i === index
            ? {
                ...s,
                validationError: `Unsupported format (${file.type || 'unknown'}). Supported: PNG, JPEG, WEBP, SVG, GIF.`,
              }
            : s
        )
      );
      return;
    }

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setGuidanceSteps((prev) =>
        prev.map((s, i) =>
          i === index
            ? {
                ...s,
                validationError: `File size exceeds 10MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
              }
            : s
        )
      );
      return;
    }

    setGuidanceSteps((prev) =>
      prev.map((s, i) =>
        i === index
          ? {
              ...s,
              isUploading: true,
              uploadProgress: 25,
              validationError: null,
              imageLoadError: false,
            }
          : s
      )
    );

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (!step.step_id.startsWith('step-temp')) {
        formData.append('step_id', step.step_id);
      }
      formData.append('template_id', templateId);
      formData.append(
        'alt_text',
        step.image_alt || `${data?.template.name || 'Template'} - ${step.title || 'Step ' + (index + 1)}`
      );

      setGuidanceSteps((prev) =>
        prev.map((s, i) => (i === index ? { ...s, uploadProgress: 65 } : s))
      );

      const res = await fetch('/api/v1/admin/guidance/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadRes = await res.json();
      if (!res.ok) {
        throw new Error(uploadRes.error || 'Upload failed');
      }

      setGuidanceSteps((prev) =>
        prev.map((s, i) =>
          i === index
            ? {
                ...s,
                isUploading: false,
                uploadProgress: 100,
                media_id: uploadRes.media_id,
                image_url: uploadRes.url,
                image_alt: uploadRes.alt_text || s.image_alt || file.name,
                media: {
                  media_id: uploadRes.media_id,
                  storage_reference: uploadRes.url,
                  original_filename: uploadRes.original_filename,
                  size: uploadRes.size,
                  kind: uploadRes.kind,
                },
                validationError: null,
                imageLoadError: false,
              }
            : s
        )
      );

      setGuidanceStatusMsg({
        type: 'success',
        text: `Image uploaded successfully for Step ${index + 1} (${uploadRes.original_filename}).`,
      });
    } catch (err: any) {
      setGuidanceSteps((prev) =>
        prev.map((s, i) =>
          i === index
            ? {
                ...s,
                isUploading: false,
                uploadProgress: 0,
                validationError: err.message || 'Image upload failed. Please try again.',
              }
            : s
        )
      );
    }
  };

  // Remove image from step
  const handleStepImageRemove = async (index: number) => {
    const step = guidanceSteps[index];
    if (!step) return;

    if (step.step_id && !step.step_id.startsWith('step-temp')) {
      try {
        const res = await fetch(`/api/v1/admin/guidance/steps/${step.step_id}/image`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          const err = await res.json();
          setGuidanceStatusMsg({
            type: 'error',
            text: err.error || 'Failed to remove image from step',
          });
          return;
        }
      } catch {
        setGuidanceStatusMsg({
          type: 'error',
          text: 'Error removing image from step',
        });
        return;
      }
    }

    setGuidanceSteps((prev) =>
      prev.map((s, i) =>
        i === index
          ? {
              ...s,
              media_id: null,
              image_url: null,
              media: null,
              imageLoadError: false,
              validationError: null,
            }
          : s
      )
    );

    setGuidanceStatusMsg({
      type: 'success',
      text: `Image removed from Step ${index + 1}. Media asset retained safely in storage.`,
    });
  };

  // Select Curated Preset
  const handleSelectPreset = (index: number, url: string, alt: string) => {
    setGuidanceSteps((prev) =>
      prev.map((s, i) =>
        i === index
          ? {
              ...s,
              image_url: url,
              image_alt: alt,
              imageLoadError: false,
              validationError: null,
            }
          : s
      )
    );
    setPresetModalStepIndex(null);
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
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-52" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-32 rounded-lg" />
          </div>
        </div>
        <Skeleton className="h-11 w-full rounded-xl" />
        <Card className="p-6 h-96">
          <Skeleton className="h-6 w-60 mb-4" />
          <Skeleton className="h-40 w-full rounded-xl mb-4" />
          <Skeleton className="h-10 w-48" />
        </Card>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link href="/admin/templates">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Templates
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{template.name}</h1>
              <Badge
                variant={template.status === 'published' ? 'emerald' : 'secondary'}
                className="text-[10px] uppercase font-semibold"
              >
                {template.status}
              </Badge>
              {template.is_sample && (
                <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30">
                  Free Sample
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Node: <span className="text-slate-800 dark:text-slate-200 font-medium">{category.name}</span> ({category.path})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href={`/admin/templates/${templateId}/versions`}>
            <Button variant="outline" size="sm" className="text-xs">
              <History className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              Version History
            </Button>
          </Link>
          <Link href={`/template/${templateId}`} target="_blank">
            <Button variant="outline" size="sm" className="text-xs">
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              View Public Card
            </Button>
          </Link>
        </div>
      </div>

      {/* 7 Tabs Bar (11-UI-UX A3) */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as any)}
        className="w-full border-b border-slate-200 dark:border-slate-800"
      >
        <TabsList className="h-auto p-1 bg-transparent gap-1 overflow-x-auto justify-start w-full rounded-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-semibold whitespace-nowrap data-[state=active]:bg-white dark:data-[state=active]:bg-[#0c162e] data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:border-t-2 data-[state=active]:border-x data-[state=active]:border-blue-600 dark:data-[state=active]:border-blue-500 data-[state=active]:border-x-slate-200 dark:data-[state=active]:border-x-slate-800 data-[state=active]:shadow-xs text-slate-500 dark:text-slate-400"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <Badge
                    variant={tab.badge === 'Missing' ? 'rose' : 'blue'}
                    className="text-[10px] px-1.5 py-0 font-mono ml-0.5"
                  >
                    {tab.badge}
                  </Badge>
                )}
                {tab.count !== undefined && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono ml-0.5">
                    {tab.count}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      {/* TAB CONTENT AREA */}
      <Card className="p-6 border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-md">
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
                  <Textarea
                    value={uiPrompt}
                    onChange={(e) => setUiPrompt(e.target.value)}
                    placeholder="Describe UI layout, React components, Tailwind tokens, dark mode, responsive behavior..."
                    rows={6}
                    className="w-full bg-slate-900/90 text-slate-100 text-xs font-mono leading-relaxed"
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
                  <Textarea
                    value={contextPrompt}
                    onChange={(e) => setContextPrompt(e.target.value)}
                    placeholder="Describe business purpose, audience personas, key page sections, brand tone, and CTAs..."
                    rows={6}
                    className="w-full bg-slate-900/90 text-slate-100 text-xs font-mono leading-relaxed"
                  />
                </div>

                {/* Collapsible Unified Prompt for legacy compatibility */}
                <details className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/30 text-xs">
                  <summary className="cursor-pointer text-slate-400 hover:text-slate-200 font-medium">
                    View Unified Prompt Text (Concatenated for single-prompt API backwards compatibility)
                  </summary>
                  <div className="mt-3 space-y-2">
                    <Textarea
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder="Leave blank to automatically synthesize from UI and Context prompts above..."
                      rows={5}
                      className="w-full bg-slate-950 text-slate-300 text-xs font-mono"
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
                <Textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Write finished, ready-to-run prompt text..."
                  rows={6}
                  className="w-full bg-slate-900/90 text-slate-100 text-sm font-mono leading-relaxed"
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
              <Textarea
                value={detailsForm.description}
                onChange={(e) => setDetailsForm({ ...detailsForm, description: e.target.value })}
                rows={3}
                required
                className="w-full bg-slate-900 text-slate-100 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Skill Difficulty</label>
                <Select
                  value={detailsForm.difficulty}
                  onValueChange={(val) => setDetailsForm({ ...detailsForm, difficulty: val })}
                >
                  <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-slate-100 text-xs h-9">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
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
              <Checkbox
                id="is_sample_edit"
                checked={detailsForm.is_sample}
                onCheckedChange={(checked) => setDetailsForm({ ...detailsForm, is_sample: !!checked })}
              />
              <Label htmlFor="is_sample_edit" className="text-slate-300 font-medium cursor-pointer">
                Free Sample Template (Readable without subscription — 05-MVP.md §3.3)
              </Label>
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
                <Select value={newToolId} onValueChange={setNewToolId}>
                  <SelectTrigger className="w-56 h-8 text-xs bg-slate-900 border-slate-700 text-slate-200">
                    <SelectValue placeholder="Select tool to assign..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTools.map((t) => (
                      <SelectItem key={t.tool_id} value={t.tool_id}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            {/* Guidance Notification Banner */}
            {guidanceStatusMsg && (
              <Alert
                variant={guidanceStatusMsg.type === 'error' ? 'destructive' : 'default'}
                className="border border-blue-500/30 bg-blue-500/10 text-xs flex items-start gap-2.5"
              >
                {guidanceStatusMsg.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <AlertTitle className="text-xs font-semibold">
                    {guidanceStatusMsg.type === 'error' ? 'Guidance Notice' : 'Walkthrough Updated'}
                  </AlertTitle>
                  <AlertDescription className="text-xs mt-0.5">
                    {guidanceStatusMsg.text}
                  </AlertDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setGuidanceStatusMsg(null)}
                  className="text-slate-400 hover:text-slate-200 h-6 w-6 p-0"
                  aria-label="Dismiss alert"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </Alert>
            )}

            {/* Header with Title and Global Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  Step-by-Step Guidance Walkthrough (FEAT-036)
                  {guidanceIsInherited && (
                    <Badge variant="outline" className="text-[10px] bg-slate-800 text-slate-400 border-slate-700 ml-2">
                      Inherited from {category.name}
                    </Badge>
                  )}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Ordered instructions showing creators exactly how to run the prompt on external tools. Each step has its own relevant image, alt text, and display order.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2">
                  <span>Format:</span>
                  <Select
                    value={guidancePresentation}
                    onValueChange={(val) => setGuidancePresentation(val as any)}
                  >
                    <SelectTrigger className="w-44 h-8 text-xs bg-slate-900 border-slate-700 text-slate-200">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="written">Written Steps</SelectItem>
                      <SelectItem value="recorded">Recorded Screencast</SelectItem>
                      <SelectItem value="both">Both (Steps + Video)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  size="sm"
                  onClick={handleAddGuidanceStep}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Step
                </Button>
                <Button
                  size="sm"
                  disabled={isSavingGuidance}
                  onClick={handleSaveGuidance}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  {isSavingGuidance ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5 mr-1" />
                  )}
                  Save Walkthrough
                </Button>
              </div>
            </div>

            {/* Empty Steps State */}
            {guidanceSteps.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-300">No Guidance Steps Configured</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Add walkthrough steps to guide subscribers from prompt copying through model tuning to final upscale.
                </p>
                <Button size="sm" onClick={handleAddGuidanceStep} className="bg-blue-600 hover:bg-blue-500 text-xs mt-2">
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add First Step
                </Button>
              </div>
            )}

            {/* Guidance Steps Card List */}
            <div className="space-y-5">
              {guidanceSteps.map((step, idx) => (
                <Card
                  key={step.step_id || idx}
                  className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-[#0d1424] space-y-4 shadow-xs"
                >
                  {/* Step Top Bar: Badge, Title Input, and Order/Delete Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800/60">
                    <div className="flex items-center gap-3 flex-1">
                      <Badge variant="blue" className="px-2.5 py-1 text-xs font-mono font-bold shrink-0">
                        Step {idx + 1}
                      </Badge>
                      <div className="flex-1">
                        <Input
                          value={step.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setGuidanceSteps((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, title: val } : s))
                            );
                          }}
                          placeholder={`e.g. Step ${idx + 1}: Configure Tool & Parameters`}
                          className="h-8 text-xs font-semibold bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1 self-end sm:self-auto">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={idx === 0}
                        onClick={() => handleStepMove(idx, 'up')}
                        title="Move step earlier in sequence"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-100 disabled:opacity-30"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={idx === guidanceSteps.length - 1}
                        onClick={() => handleStepMove(idx, 'down')}
                        title="Move step later in sequence"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-100 disabled:opacity-30"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-4 bg-slate-700 mx-1" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGuidanceStep(idx)}
                        title="Delete step (media will be retained per project policy)"
                        className="h-8 w-8 p-0 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Step Body: 2-column Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    {/* Left Column: Instruction & Tip (7 cols) */}
                    <div className="lg:col-span-7 space-y-3.5">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                          <span>Instruction Content *</span>
                          <span className="text-[10px] text-slate-400">Clear actionable directive</span>
                        </Label>
                        <Textarea
                          value={step.instruction}
                          onChange={(e) => {
                            const val = e.target.value;
                            setGuidanceSteps((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, instruction: val } : s))
                            );
                          }}
                          placeholder="Describe the exact action the user should take at this step..."
                          rows={4}
                          className="text-xs leading-relaxed bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 resize-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                          <span>Creator Pro-Tip (Optional)</span>
                          <span className="text-[10px] text-amber-500/90 font-mono">Expert optimization</span>
                        </Label>
                        <Input
                          value={step.tip}
                          onChange={(e) => {
                            const val = e.target.value;
                            setGuidanceSteps((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, tip: val } : s))
                            );
                          }}
                          placeholder="e.g. For portrait aspect ratios, always specify --ar 9:16 instead of 16:9."
                          className="h-8 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                        />
                      </div>
                    </div>

                    {/* Right Column: Step Image Management & Preview (5 cols) */}
                    <div className="lg:col-span-5 space-y-3">
                      <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                          Step Visual Reference
                        </span>
                        {step.image_url ? (
                          <span className="text-[10px] text-emerald-400 font-medium">Image Attached</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">None attached</span>
                        )}
                      </Label>

                      {/* Case A: Image Present */}
                      {step.image_url ? (
                        <div className="space-y-2.5">
                          {/* Image Thumbnail Container */}
                          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-900 group shadow-xs">
                            {step.imageLoadError ? (
                              <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-slate-900 text-slate-400">
                                <AlertCircle className="w-6 h-6 text-amber-400 mb-1" />
                                <span className="text-xs font-semibold text-slate-300">Image load failed</span>
                                <span className="text-[10px] text-slate-500 mt-0.5 truncate max-w-full">
                                  {step.image_url}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    setGuidanceSteps((prev) =>
                                      prev.map((s, i) =>
                                        i === idx ? { ...s, imageLoadError: false } : s
                                      )
                                    )
                                  }
                                  className="h-6 text-[10px] mt-2 px-2"
                                >
                                  Retry Loading
                                </Button>
                              </div>
                            ) : (
                              <>
                                <img
                                  src={step.image_url}
                                  alt={step.image_alt || step.title || `Step ${idx + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  onError={() => {
                                    setGuidanceSteps((prev) =>
                                      prev.map((s, i) =>
                                        i === idx ? { ...s, imageLoadError: true } : s
                                      )
                                    );
                                  }}
                                />

                                {/* Overlay Action Controls */}
                                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-xs">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => setPreviewLightboxStep(step)}
                                    className="h-7 px-2.5 text-[11px] bg-slate-800/90 text-white hover:bg-slate-700"
                                  >
                                    <ZoomIn className="w-3.5 h-3.5 mr-1" /> Zoom
                                  </Button>

                                  <label className="cursor-pointer">
                                    <input
                                      type="file"
                                      accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                                      className="hidden"
                                      onChange={(e) => {
                                        if (e.target.files?.[0]) {
                                          handleStepImageUpload(idx, e.target.files[0]);
                                        }
                                      }}
                                    />
                                    <span className="inline-flex items-center justify-center rounded-md text-[11px] font-medium h-7 px-2.5 bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors">
                                      <Upload className="w-3.5 h-3.5 mr-1" /> Replace
                                    </span>
                                  </label>

                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleStepImageRemove(idx)}
                                    className="h-7 px-2.5 text-[11px]"
                                    title="Remove image from step (file remains retained in media store)"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Alt Text Input */}
                          <div className="space-y-1">
                            <Label className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                              <span>Alt Text (Accessibility)</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {(step.image_alt || '').length} chars
                              </span>
                            </Label>
                            <Input
                              value={step.image_alt || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setGuidanceSteps((prev) =>
                                  prev.map((s, i) => (i === idx ? { ...s, image_alt: val } : s))
                                );
                              }}
                              placeholder={`Alt description for step ${idx + 1}...`}
                              className="h-7 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                            />
                          </div>

                          {/* Media Metadata Tag */}
                          {step.media && (
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono bg-slate-900/60 p-1.5 rounded border border-slate-800">
                              <span className="truncate max-w-[180px]">
                                {step.media.original_filename}
                              </span>
                              <span>{(step.media.size / 1024).toFixed(0)} KB</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Case B: No Image Present - Dropzone & Preset Picker */
                        <div className="space-y-2.5">
                          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700/80 rounded-lg p-3.5 text-center bg-slate-100/40 dark:bg-slate-900/40 hover:border-blue-500/70 transition-colors">
                            <ImageIcon className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              Upload image or pick preset
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5 mb-2.5">
                              JPEG, PNG, WEBP, SVG, GIF (max 10MB)
                            </p>

                            <div className="flex items-center justify-center gap-2">
                              <label className="cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                                  className="hidden"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      handleStepImageUpload(idx, e.target.files[0]);
                                    }
                                  }}
                                />
                                <span className="inline-flex items-center justify-center rounded-md text-xs font-medium h-7 px-2.5 bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition-colors">
                                  <Upload className="w-3.5 h-3.5 mr-1" /> Upload Image
                                </span>
                              </label>

                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setPresetModalStepIndex(idx)}
                                className="h-7 text-xs bg-slate-900/80 hover:bg-slate-800 border-slate-700 text-slate-200"
                              >
                                <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Presets
                              </Button>
                            </div>
                          </div>

                          {/* Alt Text Preview/Preparedness */}
                          <div className="space-y-1">
                            <Label className="text-[11px] text-slate-600 dark:text-slate-400">
                              Upcoming Alt Text (Optional)
                            </Label>
                            <Input
                              value={step.image_alt || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setGuidanceSteps((prev) =>
                                  prev.map((s, i) => (i === idx ? { ...s, image_alt: val } : s))
                                );
                              }}
                              placeholder={`Alt description for step ${idx + 1}...`}
                              className="h-7 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
                            />
                          </div>
                        </div>
                      )}

                      {/* Upload Progress Bar */}
                      {step.isUploading && (
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[11px] text-blue-400">
                            <span className="flex items-center gap-1.5">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Uploading & saving media...
                            </span>
                            <span className="font-mono">{step.uploadProgress}%</span>
                          </div>
                          <Progress value={step.uploadProgress} className="h-1.5" />
                        </div>
                      )}

                      {/* Validation Error Banner */}
                      {step.validationError && (
                        <Alert variant="destructive" className="py-2 px-3 text-xs mt-1">
                          <AlertCircle className="w-3.5 h-3.5 mr-1.5 inline" />
                          <span>{step.validationError}</span>
                        </Alert>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {guidanceSteps.length} {guidanceSteps.length === 1 ? 'step' : 'steps'} configured with visual references
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleAddGuidanceStep}
                  variant="outline"
                  className="text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Step
                </Button>
                <Button
                  size="sm"
                  disabled={isSavingGuidance}
                  onClick={handleSaveGuidance}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  {isSavingGuidance ? (
                    <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5 mr-1" />
                  )}
                  Save Guidance Walkthrough
                </Button>
              </div>
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
                  <Select
                    value={attr.attribute_type}
                    onValueChange={(val) => {
                      const next = [...attributesList];
                      next[idx].attribute_type = val;
                      setAttributesList(next);
                    }}
                  >
                    <SelectTrigger className="w-48 h-9 text-xs bg-slate-900 border-slate-700 text-slate-200">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="style">Style</SelectItem>
                      <SelectItem value="format">Format / Orientation</SelectItem>
                      <SelectItem value="mood">Mood</SelectItem>
                      <SelectItem value="difficulty">Difficulty</SelectItem>
                    </SelectContent>
                  </Select>

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
                      <Textarea
                        placeholder={template.description}
                        rows={2}
                        className="w-full bg-slate-900 text-slate-100 text-xs"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </Card>

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

      {/* GUIDANCE STEP LIGHTBOX ZOOM DIALOG */}
      <Dialog
        open={previewLightboxStep !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewLightboxStep(null);
        }}
      >
        <DialogContent className="border-slate-800 bg-[#0d1222] text-slate-100 max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <ZoomIn className="w-5 h-5 text-blue-400" />
              {previewLightboxStep?.title || 'Guidance Step Visual Preview'}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Step {previewLightboxStep?.position} walkthrough visual reference
            </DialogDescription>
          </DialogHeader>

          {previewLightboxStep && (
            <div className="space-y-4 my-2">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center">
                {previewLightboxStep.image_url && (
                  <img
                    src={previewLightboxStep.image_url}
                    alt={previewLightboxStep.image_alt || previewLightboxStep.title || 'Guidance step visual'}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold text-slate-200">Instruction:</span>
                  {previewLightboxStep.image_alt && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      Alt: {previewLightboxStep.image_alt}
                    </span>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {previewLightboxStep.instruction}
                </p>
                {previewLightboxStep.tip && (
                  <p className="text-amber-400/90 text-[11px]">
                    Tip: {previewLightboxStep.tip}
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPreviewLightboxStep(null)}
              className="text-xs"
            >
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CURATED PRESET SELECTION DIALOG */}
      <Dialog
        open={presetModalStepIndex !== null}
        onOpenChange={(open) => {
          if (!open) setPresetModalStepIndex(null);
        }}
      >
        <DialogContent className="border-slate-800 bg-[#0d1222] text-slate-100 max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Select Curated Visual Asset for Step {(presetModalStepIndex ?? 0) + 1}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Choose from high-fidelity SVG visual diagrams crafted for Image, Video, Slides, and Website workflows.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 my-2">
            {PRESET_COLLECTIONS.map((col, colIdx) => (
              <div key={colIdx} className="space-y-3">
                <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  {col.category}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {col.presets.map((preset, pIdx) => (
                    <div
                      key={pIdx}
                      onClick={() => {
                        if (presetModalStepIndex !== null) {
                          handleSelectPreset(presetModalStepIndex, preset.url, preset.alt);
                        }
                      }}
                      className="group cursor-pointer rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-blue-500/80 transition-all p-2.5 flex flex-col space-y-2"
                    >
                      <div className="relative aspect-video rounded-md overflow-hidden bg-slate-950 border border-slate-800/80 group-hover:border-blue-500/50">
                        <img
                          src={preset.url}
                          alt={preset.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-200 group-hover:text-blue-300 line-clamp-1">
                          {preset.title}
                        </p>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {preset.alt}
                        </p>
                      </div>
                      <div className="pt-1 flex justify-end">
                        <span className="text-[10px] font-medium text-blue-400 group-hover:underline flex items-center gap-1">
                          Attach <Check className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter className="pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPresetModalStepIndex(null)}
              className="text-xs text-slate-400"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
