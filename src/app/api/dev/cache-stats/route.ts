import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache/knowledge-cache';

export function GET() {
  const entries = cache.getEntries();
  return NextResponse.json({ size: cache.getSize(), entries });
}
