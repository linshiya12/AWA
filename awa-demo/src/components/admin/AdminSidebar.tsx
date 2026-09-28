'use client';

import React, { useEffect } from 'react';
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
  TrendingUp,
  X,
  BookmarkCheck,
  BarChart3,
  LifeBuoy,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useAppContext } from '@/lib/AppContext';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/catalog', label: 'Catalog Tree', icon: FolderTree },
  { href: '/admin/templates', label: 'Templates', icon: FileCode },
  { href: '/admin/engagement', label: 'Template Engagement', icon: BarChart3 },
  { href: '/admin/collections', label: 'Collections', icon: BookmarkCheck },
  { href: '/admin/tools', label: 'AI Tools & Models', icon: Wrench },
  { href: '/admin/users', label: 'User Accounts', icon: Users },
  { href: '/admin/support', label: 'User Support', icon: LifeBuoy, badgeKey: 'support' },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: CalendarCheck, exact: true },
  { href: '/admin/subscriptions/report', label: 'Subscription Report', icon: TrendingUp },
  { href: '/admin/commerce', label: 'Commerce & Cap', icon: CreditCard },
  { href: '/admin/languages', label: 'Languages', icon: Languages },
  { href: '/admin/audit', label: 'Audit Logs', icon: ShieldAlert },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useAppContext();
  const [unreadSupportCount, setUnreadSupportCount] = React.useState<number>(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch('/api/v1/admin/support/counts');
        if (res.ok) {
          const data = await res.json();
          setUnreadSupportCount(data.counts?.unread || 0);
        }
      } catch {
        // Fallback gracefully
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile drawer when pressing ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isSidebarOpen) {
        closeSidebar();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, closeSidebar]);

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MOBILE COLLAPSIBLE DRAWER (< lg) USING SHADCN SHEET                   */}
      {/* ========================================================================= */}
      <Sheet open={isSidebarOpen} onOpenChange={(open) => { if (!open) closeSidebar(); }}>
        <SheetContent side="left" className="w-72 max-w-[85vw] p-0 flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090d18]">
          {/* Drawer Header */}
          <SheetHeader className="h-16 flex-row items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#070a14]/60 space-y-0 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <SheetTitle className="font-bold tracking-wider text-slate-900 dark:text-white text-base">AWA</SheetTitle>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-semibold uppercase px-1.5 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                  >
                    Admin
                  </Badge>
                </div>
                <SheetDescription className="text-[10px] text-slate-500 dark:text-slate-400">Operations Control</SheetDescription>
              </div>
            </div>
          </SheetHeader>

          {/* Drawer Navigation List */}
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Catalog & Operations
            </div>
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-300 border border-blue-500/30 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {'badgeKey' in item && item.badgeKey === 'support' && unreadSupportCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 leading-none">
                        {unreadSupportCount}
                      </span>
                    )}
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Drawer Footer Link to Public Catalog */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070a14]/40">
            <Link
              href="/"
              target="_blank"
              onClick={closeSidebar}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors border border-slate-200 dark:border-slate-800"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                Public Catalog
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Live</span>
            </Link>
          </div>
        </SheetContent>
      </Sheet>

      {/* ========================================================================= */}
      {/* 2. DESKTOP STICKY SIDEBAR (>= lg)                                        */}
      {/* Starts below AdminHeader (top-16), height h-[calc(100vh-4rem)],          */}
      {/* self-start, and scrolls independently ONLY when items exceed its height. */}
      {/* ========================================================================= */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-slate-200 dark:border-slate-800/80 bg-slate-50/90 dark:bg-[#090d18] transition-colors self-start">
        {/* Navigation list */}
        <nav className="p-3 space-y-1 flex-1">
          <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Catalog & Operations
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-300 border border-blue-500/30 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {'badgeKey' in item && item.badgeKey === 'support' && unreadSupportCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 leading-none">
                      {unreadSupportCount}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer link to public surface */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-[#070a14]/40 mt-auto">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors border border-slate-200 dark:border-slate-800"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              Public Catalog
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Live</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
