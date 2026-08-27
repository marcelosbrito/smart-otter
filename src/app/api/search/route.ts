import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { searchService } from '@/lib/ai/service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, provider } = body as { query?: string; provider?: string };

    console.log(`[api/search] POST received query="${query}" provider="${provider || 'auto'}"`);

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json({ error: 'Search query is required and must be a non-empty string.' }, { status: 400 });
    }

    const trimmedQuery = query.trim();
    
    // Map client provider selection to service layer behavior
    let effectiveProvider = provider || 'auto';
    if (effectiveProvider === 'ollama') {
      console.log(`[api/search] Client requested Ollama only`);
    } else if (effectiveProvider === 'groq') {
      console.log(`[api/search] Client requested Groq only`);
    } else {
      console.log(`[api/search] Using default provider selection (Groq → Ollama fallback)`);
    }
    
    console.log(`[api/search] Calling searchService with query="${trimmedQuery}"`);
    const result = await searchService(trimmedQuery, effectiveProvider || 'groq');
    console.log(`[api/search] Response: provider=${result.metrics.provider} duration=${result.metrics.durationMs}ms hasResults=${!!result.response}`);

    return NextResponse.json({ response: result.response, metrics: result.metrics });
  } catch (error) {
    console.error(`[api/search] Error:`, error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  console.log(`[api/search] GET received q="${query}"`);

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return NextResponse.json({ error: 'Search query is required.' }, { status: 400 });
  }

  try {
    const result = await searchService(query);
    console.log(`[api/search] GET Response: provider=${result.metrics.provider} duration=${result.metrics.durationMs}ms hasResults=${!!result.response}`);
    return NextResponse.json({ response: result.response, metrics: result.metrics });
  } catch (error) {
    console.error(`[api/search] Error:`, error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  }
}
