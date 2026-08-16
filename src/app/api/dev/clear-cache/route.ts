import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache/knowledge-cache';

export function POST() {
  cache.clear();
  return NextResponse.json({ cleared: true });
}
