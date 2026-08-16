'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Terminal, Trash2 } from 'lucide-react';

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
              <DialogTrigger>
                <Button variant="outline" size="sm" className="gap-1">
                  <Trash2 className="w-3 h-3" /> Clear Cache
                </Button>
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
