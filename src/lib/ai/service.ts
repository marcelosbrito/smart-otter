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

  console.log(`[searchService] === START query="${query}" providerName="${providerName}" activeProvider=${activeProvider} ===`);

  try {
    const cached = await getCache(query);
    if (cached) {
      return { response: cached, metrics: { provider: 'Cache', cacheHit: true, durationMs: Date.now() - startTime } };
    }
    console.log(`[searchService] Cache MISS for query="${query}"`);
  } catch (err) {
    console.warn(`[searchService] Cache fetch error:`, err instanceof Error ? err.message : String(err));
  }

  let rawResponse: RawResponse | null = null;
  let usedProviderName = providerName;

  // Respect explicit provider selection from client
  if (providerName === 'ollama') {
    try {
      const ollamaProvider = createProvider('ollama');
      if (ollamaProvider) {
        console.log(`[searchService] Attempting Ollama for query="${query}"`);
        rawResponse = await ollamaProvider.search(query);
        usedProviderName = 'ollama';
        console.info('[searchService] Ollama provider succeeded.');
      }
    } catch (err) {
      const ollamaError = err instanceof Error ? err.message : String(err);
      errorChain.push(`Ollama: ${ollamaError}`);
      console.warn(`[searchService] Ollama provider failed:`, ollamaError);
    }
  } else if (providerName === 'groq') {
    try {
      const groqProvider = createProvider('groq');
      if (groqProvider) {
        console.log(`[searchService] Attempting Groq for query="${query}"`);
        rawResponse = await groqProvider.search(query);
        usedProviderName = 'groq';
        console.info('[searchService] Groq provider succeeded.');
      }
    } catch (err) {
      const groqError = err instanceof Error ? err.message : String(err);
      errorChain.push(`Groq: ${groqError}`);
      console.warn(`[searchService] Groq provider failed:`, groqError);
    }
  } else if (activeProvider === 'ollama') {
    try {
      const ollamaProvider = createProvider('ollama');
      if (ollamaProvider) {
        console.log(`[searchService] Attempting Ollama for query="${query}"`);
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
        console.log(`[searchService] Attempting Groq for query="${query}"`);
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
    // Default: try Groq first, then Ollama fallback
    if (process.env.GROQ_API_KEY) {
      try {
        const groqProvider = createProvider('groq');
        if (groqProvider) {
          console.log(`[searchService] Attempting Groq for query="${query}"`);
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
      console.log(`[searchService] GROQ_API_KEY not set, skipping Groq`);
    }

    if (!rawResponse && process.env.OLLAMA_BASE_URL) {
      try {
        const ollamaProvider = createProvider('ollama');
        if (ollamaProvider) {
          console.log(`[searchService] Attempting Ollama for query="${query}"`);
          rawResponse = await ollamaProvider.search(query);
          usedProviderName = 'ollama';
          console.info('[searchService] Ollama provider succeeded.');
        }
      } catch (err) {
        const ollamaError = err instanceof Error ? err.message : String(err);
        errorChain.push(`Ollama: ${ollamaError}`);
        console.warn(`[searchService] Ollama also failed:`, ollamaError);
      }
    } else if (!rawResponse) {
      console.log(`[searchService] OLLAMA_BASE_URL not set, skipping Ollama`);
    }
  }

  if (!rawResponse) {
    const cachedFallback = await getCache(query).catch(() => null);
    if (cachedFallback) {
      return { response: cachedFallback, metrics: { provider: 'Cache', cacheHit: true, durationMs: Date.now() - startTime, error: 'All AI providers unavailable — served from cache' } };
    }
    console.error(`[searchService] No rawResponse for query: "${query}"`);
    throw new Error(`Search failed after trying all providers: ${errorChain.join(' | ')}`);
  }

  const hasAnyResources = Object.values(rawResponse.categories).some(cat => Array.isArray(cat) && cat.length > 0);
  console.log(`[searchService] Response categories: Tools=${(rawResponse.categories?.Tools || []).length}, Communities=${(rawResponse.categories?.Communities || []).length}, LearningPlatforms=${(rawResponse.categories?.LearningPlatforms || []).length}, Documentation=${(rawResponse.categories?.Documentation || []).length}`);

  if (!hasAnyResources) {
    console.warn(`[searchService] AI returned empty results for query: "${query}" — treating as provider failure`);
    rawResponse = null;
    usedProviderName = '';

    // Try fallback provider when primary returns empty
    if (usedProviderName !== 'ollama' && process.env.OLLAMA_BASE_URL) {
      try {
        const ollamaProvider = createProvider('ollama');
        if (ollamaProvider) {
          console.log(`[searchService] Retrying with Ollama after empty Groq response`);
          rawResponse = await ollamaProvider.search(query);
          usedProviderName = 'ollama';
          console.info('[searchService] Ollama provider succeeded after Groq returned empty.');
        }
      } catch (err) {
        const ollamaError = err instanceof Error ? err.message : String(err);
        errorChain.push(`Ollama: ${ollamaError}`);
        console.warn(`[searchService] Ollama also failed after empty Groq response:`, ollamaError);
      }
    }

    if (!rawResponse) {
      const cachedFallback = await getCache(query).catch(() => null);
      if (cachedFallback) {
        return { response: cachedFallback, metrics: { provider: 'Cache', cacheHit: true, durationMs: Date.now() - startTime, error: 'All AI providers returned empty — served from cache' } };
      }
      throw new Error(`Search failed after trying all providers: ${errorChain.join(' | ')}`);
    }
  }

  const normalized = normalizeRawResponse(rawResponse);
  console.log(`[searchService] Normalized: profession="${normalized.profession}" tools=${normalized.tools.length} communities=${normalized.communities.length} learningPlatforms=${normalized.learningPlatforms.length} documentation=${normalized.documentation.length}`);

  try {
    await setCache(query, normalized);
    console.log(`[searchService] Cached result for query="${query}"`);
  } catch (err) {
    console.warn(`[searchService] Cache save failed:`, err instanceof Error ? err.message : String(err));
  }

  const durationMs = Date.now() - startTime;
  console.log(`[searchService] === END query="${query}" provider="${usedProviderName}" duration=${durationMs}ms ===`);

  return {
    response: normalized,
    metrics: {
      provider: errorChain.length > 0 ? 'Fallback' : usedProviderName === 'groq' ? 'Groq' : 'Ollama',
      cacheHit: false,
      durationMs,
      error: errorChain.length > 0 ? `Providers tried: ${errorChain.join(', ')}` : undefined,
    },
  };
}
