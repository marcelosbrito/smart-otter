"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'groq' | 'local' | 'offline' | null;

export default function SearchStatusWidget() {
  const [status, setStatus] = useState<StatusType>(null);
  const [provider] = useState(() => {
    if (typeof window === 'undefined') return 'auto';
    return localStorage.getItem('smart-otter-active-provider') || 'auto';
  });

  useEffect(() => {
    let cancelled = false;

    async function checkStatus() {
      if (!cancelled) {
        if (provider === 'groq') {
          setStatus('groq');
        } else if (provider === 'ollama') {
          try {
            const baseUrl = process.env.NEXT_PUBLIC_OLLAMA_BASE_URL || 'http://localhost:11434';
            await fetch(`${baseUrl}/api/tags`);
            setStatus('local');
          } catch {
            setStatus('offline');
          }
        } else {
          try {
            const baseUrl = process.env.NEXT_PUBLIC_OLLAMA_BASE_URL || 'http://localhost:11434';
            await fetch(`${baseUrl}/api/tags`);
            setStatus('local');
          } catch {
            setStatus('groq');
          }
        }
      }
    }

    checkStatus();
    return () => { cancelled = true; };
  }, [provider]);

  const labels: Record<StatusType, string> = {
    groq: 'Groq API (Online)',
    local: 'Local GPU Engine (Fallback Active)',
    offline: 'Local GPU Engine (Offline — using Groq)',
  };

  if (!status) return null;

  const indicators: Record<StatusType, string> = {
    groq: '\u{1F535}',
    local: '\u{1F7E2}',
    offline: '\u{26AA}',
  };

  return (
    <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-muted/50 border">
      <span>{indicators[status]}</span>
      <span className={cn(
        "font-medium",
        status === 'groq' ? 'text-blue-600 dark:text-blue-400' : '',
        status === 'local' ? 'text-green-600 dark:text-green-400' : '',
        status === 'offline' ? 'text-muted-foreground' : ''
      )}>
        {labels[status]}
      </span>
    </div>
  );
}
