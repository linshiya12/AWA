import React from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { HomeTemplateShowcase } from '@/components/HomeTemplateShowcase';
import { Search, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent dark:bg-[#0a0e1a] text-zinc-900 dark:text-[#F8FAFF] font-sans selection:bg-[#6EA8FF]/30 transition-colors duration-200">

      {/* 1. TOP NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/85 dark:bg-[#0a0e1a]/85 backdrop-blur-md border-b border-zinc-200/80 dark:border-[#94A3B8]/[0.16] transition-colors">
        {/* Left: Logo & Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6EA8FF] to-[#9AA7FF] text-[#020817] flex items-center justify-center shadow-lg shadow-[#6EA8FF]/20">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 18h3.2l2.4-7.2L12 15l2.4-4.2L16.8 18H20L13.8 6h-3.6L4 18z" />
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-white font-['var(--font-heading)']">
            AWA
          </span>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-[#94A3B8]">
          <Link href="/templates" className="hover:text-black dark:hover:text-[#F8FAFF] transition-colors">Templates</Link>
          <Link href="/templates" className="hover:text-black dark:hover:text-[#F8FAFF] transition-colors">Categories</Link>
          <Link href="/collections" className="hover:text-black dark:hover:text-[#F8FAFF] transition-colors">Saved Collections</Link>
          <Link href="/templates" className="hover:text-black dark:hover:text-[#F8FAFF] transition-colors">Gallery</Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <ThemeToggle />
          <Link href="/templates" className="text-zinc-600 dark:text-[#94A3B8] hover:text-black dark:hover:text-[#F8FAFF] transition-colors" aria-label="Search">
            <Search className="w-5 h-5" />
          </Link>
          <div className="hidden sm:block text-sm text-zinc-600 dark:text-[#94A3B8] font-medium cursor-pointer hover:text-black dark:hover:text-[#F8FAFF] transition-colors">EN</div>
          <Link href="/templates" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-[#8AB4FF] transition-colors hidden sm:block">Sign in</Link>
          <Button asChild className="rounded-full px-5 h-9 text-sm font-bold shadow-sm">
            <Link href="/templates">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-16 sm:pt-20 pb-20 overflow-hidden relative">
        {/* Ambient Clean Background: restrained blue & lavender radial glow without busy wave/particle imagery */}
        <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[radial-gradient(ellipse_at_top,_rgba(110,168,255,0.12)_0%,_rgba(154,167,255,0.06)_40%,_transparent_70%)] blur-3xl"></div>
          <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[550px] h-[220px] bg-[radial-gradient(ellipse_at_center,_rgba(110,168,255,0.07)_0%,_transparent_60%)] blur-2xl"></div>
        </div>

        {/* 2. HERO SECTION (Compact, clean modern 2-line layout) */}
        <section className="relative z-10 px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center text-center mt-3 sm:mt-5 mb-6 sm:mb-8">
          {/* Bold, modern two-line heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-white mb-3.5 leading-[1.14] font-['var(--font-heading)']">
            Find the right prompt <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6EA8FF] via-[#8AB4FF] to-[#C7D2FE]">
              for your next idea.
            </span>
          </h1>

          {/* Short description clearly explaining AWA: discover templates, customize prompts, use in external AI tools */}
          <p className="text-sm sm:text-base text-zinc-600 dark:text-[#94A3B8] max-w-xl mx-auto mb-6 leading-relaxed font-normal">
            Discover production-tested prompt templates, customize prompts to your needs, and export ready-to-use prompts for your favorite external AI tools.
          </p>

          {/* One prominent 'Explore Templates' button and a quieter 'How It Works' link */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-2">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3 bg-gradient-to-r from-[#6EA8FF] to-[#8AB4FF] text-[#020817] font-bold text-sm shadow-[0_4px_18px_rgba(110,168,255,0.22)] hover:shadow-[0_6px_25px_rgba(110,168,255,0.36)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Explore Templates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-[#94A3B8] hover:text-zinc-950 dark:hover:text-white transition-colors py-2 px-3 rounded-full hover:bg-zinc-100 dark:hover:bg-white/5"
            >
              <span>How It Works</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>
        </section>

        {/* TEMPLATE SHOWCASE GALLERY (Compact transition, 4-column distinct row) */}
        <HomeTemplateShowcase />

        {/* 8. FINAL CTA */}
        <section className="px-6 max-w-4xl mx-auto mb-20 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(110,168,255,0.15)_0%,_transparent_70%)] blur-2xl pointer-events-none"></div>
          <div className="relative z-10 p-12 rounded-3xl border border-[#6EA8FF]/20 bg-[#0A1428]/80 backdrop-blur-md text-center shadow-[0_0_50px_rgba(110,168,255,0.1)]">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Your next great creation starts with a better prompt.</h2>
            <p className="text-[#94A3B8] text-lg mb-10 max-w-2xl mx-auto">Explore templates and turn your idea into a prompt ready for your AI workflow.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="px-8 py-6 rounded-full bg-white text-[#020817] text-base font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:-translate-y-0.5">
                <Link href="/templates">Explore Templates</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-6 rounded-full border border-[#94A3B8]/[0.16] bg-[#071126] text-[#F8FAFF] text-base font-bold hover:bg-[#1a253a] transition-all">
                <Link href="/templates">Create a Prompt</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* 9. FOOTER */}
      <footer className="border-t border-[#94A3B8]/[0.16] bg-[#020817] pt-16 pb-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-[#6EA8FF] text-[#020817] flex items-center justify-center">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 18h3.2l2.4-7.2L12 15l2.4-4.2L16.8 18H20L13.8 6h-3.6L4 18z" />
                </svg>
              </div>
              <span className="font-extrabold text-lg tracking-tight font-['var(--font-heading)']">AWA</span>
            </div>
            <p className="text-xs text-[#94A3B8]">AI Prompt Creation & Discovery Platform</p>
          </div>
          <div>
            <h4 className="font-bold text-[#F8FAFF] mb-4 text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li><Link href="/templates" className="hover:text-[#6EA8FF]">Templates</Link></li>
              <li><Link href="/templates" className="hover:text-[#6EA8FF]">Categories</Link></li>
              <li><Link href="/collections" className="hover:text-[#6EA8FF]">Collections</Link></li>
              <li><Link href="/templates" className="hover:text-[#6EA8FF]">Explore Gallery</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#F8FAFF] mb-4 text-sm">Resources</h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li><Link href="#" className="hover:text-[#6EA8FF]">Documentation</Link></li>
              <li><Link href="#" className="hover:text-[#6EA8FF]">Guides</Link></li>
              <li><Link href="#" className="hover:text-[#6EA8FF]">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#F8FAFF] mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li><Link href="#" className="hover:text-[#6EA8FF]">About</Link></li>
              <li><Link href="#" className="hover:text-[#6EA8FF]">Contact</Link></li>
              <li><Link href="#" className="hover:text-[#6EA8FF]">Privacy</Link></li>
              <li><Link href="#" className="hover:text-[#6EA8FF]">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto pt-8 border-t border-[#94A3B8]/[0.16] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#94A3B8]">
          <p>&copy; {new Date().getFullYear()} AWA Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-[#F8FAFF]">Twitter</Link>
            <Link href="#" className="hover:text-[#F8FAFF]">GitHub</Link>
            <Link href="#" className="hover:text-[#F8FAFF]">Discord</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
