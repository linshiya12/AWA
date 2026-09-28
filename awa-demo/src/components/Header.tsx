'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/lib/AppContext';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  Search,
  Bookmark,
  Sun,
  Moon,
  Bell,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  Check,
  Globe,
  LifeBuoy,
} from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const {
    isSubscribed,
    credits,
    subscribe,
    unsubscribe,
    triggerError,
    clearError,
    resetDemo,
    collections,
    isSidebarOpen,
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    currentLanguage,
    setLanguage,
    availableLanguages,
  } = useAppContext();

  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const handleToggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('awa_theme', 'dark');
      } catch (e) {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('awa_theme', 'light');
      } catch (e) {}
    }
  };

  const isTemplatesActive = pathname === '/templates' || pathname.startsWith('/template');
  const isSavedActive = pathname.startsWith('/collections');
  const isSupportActive = pathname.startsWith('/support');

  if (pathname === '/' || pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 dark:border-blue-900/40 bg-white/95 dark:bg-[#0a0e1a]/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* LEFT: Logo & Section Nav Labels (Templates / Saved / Support) */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            {/* Category Drawer Menu Button */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className={`h-9 w-9 rounded-xl transition-all cursor-pointer ${
                isSidebarOpen
                  ? 'bg-blue-600 border-blue-600 text-white dark:bg-blue-600 dark:border-blue-600 dark:text-white'
                  : 'bg-slate-100 dark:bg-blue-950/40 hover:bg-slate-200 dark:hover:bg-blue-900/50 border-slate-200/90 dark:border-blue-800/40 text-slate-700 dark:text-slate-300'
              }`}
              title={isSidebarOpen ? 'Close category sidebar' : 'Open category sidebar'}
              aria-label="Category Navigation"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>

            {/* Reference-matching Logo Mark */}
            <Link href="/templates" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs group-hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 18h3.2l2.4-7.2L12 15l2.4-4.2L16.8 18H20L13.8 6h-3.6L4 18z" />
                </svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white font-['var(--font-heading)']">
                AWA
              </span>
            </Link>

            <nav className="flex items-center gap-4 sm:gap-5 pl-1 sm:pl-2 text-sm">
              <Link
                href="/templates"
                className={`font-medium transition-colors ${
                  isTemplatesActive
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Templates
              </Link>
              <Link
                href="/collections"
                className={`font-medium transition-colors flex items-center gap-1.5 ${
                  isSavedActive
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <span>Saved</span>
                {collections.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold leading-none">
                    {collections.length}
                  </span>
                )}
              </Link>
              <Link
                href="/support"
                className={`font-medium transition-colors flex items-center gap-1.5 ${
                  isSupportActive
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <span>Support</span>
              </Link>
            </nav>
          </div>

          {/* CENTER: Centered, Large Pill-Shaped Search Bar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-6 relative">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates, models, tools..."
                className="w-full h-10 pl-10 pr-9 rounded-full bg-slate-100/90 dark:bg-blue-950/40 hover:bg-slate-200/70 dark:hover:bg-blue-900/30 focus:bg-white dark:focus:bg-blue-950/70 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 text-sm border border-slate-200/90 dark:border-blue-900/50 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Bookmark, Theme Toggle, Language, Subscribe Button, Avatar */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Bookmark Icon (opens Collections) */}
            <Link
              href="/collections"
              className={`p-2 rounded-xl border border-slate-200/80 dark:border-blue-900/50 bg-slate-50 dark:bg-blue-950/30 hover:bg-slate-100 dark:hover:bg-blue-900/50 transition-colors relative cursor-pointer ${
                isSavedActive ? 'text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700' : 'text-slate-600 dark:text-slate-400'
              }`}
              title="Saved Collections"
              aria-label="Saved Collections"
            >
              <Bookmark className="w-4 h-4" />
              {collections.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-zinc-900"></span>
              )}
            </Link>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={handleToggleTheme}
              className="p-2 rounded-xl border border-slate-200/80 dark:border-blue-900/50 bg-slate-50 dark:bg-blue-950/30 hover:bg-slate-100 dark:hover:bg-blue-900/50 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Language Selection */}
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg border border-slate-200/80 dark:border-blue-900/50 bg-slate-50 dark:bg-blue-950/30 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Globe className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <select
                aria-label="Change Language"
                title="Select language"
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer pr-1"
              >
                {availableLanguages.map((lang) => (
                  <option
                    key={lang.language_id}
                    value={lang.language_id}
                    className="bg-white dark:bg-[#0c1427] text-slate-900 dark:text-slate-100"
                  >
                    {lang.language_id.toUpperCase()} - {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Unified Design System "Subscribe" Button */}
            <button
              type="button"
              onClick={() => {
                if (isSubscribed) {
                  unsubscribe();
                } else {
                  subscribe();
                }
              }}
              className={`h-9 px-3.5 sm:px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                isSubscribed
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 shadow-2xs'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs'
              }`}
              title={isSubscribed ? 'Account Subscribed (Click to switch to guest)' : 'Subscribe for full catalog access'}
            >
              {isSubscribed ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Creator Pass ({credits})</span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>

            {/* Demo Tools & Stage Controller Dropdown using Shadcn DropdownMenu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-[#64748b] hover:bg-[#526175] text-white font-semibold text-xs flex items-center justify-center transition-all shadow-xs ring-2 ring-transparent focus:ring-blue-400 focus:outline-none cursor-pointer"
                  title="Account / Live Demo Controller"
                  aria-label="User Account"
                >
                  L
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-72 p-2">
                <DropdownMenuLabel className="flex justify-between items-center pb-2">
                  <div>
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">Demo Controller</span>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal">Live stage presentation tools</p>
                  </div>
                  <button
                    onClick={() => resetDemo()}
                    className="text-amber-600 dark:text-amber-400 hover:underline font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                </DropdownMenuLabel>

                <div className="my-1.5 p-2 rounded-xl bg-zinc-100/70 dark:bg-blue-950/40 border border-zinc-200/60 dark:border-blue-900/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Account status:</span>
                    <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-100">
                      {isSubscribed ? `Subscribed (${credits} credits)` : 'Guest (Unsubscribed)'}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (isSubscribed) unsubscribe();
                      else subscribe();
                    }}
                    className="h-7 text-[11px] px-2.5 rounded-lg"
                  >
                    {isSubscribed ? 'Sign Out' : 'Sign In'}
                  </Button>
                </div>

                <DropdownMenuSeparator />

                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Simulate Fallbacks (§4)
                </div>

                <DropdownMenuItem
                  onClick={() => triggerError('capacity_paused')}
                  className="flex justify-between items-center cursor-pointer text-xs"
                >
                  <span>503 Capacity Paused</span>
                  <span className="text-[10px] text-zinc-400">No credit</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => triggerError('unusable_request')}
                  className="flex justify-between items-center cursor-pointer text-xs"
                >
                  <span>422 Unusable Request</span>
                  <span className="text-[10px] text-zinc-400">No credit</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => triggerError('out_of_credits')}
                  className="flex justify-between items-center cursor-pointer text-xs"
                >
                  <span>402 Out of Credits</span>
                  <span className="text-[10px] text-rose-500 dark:text-rose-400 font-medium">Prompt kept</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => clearError()}
                  className="cursor-pointer text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                >
                  Clear Active Error
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setShowComparisonModal(true)}
                  className="flex items-center justify-between font-medium cursor-pointer text-xs bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Open §3:35 Side-by-Side</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/support" className="flex items-center justify-between cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-2">
                      <LifeBuoy className="w-3.5 h-3.5 text-blue-500" />
                      <span>Contact Support</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/admin" className="flex items-center justify-between cursor-pointer text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Admin Control Panel</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* §3:35 Side-by-Side Image Comparison Dialog using Shadcn Dialog */}
      <Dialog open={showComparisonModal} onOpenChange={setShowComparisonModal}>
        <DialogContent className="max-w-4xl p-6 sm:p-8">
          <DialogHeader className="mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              14-DEMO-LIVE §3:35
            </span>
            <DialogTitle className="text-2xl font-extrabold font-['var(--font-heading)'] mt-1">
              The Result, Side by Side
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              &ldquo;Same tool. Same one attempt each. Left: what I&apos;d have typed. Right: the AWA prompt. That gap is the entire product.&rdquo;
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
            {/* Naive Attempt (Window B 0:00) */}
            <div className="rounded-2xl border border-red-200/80 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                  Naive Prompt (0:00)
                </span>
                <span className="text-xs text-zinc-500">1 Attempt</span>
              </div>
              <div className="aspect-square rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden mb-3 shadow-xs">
                <div className="w-32 h-20 rounded bg-gradient-to-br from-amber-900/40 to-zinc-400 border border-zinc-300 dark:border-zinc-700 shadow-xs relative flex items-center justify-center">
                  <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-medium">Harsh reflections</span>
                  <div className="absolute -bottom-2 w-28 h-2 bg-black/20 blur-xs rounded-full"></div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3 bg-zinc-900/90 text-left">
                  <p className="text-[11px] font-mono text-zinc-300 truncate">
                    &quot;product photo of a leather wallet, white background&quot;
                  </p>
                </div>
              </div>
              <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5">
                <li className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                  <X className="w-3.5 h-3.5 shrink-0" /> Blown-out harsh highlights, washed-out whites
                </li>
                <li className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                  <X className="w-3.5 h-3.5 shrink-0" /> Unrealistic floating appearance, awkward shadow
                </li>
                <li className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                  <X className="w-3.5 h-3.5 shrink-0" /> Lost micro-textures and uneven color fidelity
                </li>
              </ul>
            </div>

            {/* AWA Result (3:00) */}
            <div className="rounded-2xl border border-amber-300/80 dark:border-amber-600/40 bg-amber-50/40 dark:bg-amber-950/20 p-5 flex flex-col shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black dark:bg-white text-white dark:text-black">
                  AWA Adapted Prompt (3:00)
                </span>
                <span className="text-xs text-teal-700 dark:text-teal-400 font-semibold">Midjourney v6</span>
              </div>
              <div className="aspect-square rounded-xl bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/40 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden mb-3 shadow-xs">
                <div className="w-36 h-28 rounded-lg bg-gradient-to-tr from-amber-700 via-amber-800 to-amber-900 shadow-md relative flex items-center justify-center transform -rotate-3 text-white">
                  <div className="w-full h-full p-2 flex flex-col justify-between">
                    <div className="w-full h-0.5 border-b border-dashed border-amber-300/40"></div>
                    <span className="text-[10px] text-amber-200 font-serif">Rich Saddle Stitch</span>
                    <div className="w-full h-0.5 border-b border-dashed border-amber-300/40"></div>
                  </div>
                  <div className="absolute -bottom-3 w-36 h-3 bg-black/30 blur-xs rounded-full"></div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3 bg-zinc-900 text-left">
                  <p className="text-[11px] font-mono text-amber-300 truncate">
                    Hasselblad H6D-100c · 120mm macro · 120cm octabox
                  </p>
                </div>
              </div>
              <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1.5">
                <li className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" /> Tack-sharp edge-to-edge focus on full-grain leather
                </li>
                <li className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" /> 3-point softbox with 2:1 fill ratio and contact shadow
                </li>
                <li className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-medium">
                  <Check className="w-3.5 h-3.5 shrink-0" /> Commercial-ready Amazon/Shopify infinity cove (#FFFFFF)
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className="mt-4 pt-4 border-t border-zinc-200/80 dark:border-blue-900/40">
            <Button
              onClick={() => setShowComparisonModal(false)}
              className="rounded-full px-5 text-xs font-semibold"
            >
              Close Comparison
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
