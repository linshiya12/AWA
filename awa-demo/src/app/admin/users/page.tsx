'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Coins,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface UserItem {
  user_id: string;
  email: string;
  display_name: string | null;
  role: 'member' | 'administrator';
  status: 'active' | 'suspended';
  created_at: string;
  last_seen_at: string;
  allowance_balance: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/users?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const handleRoleChange = async (user: UserItem, newRole: 'member' | 'administrator') => {
    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, role: newRole }),
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update role');
      }
    } catch {
      alert('Error updating role');
    }
  };

  const handleStatusToggle = async (user: UserItem) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.user_id, status: nextStatus }),
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to toggle status');
      }
    } catch {
      alert('Error updating status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-400" />
            <span>User Accounts</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
              Screen A6
            </Badge>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage subscriber access, platform roles, account status, and allowance balances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email or name..."
              className="pl-8 bg-slate-900 border-slate-700 text-xs h-9 text-slate-200"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-800 bg-[#080d1a] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-semibold">User Account</th>
                <th className="py-3 px-4 font-semibold text-center">Platform Role</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-center">Customization Allowance</th>
                <th className="py-3 px-4 font-semibold">Created / Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-4 h-4 animate-spin inline-block mr-2 text-blue-500" />
                    Loading accounts...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No users found matching query.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.user_id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-semibold text-slate-200 text-sm">{u.email}</span>
                        {u.display_name && (
                          <span className="text-slate-400 block text-[11px]">{u.display_name}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u, e.target.value as any)}
                        className={`text-[11px] font-semibold rounded-md border px-2 py-1 bg-slate-900 ${
                          u.role === 'administrator'
                            ? 'text-emerald-400 border-emerald-500/30'
                            : 'text-slate-300 border-slate-700'
                        }`}
                      >
                        <option value="member">Member</option>
                        <option value="administrator">Administrator</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleStatusToggle(u)}
                        className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold border transition-all ${
                          u.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                        }`}
                        title="Click to toggle account status"
                      >
                        {u.status}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-mono font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        <Coins className="w-3 h-3" />
                        {u.allowance_balance} Credits
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      <div>{new Date(u.created_at).toLocaleDateString()}</div>
                      <span className="text-[10px] text-slate-400">
                        Seen: {new Date(u.last_seen_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
