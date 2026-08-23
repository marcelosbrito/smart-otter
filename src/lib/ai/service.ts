import { getCache, setCache } from '../cache/knowledge-cache';
import { createProvider } from './factory';
import type { RawResponse, NormalizedResponse } from './provider';

const DEFAULT_CATEGORIES = ['Tools', 'Communities', 'LearningPlatforms', 'Documentation'];

export interface SearchMetrics {
  provider: string;
  cacheHit: boolean;
  durationMs: number;
  error?: string;
}

function getActiveProvider(): 'groq' | 'ollama' | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('smart-otter-active-provider');
  if (stored === 'auto') return null;
  return (stored as 'groq' | 'ollama') || null;
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
  const errorChain: string[] = [];
  const activeProvider = getActiveProvider();

  try {
    const cached = await getCache(query);
    if (cached) {
      return { response: cached, metrics: { provider: 'Cache', cacheHit: true, durationMs: Date.now() - startTime } };
    }
  } catch {}

  let rawResponse: RawResponse | null = null;
  let usedProviderName = providerName;

  if (activeProvider === 'ollama') {
    try {
      const ollamaProvider = createProvider('ollama');
      if (ollamaProvider) {
        rawResponse = await ollamaProvider.search(query);
        usedProviderName = 'ollama';
        console.info('[searchService] Ollama provider succeeded.');
      }
    } catch (err) {
      const ollamaError = err instanceof Error ? err.message : String(err);
      errorChain.push(`Ollama: ${ollamaError}`);
      console.warn(`[searchService] Ollama provider failed:`, ollamaError);
    }
  } else if (activeProvider === 'groq') {
    try {
      const groqProvider = createProvider('groq');
      if (groqProvider) {
        rawResponse = await groqProvider.search(query);
        usedProviderName = 'groq';
        console.info('[searchService] Groq provider succeeded.');
      }
    } catch (err) {
      const groqError = err instanceof Error ? err.message : String(err);
      errorChain.push(`Groq: ${groqError}`);
      console.warn(`[searchService] Groq provider failed:`, groqError);
    }
  } else {
    if (process.env.GROQ_API_KEY) {
      try {
        const groqProvider = createProvider('groq');
        if (groqProvider) {
          rawResponse = await groqProvider.search(query);
          usedProviderName = 'groq';
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
          usedProviderName = 'ollama';
          console.info('[searchService] Ollama provider succeeded.');
        }
      } catch (err) {
        const ollamaError = err instanceof Error ? err.message : String(err);
        errorChain.push(`Ollama: ${ollamaError}`);
        console.warn(`[searchService] Ollama provider failed:`, ollamaError);
      }
    }
  }

  if (!rawResponse) {
    const cachedFallback = await getCache(query);
    if (cachedFallback) {
      return { response: cachedFallback, metrics: { provider: 'Cache', cacheHit: true, durationMs: Date.now() - startTime, error: 'All AI providers unavailable — served from cache' } };
    }
    throw new Error(`Search failed after trying all providers: ${errorChain.join(' | ')}`);
  }

  const normalized = normalizeRawResponse(rawResponse);
  await setCache(query, normalized);

  return {
    response: normalized,
    metrics: {
      provider: errorChain.length > 0 ? 'Fallback' : usedProviderName === 'groq' ? 'Groq' : 'Ollama',
      cacheHit: false,
      durationMs: Date.now() - startTime,
      error: errorChain.length > 0 ? `Providers tried: ${errorChain.join(', ')}` : undefined,
    },
  };
}
