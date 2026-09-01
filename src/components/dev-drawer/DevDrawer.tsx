"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CogIcon, CheckIcon } from 'lucide-react';
import SearchStatusWidget from '@/components/search/SearchStatusWidget';

export type ProviderType = 'auto' | 'groq' | 'ollama';

const PROVIDERS: { value: ProviderType; label: string; description: string }[] = [
  { value: 'auto', label: 'Auto/Hybrid', description: 'Attempts Groq, falls back to Local GPU' },
  { value: 'groq', label: 'Groq Cloud', description: 'Ultra-fast, Free API' },
  { value: 'ollama', label: 'Ollama / GPU Local', description: 'Local GPU via Cloudflare Tunnel' },
];

const STORAGE_KEY = 'smart-otter-active-provider';

function getStoredProvider(): ProviderType {
  if (typeof window === 'undefined') return 'auto';
  const stored = localStorage.getItem(STORAGE_KEY);
  return (stored as ProviderType) || 'auto';
}

export default function DevDrawer() {
  const [open, setOpen] = useState(false);
  const [activeProvider, setActiveProvider] = useState<ProviderType>(() => getStoredProvider());

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setActiveProvider(e.newValue as ProviderType);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also poll for changes in case storage event doesn't fire (same tab)
    const interval = setInterval(() => {
      const current = getStoredProvider();
      if (current !== activeProvider) {
        setActiveProvider(current);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [activeProvider]);

  const handleSelect = (value: ProviderType) => {
    setActiveProvider(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
          <CogIcon className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent showCloseButton className="max-w-md">
        <DialogTitle>Developer Mode</DialogTitle>

        <div className="space-y-1 mt-2">
          <p className="text-sm text-muted-foreground mb-3">Select active AI provider for search queries.</p>

          {PROVIDERS.map((provider) => (
            <button
              key={provider.value}
              onClick={() => handleSelect(provider.value)}
              className={cn(
                "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                activeProvider === provider.value ? "bg-accent" : "hover:bg-muted/50"
              )}
            >
              <div className="flex size-4 items-center justify-center">
                {activeProvider === provider.value && <CheckIcon className="size-3" />}
              </div>

              <div>
                <span className="text-sm font-medium">{provider.label}</span>
                <p className="text-xs text-muted-foreground">{provider.description}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Provider Status</h4>
          <SearchStatusWidget />
        </div>

        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2">Cache Management</h4>
          <CacheActions />
        </div>

        <DialogFooter className="sm:justify-start">
          <Button variant="default" size="sm" onClick={() => setOpen(false)}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CacheActions() {
  const [stats, setStats] = useState<{ size: number; oldest_created_at: string | null; newest_created_at: string | null } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/dev/cache-stats')
      .then(r => r.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  const handleClear = async () => {
    setLoading(true);
    try {
      await fetch('/api/dev/clear-cache', { method: 'POST' });
      setStats({ size: 0, oldest_created_at: null, newest_created_at: null });
    } catch (err) {
      console.error('[DevDrawer] Clear cache failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Cache entries: {stats?.size ?? '-'}</span>
        {stats?.newest_created_at && (
          <span className="text-xs text-muted-foreground">
            Last: {new Date(stats.newest_created_at).toLocaleString()}
          </span>
        )}
      </div>

      <Button variant="outline" size="sm" onClick={handleClear} disabled={loading}>
        {loading ? 'Clearing...' : 'Clear Cache'}
      </Button>
    </div>
  );
}
