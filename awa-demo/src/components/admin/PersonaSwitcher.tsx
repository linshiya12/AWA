'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, EyeOff, ChevronDown, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Persona {
  id: string;
  label: string;
  role: string;
}

export function PersonaSwitcher() {
  const [currentId, setCurrentId] = useState<string>('usr-admin-1');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch active session persona
    fetch('/api/v1/admin/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.currentUser) {
          setCurrentId(data.currentUser.user_id);
        }
      })
      .catch(() => {});
  }, []);

  const personas: Persona[] = [
    { id: 'usr-admin-1', label: 'Admin (admin@awa.ai)', role: 'administrator' },
    { id: 'usr-alex-sub', label: 'Member (alex@creative.io)', role: 'member' },
    { id: 'visitor', label: 'Visitor (Unauthenticated)', role: 'visitor' },
  ];

  const handleSwitch = async (personaId: string) => {
    setLoading(true);
    try {
      await fetch('/api/v1/admin/session', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ user_id: personaId }),
      });
      setCurrentId(personaId);
      // Hard refresh page to test gate
      window.location.reload();
    } catch {
      setLoading(false);
    }
  };

  const currentPersona = personas.find((p) => p.id === currentId) || personas[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2 px-3 text-xs border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Switch auth persona to test server-side 404 security gate"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
          ) : currentPersona.role === 'administrator' ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          ) : currentPersona.role === 'member' ? (
            <UserCheck className="w-3.5 h-3.5 text-blue-500" />
          ) : (
            <EyeOff className="w-3.5 h-3.5 text-amber-500" />
          )}
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {currentPersona.label}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-1.5">
        <DropdownMenuLabel className="px-2.5 py-1.5 text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">
          Security Gate Test Persona
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="space-y-1">
          {personas.map((p) => {
            const isSelected = p.id === currentId;
            return (
              <DropdownMenuItem
                key={p.id}
                onClick={() => handleSwitch(p.id)}
                className={`flex items-center justify-between px-2.5 py-2 cursor-pointer rounded-lg ${
                  isSelected
                    ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-700 dark:text-blue-300 font-semibold'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex flex-col">
                  <span>{p.label}</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                    {p.role === 'administrator'
                      ? 'Full Admin Access'
                      : 'Expects 404 Not Found'}
                  </span>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
