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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

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
  const [entityFilter, setEntityFilter] = useState('all');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const url =
        entityFilter === 'all'
          ? '/api/v1/admin/audit?limit=100'
          : `/api/v1/admin/audit?limit=100&entity_type=${encodeURIComponent(entityFilter)}`;
      const res = await fetch(url);
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
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
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Administrative Audit Log</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
              API-030 · NFR-016
            </Badge>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Immutable, append-only record of all administrative actions, content publishes, user adjustments, and commerce modifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-300 text-xs h-9"
          >
            <option value="all">All Entity Types</option>
            <option value="template">Templates</option>
            <option value="template_version">Prompt Versions</option>
            <option value="category">Categories</option>
            <option value="user">User Accounts</option>
            <option value="payment_configuration">Payment Config</option>
            <option value="spend_period">Spend Cap</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchLogs}
            className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#080d1a] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Actor</th>
                <th className="py-3 px-4 font-semibold">Action</th>
                <th className="py-3 px-4 font-semibold">Entity Type & ID</th>
                <th className="py-3 px-4 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-4 h-4 animate-spin inline-block mr-2 text-blue-500" />
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No audit records matching filter.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isExpanded = expandedLogId === log.audit_id;
                  return (
                    <React.Fragment key={log.audit_id}>
                      <tr className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                          {new Date(log.occurred_at).toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-200">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-400 font-mono text-[11px]">
                            {log.actor_id}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge
                            variant="outline"
                            className="text-[10px] font-mono text-cyan-400 border-cyan-500/30"
                          >
                            {log.action}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 text-slate-300">
                          <span className="font-semibold text-slate-200 mr-2">{log.entity_type}</span>
                          <span className="font-mono text-slate-400 text-[11px]">{log.entity_id}</span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpand(log.audit_id)}
                            className="h-7 px-2 text-xs text-blue-400 hover:text-blue-300"
                          >
                            <span>{isExpanded ? 'Hide Diff' : 'View Diff'}</span>
                            <ChevronDown
                              className={`w-3.5 h-3.5 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            />
                          </Button>
                        </td>
                      </tr>

                      {/* Expanded Diff Row */}
                      {isExpanded && (
                        <tr className="bg-slate-900/40">
                          <td colSpan={5} className="p-4 border-t border-slate-800/60">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                              <div>
                                <span className="block text-slate-400 font-bold mb-1 text-[10px] uppercase">
                                  State Before
                                </span>
                                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 overflow-x-auto text-[11px]">
                                  {log.before ? JSON.stringify(log.before, null, 2) : 'null (Created)'}
                                </pre>
                              </div>

                              <div>
                                <span className="block text-emerald-400 font-bold mb-1 text-[10px] uppercase">
                                  State After
                                </span>
                                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-emerald-300 overflow-x-auto text-[11px]">
                                  {log.after ? JSON.stringify(log.after, null, 2) : 'null'}
                                </pre>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
