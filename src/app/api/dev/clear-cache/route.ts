import { NextResponse } from 'next/server';
import { clearCache } from '@/lib/cache/knowledge-cache';

export async function POST() {
  try {
    await clearCache();
    return NextResponse.json({ cleared: true });
  } catch (error) {
    console.error('[clear-cache] Error:', error);
    return NextResponse.json({ cleared: false, error: String(error) }, { status: 500 });
  }
}
