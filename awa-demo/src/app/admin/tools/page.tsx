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

  // Withdraw Confirmation Modal (11-UI-UX A5: Withdrawing shows how many assignments reference it)
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawTarget, setWithdrawTarget] = useState<Tool | null>(null);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/tools');
      const data = await res.json();
      setTools(data.tools || []);
    } catch (err) {
      console.error(err);
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
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>AI Tool & Model Registry</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
              Screen A5
            </Badge>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Maintain external destination tools, model variants, and the required reasoning lines shown to subscribers (FEAT-016).
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTools}
            className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
          <Button size="sm" onClick={openAddTool} className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Register AI Tool
          </Button>
        </div>
      </div>

      {/* Tools Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-12 flex justify-center text-slate-400 text-xs">
            <RefreshCw className="w-4 h-4 animate-spin mr-2 text-blue-500" />
            Loading AI tools and models...
          </div>
        ) : (
          tools.map((tool) => (
            <div
              key={tool.tool_id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                tool.is_available
                  ? 'border-slate-800 bg-[#0a0f1d] hover:border-slate-700 shadow-xl'
                  : 'border-slate-800/40 bg-slate-900/30 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-base text-white">{tool.name}</span>
                    {tool.is_available ? (
                      <Badge className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        Available
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] bg-rose-500/10 text-rose-400 border-rose-500/30">
                        Withdrawn
                      </Badge>
                    )}
                  </div>

                  <a
                    href={tool.destination}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1"
                  >
                    <span>Launch</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Required Reasoning (FEAT-016: Reason shown to users) */}
                <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs text-blue-200 mb-4">
                  <span className="font-semibold text-blue-400 block text-[10px] uppercase tracking-wider mb-0.5">
                    Reasoning Shown to Users (Required)
                  </span>
                  &quot;{tool.reasoning}&quot;
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-4">
                  <div>
                    <span className="block text-[10px] uppercase text-slate-400">Pricing Note</span>
                    <span className="text-slate-300 font-medium">{tool.pricing_note || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-slate-400">Quality Note</span>
                    <span className="text-slate-300 font-medium">{tool.quality_note || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModels(tool)}
                  className="h-8 border-slate-700 bg-slate-900 text-slate-300 text-xs"
                >
                  <Cpu className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                  Manage Models
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditTool(tool)}
                    className="h-8 text-slate-300 hover:text-white text-xs"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    Edit
                  </Button>
                  {tool.is_available && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openWithdrawModal(tool)}
                      className="h-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs"
                    >
                      Withdraw
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL 1: ADD/EDIT TOOL */}
      <Dialog open={isToolModalOpen} onOpenChange={setIsToolModalOpen}>
        <DialogContent className="border-slate-800 bg-[#0d1222] text-slate-100 max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingToolId ? 'Edit AI Tool' : 'Register AI Tool'}</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Every tool recommendation must carry a reasoning statement explaining why it is suggested (FEAT-016).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleToolSubmit} className="space-y-4 text-xs mt-2">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Tool Name *</label>
              <Input
                value={toolForm.name}
                onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                placeholder="e.g. FLUX.1"
                required
                className="bg-slate-900 border-slate-700 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Destination URL *</label>
              <Input
                value={toolForm.destination}
                onChange={(e) => setToolForm({ ...toolForm, destination: e.target.value })}
                placeholder="https://blackforestlabs.ai"
                required
                className="bg-slate-900 border-slate-700 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                <span>Reasoning Line (Shown to Users) *</span>
                <span className="text-[10px] text-blue-400">Required FEAT-016</span>
              </label>
              <textarea
                value={toolForm.reasoning}
                onChange={(e) => setToolForm({ ...toolForm, reasoning: e.target.value })}
                placeholder="e.g. Unmatched typography adherence and text rendering on product labels."
                required
                rows={2}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Pricing Note</label>
                <Input
                  value={toolForm.pricing_note}
                  onChange={(e) => setToolForm({ ...toolForm, pricing_note: e.target.value })}
                  placeholder="e.g. Free open weights & API"
                  className="bg-slate-900 border-slate-700 text-xs"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Quality Note</label>
                <Input
                  value={toolForm.quality_note}
                  onChange={(e) => setToolForm({ ...toolForm, quality_note: e.target.value })}
                  placeholder="e.g. Top fidelity photorealism"
                  className="bg-slate-900 border-slate-700 text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsToolModalOpen(false)}
                className="text-xs text-slate-400"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
                Save AI Tool
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: MANAGE MODEL VARIANTS */}
      <Dialog open={isModelModalOpen} onOpenChange={setIsModelModalOpen}>
        <DialogContent className="border-slate-800 bg-[#0d1222] text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle>Model Variants: {activeToolForModel?.name}</DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              Configure specific versions (e.g. Sora, Gen-3 Alpha, FLUX.1 dev) that feed the model filter (FEAT-034).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs mt-2">
            <form onSubmit={handleAddModel} className="flex gap-2">
              <Input
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                placeholder="New variant name (e.g. FLUX.1 [schnell])"
                className="bg-slate-900 border-slate-700 text-xs"
              />
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-500 text-xs shrink-0">
                Add Model
              </Button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {toolModels.map((m) => (
                <div
                  key={m.model_id}
                  className="p-2.5 rounded-lg border border-slate-800 bg-slate-900 flex items-center justify-between"
                >
                  <span className="font-semibold text-slate-200">{m.name}</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                    Active
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-slate-800">
            <Button
              type="button"
              onClick={() => setIsModelModalOpen(false)}
              className="bg-slate-800 hover:bg-slate-700 text-xs"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: WITHDRAW CONFIRMATION (11-UI-UX A5: Withdrawing shows reference count before confirming) */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="border-slate-800 bg-[#0d1222] text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Withdraw AI Tool: {withdrawTarget?.name}?
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-xs leading-relaxed pt-2">
              Withdrawing removes this tool from public recommendations and model filters immediately.
              Existing delivered records referencing it remain readable (FR-041).
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs my-2">
            The system will audit all template assignments currently referencing this tool.
          </div>

          <DialogFooter className="pt-3 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsWithdrawOpen(false)}
              className="text-xs text-slate-400"
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
