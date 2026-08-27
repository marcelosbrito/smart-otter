import { createSupabaseServerClient } from '../db/supabase-server';
import type { NormalizedResponse } from '../ai/provider';

const CACHE_TTL_HOURS = 24;

export async function getCache(queryKey: string): Promise<NormalizedResponse | null> {
  const supabase = createSupabaseServerClient();
  const key = generateCacheKey(queryKey);
  const now = new Date().toISOString();

  console.log(`[cache] Looking up key="${key}" (expires_at >= ${now})`);

  try {
    const { data, error } = await supabase
      .from('knowledge_cache')
      .select('response')
      .eq('query_key', key)
      .gte('expires_at', now)
      .single();

    if (error && error.code !== 'PGRST106') {
      console.warn(`[cache] Error fetching cache entry: ${error.message}`);
      return null;
    }

    if (!data) {
      const { data: expired, error: expiredError } = await supabase
        .from('knowledge_cache')
        .select('response')
        .eq('query_key', key)
        .single();

      if (expired && !expiredError) {
        console.log(`[cache] Found expired entry for "${key}", deleting`);
        await supabase.from('knowledge_cache').delete().eq('query_key', key);
        return null;
      }
    }

    const rawEntry = data || (await getFromExpired(key));
    if (!rawEntry) {
      console.log(`[cache] MISS for query: "${queryKey}"`);
      return null;
    }

    // Supabase .select('response').single() returns { response: {...} }, extract the actual data
    const entry = (rawEntry as any).response ?? rawEntry;
    
    console.log(`[cache] Parsed cached entry keys: ${Object.keys(entry).join(', ')}, profession=${JSON.stringify((entry as any).profession)}`);

    // Validate cached result has actual content
    let totalResources = 0;
    if ((entry as any).categories) {
      const categoryKeys = ['Tools', 'Communities', 'LearningPlatforms', 'Documentation'] as const;
      totalResources = categoryKeys.reduce((sum, cat) => {
        return sum + (((entry as any).categories?.[cat] as any[])?.length || 0);
      }, 0);
    } else {
      totalResources = ((entry as any).tools?.length || 0) 
        + ((entry as any).communities?.length || 0) 
        + ((entry as any).learningPlatforms?.length || 0) 
        + ((entry as any).documentation?.length || 0);
    }

    if (!(entry as any).profession || totalResources === 0) {
      console.warn(`[cache] Cached entry for "${key}" is empty (profession="${(entry as any).profession}", resources=${totalResources}) — deleting and returning MISS`);
      await supabase.from('knowledge_cache').delete().eq('query_key', key);
      return null;
    }

    console.log(`[cache] HIT for query: "${queryKey}" (${totalResources} resources)`);
    return entry as NormalizedResponse;
  } catch (err) {
    console.warn(`[cache] Exception fetching cache:`, err instanceof Error ? err.message : String(err));
    return null;
  }
}

async function getFromExpired(queryKey: string): Promise<NormalizedResponse | null> {
  const supabase = createSupabaseServerClient();
  
  try {
    const { data, error } = await supabase
      .from('knowledge_cache')
      .select('response')
      .eq('query_key', queryKey)
      .single();

    if (error || !data) return null;

    console.log(`[cache] Found expired entry for "${queryKey}", serving and deleting`);
    await supabase.from('knowledge_cache').delete().eq('query_key', queryKey);
    
    const entry = (data as any).response ?? data;
    let totalResources = 0;
    if ((entry as any).categories) {
      const categoryKeys = ['Tools', 'Communities', 'LearningPlatforms', 'Documentation'] as const;
      totalResources = categoryKeys.reduce((sum, cat) => {
        return sum + (((entry as any).categories?.[cat] as any[])?.length || 0);
      }, 0);
    } else {
      totalResources = ((entry as any).tools?.length || 0) 
        + ((entry as any).communities?.length || 0) 
        + ((entry as any).learningPlatforms?.length || 0) 
        + ((entry as any).documentation?.length || 0);
    }

    if (!(entry as any).profession || totalResources === 0) {
      console.warn(`[cache] Expired cached entry for "${queryKey}" is empty — skipping`);
      return null;
    }

    return entry as NormalizedResponse;
  } catch {
    return null;
  }
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
  const { error } = await supabase.from('knowledge_cache').delete().neq('query_key', '');

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
