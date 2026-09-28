'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  Clock,
  User,
  FileCode,
  DollarSign,
  ChevronDown,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

interface AuditLog {
  audit_id: string;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  occurred_at: string;
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entityFilter, setEntityFilter] = useState('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        entityFilter === 'all'
          ? '/api/v1/admin/audit?limit=100'
          : `/api/v1/admin/audit?limit=100&entity_type=${encodeURIComponent(entityFilter)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to retrieve audit trail');
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with audit ledger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [entityFilter]);

  const toggleExpand = (id: string) => {
    setExpandedLogId(expandedLogId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <span>Administrative Audit Log</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
              API-030 · NFR-016
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Immutable, append-only record of all administrative actions, content publishes, user adjustments, and commerce modifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-48">
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Entity Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entity Types</SelectItem>
                <SelectItem value="curated_collection">Curated Collections</SelectItem>
                <SelectItem value="template">Templates</SelectItem>
                <SelectItem value="template_version">Prompt Versions</SelectItem>
                <SelectItem value="category">Categories</SelectItem>
                <SelectItem value="user">User Accounts</SelectItem>
                <SelectItem value="payment_configuration">Payment Config</SelectItem>
                <SelectItem value="spend_period">Spend Cap</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Audit Ledger Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={fetchLogs} className="ml-4">
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Audit Log Table */}
      <Card className="overflow-hidden border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Timestamp</TableHead>
              <TableHead className="font-semibold">Actor</TableHead>
              <TableHead className="font-semibold">Action</TableHead>
              <TableHead className="font-semibold">Entity Type & ID</TableHead>
              <TableHead className="font-semibold text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading state: Skeletons
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Skeleton className="h-4 w-32 font-mono" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-28 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-7 w-20 ml-auto rounded-lg" />
                  </TableCell>
                </TableRow>
              ))
            ) : logs.length === 0 ? (
              // Empty State
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {entityFilter !== 'all' ? 'No records for selected entity type' : 'No audit entries recorded'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        All administrative mutations across prompts, categories, roles, and caps will be logged here.
                      </p>
                    </div>
                    {entityFilter !== 'all' && (
                      <Button variant="outline" size="sm" onClick={() => setEntityFilter('all')} className="text-xs">
                        View All Entities
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Populated State
              logs.map((log) => {
                const isExpanded = expandedLogId === log.audit_id;
                return (
                  <React.Fragment key={log.audit_id}>
                    <TableRow className="transition-colors">
                      <TableCell className="text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {new Date(log.occurred_at).toLocaleString()}
                      </TableCell>

                      <TableCell className="font-semibold text-slate-900 dark:text-slate-200">
                        <Badge variant="secondary" className="font-mono text-[11px]">
                          {log.actor_id}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 border-cyan-500/30 bg-cyan-500/5"
                        >
                          {log.action}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-slate-700 dark:text-slate-300">
                        <span className="font-semibold text-slate-900 dark:text-slate-200 mr-2">{log.entity_type}</span>
                        <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">{log.entity_id}</span>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(log.audit_id)}
                          className="h-7 px-2.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                        >
                          <span>{isExpanded ? 'Hide Diff' : 'View Diff'}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Diff Row */}
                    {isExpanded && (
                      <TableRow className="bg-slate-50/80 dark:bg-slate-900/40">
                        <TableCell colSpan={5} className="p-4 border-t border-slate-200 dark:border-slate-800/60">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                            <div>
                              <span className="block text-slate-500 dark:text-slate-400 font-bold mb-1 text-[10px] uppercase">
                                State Before
                              </span>
                              <pre className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 overflow-x-auto text-[11px] max-h-64">
                                {log.before ? JSON.stringify(log.before, null, 2) : 'null (Created)'}
                              </pre>
                            </div>

                            <div>
                              <span className="block text-emerald-600 dark:text-emerald-400 font-bold mb-1 text-[10px] uppercase">
                                State After
                              </span>
                              <pre className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-300 overflow-x-auto text-[11px] max-h-64">
                                {log.after ? JSON.stringify(log.after, null, 2) : 'null'}
                              </pre>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
