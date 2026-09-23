import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockCatalog } from '@/lib/mockData';
import { TemplateCard } from '@/components/TemplateCard';

export default async function SubcategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string; subcategoryId: string }>;
}) {
  const { categoryId, subcategoryId } = await params;

  const category = mockCatalog.find((c) => c.id === categoryId);
  const subcategory = category?.subcategories.find((s) => s.id === subcategoryId);

  if (!category || !subcategory) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center text-xs text-zinc-500 gap-2">
        <Link href="/" className="hover:text-black font-medium transition-colors">Home</Link>
        <span className="text-zinc-300">›</span>
        <Link href={`/category/${category.id}`} className="hover:text-black font-medium transition-colors">
          {category.name}
        </Link>
        <span className="text-zinc-300">›</span>
        <span className="text-zinc-900 font-semibold">{subcategory.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs text-zinc-700 mb-3 font-medium">
          <span>Subcategory</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 mb-3 font-['var(--font-heading)']">
          {subcategory.name}
        </h1>
        <p className="text-base text-zinc-600 max-w-2xl">
          {subcategory.description} Each template specifies what it produces and the exact models it was engineered for.
        </p>
      </header>

      {/* Curated Gallery Grid */}
      <main>
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-200">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-['var(--font-heading)']">
            Available Prompt Templates ({subcategory.templates.length})
          </span>
          <span className="text-xs text-zinc-400 hidden sm:inline">
            Tested on Midjourney v6 & DALL-E 3
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {subcategory.templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </main>
    </div>
  );
}
