import { cache } from '../cache/knowledge-cache';
import { createProvider } from './factory';
import { getKnowledgeBaseResponse } from './knowledge-base';
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
  providerName = 'gemini'
): Promise<{ response: NormalizedResponse | null; metrics: SearchMetrics }> {
  const startTime = Date.now();

  try {
    const cached = cache.get(query);
    if (cached) {
      return { response: cached, metrics: { provider: providerName, cacheHit: true, durationMs: Date.now() - startTime } };
    }

    const provider = createProvider(providerName);
    if (!provider) {
      throw new Error(`Unknown AI provider: ${providerName}`);
    }

    try {
      const rawResponse = await provider.search(query);
      const normalized = normalizeRawResponse(rawResponse);
      cache.set(query, normalized);
      return {
        response: normalized,
        metrics: { provider: provider.name, cacheHit: false, durationMs: Date.now() - startTime },
      };
    } catch (err) {
      const lastError = err instanceof Error ? err : new Error(String(err));

      const kbResponse = getKnowledgeBaseResponse(query);
      if (kbResponse) {
        const normalized = normalizeRawResponse(kbResponse);
        cache.set(query, normalized);
        return {
          response: normalized,
          metrics: { provider: 'knowledge-base', cacheHit: false, durationMs: Date.now() - startTime, error: `AI unavailable — fallback to knowledge base` },
        };
      }

      const cachedFallback = cache.get(query);
      if (cachedFallback) {
        return { response: cachedFallback, metrics: { provider: providerName, cacheHit: true, durationMs: Date.now() - startTime, error: lastError.message } };
      }

      throw new Error(`Search failed: ${lastError.message}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unknown AI provider')) {
      throw error;
    }
    const cachedFallback = cache.get(query);
    if (cachedFallback) {
      return { response: cachedFallback, metrics: { provider: providerName, cacheHit: true, durationMs: Date.now() - startTime, error: 'Provider failed, served from cache' } };
    }
    throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
