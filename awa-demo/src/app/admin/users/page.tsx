'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Coins,
  RefreshCw,
  AlertTriangle,
  X,
  UserCheck,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/admin/users?search=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error('Failed to retrieve user accounts');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with user directory');
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>User Accounts</span>
            <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
              Screen A6
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
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
              className="pl-8 text-xs h-9 pr-8"
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
                <X className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Directory Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button size="sm" variant="outline" onClick={fetchUsers} className="ml-4">
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Users Table */}
      <Card className="overflow-hidden border-slate-200/80 dark:border-blue-900/40 bg-white dark:bg-[#0c162e]/80 shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">User Account</TableHead>
              <TableHead className="font-semibold text-center">Platform Role</TableHead>
              <TableHead className="font-semibold text-center">Status</TableHead>
              <TableHead className="font-semibold text-center">Customization Allowance</TableHead>
              <TableHead className="font-semibold">Created / Last Seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading state: Skeletons matching columns
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-44" />
                      <Skeleton className="h-3 w-28" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-8 w-28 mx-auto rounded-lg" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-6 w-20 mx-auto rounded-full" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-6 w-24 mx-auto rounded-lg" />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Skeleton className="h-3.5 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              // Empty State
              <TableRow>
                <TableCell colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {searchQuery ? 'No matching users found' : 'No user accounts recorded'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {searchQuery
                          ? 'Try searching with a different name or email fragment.'
                          : 'Users will appear here once authenticated sessions are initiated.'}
                      </p>
                    </div>
                    {searchQuery && (
                      <Button variant="outline" size="sm" onClick={() => setSearchQuery('')} className="text-xs">
                        Clear Search Query
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Populated State
              users.map((u) => (
                <TableRow key={u.user_id} className="transition-colors">
                  <TableCell>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{u.email}</span>
                      {u.display_name && (
                        <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{u.display_name}</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="w-32 mx-auto">
                      <Select
                        value={u.role}
                        onValueChange={(val: 'member' | 'administrator') => handleRoleChange(u, val)}
                      >
                        <SelectTrigger className="h-7 text-[11px] font-semibold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">
                            <span className="flex items-center gap-1.5">
                              <UserCheck className="w-3 h-3 text-blue-500" />
                              <span>Member</span>
                            </span>
                          </SelectItem>
                          <SelectItem value="administrator">
                            <span className="flex items-center gap-1.5">
                              <Shield className="w-3 h-3 text-emerald-500" />
                              <span>Administrator</span>
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusToggle(u)}
                      className="h-6 p-0 hover:bg-transparent cursor-pointer transition-transform active:scale-95"
                      title="Click to toggle account status"
                      aria-label={`Toggle account status for ${u.email}`}
                    >
                      <Badge
                        variant={u.status === 'active' ? 'emerald' : 'rose'}
                        className="text-[10px] uppercase font-semibold cursor-pointer"
                      >
                        {u.status}
                      </Badge>
                    </Button>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20 px-2 py-0.5">
                      <Coins className="w-3 h-3 mr-1" />
                      {u.allowance_balance} Credits
                    </Badge>
                  </TableCell>

                  <TableCell className="text-slate-500 dark:text-slate-400 text-[11px]">
                    <div className="font-medium text-slate-700 dark:text-slate-300">
                      {new Date(u.created_at).toLocaleDateString()}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      Seen: {new Date(u.last_seen_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
