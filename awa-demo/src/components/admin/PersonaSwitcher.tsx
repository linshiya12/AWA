'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, EyeOff, ChevronDown, Check, Loader2 } from 'lucide-react';

interface Persona {
  id: string;
  label: string;
  role: string;
}

export function PersonaSwitcher() {
  const router = useRouter();
  const [currentId, setCurrentId] = useState<string>('usr-admin-1');
  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(false);
      // Hard refresh page to test gate
      window.location.reload();
    } catch {
      setLoading(false);
    }
  };

  const currentPersona = personas.find((p) => p.id === currentId) || personas[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 text-xs font-medium text-slate-200 transition-colors"
        title="Switch auth persona to test server-side 404 security gate"
      >
        {currentPersona.role === 'administrator' ? (
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        ) : currentPersona.role === 'member' ? (
          <UserCheck className="w-3.5 h-3.5 text-blue-400" />
        ) : (
          <EyeOff className="w-3.5 h-3.5 text-amber-400" />
        )}
        <span>{currentPersona.label}</span>
        <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-700 bg-[#0d1222] shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
          <div className="px-2.5 py-1.5 text-[10px] uppercase font-semibold text-slate-400 border-b border-slate-800/80">
            Security Gate Test Persona
          </div>
          <div className="mt-1 space-y-1">
            {personas.map((p) => {
              const isSelected = p.id === currentId;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSwitch(p.id)}
                  disabled={loading}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-blue-600/20 text-blue-300 font-medium'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{p.label}</span>
                    <span className="text-[10px] text-slate-400">
                      {p.role === 'administrator' ? 'Full Admin Access' : 'Expects 404 Not Found'}
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
