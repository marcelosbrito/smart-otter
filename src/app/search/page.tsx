'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronDown, Search as SearchIcon, AlertCircle, BookmarkPlus, Bookmark } from 'lucide-react';
import SearchStatusWidget from '@/components/search/SearchStatusWidget';

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
  const [savedFavorites, setSavedFavorites] = useState<Set<string>>(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  function capitalize(str: string) {
    if (!str) return str;
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/status');
        const data = await res.json();
        setIsAuthenticated(data.authenticated || false);
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !results?.profession) return;

    async function loadFavoriteState() {
      const allResources: Resource[] = [];
      CATEGORIES.forEach((cat) => {
        const items = results[cat.key as keyof NormalizedResponse];
        if (items) allResources.push(...(items as Resource[]));
      });

      try {
        const res = await fetch('/api/favorites/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profession: results.profession, resources: allResources.map((r) => r.name) }),
        });
        const data = await res.json();
        if (data.saved) {
          setSavedFavorites(new Set(data.saved));
        }
      } catch {
        // silently fail — user can still save manually
      }
    }

    loadFavoriteState();
  }, [results, isAuthenticated]);

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

    const provider = localStorage.getItem('smart-otter-active-provider') || 'auto';

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, provider }),
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

  async function handleSaveFavorite(resourceName: string, categoryKey: string, explanation?: string, url?: string) {
    if (!results || !results.profession) return;

    try {
      const res = await fetch('/api/favorites/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profession: results.profession,
          resourceName,
          resourceUrl: url || '',
          category: catLabels[categoryKey] || categoryKey,
          explanation,
        }),
      });

      if (res.ok) {
        setSavedFavorites((prev) => new Set(prev).add(resourceName));
      } else {
        const data = await res.json();
        if (data.redirect) {
          window.location.href = `/sign-in?redirect=${encodeURIComponent(window.location.href)}`;
        }
      }
    } catch {
      setError('Failed to save favorite.');
    }
  }

  const catLabels: Record<string, string> = {
    tools: 'Tools',
    communities: 'Communities',
    learningPlatforms: 'Learning Platforms',
    documentation: 'Documentation',
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12" role="main">
      <h1 className="text-3xl font-bold mb-8">Search Resources</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-8" aria-label="Resource search form">
        <Input
          placeholder="Enter a profession or domain (e.g., Frontend Developer)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search query"
          className="min-w-0 flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Searching...' : <><SearchIcon className="w-4 h-4 mr-2" /> Search</>}
        </Button>
      </form>

      <div className="mb-8">
        <SearchStatusWidget />
      </div>

      {error && (
        <div role="alert" aria-live="assertive" className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {metrics && !results && (
        <p aria-live="polite" className="text-sm text-muted-foreground mb-4">
          Served from cache ({metrics.provider}) — {metrics.durationMs}ms
        </p>
      )}

      {loading && (
        <div role="status" aria-busy="true" className="space-y-6">
          <Skeleton className="h-8 w-48 animate-pulse" />
          {[...Array(CATEGORIES.length)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                  <Skeleton className="h-5 w-1/2" />
                  <Badge variant="secondary" className="text-xs"><Skeleton className="w-16 h-4 rounded-full" /></Badge>
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {hasResults && results && (
        <>
          <p aria-label={`Results for ${results.profession}`} className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
            Results for &ldquo;{capitalize(results.profession)}&rdquo; —{' '}
            <Badge variant="outline" className="font-normal">{metrics?.provider}</Badge>
            {metrics && (
              <>
                <span className="text-muted-foreground/60">·</span>
                <span>{metrics.cacheHit ? 'Cached' : 'Fresh'}</span>
                <span className="text-muted-foreground/60">·</span>
                <span>{metrics.durationMs}ms</span>
              </>
            )}
          </p>

          <div role="search" className="space-y-4 mb-6">
            {CATEGORIES.map((cat) => {
              const items = results[cat.key as keyof NormalizedResponse] as Resource[] | undefined;
              if (!items || items.length === 0) return null;

              return (
                <Collapsible key={cat.key}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-4 rounded-xl border bg-background hover:bg-secondary/50 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none">
                    <span className="font-semibold text-base">{cat.label} ({items.length})</span>
                    <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-200" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 space-y-2">
                    {items.map((item, idx) => (
                      <Card
                        key={idx}
                        className="group hover:shadow-md transition-all duration-200 animate-in fade-in fill-mode-forwards"
                        style={{ animationDelay: `${idx * 75}ms`, animationDuration: '300ms' }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                            <div>
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">{item.name}</a>
                              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.explanation}</p>
                            </div>
                              <div className="flex items-center gap-2">
                               <Badge variant="secondary" className="text-xs capitalize rounded-full">{cat.label.replace(' ', '').replace(/([A-Z])/g, ' $1')}</Badge>
                               {isAuthenticated ? (
                                 <Button
                                   variant="ghost"
                                   size="sm"
                                   className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleSaveFavorite(item.name, cat.key as string, item.explanation, item.url)}
                                   aria-label={savedFavorites.has(item.name) ? `${item.name} saved to favorites` : `Save ${item.name} to favorites`}
                                 >
                                   {savedFavorites.has(item.name) ? (
                                     <Bookmark className="w-4 h-4 fill-current text-primary" />
                                   ) : (
                                     <BookmarkPlus className="w-4 h-4" />
                                   )}
                                 </Button>
                               ) : null}
                             </div>
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
        <p className="text-muted-foreground text-center py-12" role="status">Enter a profession above to discover curated resources.</p>
      )}

      {hasResults === false && results && !error && (
        <div className="text-center py-12 space-y-2">
          <p className="text-muted-foreground text-lg">No specific resources found for &ldquo;{results.profession}&rdquo;</p>
          <p className="text-sm text-muted-foreground/70">Try a different profession or domain name.</p>
        </div>
      )}
    </div>
  );
}
