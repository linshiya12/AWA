'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Shield, Menu, X, Sparkles } from 'lucide-react';
import { PersonaSwitcher } from './PersonaSwitcher';
import ThemeToggle from '@/components/ThemeToggle';
import { useAppContext } from '@/lib/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function AdminHeader() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useAppContext();

  // Generate breadcrumb items from URL
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    const label =
      seg === 'admin'
        ? 'Admin'
        : seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
    return { href, label, isLast: i === segments.length - 1 };
  });

  return (
    <header className="h-16 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#090d18]/85 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left: Mobile hamburger menu toggle + AWA Admin brand + Breadcrumbs */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Mobile drawer toggle (< lg) */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="h-9 w-9 rounded-xl lg:hidden text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
          aria-label={isSidebarOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
          title={isSidebarOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
        >
          {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>

        {/* AWA Admin Brand Mark */}
        <Link href="/admin" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0 group-hover:opacity-90 transition-opacity">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="font-bold tracking-wider text-slate-900 dark:text-white text-base">AWA</span>
            <Badge
              variant="outline"
              className="text-[10px] font-semibold uppercase px-1.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
            >
              Admin
            </Badge>
          </div>
        </Link>

        {/* Vertical divider */}
        <div className="hidden md:block h-4 w-px bg-slate-200 dark:bg-slate-800 shrink-0" />

        {/* Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
          <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 mr-0.5 shrink-0" />
          {breadcrumbs.map((b, idx) => (
            <React.Fragment key={b.href}>
              {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />}
              {b.isLast ? (
                <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">{b.label}</span>
              ) : (
                <Link href={b.href} className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors shrink-0">
                  {b.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right controls: Persona Switcher, ThemeToggle */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <PersonaSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
