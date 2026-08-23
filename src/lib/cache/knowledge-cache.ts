import { createSupabaseServerClient } from '../db/supabase-server';
import type { NormalizedResponse } from '../ai/provider';

const CACHE_TTL_HOURS = 24;

export async function getCache(queryKey: string): Promise<NormalizedResponse | null> {
  const supabase = createSupabaseServerClient();
  const key = generateCacheKey(queryKey);
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('knowledge_cache')
    .select('response')
    .eq('query_key', key)
    .lt('expires_at', now)
    .single();

  if (error && error.code !== 'PGRST106') {
    console.warn('[cache] Error fetching cache entry:', error.message);
    return null;
  }

  if (!data) {
    const { data: expired, error: expiredError } = await supabase
      .from('knowledge_cache')
      .select('response')
      .eq('query_key', key)
      .single();

    if (expired && !expiredError) {
      await supabase.from('knowledge_cache').delete().eq('query_key', key);
      return null;
    }
  }

  const entry = data || (await getFromExpired(key));
  if (!entry) return null;

  return entry as NormalizedResponse;
}

async function getFromExpired(queryKey: string): Promise<NormalizedResponse | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('knowledge_cache')
    .select('response')
    .eq('query_key', queryKey)
    .single();

  if (error || !data) return null;

  await supabase.from('knowledge_cache').delete().eq('query_key', queryKey);
  return data as NormalizedResponse;
}

export async function setCache(
  queryKey: string,
  response: NormalizedResponse
): Promise<void> {
  const supabase = createSupabaseServerClient();
  const key = generateCacheKey(queryKey);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + CACHE_TTL_HOURS * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from('knowledge_cache').upsert({
    query_key: key,
    response,
    created_at: now.toISOString(),
    expires_at: expiresAt,
  }, { onConflict: 'query_key' });

  if (error) {
    console.error('[cache] Error saving cache entry:', error.message);
  }
}

export async function clearCache(): Promise<void> {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from('knowledge_cache').delete();

  if (error) {
    console.error('[cache] Error clearing cache:', error.message);
  }
}

export async function getCacheStats(): Promise<{ size: number; oldest_created_at: string | null; newest_created_at: string | null }> {
  const supabase = createSupabaseServerClient();
  const { count, error: countError } = await supabase
    .from('knowledge_cache')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('[cache] Error getting cache stats:', countError.message);
    return { size: 0, oldest_created_at: null, newest_created_at: null };
  }

  const { data: timestamps, error: tsError } = await supabase
    .from('knowledge_cache')
    .select('created_at')
    .order('created_at', { ascending: true })
    .limit(2);

  if (tsError) {
    console.error('[cache] Error getting cache timestamps:', tsError.message);
    return { size: count || 0, oldest_created_at: null, newest_created_at: null };
  }

  const sizes = count || 0;
  const oldestCreatedAt = timestamps?.length ? timestamps[0]?.created_at : null;
  const newestCreatedAt = timestamps?.length > 1 ? timestamps[timestamps.length - 1]?.created_at : (timestamps?.[0]?.created_at ?? null);

  return { size: sizes, oldest_created_at: oldestCreatedAt, newest_created_at: newestCreatedAt };
}

function generateCacheKey(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, '-');
}
