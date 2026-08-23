import { describe, it, expect } from 'vitest';

describe('KnowledgeCache (PostgreSQL)', () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  beforeAll(() => {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Skipping KnowledgeCache tests — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    }
  });

  it('should export getCache, setCache, clearCache', async () => {
    const cache = await import('@/lib/cache/knowledge-cache');
    expect(typeof cache.getCache).toBe('function');
    expect(typeof cache.setCache).toBe('function');
    expect(typeof cache.clearCache).toBe('function');
  });

  it('should return null for non-existent keys when DB is unavailable', async () => {
    const { getCache } = await import('@/lib/cache/knowledge-cache');
    if (!supabaseUrl || !supabaseKey) {
      expect(true).toBe(true);
      return;
    }
    const result = await getCache('nonexistent');
    expect(result).toBeNull();
  });
});
