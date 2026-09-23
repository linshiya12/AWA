import Link from 'next/link';
import { notFound } from 'next/navigation';
import { mockCatalog } from '@/lib/mockData';

export default async function CategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params;
  const category = mockCatalog.find(c => c.id === categoryId);

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center text-xs text-zinc-500 gap-2">
        <Link href="/" className="hover:text-black font-medium transition-colors">Home</Link>
        <span className="text-zinc-300">›</span>
        <span className="text-zinc-900 font-semibold">{category.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs text-zinc-700 mb-3 font-medium">
          <span>Category</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 mb-3 font-['var(--font-heading)']">
          {category.name}
        </h1>
        <p className="text-base text-zinc-600 max-w-2xl">
          {category.description} Select a specific job to view production-ready prompt templates.
        </p>
      </header>

      {/* Subcategory List */}
      <main>
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4 font-['var(--font-heading)']">
          Subcategories & Jobs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {category.subcategories.map(sub => (
            <Link
              key={sub.id}
              href={`/category/${category.id}/${sub.id}`}
              className="reference-card group block p-6 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-zinc-900 group-hover:text-black transition-colors font-['var(--font-heading)']">
                  {sub.name}
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-700 font-medium">
                  {sub.templates.length} templates
                </span>
              </div>
              <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
                {sub.description}
              </p>

              <div className="pt-4 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-900 font-bold">
                <span>View template list</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
