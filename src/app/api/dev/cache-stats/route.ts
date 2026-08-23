import { NextResponse } from 'next/server';
import { getCacheStats } from '@/lib/cache/knowledge-cache';

export async function GET() {
  try {
    const stats = await getCacheStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('[cache-stats] Error:', error);
    return NextResponse.json({ size: 0, oldest_created_at: null, newest_created_at: null }, { status: 500 });
  }
}
