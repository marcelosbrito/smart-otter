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
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkId)
      .single();

    if (userError) {
      console.error('[favorites] User check error:', userError);
    }

    let userId: string | null = existingUser?.id ?? null;

    if (!userId) {
      console.log('[favorites] Creating new user');
      const insertResult = await supabase.from('users').insert({ clerk_id: clerkId }).select().single();
      console.log('[favorites] User insert result:', JSON.stringify(insertResult));
      userId = insertResult?.data?.id ?? null;
    }

    if (!userId) {
      throw new Error('Failed to get user ID');
    }

    console.log('[favorites] Inserting favorite for user:', userId, 'resource:', resourceName);
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        profession,
        resource_name: resourceName,
        resource_url: resourceUrl,
        category,
        explanation: explanation || null,
      })
      .select()
      .single();

    console.log('[favorites] Insert result:', JSON.stringify({ data, error }));

    if (error) {
      throw new Error(`Failed to save favorite: ${error.message} (${error.code})`);
    }

    return data as Favorite;
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

  return (data as Favorite[]) || [];
}

export async function hasFavorite(
  clerkId: string,
  profession: string,
  resourceName: string
): Promise<boolean> {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', clerkId)
    .eq('profession', profession)
    .eq('resource_name', resourceName)
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST106') {
    throw new Error(`Failed to check favorite: ${error.message}`);
  }

  return !!data;
}
