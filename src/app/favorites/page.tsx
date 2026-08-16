import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function FavoritesPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">Favorites</h1>
      <Suspense fallback={<Skeleton className="w-full h-40 rounded-lg" />}>
        <div>Your saved resources will appear here.</div>
      </Suspense>
    </div>
  );
}
