import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { searchService } from '@/lib/ai/service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, provider } = body as { query?: string; provider?: string };

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({ error: 'Search query is required and must be a non-empty string.' }, { status: 400 });
    }

    const trimmedQuery = query.trim();
    const result = await searchService(trimmedQuery, provider || 'gemini');

    return NextResponse.json({ response: result.response, metrics: result.metrics });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return NextResponse.json({ error: 'Search query is required.' }, { status: 400 });
  }

  try {
    const result = await searchService(query);
    return NextResponse.json({ response: result.response, metrics: result.metrics });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  }
}
