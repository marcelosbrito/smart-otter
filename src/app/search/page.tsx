'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Search as SearchIcon, AlertCircle } from 'lucide-react';

type Resource = { name: string; url: string; explanation: string };
type NormalizedResponse = { profession: string; tools: Resource[]; communities: Resource[]; learningPlatforms: Resource[]; documentation: Resource[] };
type SearchMetrics = { provider: string; cacheHit: boolean; durationMs: number; error?: string };

const CATEGORIES = [
  { key: 'tools', label: 'Tools' },
  { key: 'communities', label: 'Communities' },
  { key: 'learningPlatforms', label: 'Learning Platforms' },
  { key: 'documentation', label: 'Documentation' },
] as const;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<NormalizedResponse | null>(null);
  const [metrics, setMetrics] = useState<SearchMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) {
      setError('Please enter a profession or domain name.');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setMetrics(null);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Search failed');
        return;
      }

      setResults(data.response);
      setMetrics(data.metrics);
    } catch {
      setError('Failed to connect to the search service.');
    } finally {
      setLoading(false);
    }
  }

  function handleCategoryClick(categoryKey: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('q', query.trim());
    if (categoryKey !== 'all') {
      url.searchParams.set('category', categoryKey);
    } else {
      url.searchParams.delete('category');
    }
    window.history.pushState({}, '', url.pathname + url.search);
  }

  const hasResults = results && CATEGORIES.some((cat) => results[cat.key as keyof NormalizedResponse]?.length > 0);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Search Resources</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <Input
          placeholder="Enter a profession or domain (e.g., Frontend Developer)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search query"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Searching...' : <><SearchIcon className="w-4 h-4 mr-2" /> Search</>}
        </Button>
      </form>

      {error && (
        <div role="alert" className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {metrics && !results && (
        <p className="text-sm text-muted-foreground mb-4">
          Served from cache ({metrics.provider}) — {metrics.durationMs}ms
        </p>
      )}

      {loading && (
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {hasResults && results && (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            Results for &ldquo;{results.profession}&rdquo; — {metrics?.cacheHit ? 'Cached' : 'Fresh'} ({metrics?.durationMs}ms, {metrics?.provider})
          </p>

          <div className="space-y-3 mb-6">
            {CATEGORIES.map((cat) => {
              const items = results[cat.key as keyof NormalizedResponse] as Resource[] | undefined;
              if (!items || items.length === 0) return null;

              return (
                <Collapsible key={cat.key}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg border bg-background hover:bg-accent transition-colors">
                    <span className="font-medium">{cat.label} ({items.length})</span>
                    <ChevronDown className="w-4 h-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2 space-y-2">
                    {items.map((item, idx) => (
                      <Card key={idx}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">{item.name}</a>
                              <p className="text-sm text-muted-foreground mt-1">{item.explanation}</p>
                            </div>
                            <Badge variant="secondary" className="text-xs">{cat.label.replace(' ', '')}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </>
      )}

      {!loading && !results && !error && (
        <p className="text-muted-foreground text-center py-12">Enter a profession above to discover curated resources.</p>
      )}
    </div>
  );
}
