import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

let cachedClient: ReturnType<typeof createClient<Database>> | null = null;

function buildStub(): any {
  const makeQuery = (): any => ({
    eq(_col: string, _val: unknown) { return makeQuery(); },
    neq(_col: string, _val: unknown) { return makeQuery(); },
    gt(_col: string, _val: unknown) { return makeQuery(); },
    gte(_col: string, _val: unknown) { return makeQuery(); },
    lt(_col: string, _val: unknown) { return makeQuery(); },
    lte(_col: string, _val: unknown) { return makeQuery(); },
    like(_col: string) { return makeQuery(); },
    ilike(_col: string) { return makeQuery(); },
    is(_col: string, _val: boolean) { return makeQuery(); },
    contains(_col: string, _val: unknown) { return makeQuery(); },
    overlaps(_col: string[]) { return makeQuery(); },
    matches(_col: string, _val: string) { return makeQuery(); },
    order(_col: string, _opts?: any) { return makeQuery(); },
    limit(_count: number) { return makeQuery(); },
    offset(_count: number) { return makeQuery(); },
    single() { return Promise.resolve({ data: null, error: new Error('Supabase not available') }); },
    maybeSingle() { return Promise.resolve({ data: null, error: new Error('Supabase not available') }); },
    count() { return Promise.resolve({ count: null, error: new Error('Supabase not available') }); },
    then(onfulfilled?: (value: any) => unknown, onrejected?: (reason: any) => unknown) {
      const p = Promise.reject(new Error('Supabase not available'));
      return p.then(onfulfilled, onrejected);
    },
  });

  return {
    from(_table: string) {
      return {
        select(_cols?: string, _opts?: any) {
          return makeQuery();
        },
        insert(_values: unknown) {
          return {
            select() {
              return { single() { return Promise.resolve({ data: null, error: new Error('Supabase not available') }); } };
            },
          };
        },
        delete() {
          return { eq(_col: string, _val: unknown) { return makeQuery(); } };
        },
        upsert(_values: unknown, _opts?: any) {
          return Promise.resolve({ data: null, error: new Error('Supabase not available') });
        },
      };
    },
  };
}

export function createSupabaseServerClient(): ReturnType<typeof createClient<Database>> | any {
  if (cachedClient !== null) {
    return cachedClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[db] Missing Supabase credentials:', { hasUrl: !!supabaseUrl, hasServiceKey: !!serviceRoleKey });
    cachedClient = buildStub() as any;
    return cachedClient;
  }

  try {
    cachedClient = createClient<Database>(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    console.log('[db] Supabase client initialized successfully');
  } catch (err) {
    console.error('[db] Failed to initialize Supabase client:', err);
    cachedClient = buildStub() as any;
  }

  return cachedClient;
}
