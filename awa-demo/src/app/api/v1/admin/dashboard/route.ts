import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/server/auth';
import { publicDb } from '@/lib/server/db/publicStore';
import { privateDb } from '@/lib/server/db/privateStore';

export async function GET(request: NextRequest) {
  const auth = requireAdminApi(request);
  if ('errorResponse' in auth) return auth.errorResponse;

  const { searchParams } = new URL(request.url);
  const period = (searchParams.get('period') || '30d') as '7d' | '30d' | '90d' | 'all';

  const now = new Date();
  let currentStart: Date | null = null;
  let prevStart: Date | null = null;
  let prevEnd: Date | null = null;

  if (period === '7d') {
    currentStart = new Date(now.getTime() - 7 * 86400000);
    prevStart = new Date(now.getTime() - 14 * 86400000);
    prevEnd = currentStart;
  } else if (period === '30d') {
    currentStart = new Date(now.getTime() - 30 * 86400000);
    prevStart = new Date(now.getTime() - 60 * 86400000);
    prevEnd = currentStart;
  } else if (period === '90d') {
    currentStart = new Date(now.getTime() - 90 * 86400000);
    prevStart = new Date(now.getTime() - 180 * 86400000);
    prevEnd = currentStart;
  }

  // 1. ALL SUBSCRIPTIONS & ACTIVE COUNT
  const allSubs = privateDb.getSubscriptions();
  const activeSubs = allSubs.filter(
    (s) => s.state === 'active' && (s.is_lifetime || (s.days_remaining !== null && s.days_remaining > 0))
  );
  const activeCount = activeSubs.length;

  // Real historical comparison if supported
  let activeChangePercent: number | null = null;
  let prevActiveCount: number | null = null;
  if (prevEnd) {
    const prevActive = allSubs.filter(
      (s) => s.state === 'active' && new Date(s.started_at) <= prevEnd!
    );
    prevActiveCount = prevActive.length;
    if (prevActiveCount > 0) {
      activeChangePercent = Math.round(((activeCount - prevActiveCount) / prevActiveCount) * 100);
    }
  }

  // 2. REVENUE FROM SUCCESSFUL PLAN PAYMENTS ONLY
  // Strictly sums payment_transactions where purchase_type === 'plan' AND state === 'succeeded'
  const allTransactions = privateDb.getTransactions();
  const allSucceededPlanTx = allTransactions.filter(
    (tx) => tx.purchase_type === 'plan' && tx.state === 'succeeded'
  );

  const currentPeriodTx = currentStart
    ? allSucceededPlanTx.filter((tx) => new Date(tx.occurred_at) >= currentStart!)
    : allSucceededPlanTx;

  const currentRevenue = currentPeriodTx.reduce((sum, tx) => sum + tx.amount, 0);

  let prevRevenue: number | null = null;
  let revenueChangePercent: number | null = null;
  if (prevStart && prevEnd) {
    const prevPeriodTx = allSucceededPlanTx.filter((tx) => {
      const d = new Date(tx.occurred_at);
      return d >= prevStart! && d < prevEnd!;
    });
    prevRevenue = prevPeriodTx.reduce((sum, tx) => sum + tx.amount, 0);
    if (prevRevenue > 0) {
      revenueChangePercent = Math.round(((currentRevenue - prevRevenue) / prevRevenue) * 100);
    }
  }

  // 3. PUBLISHED TEMPLATES
  const allTemplates = publicDb.getTemplates();
  const publishedTemplates = allTemplates.filter((t) => t.status === 'published');
  const draftTemplates = allTemplates.filter((t) => t.status === 'draft');
  const publishedCount = publishedTemplates.length;
  const totalTemplatesCount = allTemplates.length;
  const templateRatio = totalTemplatesCount > 0 ? Math.round((publishedCount / totalTemplatesCount) * 100) : 0;

  // 4. AI CUSTOMIZATION SPEND VS CAP
  const commerce = privateDb.getCommerceOverview();
  const spendPeriod = commerce.spendPeriod;
  const aiSpent = spendPeriod.spent;
  const aiLimit = spendPeriod.limit;
  const spendPercent = Math.min(100, Math.round((aiSpent / aiLimit) * 100));
  const spendStatus: 'normal' | 'approaching' | 'paused' =
    spendPercent >= 100 ? 'paused' : spendPercent >= 80 ? 'approaching' : 'normal';

  // 5. TRENDS DATA BUCKETS
  const users = privateDb.getUsers();
  const userMap = new Map(users.map((u) => [u.user_id, u]));

  // Generate bucket series based on selected period
  const trendPoints: Array<{
    date: string;
    label: string;
    revenue: number;
    subscriptions: number;
    aiSpend: number;
    cumulativeRevenue: number;
  }> = [];

  const bucketCount = period === '7d' ? 7 : period === '30d' ? 6 : period === '90d' ? 6 : 6;
  const intervalMs = currentStart
    ? (now.getTime() - currentStart.getTime()) / bucketCount
    : (365 * 86400000) / bucketCount;

  const baseStart = currentStart ? currentStart.getTime() : now.getTime() - 365 * 86400000;
  let runningRev = 0;

  for (let i = 0; i < bucketCount; i++) {
    const bucketStart = new Date(baseStart + i * intervalMs);
    const bucketEnd = new Date(baseStart + (i + 1) * intervalMs);

    const bTx = allSucceededPlanTx.filter((tx) => {
      const d = new Date(tx.occurred_at);
      return d >= bucketStart && d < bucketEnd;
    });

    const bSubs = allSubs.filter((s) => {
      const d = new Date(s.started_at);
      return d >= bucketStart && d < bucketEnd;
    });

    const bRev = bTx.reduce((sum, tx) => sum + tx.amount, 0);
    runningRev += bRev;

    // Allocated proportionate AI spend for the trend interval
    const bAiSpend = Math.round((aiSpent / bucketCount) * 100) / 100;

    const label =
      period === '7d'
        ? bucketStart.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' })
        : bucketStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    trendPoints.push({
      date: bucketStart.toISOString(),
      label,
      revenue: bRev,
      subscriptions: bSubs.length,
      aiSpend: bAiSpend,
      cumulativeRevenue: runningRev,
    });
  }

  // 6. NEEDS ATTENTION
  // A. Expiring Subscriptions (within 30 days)
  const expiringSubs = allSubs
    .filter((s) => s.is_expiring_soon || (s.days_remaining !== null && s.days_remaining <= 30 && s.days_remaining > 0))
    .map((s) => ({
      id: s.subscription_id,
      userEmail: s.user?.email || userMap.get(s.user_id)?.email || 'Unknown',
      userName: s.user?.display_name || userMap.get(s.user_id)?.display_name || 'Subscriber',
      planName: s.plan?.name || s.plan_id,
      daysRemaining: s.days_remaining ?? 0,
      endsAt: s.ends_at,
    }));

  // B. Failed Payments
  const failedTx = allTransactions
    .filter((tx) => tx.state === 'failed')
    .map((tx) => ({
      id: tx.transaction_id,
      userEmail: userMap.get(tx.user_id)?.email || tx.user_id,
      amount: tx.amount,
      currency: tx.currency,
      providerReference: tx.provider_reference,
      date: tx.occurred_at,
    }));

  // C. Unpublished or Incomplete Templates
  const incompleteTemplates = allTemplates
    .filter((t) => t.status === 'draft' || !t.current_version_id)
    .map((t) => ({
      id: t.template_id,
      name: t.name,
      status: t.status,
      issue: !t.current_version_id ? 'Missing prompt version' : 'Draft status (unpublished)',
    }));

  // D. Missing Guidance or Media
  const missingGuidanceOrMedia = allTemplates
    .filter((t) => {
      const guide = publicDb.getGuidanceForScope('template', t.template_id);
      return !guide || guide.steps.length === 0 || !t.preview_image;
    })
    .map((t) => {
      const guide = publicDb.getGuidanceForScope('template', t.template_id);
      const isMissingGuide = !guide || guide.steps.length === 0;
      return {
        id: t.template_id,
        name: t.name,
        issue: isMissingGuide ? 'No step guidance walkthrough' : 'Missing preview image',
      };
    });

  // E. Catalog Gaps
  const reports = privateDb.getReports();
  const catalogGaps = reports.contentGaps.map((g) => ({
    type: g.type,
    templateId: g.templateId,
    templateName: g.templateName,
    message: g.message,
  }));

  // F. Spend Cap Warning
  const spendCapWarning = {
    isWarning: spendStatus === 'approaching' || spendStatus === 'paused',
    isPaused: spendStatus === 'paused',
    message:
      spendStatus === 'paused'
        ? `Monthly AI spend cap reached ($${aiSpent.toFixed(2)} / $${aiLimit.toFixed(2)}). Customizations paused.`
        : spendStatus === 'approaching'
        ? `AI spend is at ${spendPercent}% of monthly ceiling ($${aiSpent.toFixed(2)} / $${aiLimit.toFixed(2)}).`
        : null,
    href: '/admin/commerce',
  };

  const totalIssuesCount =
    expiringSubs.length +
    failedTx.length +
    incompleteTemplates.length +
    missingGuidanceOrMedia.length +
    catalogGaps.length +
    (spendCapWarning.isWarning ? 1 : 0);

  // 7. RECENT ACTIVITY COMPACT STREAM
  // Combines transactions, subscription changes, and administrative audit logs
  type ActivityItem = {
    id: string;
    type: 'subscription' | 'payment' | 'template' | 'audit';
    title: string;
    description: string;
    timestamp: string;
    badge: {
      label: string;
      variant: 'emerald' | 'blue' | 'amber' | 'rose' | 'secondary';
    };
    amount?: string;
    actor?: string;
    link?: string;
  };

  const activityList: ActivityItem[] = [];

  // Add transactions
  for (const tx of allTransactions.slice(0, 10)) {
    const u = userMap.get(tx.user_id);
    const isSuccess = tx.state === 'succeeded';
    const isPending = tx.state === 'pending';
    activityList.push({
      id: tx.transaction_id,
      type: 'payment',
      title: `${tx.purchase_type === 'plan' ? 'Plan Payment' : 'Credit Pack Purchase'}`,
      description: `${u ? u.display_name : tx.user_id} (${u ? u.email : ''})`,
      timestamp: tx.occurred_at,
      badge: {
        label: tx.state.charAt(0).toUpperCase() + tx.state.slice(1),
        variant: isSuccess ? 'emerald' : isPending ? 'amber' : 'rose',
      },
      amount: `${isSuccess ? '+' : ''}${tx.currency === 'INR' ? '₹' : '$'}${tx.amount}`,
      actor: u?.display_name || 'Customer',
      link: '/admin/commerce',
    });
  }

  // Add audit logs
  const auditLogs = privateDb.getAuditLogs({ limit: 10 });
  for (const log of auditLogs) {
    const actorUser = userMap.get(log.actor_id);
    const actorName = actorUser?.display_name || 'Admin';
    let title = log.action.replace(/_/g, ' ');
    title = title.charAt(0).toUpperCase() + title.slice(1);

    activityList.push({
      id: log.audit_id,
      type: 'audit',
      title,
      description: `Target: ${log.entity_type} (${log.entity_id})`,
      timestamp: log.occurred_at,
      badge: {
        label: 'Audit',
        variant: 'blue',
      },
      actor: actorName,
      link: log.entity_type === 'template' ? `/admin/templates/${log.entity_id}` : '/admin/audit',
    });
  }

  // Sort chronologically newest first and take top 8
  activityList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const recentActivity = activityList.slice(0, 8);

  return NextResponse.json({
    refreshedAt: now.toISOString(),
    period,
    metrics: {
      activeSubscriptions: {
        count: activeCount,
        previousCount: prevActiveCount,
        changePercent: activeChangePercent,
      },
      subscriptionRevenue: {
        amount: currentRevenue,
        previousAmount: prevRevenue,
        changePercent: revenueChangePercent,
        transactionCount: currentPeriodTx.length,
        currency: 'INR',
      },
      publishedTemplates: {
        publishedCount,
        totalCount: totalTemplatesCount,
        ratio: templateRatio,
      },
      aiSpend: {
        spent: aiSpent,
        limit: aiLimit,
        percent: spendPercent,
        status: spendStatus,
        currency: 'USD',
      },
    },
    trends: {
      points: trendPoints,
      totalRevenue: currentRevenue,
      averageDailyRevenue:
        period === '7d'
          ? Math.round(currentRevenue / 7)
          : period === '30d'
          ? Math.round(currentRevenue / 30)
          : Math.round(currentRevenue / 90),
    },
    needsAttention: {
      expiringSubscriptions: {
        count: expiringSubs.length,
        items: expiringSubs,
        href: '/admin/subscriptions?status=expiring',
      },
      failedPayments: {
        count: failedTx.length,
        items: failedTx,
        href: '/admin/commerce',
      },
      unpublishedTemplates: {
        count: incompleteTemplates.length,
        items: incompleteTemplates,
        href: '/admin/templates?status=draft',
      },
      missingGuidanceOrMedia: {
        count: missingGuidanceOrMedia.length,
        items: missingGuidanceOrMedia,
        href: '/admin/templates',
      },
      catalogGaps: {
        count: catalogGaps.length,
        items: catalogGaps,
        href: '/admin/catalog',
      },
      spendCapWarning,
      totalIssuesCount,
    },
    recentActivity,
  });
}
