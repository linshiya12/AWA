'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Sparkles,
  Save,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Plan {
  plan_id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  term_length: string;
  initial_allowance: number;
  is_available: boolean;
}

interface CreditPack {
  pack_id: string;
  name: string;
  price: number;
  currency: string;
  units: number;
  is_available: boolean;
}

interface PaymentConfig {
  configuration_id: string;
  provider: string;
  mode: 'test' | 'live';
  key_id: string;
  key_secret_masked: string;
  webhook_secret_masked: string;
  is_enabled: boolean;
  last_verified_at: string | null;
}

interface SpendPeriod {
  period_id: string;
  limit: number;
  spent: number;
  period_start: string;
  period_end: string;
}

export default function AdminCommercePage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [creditPacks, setCreditPacks] = useState<CreditPack[]>([]);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [spendPeriod, setSpendPeriod] = useState<SpendPeriod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Spend cap input
  const [spendLimitInput, setSpendLimitInput] = useState<number>(500);

  // New keys input (write-only)
  const [keyIdInput, setKeyIdInput] = useState('');
  const [keySecretInput, setKeySecretInput] = useState('');
  const [webhookSecretInput, setWebhookSecretInput] = useState('');
  const [paymentMode, setPaymentMode] = useState<'test' | 'live'>('test');

  // Test connection state
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; verifiedAt?: string } | null>(null);
  const [testing, setTesting] = useState(false);

  const fetchCommerce = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/admin/commerce');
      if (!res.ok) throw new Error('Failed to retrieve commerce parameters');
      const data = await res.json();
      setPlans(data.plans || []);
      setCreditPacks(data.creditPacks || []);
      setPaymentConfig(data.paymentConfig || null);
      setSpendPeriod(data.spendPeriod || null);

      if (data.spendPeriod) {
        setSpendLimitInput(data.spendPeriod.limit);
      }
      if (data.paymentConfig) {
        setKeyIdInput(data.paymentConfig.key_id);
        setPaymentMode(data.paymentConfig.mode);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with commerce server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommerce();
  }, []);

  const handleSaveSpendCap = async () => {
    try {
      const res = await fetch('/api/v1/admin/commerce', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spend_cap_limit: spendLimitInput }),
      });
      if (res.ok) {
        alert('Monthly spend cap ceiling updated.');
        fetchCommerce();
      }
    } catch {
      alert('Error updating spend cap');
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/v1/admin/commerce/test-connection', {
        method: 'POST',
      });
      const data = await res.json();
      setTestResult(data);
      if (data.success) {
        fetchCommerce();
      }
    } catch {
      setTestResult({ success: false, message: 'Gateway ping failed.' });
    } finally {
      setTesting(false);
    }
  };

  const handleSavePaymentConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/admin/commerce', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_config: {
            mode: paymentMode,
            key_id: keyIdInput,
            key_secret: keySecretInput || undefined,
            webhook_secret: webhookSecretInput || undefined,
          },
        }),
      });
      if (res.ok) {
        alert('Payment configuration saved. Credentials stored write-only in private database.');
        setKeySecretInput('');
        setWebhookSecretInput('');
        fetchCommerce();
      }
    } catch {
      alert('Error saving payment configuration');
    }
  };

  if (loading || !paymentConfig || !spendPeriod) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
        <Card className="p-6 h-56">
          <Skeleton className="h-6 w-72 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
        </Card>
        <Card className="p-6 h-72">
          <Skeleton className="h-6 w-80 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
          </div>
        </Card>
      </div>
    );
  }

  const spendPercent = Math.min(100, Math.round((spendPeriod.spent / spendPeriod.limit) * 100));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Commerce, Plans & Spending Cap</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
              Screen A7
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Subscription plans, credit packs, write-only payment credentials, and monthly AI cost ceiling (FEAT-042, FEAT-043).
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchCommerce}
          className="text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Refresh
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Commerce Telemetry Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={fetchCommerce} className="ml-4">
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* SECTION 1: MONTHLY SPEND CAP */}
      <Card className="p-6 space-y-4 border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Monthly AI Spend Cap & Safeguard (FEAT-043)</h3>
          </div>
          <Badge variant="outline" className="text-xs font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
            Hard Ceiling: ${spendPeriod.limit}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Gauge card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex flex-col justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              Current Period Spend
            </span>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">${spendPeriod.spent.toFixed(2)}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 font-medium">({spendPercent}% of limit)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                style={{ width: `${spendPercent}%` }}
              />
            </div>
          </div>

          {/* Limit form */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex flex-col justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              Adjust Monthly Limit
            </span>
            <div className="flex items-center gap-2 my-2">
              <span className="text-sm font-bold text-slate-500">$</span>
              <Input
                type="number"
                value={spendLimitInput}
                onChange={(e) => setSpendLimitInput(Number(e.target.value))}
                className="text-xs font-mono h-9"
              />
              <Button size="sm" onClick={handleSaveSpendCap} className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9">
                Update
              </Button>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">Alert triggers at 80% threshold</span>
          </div>

          {/* Fixed rate limit rule */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex flex-col justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              User Rate Limit (Decided)
            </span>
            <div className="my-2 font-mono font-bold text-cyan-600 dark:text-cyan-400 text-lg">
              20 calls / user / hour
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Fixed rate limit enforced independently of remaining allowance (08 §5).
            </span>
          </div>
        </div>
      </Card>

      {/* SECTION 2: PAYMENT CONFIGURATION */}
      <Card className="p-6 space-y-4 border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Payment Gateway Configuration (Razorpay)</h3>
          </div>
          {paymentConfig.last_verified_at && (
            <Badge variant="emerald" className="text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified {new Date(paymentConfig.last_verified_at).toLocaleDateString()}
            </Badge>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Stored encrypted in the private database. Secret keys are <strong>write-only</strong> (NFR-005) and can never be read back through any interface.
        </p>

        <form onSubmit={handleSavePaymentConfig} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
          <div className="space-y-1.5">
            <Label>Environment Mode</Label>
            <Select
              value={paymentMode}
              onValueChange={(val: 'test' | 'live') => setPaymentMode(val)}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="test">Test Mode (Sandbox)</SelectItem>
                <SelectItem value="live">Live Mode (Production)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="key_id">Razorpay Key ID</Label>
            <Input
              id="key_id"
              value={keyIdInput}
              onChange={(e) => setKeyIdInput(e.target.value)}
              placeholder="rzp_test_..."
              className="text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="key_secret">Razorpay Key Secret (Write-Only)</Label>
            <Input
              id="key_secret"
              type="password"
              value={keySecretInput}
              onChange={(e) => setKeySecretInput(e.target.value)}
              placeholder={paymentConfig.key_secret_masked}
              className="text-xs font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Leave blank to keep existing encrypted secret.
            </span>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="webhook_sec">Webhook Secret (Write-Only)</Label>
            <Input
              id="webhook_sec"
              type="password"
              value={webhookSecretInput}
              onChange={(e) => setWebhookSecretInput(e.target.value)}
              placeholder={paymentConfig.webhook_secret_masked}
              className="text-xs font-mono"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Used for verifying incoming webhook signatures (API-010).
            </span>
          </div>

          <div className="col-span-2 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={testing}
                onClick={handleTestConnection}
                className="text-xs"
              >
                {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-cyan-500" />}
                Test Connection Before Enabling
              </Button>
              {testResult && (
                <span className={`text-xs ${testResult.success ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-rose-600 dark:text-rose-400 font-medium'}`}>
                  {testResult.message}
                </span>
              )}
            </div>

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
              Save Payment Settings
            </Button>
          </div>
        </form>
      </Card>

      {/* SECTION 3: SUBSCRIPTION PLANS & CREDIT PACKS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plans */}
        <Card className="p-6 space-y-4 border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Subscription Plans (05-MVP §3.3)
            </h3>
            <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
              2 Confirmed Plans
            </Badge>
          </div>

          <div className="space-y-3">
            {plans.map((p) => (
              <div key={p.plan_id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</span>
                    <Badge variant="outline" className="text-[10px] text-blue-600 dark:text-blue-400 border-blue-500/30">
                      {p.term_length}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{p.description}</p>
                  <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium block mt-1">
                    Initial allowance: {p.initial_allowance} customizations
                  </span>
                </div>

                <div className="text-right shrink-0 ml-4">
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white">₹{p.price}</span>
                  <span className="block text-[10px] text-slate-400">{p.term_length === 'yearly' ? '/ year' : 'lifetime'}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Credit Packs */}
        <Card className="p-6 space-y-4 border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Customization Credit Packs
            </h3>
            <Badge variant="secondary" className="text-[10px] uppercase font-semibold">
              Top-up Packs
            </Badge>
          </div>

          <div className="space-y-3">
            {creditPacks.map((cp) => (
              <div key={cp.pack_id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{cp.name}</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Grants {cp.units} AI customizations. Packs confer units once and carry no term access.
                  </p>
                </div>

                <div className="text-right shrink-0 ml-4">
                  <span className="text-lg font-extrabold text-slate-900 dark:text-white">₹{cp.price}</span>
                  <span className="block text-[10px] text-slate-400">{cp.units} credits</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
