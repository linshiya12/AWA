'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  LifeBuoy,
  Plus,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Image as ImageIcon,
  ChevronRight,
  ArrowLeft,
  X,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  FileText,
  User,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import {
  SupportTicket,
  SupportTicketCategory,
  SupportTicketStatus,
  SupportTicketMessage,
} from '@/lib/server/types';

const CATEGORY_LABELS: Record<SupportTicketCategory, string> = {
  account: 'Account',
  subscription_or_payment: 'Subscription or Payment',
  credits: 'Credits',
  prompt_customization: 'Prompt Customization',
  template_or_guidance: 'Template or Guidance',
  other: 'Other',
};

const STATUS_BADGES: Record<
  SupportTicketStatus,
  { label: string; color: string; border: string; bg: string }
> = {
  open: {
    label: 'Open',
    color: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
  },
  waiting_for_user: {
    label: 'Waiting for You',
    color: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
  },
  resolved: {
    label: 'Resolved',
    color: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
  },
};

export default function UserSupportPage() {
  const [activeView, setActiveView] = useState<'list' | 'create' | 'detail'>('list');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [ticketError, setTicketError] = useState<string | null>(null);

  // Selected ticket for thread view
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Template attachment options
  const [templateOptions, setTemplateOptions] = useState<
    Array<{ template_id: string; name: string; category: string; format: string }>
  >([]);

  // Create form state
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicketCategory>('prompt_customization');
  const [description, setDescription] = useState('');
  const [relatedTemplateId, setRelatedTemplateId] = useState<string>('none');
  const [relatedAttemptId, setRelatedAttemptId] = useState('');
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Reply form state
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch User's Tickets
  const fetchTickets = useCallback(async () => {
    try {
      setLoadingTickets(true);
      setTicketError(null);
      const res = await fetch('/api/v1/support/tickets');
      if (!res.ok) throw new Error('Failed to load your support tickets');
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err: unknown) {
      setTicketError((err as Error).message || 'Unable to connect to support service');
    } finally {
      setLoadingTickets(false);
    }
  }, []);

  // Fetch Template Options for Dropdown
  useEffect(() => {
    fetch('/api/v1/support/templates')
      .then((res) => res.json())
      .then((data) => setTemplateOptions(data.templates || []))
      .catch(() => {});
    fetchTickets();
  }, [fetchTickets]);

  // Fetch Ticket Thread Detail
  const fetchTicketDetail = useCallback(async (id: string) => {
    try {
      setLoadingDetail(true);
      const res = await fetch(`/api/v1/support/tickets/${id}`);
      if (!res.ok) throw new Error('Failed to load ticket conversation');
      const data = await res.json();
      setActiveTicket(data.ticket);
    } catch (err: unknown) {
      showToast('error', (err as Error).message || 'Failed to load ticket thread');
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const handleOpenTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setActiveView('detail');
    fetchTicketDetail(ticketId);
  };

  // Handle Screenshot Upload
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please choose an image file (PNG, JPG, SVG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'Image size must be under 5MB');
      return;
    }

    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotData(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle Ticket Submission
  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setFormError('Please enter a brief subject for your ticket.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please provide details in the description.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      const payload = {
        subject: subject.trim(),
        category,
        description: description.trim(),
        screenshotUrl: screenshotData || undefined,
        relatedTemplateId: relatedTemplateId !== 'none' ? relatedTemplateId : undefined,
        relatedAttemptId: relatedAttemptId.trim() || undefined,
      };

      const res = await fetch('/api/v1/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to submit ticket');
      }

      const resData = await res.json();
      showToast('success', 'Support ticket created successfully!');

      // Reset form
      setSubject('');
      setDescription('');
      setCategory('prompt_customization');
      setRelatedTemplateId('none');
      setRelatedAttemptId('');
      setScreenshotData(null);
      setScreenshotName(null);

      // Refresh list and open new ticket
      await fetchTickets();
      if (resData.ticket?.ticket_id) {
        handleOpenTicket(resData.ticket.ticket_id);
      } else {
        setActiveView('list');
      }
    } catch (err: unknown) {
      setFormError((err as Error).message || 'Error submitting ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle User Reply
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !activeTicket) return;

    try {
      setIsReplying(true);
      setReplyError(null);

      const res = await fetch(`/api/v1/support/tickets/${activeTicket.ticket_id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent.trim(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to post reply');
      }

      setReplyContent('');
      showToast('success', 'Your reply has been sent.');
      // Refresh thread
      fetchTicketDetail(activeTicket.ticket_id);
      fetchTickets();
    } catch (err: unknown) {
      setReplyError((err as Error).message || 'Failed to send reply');
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-[#070a14] py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Toast Alert */}
        {toastMessage && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between shadow-lg border transition-all ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
              <span className="text-sm font-medium">{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-xs font-semibold underline ml-4 hover:opacity-80"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Top Header & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <Link href="/templates" className="hover:underline">
                AWA Platform
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-900 dark:text-slate-200 font-medium">Support</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <LifeBuoy className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              User Support & Help Desk
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Ask questions about prompt customization, report issues, and communicate directly with the AWA team.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {activeView !== 'list' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveView('list')}
                className="rounded-xl text-xs gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                My Tickets ({tickets.length})
              </Button>
            )}
            {activeView !== 'create' && (
              <Button
                size="sm"
                onClick={() => setActiveView('create')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs gap-1.5 shadow-sm shadow-blue-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                Contact Support
              </Button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: USER'S TICKETS LIST                                              */}
        {/* ========================================================================= */}
        {activeView === 'list' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Your Support Inquiries ({tickets.length})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchTickets}
                disabled={loadingTickets}
                className="h-8 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 gap-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingTickets ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Loading Skeletons */}
            {loadingTickets && (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-5 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c162e]">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-72" />
                      </div>
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Error State */}
            {!loadingTickets && ticketError && (
              <Card className="p-8 text-center space-y-3 border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                  {ticketError}
                </h3>
                <Button size="sm" onClick={fetchTickets} className="rounded-xl text-xs">
                  Try Again
                </Button>
              </Card>
            )}

            {/* Empty State */}
            {!loadingTickets && !ticketError && tickets.length === 0 && (
              <Card className="p-12 text-center space-y-4 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-[#0c162e]/50">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
                  <LifeBuoy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    No Support Tickets Found
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    You haven’t submitted any support requests yet. Have a question about a prompt or customization? We’re here to help!
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setActiveView('create')}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Submit Your First Ticket
                </Button>
              </Card>
            )}

            {/* Ticket Cards List */}
            {!loadingTickets && !ticketError && tickets.length > 0 && (
              <div className="space-y-3">
                {tickets.map((t) => {
                  const statusInfo = STATUS_BADGES[t.status] || STATUS_BADGES.open;
                  const lastMessage = t.messages[t.messages.length - 1];

                  return (
                    <Card
                      key={t.ticket_id}
                      onClick={() => handleOpenTicket(t.ticket_id)}
                      className="p-5 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c162e]/90 hover:border-blue-300 dark:hover:border-blue-700/60 shadow-xs cursor-pointer transition-all hover:shadow-md"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-slate-400">
                              #{t.ticket_number}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
                            >
                              {statusInfo.label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                            >
                              {CATEGORY_LABELS[t.category]}
                            </Badge>
                            {t.related_template_id && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-2 py-0.5 border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 font-mono"
                              >
                                Template: {t.related_template_id}
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                            {t.subject}
                          </h3>
                          {lastMessage && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {lastMessage.sender_role === 'administrator' ? 'AWA Team: ' : 'You: '}
                              </span>
                              {lastMessage.content}
                            </p>
                          )}
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 text-xs text-slate-400 shrink-0">
                          <span className="flex items-center gap-1 text-[11px]">
                            <Clock className="w-3 h-3" />
                            {new Date(t.updated_at).toLocaleDateString()}
                          </span>
                          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                            {t.messages.length} message{t.messages.length > 1 ? 's' : ''}
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: CREATE SUPPORT TICKET FORM                                       */}
        {/* ========================================================================= */}
        {activeView === 'create' && (
          <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c162e]/90 shadow-sm overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[10px]"
                >
                  New Inquiry
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Contact AWA Support
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                Please provide clear details. Our curation and engineering team will review and reply directly to your ticket.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <form onSubmit={handleSubmitTicket} className="space-y-5">
                {formError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. Prompt customization didn't produce the metallic finish"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    className="h-9 text-xs rounded-xl bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800"
                  />
                </div>

                {/* Category & Template Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <Select
                      value={category}
                      onValueChange={(val) => setCategory(val as SupportTicketCategory)}
                    >
                      <SelectTrigger className="h-9 text-xs rounded-xl">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prompt_customization">Prompt Customization</SelectItem>
                        <SelectItem value="template_or_guidance">Template or Guidance</SelectItem>
                        <SelectItem value="credits">Credits & Allowance</SelectItem>
                        <SelectItem value="subscription_or_payment">Subscription or Payment</SelectItem>
                        <SelectItem value="account">Account</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Related Template Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Related Template (Optional)
                    </label>
                    <Select
                      value={relatedTemplateId}
                      onValueChange={(val) => setRelatedTemplateId(val)}
                    >
                      <SelectTrigger className="h-9 text-xs rounded-xl">
                        <SelectValue placeholder="Attach a template..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        <SelectItem value="none">None / General</SelectItem>
                        {templateOptions.map((t) => (
                          <SelectItem key={t.template_id} value={t.template_id}>
                            {t.name} ({t.format})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Related Attempt ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Related Customization Attempt ID (Optional)
                  </label>
                  <Input
                    placeholder="e.g. att-alex-01 or paste attempt reference if customization failed"
                    value={relatedAttemptId}
                    onChange={(e) => setRelatedAttemptId(e.target.value)}
                    className="h-9 text-xs rounded-xl bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 font-mono"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Description & Steps <span className="text-rose-500">*</span>
                  </label>
                  <Textarea
                    rows={5}
                    placeholder="Explain what prompt or guidance you were using, what outcome you expected, and what happened instead..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="text-xs rounded-xl bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 leading-relaxed"
                  />
                </div>

                {/* Optional Screenshot Attachment */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                    Attach Screenshot (Optional)
                  </label>

                  {screenshotData ? (
                    <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/20 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={screenshotData}
                            alt="Screenshot Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-slate-900 dark:text-white">
                            {screenshotName || 'Attached Screenshot'}
                          </div>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            Ready to upload
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setScreenshotData(null);
                          setScreenshotName(null);
                        }}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 transition-colors">
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Click to upload screenshot
                      </span>
                      <span className="text-[10px] text-slate-400">
                        PNG, JPG, SVG up to 5MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Form Footer Buttons */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveView('list')}
                    className="rounded-xl text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs gap-1.5 shadow-sm shadow-blue-500/20 px-5"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Submit Ticket
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: TICKET CONVERSATION & REPLY THREAD                               */}
        {/* ========================================================================= */}
        {activeView === 'detail' && activeTicket && (
          <div className="space-y-4">
            {/* Thread Header Card */}
            <Card className="p-5 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c162e]/90 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-400">
                      Ticket #{activeTicket.ticket_number}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        STATUS_BADGES[activeTicket.status]?.bg
                      } ${STATUS_BADGES[activeTicket.status]?.color} ${
                        STATUS_BADGES[activeTicket.status]?.border
                      }`}
                    >
                      {STATUS_BADGES[activeTicket.status]?.label}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      {CATEGORY_LABELS[activeTicket.category]}
                    </Badge>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {activeTicket.subject}
                  </h2>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>Opened {new Date(activeTicket.created_at).toLocaleString()}</span>
                    {activeTicket.assigned_to_name && (
                      <>
                        <span>•</span>
                        <span>Assigned to {activeTicket.assigned_to_name}</span>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchTicketDetail(activeTicket.ticket_id)}
                  disabled={loadingDetail}
                  className="rounded-xl text-xs gap-1.5 self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingDetail ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              {/* Related Record Box */}
              {(activeTicket.related_template_id || activeTicket.related_attempt_id) && (
                <div className="mt-4 p-3 rounded-xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        Related Record:
                      </span>{' '}
                      {activeTicket.related_template_id && (
                        <span className="text-slate-600 dark:text-slate-300">
                          Template <code className="font-mono text-blue-600 dark:text-blue-400">{activeTicket.related_template_id}</code>
                        </span>
                      )}
                      {activeTicket.related_attempt_id && (
                        <span className="text-slate-600 dark:text-slate-300 ml-2">
                          Attempt <code className="font-mono">{activeTicket.related_attempt_id}</code>
                        </span>
                      )}
                    </div>
                  </div>

                  {activeTicket.related_template_id && (
                    <Link
                      href={`/templates?search=${activeTicket.related_template_id}`}
                      target="_blank"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      View Template
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              )}
            </Card>

            {/* Conversation Messages Timeline */}
            <div className="space-y-4">
              {activeTicket.messages.map((msg, index) => {
                const isAdmin = msg.sender_role === 'administrator';

                return (
                  <div
                    key={msg.message_id || index}
                    className={`flex gap-3 ${isAdmin ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-2xl rounded-2xl p-4 sm:p-5 shadow-xs border ${
                        isAdmin
                          ? 'bg-blue-50/60 dark:bg-[#0c162e] border-blue-200/80 dark:border-blue-900/60 text-slate-900 dark:text-slate-100 rounded-tl-sm'
                          : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tr-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                              isAdmin
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            {isAdmin ? 'A' : 'U'}
                          </div>
                          <div>
                            <span className="text-xs font-semibold text-slate-900 dark:text-white">
                              {isAdmin ? 'AWA Support Team' : 'You'}
                            </span>
                            {isAdmin && (
                              <Badge
                                variant="outline"
                                className="ml-1.5 text-[9px] px-1 py-0 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                              >
                                Curator
                              </Badge>
                            )}
                          </div>
                        </div>

                        <span className="text-[10px] text-slate-400">
                          {new Date(msg.created_at).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>

                      {/* Attachment preview if present */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
                          <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                            <Paperclip className="w-3 h-3" /> Attached Media
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {msg.attachments.map((att) => (
                              <div
                                key={att.attachment_id}
                                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2 text-xs"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={att.url}
                                  alt={att.file_name}
                                  className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                                />
                                <div>
                                  <div className="font-medium text-slate-900 dark:text-white text-xs">
                                    {att.file_name}
                                  </div>
                                  <a
                                    href={att.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline"
                                  >
                                    View Full Size
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* User Reply Composer Box */}
            <Card className="p-5 border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c162e]/90 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                Reply to this ticket
              </h3>

              {activeTicket.status === 'resolved' ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 text-center space-y-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    This ticket has been marked as resolved.
                  </p>
                  <p className="text-[11px]">
                    If your issue is still not resolved, you can post a reply below to reopen this ticket.
                  </p>
                </div>
              ) : null}

              <form onSubmit={handleSendReply} className="space-y-3 mt-3">
                {replyError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs">
                    {replyError}
                  </div>
                )}

                <Textarea
                  rows={3}
                  placeholder="Type your message or answer here..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  required
                  className="text-xs rounded-xl bg-slate-50/60 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800"
                />

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Your reply will alert the assigned curator</span>
                  </div>

                  <Button
                    type="submit"
                    size="sm"
                    disabled={isReplying || !replyContent.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs gap-1.5 px-4 shadow-sm"
                  >
                    {isReplying ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send Reply
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
