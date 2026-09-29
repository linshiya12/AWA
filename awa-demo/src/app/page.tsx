import React from 'react';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { HomeTemplateShowcase } from '@/components/HomeTemplateShowcase';
import { Search, ArrowRight, ArrowUpRight } from 'lucide-react';

const HERO_FEATURED_ITEMS = [
  {
    id: 'tpl_img_aquatic',
    title: 'Aquatic Fragrance Mist',
    category: 'Commercial Image',
    tool: 'Midjourney v6',
    image: '/images/templates/spray.jpg',
  },
  {
    id: 'tpl_video_1',
    title: 'Turntable Motion Loop',
    category: 'Video Loop',
    tool: 'Runway Gen-3',
    image: '/images/templates/tpl_video_1.jpg',
  },
  {
    id: 'tpl_web_1',
    title: 'Dark SaaS Product Landing',
    category: 'Web Interface',
    tool: 'v0 / React',
    image: '/images/templates/tpl_web_1.jpg',
  },
  {
    id: 'tpl_slide_1',
    title: 'Executive Pitch Deck',
    category: 'Presentation Slide',
    tool: 'Slides AI',
    image: '/images/templates/tpl_slide_1.jpg',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-transparent dark:bg-[#0a0e1a] text-slate-900 dark:text-[#F8FAFF] font-sans selection:bg-[#6EA8FF]/30 transition-colors duration-200">

      {/* 1. TOP NAVIGATION (Full width with consistent side padding) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 py-4 bg-white/90 dark:bg-[#0a0e1a]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-blue-900/40 transition-colors">
        {/* Left: Logo & Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#3b82f6] to-[#6EA8FF] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 18h3.2l2.4-7.2L12 15l2.4-4.2L16.8 18H20L13.8 6h-3.6L4 18z" />
            </svg>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-['var(--font-heading)']">
            AWA
          </span>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/templates" className="hover:text-slate-950 dark:hover:text-white transition-colors">Templates</Link>
          <Link href="/templates" className="hover:text-slate-950 dark:hover:text-white transition-colors">Categories</Link>
          <Link href="/collections" className="hover:text-slate-950 dark:hover:text-white transition-colors">Saved Collections</Link>
          <Link href="/templates" className="hover:text-slate-950 dark:hover:text-white transition-colors">Gallery</Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <ThemeToggle />
          <Link href="/templates" className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors" aria-label="Search">
            <Search className="w-5 h-5" />
          </Link>
          <div className="hidden sm:block text-sm text-slate-600 dark:text-slate-300 font-medium cursor-pointer hover:text-slate-950 dark:hover:text-white transition-colors">EN</div>
          <Link href="/templates" className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-[#8AB4FF] transition-colors hidden sm:block">Sign in</Link>
          <Button asChild className="rounded-full px-5 h-9 text-sm font-bold shadow-sm bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-500">
            <Link href="/templates">Get Started</Link>
          </Button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-16 sm:pt-20 pb-20 overflow-hidden relative w-full">
        {/* Ambient Clean Background: restrained blue & indigo radial glow in dark blue palette */}
        <div className="absolute top-0 left-0 w-full h-[650px] pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[1400px] max-w-full h-[450px] bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.14)_0%,_rgba(30,58,138,0.08)_50%,_transparent_75%)] blur-3xl"></div>
          <div className="absolute top-[80px] left-1/2 -translate-x-1/2 w-[900px] max-w-full h-[260px] bg-[radial-gradient(ellipse_at_center,_rgba(110,168,255,0.08)_0%,_transparent_65%)] blur-2xl"></div>
        </div>

        {/* 2. HERO SECTION (Expanded full-width layout with consistent side padding) */}
        <section className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col items-center text-center mt-4 sm:mt-6 mb-8 sm:mb-12">
          {/* Bold, modern two-line heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 dark:text-white mb-4 leading-[1.12] max-w-5xl font-['var(--font-heading)']">
            Find the right prompt <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6EA8FF] via-[#8AB4FF] to-[#A5B4FC]">
              for your next idea.
            </span>
          </h1>

          {/* Short description clearly explaining AWA: discover templates, customize prompts, use in external AI tools */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed font-normal">
            Discover production-tested prompt templates, customize prompts to your needs, and export ready-to-use prompts for your favorite external AI tools.
          </p>

          {/* One prominent 'Explore Templates' button and a quieter 'How It Works' link */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-2">
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white dark:bg-gradient-to-r dark:from-[#6EA8FF] dark:to-[#8AB4FF] dark:text-[#020817] font-bold text-sm shadow-[0_4px_18px_rgba(37,99,235,0.25)] dark:shadow-[0_4px_20px_rgba(110,168,255,0.25)] hover:shadow-[0_6px_25px_rgba(110,168,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Explore Templates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors py-2 px-3.5 rounded-full hover:bg-slate-100 dark:hover:bg-blue-950/50"
            >
              <span>How It Works</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>

          {/* 3. FEATURED 4-IMAGE ROW (Visual showcase of 4 prompt results across Image, Video, Websites, Slides) */}
          <div className="w-full mt-10 sm:mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5 w-full">
              {HERO_FEATURED_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  href={`/template/${item.id}`}
                  className="group relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#0c1427] border border-slate-200/90 dark:border-blue-900/40 hover:border-blue-500/50 dark:hover:border-[#6EA8FF]/50 transition-all duration-300 shadow-xs hover:shadow-xl dark:hover:shadow-[0_12px_32px_rgba(2,12,32,0.85)] hover:-translate-y-1 block text-left"
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-200 dark:bg-[#080d19]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="eager"
                    />

                    {/* Top Category Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                      <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-black/60 dark:bg-[#060c18]/85 backdrop-blur-md text-white border border-white/10 shadow-xs flex items-center gap-1.5">
                        <span>{item.category}</span>
                      </span>
                    </div>

                    {/* Hover Arrow Icon */}
                    <div className="absolute top-2.5 right-2.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <span className="w-7 h-7 rounded-full bg-black/60 dark:bg-[#060c18]/85 backdrop-blur-md text-white flex items-center justify-center border border-white/15 shadow-xs">
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#6EA8FF]" />
                      </span>
                    </div>

                    {/* Bottom Gradient Scrim & Info */}
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end">
                      <h3 className="font-semibold text-xs sm:text-sm text-white group-hover:text-[#6EA8FF] transition-colors truncate font-['var(--font-heading)']">
                        {item.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-slate-300 mt-0.5 truncate font-normal">
                        {item.tool}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* TEMPLATE SHOWCASE GALLERY (Full-width responsive multi-column layout) */}
        <HomeTemplateShowcase />

        {/* 8. FINAL CTA */}
        <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 mb-24 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.08)_0%,_transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(110,168,255,0.15)_0%,_transparent_70%)] blur-2xl pointer-events-none"></div>
          <div className="relative z-10 max-w-5xl mx-auto p-8 sm:p-12 md:p-14 rounded-3xl border border-slate-200/90 dark:border-blue-900/40 bg-white/95 dark:bg-[#0c1427]/90 backdrop-blur-md text-center shadow-lg dark:shadow-[0_0_50px_rgba(30,58,138,0.25)]">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-slate-900 dark:text-white font-['var(--font-heading)']">Your next great creation starts with a better prompt.</h2>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg mb-8 max-w-2xl mx-auto">Explore templates and turn your idea into a prompt ready for your AI workflow.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3.5">
              <Button asChild size="lg" className="px-8 py-5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5">
                <Link href="/templates">Explore Templates</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-5 rounded-full border border-slate-200 dark:border-blue-900/50 bg-slate-50 dark:bg-[#080d19] text-slate-800 dark:text-slate-100 text-base font-semibold hover:bg-slate-100 dark:hover:bg-[#121f3d] dark:hover:border-blue-700/50 transition-all">
                <Link href="/templates">Create a Prompt</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* 9. FOOTER (Consistent full-width layout with dark blue theme) */}
      <footer className="w-full border-t border-slate-200/80 dark:border-blue-900/40 bg-slate-100/70 dark:bg-[#060a14] pt-16 pb-12 px-4 sm:px-6 md:px-8 lg:px-12 transition-colors">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#3b82f6] to-[#6EA8FF] text-white flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 18h3.2l2.4-7.2L12 15l2.4-4.2L16.8 18H20L13.8 6h-3.6L4 18z" />
                </svg>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white font-['var(--font-heading)']">AWA</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">AI Prompt Creation & Discovery Platform</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">Product</h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/templates" className="hover:text-blue-600 dark:hover:text-[#6EA8FF] transition-colors">Templates</Link></li>
              <li><Link href="/templates" className="hover:text-blue-600 dark:hover:text-[#6EA8FF] transition-colors">Categories</Link></li>
              <li><Link href="/collections" className="hover:text-blue-600 dark:hover:text-[#6EA8FF] transition-colors">Collections</Link></li>
              <li><Link href="/templates" className="hover:text-blue-600 dark:hover:text-[#6EA8FF] transition-colors">Explore Gallery</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">Resources</h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="#" className="hover:text-blue-600 dark:hover:text-[#6EA8FF] transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-blue-600 dark:hover:text-[#6EA8FF] transition-colors">Guides</Link></li>
              <li><Link href="#" className="hover:text-blue-600 dark:hover:text-[#6EA8FF] transition-colors">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm">Company</h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="#" className="hover:text-blue-600 dark:hover:text-[#6EA8FF] transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-blue-600 dark:hover:text-[#6EA8FF] transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-blue-600 dark:hover:text-[#6EA8FF] transition-colors">Privacy</Link></li>
              <li><Link href="#" className="hover:text-blue-600 dark:hover:text-[#6EA8FF] transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="w-full max-w-7xl mx-auto pt-8 border-t border-slate-200/80 dark:border-blue-900/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>&copy; {new Date().getFullYear()} AWA Platform. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Discord</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
