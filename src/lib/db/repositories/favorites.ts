import { createSupabaseServerClient } from '../supabase-server';

export interface Favorite {
  id: number;
  user_id: string;
  profession: string;
  resource_name: string;
  resource_url: string;
  category: string;
  explanation: string | null;
  created_at: string;
}

export async function saveFavorite(
  clerkId: string,
  profession: string,
  resourceName: string,
  resourceUrl: string,
  category: string,
  explanation?: string
): Promise<Favorite> {
  const supabase = createSupabaseServerClient();

  try {
    console.log('[favorites] Checking user:', clerkId);
    
    // Ensure user exists in users table (FK: favorites.user_id -> users.clerk_id)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .limit(1);

    if (userError && !userData?.length) {
      console.log('[favorites] Creating new user for Clerk ID:', clerkId);
      const insertResult = await supabase.from('users').insert({ clerk_id: clerkId }).select().limit(1);
      const rows = Array.isArray(insertResult?.data) ? insertResult.data : [];
      if (rows.length === 0 || !rows[0]?.id) {
        throw new Error('Failed to create user');
      }
    }

    console.log('[favorites] Inserting favorite for user:', clerkId, 'resource:', resourceName);
    
    // Check if already saved before inserting
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', clerkId)
      .eq('profession', profession)
      .eq('resource_name', resourceName)
      .limit(1);

    if (Array.isArray(existing) && existing.length > 0) {
      console.log(`[favorites] Already saved: ${resourceName}`);
      return existing[0] as Favorite;
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: clerkId,
        profession,
        resource_name: resourceName,
        resource_url: resourceUrl,
        category,
        explanation: explanation || null,
      })
      .select()
      .limit(1);

    const rows = Array.isArray(data) ? data : [];

    if (error) {
      throw new Error(`Failed to save favorite: ${error.message} (${error.code})`);
    }

    return rows[0] as Favorite;
  } catch (err) {
    console.error('[favorites] saveFavorite error:', err);
    throw err;
  }
}

export async function removeFavorite(favoriteId: number): Promise<boolean> {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', favoriteId);

  if (error) {
    throw new Error(`Failed to remove favorite: ${error.message}`);
  }

  return true;
}

export async function getFavorites(clerkId: string, profession?: string): Promise<Favorite[]> {
  const supabase = createSupabaseServerClient();

  let query = supabase
    .from('favorites')
    .select('*')
    .eq('user_id', clerkId)
    .order('profession')
    .order('created_at', { ascending: false });

  if (profession) {
    query = query.eq('profession', profession);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch favorites: ${error.message}`);
  }

  return Array.isArray(data) ? (data as Favorite[]) : [];
}

export async function hasFavorite(
  clerkId: string,
  profession: string,
  resourceName: string
): Promise<boolean> {
  const supabase = createSupabaseServerClient();

  // FK: favorites.user_id -> users.clerk_id, so query directly by Clerk ID
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', clerkId)
    .eq('profession', profession)
    .eq('resource_name', resourceName)
    .limit(1);

  if (error && error.code !== 'PGRST106') {
    console.error(`[favorites] Error checking favorite: ${error.message} (code: ${error.code})`);
    return false;
  }

  return Array.isArray(data) && data.length > 0;
}
