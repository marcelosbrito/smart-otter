import { cache } from '../cache/knowledge-cache';
import { createProvider } from './factory';
import type { RawResponse, NormalizedResponse } from './provider';

const DEFAULT_CATEGORIES = ['Tools', 'Communities', 'LearningPlatforms', 'Documentation'];

export interface SearchMetrics {
  provider: string;
  cacheHit: boolean;
  durationMs: number;
  error?: string;
}

function normalizeRawResponse(raw: RawResponse): NormalizedResponse {
  const categories: Record<string, Resource[]> = {};

  for (const category of DEFAULT_CATEGORIES) {
    categories[category] = raw.categories?.[category] ?? [];
  }

  return {
    profession: raw.profession || 'Unknown',
    tools: categories.Tools || [],
    communities: categories.Communities || [],
    learningPlatforms: categories.LearningPlatforms || [],
    documentation: categories.Documentation || [],
  };
}

interface Resource {
  name: string;
  url: string;
  explanation: string;
}

export async function searchService(
  query: string,
  providerName = 'groq'
): Promise<{ response: NormalizedResponse | null; metrics: SearchMetrics }> {
  const startTime = Date.now();
  let errorChain: string[] = [];

  try {
    const cached = cache.get(query);
    if (cached) {
      return { response: cached, metrics: { provider: 'Cache', cacheHit: true, durationMs: Date.now() - startTime } };
    }
  } catch {}

  let rawResponse: RawResponse | null = null;

  if (process.env.GROQ_API_KEY) {
    try {
      const groqProvider = createProvider('groq');
      if (groqProvider) {
        rawResponse = await groqProvider.search(query);
        console.info('[searchService] Groq provider succeeded.');
      }
    } catch (err) {
      const groqError = err instanceof Error ? err.message : String(err);
      errorChain.push(`Groq: ${groqError}`);
      console.warn(`[searchService] Groq provider failed:`, groqError);
    }
  }

  if (!rawResponse && process.env.OLLAMA_BASE_URL) {
    try {
      const ollamaProvider = createProvider('ollama');
      if (ollamaProvider) {
        rawResponse = await ollamaProvider.search(query);
        console.info('[searchService] Ollama provider succeeded.');
      }
    } catch (err) {
      const ollamaError = err instanceof Error ? err.message : String(err);
      errorChain.push(`Ollama: ${ollamaError}`);
      console.warn(`[searchService] Ollama provider failed:`, ollamaError);
    }
  }

  if (!rawResponse) {
    const cachedFallback = cache.get(query);
    if (cachedFallback) {
      return { response: cachedFallback, metrics: { provider: 'Cache', cacheHit: true, durationMs: Date.now() - startTime, error: 'All AI providers unavailable — served from cache' } };
    }
    throw new Error(`Search failed after trying all providers: ${errorChain.join(' | ')}`);
  }

  const normalized = normalizeRawResponse(rawResponse);
  cache.set(query, normalized);

  return {
    response: normalized,
    metrics: {
      provider: errorChain.length > 0 ? 'Fallback' : rawResponse.profession ? (providerName === 'groq' ? 'Groq' : 'Ollama') : 'Unknown',
      cacheHit: false,
      durationMs: Date.now() - startTime,
      error: errorChain.length > 0 ? `Providers tried: ${errorChain.join(', ')}` : undefined,
    },
  };
}
