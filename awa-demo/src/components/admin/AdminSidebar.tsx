'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderTree,
  FileCode,
  Wrench,
  Users,
  CreditCard,
  Languages,
  ShieldAlert,
  ExternalLink,
  ChevronRight,
  Sparkles,
  CalendarCheck,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/catalog', label: 'Catalog Tree', icon: FolderTree },
  { href: '/admin/templates', label: 'Templates', icon: FileCode },
  { href: '/admin/tools', label: 'AI Tools & Models', icon: Wrench },
  { href: '/admin/users', label: 'User Accounts', icon: Users },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: CalendarCheck },
  { href: '/admin/commerce', label: 'Commerce & Cap', icon: CreditCard },
  { href: '/admin/languages', label: 'Languages', icon: Languages },
  { href: '/admin/audit', label: 'Audit Logs', icon: ShieldAlert },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#090d18] flex flex-col shrink-0 min-h-screen">
      {/* Brand logo & platform title */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80 bg-[#070a14]/60">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-wider text-white text-base">AWA</span>
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Admin
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Creation Guide Control</p>
        </div>
      </div>

      {/* Main navigation list */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Catalog & Operations
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer link to public surface */}
      <div className="p-4 border-t border-slate-800/80 bg-[#070a14]/40">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors border border-slate-800"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            Public Catalog
          </span>
          <span className="text-[10px] text-slate-400">Live</span>
        </Link>
      </div>
    </aside>
  );
}
