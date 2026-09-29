import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findCategory } from '@/lib/mockData';
import { TemplateGallery } from '@/components/TemplateGallery';
import { ArrowLeft, ArrowRight, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const category = findCategory(categoryId);

  if (!category) {
    notFound();
  }

  const allCategoryTemplates = category.subcategories.flatMap((s) => s.templates);

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 pb-24">
      {/* Breadcrumbs & Back Link */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <nav className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 gap-2">
          <Link href="/" className="hover:text-black dark:hover:text-white font-medium transition-colors">
            Home
          </Link>
          <span className="text-zinc-300 dark:text-zinc-600">›</span>
          <Link href="/templates" className="hover:text-black dark:hover:text-white font-medium transition-colors">
            Catalog
          </Link>
          <span className="text-zinc-300 dark:text-zinc-600">›</span>
          <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{category.name}</span>
        </nav>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-full text-xs font-semibold px-3 h-8 gap-1.5 bg-zinc-100 dark:bg-blue-900/30 border-zinc-200/80 dark:border-blue-800/40"
        >
          <Link href="/templates">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Templates</span>
          </Link>
        </Button>
      </div>

      {/* Header */}
      <header className="mb-10 p-6 sm:p-8 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-[#0d1c3a] dark:to-[#091124] border border-zinc-200/80 dark:border-blue-900/50 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 text-xs text-blue-700 dark:text-[#6EA8FF] mb-3 font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Category Overview</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-3 font-['var(--font-heading)']">
          {category.name}
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-[#94A3B8] max-w-2xl leading-relaxed">
          {category.description} Explore all subcategories below or browse all available prompt templates in this category.
        </p>
      </header>

      {/* Subcategories Grid */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-['var(--font-heading)']">
            Subcategories ({category.subcategories.length})
          </h2>
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {allCategoryTemplates.length} total templates
          </span>
        </div>

        <div className={`grid grid-cols-1 ${category.subcategories.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-5`}>
          {category.subcategories.map((sub) => (
            <Link
              key={sub.id}
              href={`/category/${category.id}/${sub.id}`}
              className="reference-card group block p-6 sm:p-7 hover:-translate-y-1 transition-all border border-zinc-200/80 dark:border-blue-900/50 bg-white dark:bg-[#0c1427]/85 hover:border-blue-500/40 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3 gap-2">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-[#6EA8FF] transition-colors font-['var(--font-heading)']">
                  {sub.name}
                </h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-blue-900/40 text-zinc-700 dark:text-[#94A3B8] font-semibold border border-zinc-200 dark:border-blue-800/40 shrink-0">
                  {sub.templates.length} templates
                </span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-[#94A3B8] mb-6 leading-relaxed">
                {sub.description}
              </p>

              <div className="pt-4 border-t border-zinc-100 dark:border-blue-900/30 flex items-center justify-between text-xs text-zinc-900 dark:text-zinc-200 font-bold group-hover:text-blue-600 dark:group-hover:text-[#6EA8FF]">
                <span>Explore {sub.name}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4-COLUMN RESPONSIVE TEMPLATES GALLERY */}
      <section>
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-200/80 dark:border-blue-900/40">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-['var(--font-heading)']">
            All {category.name} Templates ({allCategoryTemplates.length})
          </h2>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:inline">
            Tested &amp; Production Verified Prompts
          </span>
        </div>

        <TemplateGallery templates={allCategoryTemplates} />
      </section>
    </div>
  );
}
