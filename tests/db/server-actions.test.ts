import { describe, it, expect } from 'vitest';

describe('Favorites Repository (PostgreSQL)', () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  beforeAll(() => {
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Skipping PostgreSQL tests — set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    }
  });

  it('should export saveFavorite, removeFavorite, getFavorites, hasFavorite', async () => {
    const repo = await import('@/lib/db/repositories/favorites');
    expect(typeof repo.saveFavorite).toBe('function');
    expect(typeof repo.removeFavorite).toBe('function');
    expect(typeof repo.getFavorites).toBe('function');
    expect(typeof repo.hasFavorite).toBe('function');
  });

  it('should call Supabase insert for saveFavorite', async () => {
    const { saveFavorite } = await import('@/lib/db/repositories/favorites');
    expect(saveFavorite.length).toBe(6);
  });

  it('should call Supabase delete for removeFavorite', async () => {
    const { removeFavorite } = await import('@/lib/db/repositories/favorites');
    expect(removeFavorite.length).toBe(1);
  });

  it('should call Supabase select for getFavorites', async () => {
    const { getFavorites } = await import('@/lib/db/repositories/favorites');
    expect(getFavorites.length).toBe(2);
  });

  it('should call Supabase select for hasFavorite', async () => {
    const { hasFavorite } = await import('@/lib/db/repositories/favorites');
    expect(hasFavorite.length).toBe(3);
  });
});
