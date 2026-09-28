'use client';

import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cpu,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface Tool {
  tool_id: string;
  name: string;
  destination: string;
  reasoning: string;
  pricing_note: string;
  quality_note: string;
  is_available: boolean;
}

interface Model {
  model_id: string;
  tool_id: string;
  name: string;
  is_available: boolean;
}

export default function AdminToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tool Modal
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [toolForm, setToolForm] = useState({
    name: '',
    destination: '',
    reasoning: '',
    pricing_note: '',
    quality_note: '',
    is_available: true,
  });

  // Model Modal
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [activeToolForModel, setActiveToolForModel] = useState<Tool | null>(null);
  const [toolModels, setToolModels] = useState<Model[]>([]);
  const [newModelName, setNewModelName] = useState('');

  // Withdraw Confirmation Modal
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawTarget, setWithdrawTarget] = useState<Tool | null>(null);

  const fetchTools = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/admin/tools');
      if (!res.ok) throw new Error('Failed to retrieve AI tool registry');
      const data = await res.json();
      setTools(data.tools || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with tool registry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const openAddTool = () => {
    setEditingToolId(null);
    setToolForm({
      name: '',
      destination: '',
      reasoning: '',
      pricing_note: '',
      quality_note: '',
      is_available: true,
    });
    setIsToolModalOpen(true);
  };

  const openEditTool = (tool: Tool) => {
    setEditingToolId(tool.tool_id);
    setToolForm({
      name: tool.name,
      destination: tool.destination,
      reasoning: tool.reasoning,
      pricing_note: tool.pricing_note,
      quality_note: tool.quality_note,
      is_available: tool.is_available,
    });
    setIsToolModalOpen(true);
  };

  const handleToolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingToolId) {
        await fetch(`/api/v1/admin/tools/${editingToolId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toolForm),
        });
      } else {
        await fetch('/api/v1/admin/tools', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toolForm),
        });
      }
      setIsToolModalOpen(false);
      fetchTools();
    } catch {
      alert('Error saving tool');
    }
  };

  const openModels = async (tool: Tool) => {
    setActiveToolForModel(tool);
    try {
      const res = await fetch(`/api/v1/admin/tools/${tool.tool_id}/models`);
      const data = await res.json();
      setToolModels(data.models || []);
      setIsModelModalOpen(true);
    } catch {
      alert('Error fetching models');
    }
  };

  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeToolForModel || !newModelName.trim()) return;

    try {
      const res = await fetch(`/api/v1/admin/tools/${activeToolForModel.tool_id}/models`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newModelName.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setToolModels([...toolModels, data.model]);
        setNewModelName('');
      }
    } catch {
      alert('Error adding model');
    }
  };

  const openWithdrawModal = (tool: Tool) => {
    setWithdrawTarget(tool);
    setIsWithdrawOpen(true);
  };

  const handleConfirmWithdraw = async () => {
    if (!withdrawTarget) return;
    try {
      const res = await fetch(`/api/v1/admin/tools/${withdrawTarget.tool_id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        alert(data.message);
        setIsWithdrawOpen(false);
        fetchTools();
      }
    } catch {
      alert('Error withdrawing tool');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>AI Tool & Model Registry</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
              Screen A5
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Maintain external destination tools, model variants, and the required reasoning lines shown to subscribers (FEAT-016).
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTools}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button size="sm" onClick={openAddTool} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Register AI Tool
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Tool Registry Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={fetchTools} className="ml-4">
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Tools Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          // Loading Skeletons
          Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-16 w-full rounded-xl" />
              <div className="grid grid-cols-2 gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="pt-4 flex justify-between">
                <Skeleton className="h-8 w-28 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </Card>
          ))
        ) : (
          tools.map((tool) => (
            <Card
              key={tool.tool_id}
              className={`p-6 flex flex-col justify-between transition-all shadow-sm ${
                tool.is_available
                  ? 'border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80'
                  : 'border-slate-200/40 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/30 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-base text-slate-900 dark:text-white">{tool.name}</span>
                    {tool.is_available ? (
                      <Badge variant="emerald" className="text-[10px]">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="rose" className="text-[10px]">
                        Withdrawn
                      </Badge>
                    )}
                  </div>

                  <a
                    href={tool.destination}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 flex items-center gap-1 font-medium"
                  >
                    <span>Launch</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Required Reasoning (FEAT-016: Reason shown to users) */}
                <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/15 text-xs text-blue-950 dark:text-blue-200 mb-4">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 block text-[10px] uppercase tracking-wider mb-0.5">
                    Reasoning Shown to Users (Required)
                  </span>
                  &quot;{tool.reasoning}&quot;
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <div>
                    <span className="block text-[10px] uppercase text-slate-400">Pricing Note</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{tool.pricing_note || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-slate-400">Quality Note</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{tool.quality_note || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModels(tool)}
                  className="h-8 text-xs font-medium"
                >
                  <Cpu className="w-3.5 h-3.5 mr-1 text-cyan-600 dark:text-cyan-400" />
                  Manage Models
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditTool(tool)}
                    className="h-8 text-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                  {tool.is_available && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openWithdrawModal(tool)}
                      className="h-8 text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-500/10 text-xs"
                    >
                      Withdraw
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* MODAL 1: ADD/EDIT TOOL */}
      <Dialog open={isToolModalOpen} onOpenChange={setIsToolModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingToolId ? 'Edit AI Tool' : 'Register AI Tool'}</DialogTitle>
            <DialogDescription className="text-xs">
              Every tool recommendation must carry a reasoning statement explaining why it is suggested (FEAT-016).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleToolSubmit} className="space-y-4 text-xs mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="tool_name">Tool Name *</Label>
              <Input
                id="tool_name"
                value={toolForm.name}
                onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                placeholder="e.g. FLUX.1"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tool_dest">Destination URL *</Label>
              <Input
                id="tool_dest"
                value={toolForm.destination}
                onChange={(e) => setToolForm({ ...toolForm, destination: e.target.value })}
                placeholder="https://blackforestlabs.ai"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="tool_reason">Reasoning Line (Shown to Users) *</Label>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Required FEAT-016</span>
              </div>
              <Textarea
                id="tool_reason"
                value={toolForm.reasoning}
                onChange={(e) => setToolForm({ ...toolForm, reasoning: e.target.value })}
                placeholder="e.g. Unmatched typography adherence and text rendering on product labels."
                required
                rows={2}
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="tool_pricing">Pricing Note</Label>
                <Input
                  id="tool_pricing"
                  value={toolForm.pricing_note}
                  onChange={(e) => setToolForm({ ...toolForm, pricing_note: e.target.value })}
                  placeholder="e.g. Free open weights & API"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tool_quality">Quality Note</Label>
                <Input
                  id="tool_quality"
                  value={toolForm.quality_note}
                  onChange={(e) => setToolForm({ ...toolForm, quality_note: e.target.value })}
                  placeholder="e.g. Top fidelity photorealism"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsToolModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                Save AI Tool
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: MANAGE MODEL VARIANTS */}
      <Dialog open={isModelModalOpen} onOpenChange={setIsModelModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Model Variants: {activeToolForModel?.name}</DialogTitle>
            <DialogDescription className="text-xs">
              Configure specific versions (e.g. Sora, Gen-3 Alpha, FLUX.1 dev) that feed the model filter (FEAT-034).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs mt-2">
            <form onSubmit={handleAddModel} className="flex gap-2">
              <Input
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                placeholder="New variant name (e.g. FLUX.1 [schnell])"
                className="text-xs"
              />
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs shrink-0 text-white">
                Add Model
              </Button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {toolModels.map((m) => (
                <div
                  key={m.model_id}
                  className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{m.name}</span>
                  <Badge variant="emerald" className="text-[10px]">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              onClick={() => setIsModelModalOpen(false)}
              className="text-xs"
              variant="outline"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: WITHDRAW CONFIRMATION */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Withdraw AI Tool: {withdrawTarget?.name}?
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed pt-2">
              Withdrawing removes this tool from public recommendations and model filters immediately.
              Existing delivered records referencing it remain readable (FR-041).
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs my-2">
            The system will audit all template assignments currently referencing this tool.
          </div>

          <DialogFooter className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsWithdrawOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmWithdraw}
              className="text-xs"
            >
              Confirm Withdrawal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
