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

  if (pathname === '/') {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-blue-900/40 bg-white/95 dark:bg-[#0a0e1a]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* LEFT: Logo & Section Nav Labels (Templates / Saved) */}
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            {/* Category Drawer Menu Button */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={toggleSidebar}
              className={`h-9 w-9 rounded-lg transition-all ${
                isSidebarOpen
                  ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-black'
                  : 'bg-zinc-100 dark:bg-blue-950/40 hover:bg-zinc-200 dark:hover:bg-blue-900/50 border-zinc-200/80 dark:border-blue-800/40 text-zinc-700 dark:text-zinc-300'
              }`}
              title={isSidebarOpen ? 'Close category sidebar' : 'Open category sidebar'}
              aria-label="Category Navigation"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>

            {/* Reference-matching Logo Mark */}
            <Link href="/templates" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xs group-hover:bg-zinc-800 dark:group-hover:bg-zinc-200 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 18h3.2l2.4-7.2L12 15l2.4-4.2L16.8 18H20L13.8 6h-3.6L4 18z" />
                </svg>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-black dark:text-white font-['var(--font-heading)']">
                AWA
              </span>
            </Link>

            <nav className="flex items-center gap-4 sm:gap-5 pl-1 sm:pl-2 text-sm">
              <Link
                href="/templates"
                className={`font-medium transition-colors ${
                  isTemplatesActive
                    ? 'text-black dark:text-white font-semibold'
                    : 'text-zinc-500 hover:text-black dark:hover:text-white'
                }`}
              >
                Templates
              </Link>
              <Link
                href="/collections"
                className={`font-medium transition-colors flex items-center gap-1.5 ${
                  isSavedActive
                    ? 'text-black dark:text-white font-semibold'
                    : 'text-zinc-500 hover:text-black dark:hover:text-white'
                }`}
              >
                <span>Saved</span>
                {collections.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-200 dark:bg-blue-900/50 backdrop-blur-md text-zinc-700 dark:text-zinc-300 font-semibold leading-none">
                    {collections.length}
                  </span>
                )}
              </Link>
            </nav>
          </div>

          {/* CENTER: Centered, Large Pill-Shaped Search Bar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-6 relative">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search on Web..."
                className="w-full h-10 pl-10 pr-9 rounded-full bg-[#f0f0f2] dark:bg-blue-950/40 backdrop-blur-md hover:bg-[#ebebee] dark:hover:bg-blue-900/30 focus:bg-white dark:focus:bg-blue-950/70 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 text-sm border border-transparent focus:border-zinc-300 dark:focus:border-blue-700/60 focus:outline-none transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Bookmark, Theme Toggle, Language, Notifications, Subscribe Button, Avatar */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Bookmark Icon (opens Collections) */}
            <Link
              href="/collections"
              className={`p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-blue-900/30 transition-colors relative ${
                isSavedActive ? 'text-black dark:text-white' : 'text-zinc-600 dark:text-zinc-400'
              }`}
              title="Saved Collections"
              aria-label="Saved Collections"
            >
              <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
              {collections.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-zinc-900"></span>
              )}
            </Link>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={handleToggleTheme}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-blue-900/30 text-zinc-600 dark:text-zinc-300 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600" />
              )}
            </button>

            {/* Language Selection */}
            <div className="hidden sm:flex items-center">
              <select
                className="bg-transparent text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium focus:outline-none cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                title="Change Language"
                aria-label="Change Language"
                defaultValue="en"
              >
                <option value="en" className="bg-white dark:bg-[#0c1427] text-zinc-900 dark:text-zinc-100">EN</option>
                <option value="es" className="bg-white dark:bg-[#0c1427] text-zinc-900 dark:text-zinc-100">ES</option>
                <option value="fr" className="bg-white dark:bg-[#0c1427] text-zinc-900 dark:text-zinc-100">FR</option>
                <option value="de" className="bg-white dark:bg-[#0c1427] text-zinc-900 dark:text-zinc-100">DE</option>
              </select>
            </div>

            {/* Solid BLACK/WHITE pill-shaped "Subscribe" button */}
            <Button
              type="button"
              onClick={() => {
                if (isSubscribed) {
                  unsubscribe();
                } else {
                  subscribe();
                }
              }}
              className="rounded-full bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black text-xs font-semibold px-3.5 sm:px-4 h-8 sm:h-9 shadow-xs shrink-0 flex items-center gap-1.5"
              title={isSubscribed ? 'Account Subscribed (Click to switch to guest)' : 'Subscribe for full catalog access'}
            >
              {isSubscribed ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Subscribed ({credits})</span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </Button>

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
