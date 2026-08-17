'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Terminal, Trash2 } from 'lucide-react';

function resolveButtonClass({ variant = 'default', size = 'default', className }: { variant?: string; size?: string; className?: string }) {
  const v: Record<string, string> = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    outline: 'border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
    ghost: 'hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
    destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40',
    link: 'text-primary underline-offset-4 hover:underline',
  };
  const s: Record<string, string> = {
    default: 'h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
    xs: 'h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*="size-"])]:size-3',
    sm: 'h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*="size-"])]:size-3.5',
    lg: 'h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2',
    icon: 'size-8',
    'icon-xs': 'size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*="size-"])]:size-3',
    'icon-sm': 'size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg',
    'icon-lg': 'size-9',
  };
  return cn('group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0', v[variant] || '', s[size] || '', className);
}

type CacheStats = { size: number; entries: Record<string, { profession: string }> };

export default function DevPage() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [clearing, setClearing] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch('/api/dev/cache-stats');
      if (res.ok) {
        setStats(await res.json());
      }
    } catch { /* ignore */ }
  }

  async function handleClearCache() {
    setClearing(true);
    try {
      const res = await fetch('/api/dev/clear-cache', { method: 'POST' });
      if (res.ok) {
        setStats({ size: 0, entries: {} });
        setOpen(false);
      }
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="border-t border-border">
      <div className="max-w-3xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Developer Mode</span>
        </div>

        {stats ? (
          <>
            <p className="text-sm text-muted-foreground mb-3">Cache: {stats.size} entries stored</p>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger className={resolveButtonClass({ variant: 'outline', size: 'sm' })}>
                <Trash2 className="w-3 h-3" /> Clear Cache
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Clear Cache</DialogTitle>
                  <DialogDescription>Are you sure you want to clear all cached search results? This action cannot be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={handleClearCache} disabled={clearing}>
                    {clearing ? 'Clearing...' : 'Clear Cache'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Initializing...</p>
        )}
      </div>
    </div>
  );
}
