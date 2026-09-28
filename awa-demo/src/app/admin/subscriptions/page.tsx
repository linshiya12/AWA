'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Search,
  Filter,
  RefreshCw,
  BarChart3,
  PlusCircle,
  Clock,
  Coins,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  CreditCard,
  User as UserIcon,
  ChevronDown,
  Edit,
  AlertTriangle,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserOption {
  user_id: string;
  email: string;
  display_name: string | null;
  allowance_balance: number;
  status: string;
}

interface PlanOption {
  plan_id: string;
  name: string;
  price: number;
  currency: string;
  term_length: string;
  initial_allowance: number;
}

interface SubscriptionRow {
  subscription_id: string;
  user_id: string;
  plan_id: string;
  state: 'active' | 'ended' | 'cancelled';
  started_at: string;
  ends_at: string;
  end_behaviour: 'retain_delivered';
  allowance_balance: number;
  user: {
    user_id: string;
    email: string;
    display_name: string | null;
    status: 'active' | 'suspended';
    role: 'member' | 'administrator';
  };
  plan: {
    plan_id: string;
    name: string;
    price: number;
    currency: string;
    term_length: string;
    initial_allowance: number;
  };
  latest_transaction?: {
    transaction_id: string;
    provider_reference: string;
    amount: number;
    currency: string;
    state: 'succeeded' | 'pending' | 'failed';
    occurred_at: string;
  } | null;
  is_lifetime: boolean;
  days_remaining: number | null;
  is_expiring_soon: boolean;
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([]);
  const [availablePlans, setAvailablePlans] = useState<PlanOption[]>([]);
  const [usersList, setUsersList] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Grant Subscription Modal
  const [isGrantOpen, setIsGrantOpen] = useState(false);
  const [grantUserId, setGrantUserId] = useState('');
  const [grantPlanId, setGrantPlanId] = useState('');
  const [grantCustomEndsAt, setGrantCustomEndsAt] = useState('');
  const [grantAllowance, setGrantAllowance] = useState<number | ''>('');
  const [grantReason, setGrantReason] = useState('');
  const [grantSubmitting, setGrantSubmitting] = useState(false);

  // Modify / Extend Subscription Modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<SubscriptionRow | null>(null);
  const [editActionType, setEditActionType] = useState<'extend' | 'status' | 'plan'>('extend');
  const [editMonths, setEditMonths] = useState<number>(12);
  const [editState, setEditState] = useState<'active' | 'ended' | 'cancelled'>('active');
  const [editPlanId, setEditPlanId] = useState('');
  const [editReason, setEditReason] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  const fetchSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (selectedPlan !== 'all') params.set('plan', selectedPlan);
      if (selectedStatus !== 'all') params.set('status', selectedStatus);
      if (fromDate) params.set('from', fromDate);
      if (toDate) params.set('to', toDate);

