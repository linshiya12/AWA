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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CalendarCheck className="w-6 h-6 text-blue-400" />
            <span>Subscription Management</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
              Screen A9
            </Badge>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Search, inspect, and manage subscriber memberships, term dates, and payment states (04 §4A, 07 §5.5).
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/admin/subscriptions/report">
            <Button
              variant="outline"
              size="sm"
              className="bg-slate-900 border-slate-700 text-cyan-400 hover:text-cyan-300 hover:bg-slate-800 text-xs h-9"
            >
              <BarChart3 className="w-4 h-4 mr-1.5" />
              Subscription Report
            </Button>
          </Link>

          <Button
            size="sm"
            onClick={() => {
              if (usersList.length > 0 && !grantUserId) {
                setGrantUserId(usersList[0].user_id);
              }
              setIsGrantOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-9"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Grant Subscription
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchSubscriptions}
            className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs h-9"
            title="Refresh subscription records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#080d1a] p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user email, name, or sub ID..."
              className="pl-8 bg-slate-900 border-slate-700 text-xs h-9 text-slate-200"
            />
          </div>

          {/* Plan Filter */}
          <div>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="w-full h-9 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200 text-xs"
            >
              <option value="all">All Plans</option>
              {availablePlans.map((p) => (
                <option key={p.plan_id} value={p.plan_id}>
                  {p.name} (₹{p.price})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full h-9 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200 text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Memberships</option>
              <option value="expiring_soon">Expiring Soon (≤ 30 days)</option>
              <option value="ended">Expired / Ended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date range filter reset button */}
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-slate-900 border-slate-700 text-[11px] h-9 text-slate-300 px-2"
              title="Started from date"
            />
            {(searchQuery || selectedPlan !== 'all' || selectedStatus !== 'all' || fromDate || toDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedPlan('all');
                  setSelectedStatus('all');
                  setFromDate('');
                  setToDate('');
                }}
                className="text-[11px] h-9 px-2 text-slate-400 hover:text-white"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Subscriptions Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#080d1a] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Subscriber</th>
                <th className="py-3 px-4 font-semibold">Plan & Pricing</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold">Start & Expiry Dates</th>
                <th className="py-3 px-4 font-semibold">Payment Status</th>
                <th className="py-3 px-4 font-semibold text-center">Allowance</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-4 h-4 animate-spin inline-block mr-2 text-blue-500" />
                    Loading subscriptions...
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No subscriptions match the selected criteria.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => {
                  const isExpiringSoon = sub.is_expiring_soon;
                  const isEnded =
                    sub.state === 'ended' ||
                    (!sub.is_lifetime && sub.days_remaining !== null && sub.days_remaining <= 0);

                  return (
                    <tr key={sub.subscription_id} className="hover:bg-slate-800/20 transition-colors">
                      {/* Subscriber */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px] font-semibold text-slate-300">
                            {sub.user.display_name
                              ? sub.user.display_name.charAt(0).toUpperCase()
                              : sub.user.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-200 block text-xs">
                              {sub.user.email}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {sub.user.display_name || 'Individual Creator'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Plan & Pricing */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-semibold text-slate-200 block">
                            {sub.plan.name}
                          </span>
                          <span className="text-[11px] text-cyan-400 font-mono">
                            ₹{sub.plan.price} / {sub.is_lifetime ? 'Lifetime' : 'Year'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {sub.state === 'cancelled' ? (
                          <Badge className="bg-slate-800 text-slate-400 border-slate-700 text-[10px]">
                            Cancelled
                          </Badge>
                        ) : isEnded ? (
                          <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 text-[10px]">
                            Expired
                          </Badge>
                        ) : isExpiringSoon ? (
                          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 text-[10px]">
                            Expires in {sub.days_remaining}d
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                            Active
                          </Badge>
                        )}
                      </td>

                      {/* Start & Expiry Dates */}
                      <td className="py-3.5 px-4 text-slate-300 text-[11px]">
                        <div>
                          <span className="text-slate-500 mr-1.5">Start:</span>
                          {new Date(sub.started_at).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="text-slate-500 mr-1.5">End:</span>
                          {sub.is_lifetime ? (
                            <span className="text-emerald-400 font-medium">Lifetime (Never)</span>
                          ) : (
                            <span className={isExpiringSoon ? 'text-amber-400 font-medium' : ''}>
                              {new Date(sub.ends_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4 text-[11px]">
                        {sub.latest_transaction ? (
                          <div>
                            <div className="flex items-center gap-1.5">
                              {sub.latest_transaction.state === 'succeeded' ? (
                                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  Paid ₹{sub.latest_transaction.amount}
                                </span>
                              ) : sub.latest_transaction.state === 'pending' ? (
                                <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
                                  <Clock className="w-3 h-3 text-amber-400" />
                                  Pending Payment
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-400 font-medium">
                                  <XCircle className="w-3 h-3 text-rose-400" />
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
                      </td>

                      {/* Allowance */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 font-mono font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 text-[11px]">
                          <Coins className="w-3 h-3" />
                          {sub.allowance_balance}
                        </span>
                        <span className="block text-[9px] text-slate-400 mt-0.5">
                          {sub.end_behaviour}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!sub.is_lifetime && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(sub, 'extend')}
                              className="h-7 px-2 text-[11px] border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-blue-300"
                              title="Extend subscription duration"
                            >
                              Extend
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(sub, 'status')}
                            className="h-7 px-2 text-[11px] border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-slate-300"
                            title="Change subscription state"
                          >
                            Status
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(sub, 'plan')}
                            className="h-7 px-2 text-[11px] border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-slate-300"
                            title="Switch subscription plan"
                          >
                            Plan
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* GRANT SUBSCRIPTION MODAL */}
      <Dialog open={isGrantOpen} onOpenChange={setIsGrantOpen}>
        <DialogContent className="border-slate-800 bg-[#0d1222] text-slate-100 max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <PlusCircle className="w-5 h-5 text-blue-400" />
              Grant Manual Subscription
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs leading-relaxed pt-1">
              Grant a paid access subscription to a member (04 §4A). All manual grants update allowance
              balances and are permanently recorded in the immutable audit log (NFR-016).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleGrantSubmit} className="space-y-4 text-xs mt-2">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Select Member Account *
              </label>
              <select
                value={grantUserId}
                onChange={(e) => setGrantUserId(e.target.value)}
                required
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 text-xs"
              >
                {usersList.map((u) => (
                  <option key={u.user_id} value={u.user_id}>
                    {u.email} {u.display_name ? `(${u.display_name})` : ''} — Current Credits: {u.allowance_balance}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Select Subscription Plan *
              </label>
              <select
                value={grantPlanId}
                onChange={(e) => setGrantPlanId(e.target.value)}
                required
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 text-xs"
              >
                {availablePlans.map((p) => (
                  <option key={p.plan_id} value={p.plan_id}>
                    {p.name} (₹{p.price} · {p.term_length} · {p.initial_allowance} initial credits)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Custom Expiry Date (Optional)
                </label>
                <Input
                  type="date"
                  value={grantCustomEndsAt}
                  onChange={(e) => setGrantCustomEndsAt(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Leave empty to use plan default term.
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Initial Allowance (Optional)
                </label>
                <Input
                  type="number"
                  placeholder="Defaults to plan allowance"
                  value={grantAllowance}
                  onChange={(e) => setGrantAllowance(e.target.value === '' ? '' : Number(e.target.value))}
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Credits granted to user account.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                <span>Reason for Administrative Grant *</span>
                <span className="text-[10px] text-rose-400">Mandatory for Audit Trail</span>
              </label>
              <textarea
                value={grantReason}
                onChange={(e) => setGrantReason(e.target.value)}
                placeholder="e.g. Complimentary annual membership grant for creative partner (Ref #1042)"
                required
                rows={2}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 text-xs leading-relaxed"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsGrantOpen(false)}
                className="text-xs text-slate-400"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={grantSubmitting || !grantReason.trim()}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                {grantSubmitting ? 'Granting...' : 'Confirm & Grant Subscription'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT / EXTEND / STATUS SUBSCRIPTION MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="border-slate-800 bg-[#0d1222] text-slate-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <CalendarCheck className="w-5 h-5 text-blue-400" />
              Manage Subscription: {selectedSub?.user.email}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs leading-relaxed pt-1">
              Subscription ID: <code className="font-mono text-cyan-400">{selectedSub?.subscription_id}</code>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs mt-2">
            {/* Action Type Toggle */}
            <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setEditActionType('extend')}
                className={`flex-1 py-1.5 text-center font-medium rounded-md transition-colors ${
                  editActionType === 'extend' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Extend Expiry
              </button>
              <button
                type="button"
                onClick={() => setEditActionType('status')}
                className={`flex-1 py-1.5 text-center font-medium rounded-md transition-colors ${
                  editActionType === 'status' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Change Status
              </button>
              <button
                type="button"
                onClick={() => setEditActionType('plan')}
                className={`flex-1 py-1.5 text-center font-medium rounded-md transition-colors ${
                  editActionType === 'plan' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Switch Plan
              </button>
            </div>

            {/* EXTEND FIELDS */}
            {editActionType === 'extend' && (
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Extension Duration (Months)
                </label>
                <select
                  value={editMonths}
                  onChange={(e) => setEditMonths(Number(e.target.value))}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 text-xs"
                >
                  <option value={1}>+1 Month</option>
                  <option value={3}>+3 Months</option>
                  <option value={6}>+6 Months</option>
                  <option value={12}>+12 Months (1 Year)</option>
                  <option value={24}>+24 Months (2 Years)</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Current Expiry: <strong>{selectedSub?.is_lifetime ? 'Lifetime' : new Date(selectedSub?.ends_at || '').toLocaleDateString()}</strong>.
                </p>
              </div>
            )}

            {/* STATUS FIELDS */}
            {editActionType === 'status' && (
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Subscription Status
                </label>
                <select
                  value={editState}
                  onChange={(e) => setEditState(e.target.value as any)}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 text-xs"
                >
                  <option value="active">Active (Permits viewing prompts)</option>
                  <option value="ended">Ended / Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Note: Retained end behaviour (<code className="text-cyan-400">retain_delivered</code>) preserves already copied prompts even if ended.
                </p>
              </div>
            )}

            {/* PLAN FIELDS */}
            {editActionType === 'plan' && (
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Target Plan
                </label>
                <select
                  value={editPlanId}
                  onChange={(e) => setEditPlanId(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 text-xs"
                >
                  {availablePlans.map((p) => (
                    <option key={p.plan_id} value={p.plan_id}>
                      {p.name} (₹{p.price} · {p.term_length})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center justify-between">
                <span>Reason for Administrative Change *</span>
                <span className="text-[10px] text-rose-400">Mandatory</span>
              </label>
              <textarea
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                placeholder="e.g. Extended annual access by 12 months as goodwill gesture for verified service downtime"
                required
                rows={2}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 text-xs leading-relaxed"
              />
            </div>

            <DialogFooter className="pt-3 border-t border-slate-800">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditOpen(false)}
                className="text-xs text-slate-400"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={editSubmitting || !editReason.trim()}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
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
