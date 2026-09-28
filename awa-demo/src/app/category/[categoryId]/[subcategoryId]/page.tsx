import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findCategory, findSubcategory } from '@/lib/mockData';
import { TemplateCard } from '@/components/TemplateCard';
import { ArrowLeft, Layers, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string; subcategoryId: string }>;
}) {
  const { categoryId, subcategoryId } = await params;

  const category = findCategory(categoryId);
  if (!category) {
    notFound();
  }

  const subcategory = findSubcategory(category, subcategoryId);
  if (!subcategory) {
    notFound();
  }

  // Find all sibling subcategories for quick switching
  const siblingSubcategories = category.subcategories.filter((s) => s.id !== subcategory.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24">
      {/* Breadcrumbs & Navigation Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <nav className="flex flex-wrap items-center text-xs text-zinc-500 dark:text-zinc-400 gap-2">
          <Link href="/" className="hover:text-black dark:hover:text-white font-medium transition-colors">
            Home
          </Link>
          <span className="text-zinc-300 dark:text-zinc-600">›</span>
          <Link href="/templates" className="hover:text-black dark:hover:text-white font-medium transition-colors">
            Catalog
          </Link>
          <span className="text-zinc-300 dark:text-zinc-600">›</span>
          <Link
            href={`/category/${category.id}`}
            className="hover:text-black dark:hover:text-white font-medium transition-colors"
          >
            {category.name}
          </Link>
          <span className="text-zinc-300 dark:text-zinc-600">›</span>
          <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{subcategory.name}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full text-xs font-semibold px-3 h-8 gap-1.5 bg-zinc-100 dark:bg-blue-900/30 border-zinc-200/80 dark:border-blue-800/40"
          >
            <Link href={`/category/${category.id}`}>
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{category.name} Overview</span>
            </Link>
          </Button>

          {siblingSubcategories.map((sibling) => (
            <Button
              key={sibling.id}
              asChild
              variant="outline"
              size="sm"
              className="rounded-full text-xs font-semibold px-3 h-8 gap-1.5 bg-white dark:bg-blue-950/40 border-zinc-200/80 dark:border-blue-800/40 hover:border-blue-500/40"
            >
              <Link href={`/category/${category.id}/${sibling.id}`}>
                <span>View {sibling.name}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </Button>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="mb-10 p-6 sm:p-8 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-[#0d1c3a] dark:to-[#091124] border border-zinc-200/80 dark:border-blue-900/50 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 text-xs text-blue-700 dark:text-[#6EA8FF] mb-3 font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>{category.name} · Subcategory</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-3 font-['var(--font-heading)']">
          {subcategory.name}
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-[#94A3B8] max-w-2xl leading-relaxed">
          {subcategory.description} Each template specifies what it produces and the exact models it was engineered for.
        </p>
      </header>

      {/* 4-COLUMN RESPONSIVE CURATED GALLERY GRID */}
      <main>
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-200/80 dark:border-blue-900/40">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-['var(--font-heading)']">
            Available Prompt Templates ({subcategory.templates.length})
          </span>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:inline">
            Tested &amp; Production Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {subcategory.templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </main>
    </div>
  );
}
