import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const metadata = {
  title: 'AWA Admin Panel — AI Creation Guide Platform',
  description: 'Administrative control surface for catalog, prompt authoring, AI tools, and evidence.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#070a14] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600/20 dark:selection:bg-blue-600/30 selection:text-blue-900 dark:selection:text-blue-200 transition-colors">
      {/* 1. Admin Header at top of viewport across full width */}
      <AdminHeader />

      {/* 2. Admin Body: Sticky sidebar on left + Normal scrolling main content on right */}
      <div className="flex-1 flex w-full min-h-[calc(100vh-4rem)]">
        {/* Sidebar begins below AdminHeader, sticky top-16, h-[calc(100vh-4rem)], overflow-y-auto */}
        <AdminSidebar />

        {/* Main Content Area: Normal document flow, no nested scrollbar, unclipped */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
