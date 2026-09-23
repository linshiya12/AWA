'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Shield, Bell } from 'lucide-react';
import { PersonaSwitcher } from './PersonaSwitcher';
import ThemeToggle from '@/components/ThemeToggle';

export function AdminHeader() {
  const pathname = usePathname();

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
    <header className="h-16 border-b border-slate-800/80 bg-[#090d18]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400">
        <Shield className="w-3.5 h-3.5 text-blue-400 mr-1" />
        {breadcrumbs.map((b, idx) => (
          <React.Fragment key={b.href}>
            {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400" />}
            {b.isLast ? (
              <span className="font-semibold text-slate-100">{b.label}</span>
            ) : (
              <Link href={b.href} className="hover:text-slate-200 transition-colors">
                {b.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Right controls: Persona Switcher, Notifications, ThemeToggle */}
      <div className="flex items-center gap-3">
        <PersonaSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
