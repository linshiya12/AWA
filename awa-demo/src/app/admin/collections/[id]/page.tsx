'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, RefreshCw, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import CuratedCollectionEditor from '@/components/admin/collections/CuratedCollectionEditor';
import { CuratedCollection } from '@/lib/server/types';

export default function EditCuratedCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const collectionId = resolvedParams.id;

  const [collection, setCollection] = useState<CuratedCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCollection = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/v1/admin/collections/curated/${collectionId}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Collection not found');
        }
        throw new Error(`Failed to load collection (${res.status})`);
      }
      const data = await res.json();
      setCollection(data.collection);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to fetch collection details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [collectionId]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-16">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40 rounded-md" />
          <Skeleton className="h-8 w-72 rounded-md" />
          <Skeleton className="h-4 w-96 rounded-md" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {error || 'Collection Not Found'}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          The curated collection you are trying to edit does not exist or may have been deleted.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/admin/collections">
            <Button variant="outline" className="rounded-xl gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Collections
            </Button>
          </Link>
          <Button onClick={fetchCollection} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return <CuratedCollectionEditor initialData={collection} isEdit={true} />;
}