      const res = await fetch(`/api/v1/admin/subscriptions?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch subscriptions: HTTP ${res.status}`);
      }
      const data = await res.json();
      setSubscriptions(data.subscriptions || []);
      setAvailablePlans(data.available_plans || []);
      setUsersList(data.users || []);

      if (data.available_plans && data.available_plans.length > 0 && !grantPlanId) {
        setGrantPlanId(data.available_plans[0].plan_id);
      }
    } catch (err: unknown) {
      console.error(err);
      setError((err as Error).message || 'An error occurred while loading subscriptions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [searchQuery, selectedPlan, selectedStatus, fromDate, toDate]);

  // Grant Subscription Submit
  const handleGrantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantUserId || !grantPlanId) {
      alert('Please select both a user and a plan.');
      return;
    }
    if (!grantReason.trim()) {
      alert('Documented reason is mandatory for administrative subscription changes.');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to grant this subscription? This will record an immutable entry in the audit log.'
    );
    if (!confirmed) return;

    setGrantSubmitting(true);
    try {
      const res = await fetch('/api/v1/admin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: grantUserId,
          planId: grantPlanId,
          customEndsAt: grantCustomEndsAt || undefined,
          initialAllowance: grantAllowance !== '' ? Number(grantAllowance) : undefined,
          reason: grantReason.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(data.message || 'Subscription granted successfully!');
        setIsGrantOpen(false);
        setGrantReason('');
        setGrantCustomEndsAt('');
        fetchSubscriptions();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to grant subscription');
      }
    } catch {
      alert('Network error while granting subscription');
    } finally {
      setGrantSubmitting(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (sub: SubscriptionRow, action: 'extend' | 'status' | 'plan') => {
    setSelectedSub(sub);
    setEditActionType(action);
    setEditState(sub.state);
    setEditPlanId(sub.plan_id);
    setEditMonths(12);
    setEditReason('');
    setIsEditOpen(true);
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    if (!editReason.trim()) {
      alert('Documented reason is mandatory for administrative subscription changes.');
      return;
    }

    let confirmMsg = 'Confirm changes to subscription?';
    if (editActionType === 'extend') {
      confirmMsg = `Confirm extending subscription for ${selectedSub.user.email} by ${editMonths} months?`;
    } else if (editActionType === 'status') {
      confirmMsg = `Confirm changing subscription status to '${editState}'?`;
    } else if (editActionType === 'plan') {
      confirmMsg = `Confirm switching plan to '${editPlanId}'?`;
    }

    if (!window.confirm(confirmMsg)) return;

    setEditSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        reason: editReason.trim(),
      };

      if (editActionType === 'extend') {
        body.extendMonths = editMonths;
      } else if (editActionType === 'status') {
        body.state = editState;
      } else if (editActionType === 'plan') {
        body.planId = editPlanId;
      }

      const res = await fetch(`/api/v1/admin/subscriptions/${selectedSub.subscription_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        alert(data.message || 'Subscription updated successfully!');
        setIsEditOpen(false);
        fetchSubscriptions();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update subscription');
      }
    } catch {
      alert('Network error while updating subscription');
    } finally {
      setEditSubmitting(false);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPlan('all');
    setSelectedStatus('all');
    setFromDate('');
    setToDate('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Subscription Management</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
              Screen A9
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, inspect, and manage subscriber memberships, term dates, and payment states (04 §4A, 07 §5.5).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            size="sm"
            onClick={() => {
              if (usersList.length > 0 && !grantUserId) {
                setGrantUserId(usersList[0].user_id);
              }
              setIsGrantOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Grant Subscription
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchSubscriptions}
            className="text-xs h-9"
            title="Refresh subscription records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user email, name, or sub ID..."
              className="pl-8 text-xs h-9"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="h-6 w-6 absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search input"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>

          {/* Plan Filter */}
          <div>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Plans" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                {availablePlans.map((p) => (
                  <SelectItem key={p.plan_id} value={p.plan_id}>
                    {p.name} (₹{p.price})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active Memberships</SelectItem>
                <SelectItem value="expiring_soon">Expiring Soon (≤ 30 days)</SelectItem>
                <SelectItem value="ended">Expired / Ended</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date range filter & reset button */}
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="text-[11px] h-9 px-2"
              title="Started from date"
            />
            {(searchQuery || selectedPlan !== 'all' || selectedStatus !== 'all' || fromDate || toDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs h-9 px-2.5 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Error state */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertTitle>Subscription Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={fetchSubscriptions} className="ml-4">
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Subscriptions Table */}
      <Card className="overflow-hidden border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Subscriber</TableHead>
              <TableHead className="font-semibold">Plan & Pricing</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
              <TableHead className="font-semibold">Start & Expiry Dates</TableHead>
              <TableHead className="font-semibold">Payment Status</TableHead>
              <TableHead className="font-semibold text-center">Allowance</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading state: Skeletons
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="w-7 h-7 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-6 w-20 mx-auto rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-3.5 w-24" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-6 w-20 mx-auto rounded-lg" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Skeleton className="h-7 w-14 rounded-lg" />
                      <Skeleton className="h-7 w-14 rounded-lg" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : subscriptions.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <CalendarCheck className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        No subscriptions found
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {searchQuery || selectedPlan !== 'all' || selectedStatus !== 'all' || fromDate
                          ? 'Try clearing active filters to see all subscriptions.'
                          : 'Manually grant a subscription or await checkout transactions.'}
                      </p>
                    </div>
                    {searchQuery || selectedPlan !== 'all' || selectedStatus !== 'all' || fromDate ? (
                      <Button variant="outline" size="sm" onClick={clearFilters} className="text-xs">
                        Clear Filters
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => setIsGrantOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                        <PlusCircle className="w-4 h-4 mr-1.5" /> Grant First Subscription
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Populated state
              subscriptions.map((sub) => {
                const isExpiringSoon = sub.is_expiring_soon;
                const isEnded =
                  sub.state === 'ended' ||
                  (!sub.is_lifetime && sub.days_remaining !== null && sub.days_remaining <= 0);

                return (
                  <TableRow key={sub.subscription_id} className="transition-colors">
                    {/* Subscriber */}
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[11px] font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                          {sub.user.display_name
                            ? sub.user.display_name.charAt(0).toUpperCase()
                            : sub.user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-slate-200 block text-xs">
                            {sub.user.email}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {sub.user.display_name || 'Individual Creator'}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Plan & Pricing */}
                    <TableCell>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-200 block text-xs">
                          {sub.plan.name}
                        </span>
                        <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono">
                          ₹{sub.plan.price} / {sub.is_lifetime ? 'Lifetime' : 'Year'}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center">
                      {sub.state === 'cancelled' ? (
                        <Badge variant="secondary" className="text-[10px]">
                          Cancelled
                        </Badge>
                      ) : isEnded ? (
                        <Badge variant="rose" className="text-[10px]">
                          Expired
                        </Badge>
                      ) : isExpiringSoon ? (
                        <Badge variant="amber" className="text-[10px]">
                          Expires in {sub.days_remaining}d
                        </Badge>
                      ) : (
                        <Badge variant="emerald" className="text-[10px]">
                          Active
                        </Badge>
                      )}
                    </TableCell>

                    {/* Start & Expiry Dates */}
                    <TableCell className="text-slate-600 dark:text-slate-300 text-[11px]">
                      <div>
                        <span className="text-slate-400 mr-1.5">Start:</span>
                        {new Date(sub.started_at).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="text-slate-400 mr-1.5">End:</span>
                        {sub.is_lifetime ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Lifetime (Never)</span>
                        ) : (
                          <span className={isExpiringSoon ? 'text-amber-600 dark:text-amber-400 font-medium' : ''}>
                            {new Date(sub.ends_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Payment Status */}
                    <TableCell className="text-[11px]">
                      {sub.latest_transaction ? (
                        <div>
                          <div className="flex items-center gap-1.5">
                            {sub.latest_transaction.state === 'succeeded' ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                Paid ₹{sub.latest_transaction.amount}
                              </span>
                            ) : sub.latest_transaction.state === 'pending' ? (
                              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                                <Clock className="w-3.5 h-3.5 text-amber-500" />
                                Pending Payment
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                                Payment Failed
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[140px]">
                            {sub.latest_transaction.provider_reference}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">
                          Admin Granted (Direct)
                        </span>
                      )}
                    </TableCell>

                    {/* Allowance */}
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-mono font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20 text-[11px]">
                        <Coins className="w-3 h-3 mr-1" />
                        {sub.allowance_balance}
                      </Badge>
                      <span className="block text-[9px] text-slate-400 mt-0.5">
                        {sub.end_behaviour}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!sub.is_lifetime && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(sub, 'extend')}
                            className="h-7 px-2 text-[11px] text-blue-600 dark:text-blue-300"
                            title="Extend subscription duration"
                          >
                            Extend
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(sub, 'status')}
                          className="h-7 px-2 text-[11px]"
                          title="Change subscription state"
                        >
                          Status
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(sub, 'plan')}
                          className="h-7 px-2 text-[11px]"
                          title="Switch subscription plan"
                        >
                          Plan
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* GRANT SUBSCRIPTION MODAL */}
      <Dialog open={isGrantOpen} onOpenChange={setIsGrantOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Grant Manual Subscription
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed pt-1">
              Grant a paid access subscription to a member (04 §4A). All manual grants update allowance
              balances and are permanently recorded in the immutable audit log (NFR-016).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGrantSubmit} className="space-y-4 text-xs mt-2">
            <div className="space-y-1.5">
              <Label>Select Member Account *</Label>
              <Select value={grantUserId} onValueChange={setGrantUserId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Choose Member" />
                </SelectTrigger>
                <SelectContent>
                  {usersList.map((u) => (
                    <SelectItem key={u.user_id} value={u.user_id}>
                      {u.email} {u.display_name ? `(${u.display_name})` : ''} — {u.allowance_balance} Credits
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Select Subscription Plan *</Label>
              <Select value={grantPlanId} onValueChange={setGrantPlanId}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Choose Plan" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlans.map((p) => (
                    <SelectItem key={p.plan_id} value={p.plan_id}>
                      {p.name} (₹{p.price} · {p.term_length} · {p.initial_allowance} credits)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="grant_expiry">Custom Expiry Date (Optional)</Label>
                <Input
                  id="grant_expiry"
                  type="date"
                  value={grantCustomEndsAt}
                  onChange={(e) => setGrantCustomEndsAt(e.target.value)}
                  className="text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Leave empty to use plan default term.
                </span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="grant_allowance">Initial Allowance (Optional)</Label>
                <Input
                  id="grant_allowance"
                  type="number"
                  placeholder="Defaults to plan allowance"
                  value={grantAllowance}
                  onChange={(e) => setGrantAllowance(e.target.value === '' ? '' : Number(e.target.value))}
                  className="text-xs"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Credits granted to user account.
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="grant_reason">Reason for Administrative Grant *</Label>
                <span className="text-[10px] text-rose-500 dark:text-rose-400 font-semibold">Mandatory for Audit Trail</span>
              </div>
              <Textarea
                id="grant_reason"
                value={grantReason}
                onChange={(e) => setGrantReason(e.target.value)}
                placeholder="e.g. Complimentary annual membership grant for creative partner (Ref #1042)"
                required
                rows={2}
                className="text-xs leading-relaxed"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsGrantOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={grantSubmitting || !grantReason.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                {grantSubmitting ? 'Granting...' : 'Confirm & Grant Subscription'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT / EXTEND / STATUS SUBSCRIPTION MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Manage Subscription: {selectedSub?.user.email}
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed pt-1">
              Subscription ID: <code className="font-mono text-cyan-600 dark:text-cyan-400">{selectedSub?.subscription_id}</code>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs mt-2">
            {/* Action Type Toggle */}
            <Tabs
              value={editActionType}
              onValueChange={(val) => setEditActionType(val as 'extend' | 'status' | 'plan')}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full h-9">
                <TabsTrigger value="extend" className="text-xs">
                  Extend Expiry
                </TabsTrigger>
                <TabsTrigger value="status" className="text-xs">
                  Change Status
                </TabsTrigger>
                <TabsTrigger value="plan" className="text-xs">
                  Switch Plan
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* EXTEND FIELDS */}
            {editActionType === 'extend' && (
              <div className="space-y-1.5">
                <Label>Extension Duration (Months)</Label>
                <Select
                  value={String(editMonths)}
                  onValueChange={(val) => setEditMonths(Number(val))}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">+1 Month</SelectItem>
                    <SelectItem value="3">+3 Months</SelectItem>
                    <SelectItem value="6">+6 Months</SelectItem>
                    <SelectItem value="12">+12 Months (1 Year)</SelectItem>
                    <SelectItem value="24">+24 Months (2 Years)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Current Expiry: <strong>{selectedSub?.is_lifetime ? 'Lifetime' : new Date(selectedSub?.ends_at || '').toLocaleDateString()}</strong>.
                </p>
              </div>
            )}

            {/* STATUS FIELDS */}
            {editActionType === 'status' && (
              <div className="space-y-1.5">
                <Label>Subscription Status</Label>
                <Select
                  value={editState}
                  onValueChange={(val: 'active' | 'ended' | 'cancelled') => setEditState(val)}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active (Permits viewing prompts)</SelectItem>
                    <SelectItem value="ended">Ended / Expired</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  Note: Retained end behaviour (<code className="text-cyan-600 dark:text-cyan-400">retain_delivered</code>) preserves already copied prompts even if ended.
                </p>
              </div>
            )}

            {/* PLAN FIELDS */}
            {editActionType === 'plan' && (
              <div className="space-y-1.5">
                <Label>Target Plan</Label>
                <Select
                  value={editPlanId}
                  onValueChange={setEditPlanId}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlans.map((p) => (
                      <SelectItem key={p.plan_id} value={p.plan_id}>
                        {p.name} (₹{p.price} · {p.term_length})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="edit_reason">Reason for Administrative Change *</Label>
                <span className="text-[10px] text-rose-500 dark:text-rose-400 font-semibold">Mandatory</span>
              </div>
              <Textarea
                id="edit_reason"
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                placeholder="e.g. Extended annual access by 12 months as goodwill gesture for verified service downtime"
                required
                rows={2}
                className="text-xs leading-relaxed"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editSubmitting || !editReason.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                {editSubmitting ? 'Saving...' : 'Confirm & Record Change'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
