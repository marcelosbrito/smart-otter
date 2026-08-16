import { describe, it, expect, vi } from 'vitest';
import type { RawResponse } from '../../src/lib/ai/provider';

describe('Search Service Integration', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should complete full pipeline: cache miss → provider call → normalization → cache store', async () => {
    const mockRawResponse: RawResponse = {
      profession: 'Frontend Developer',
      categories: {
        Tools: [{ name: 'VS Code', url: 'https://code.visualstudio.com', explanation: 'Industry standard editor' }],
        Communities: [{ name: 'r/webdev', url: 'https://reddit.com/r/webdev', explanation: 'Active web dev community' }],
        LearningPlatforms: [],
        Documentation: [],
      },
    };

    const createProviderMock = vi.fn().mockReturnValue({ name: 'Gemini', search: vi.fn().mockResolvedValue(mockRawResponse) });
    vi.doMock('../../src/lib/ai/factory', () => ({ createProvider: createProviderMock, GeminiProvider: class {}, GroqProvider: class {}, OllamaProvider: class {} }));

    const cacheModule = await vi.importActual('../../src/lib/cache/knowledge-cache');
    const { searchService } = await import('../../src/lib/ai/service');

    cacheModule.cache.clear();

    const result = await searchService('Frontend Developer', 'gemini');

    expect(createProviderMock).toHaveBeenCalledWith('gemini');
    expect(result.response).not.toBeNull();
    if (result.response) {
      expect(result.response.profession).toBe('Frontend Developer');
      expect(result.metrics.cacheHit).toBe(false);
      expect(result.metrics.provider).toBe('Gemini');
    }

    const secondResult = await searchService('Frontend Developer', 'gemini');
    expect(secondResult.metrics.cacheHit).toBe(true);
  });

  it('should handle unknown provider gracefully', async () => {
    vi.doMock('../../src/lib/ai/factory', () => ({ createProvider: () => null, GeminiProvider: class {}, GroqProvider: class {}, OllamaProvider: class {} }));

    const cacheModule = await vi.importActual('../../src/lib/cache/knowledge-cache');
    const { searchService } = await import('../../src/lib/ai/service');

    cacheModule.cache.clear();

    await expect(searchService('test query', 'nonexistent')).rejects.toThrow('Unknown AI provider: nonexistent');
  });

  it('should return normalized response when provider returns empty categories', async () => {
    vi.doMock('../../src/lib/ai/factory', () => ({ createProvider: () => ({ name: 'Gemini', search: vi.fn().mockResolvedValue({ profession: '', categories: {} }) }), GeminiProvider: class {}, GroqProvider: class {}, OllamaProvider: class {} }));

    const cacheModule = await vi.importActual('../../src/lib/cache/knowledge-cache');
    const { searchService } = await import('../../src/lib/ai/service');

    cacheModule.cache.clear();

    const result = await searchService('unknown domain', 'gemini');

    expect(result.response).not.toBeNull();
    if (result.response) {
      expect(result.response.tools).toHaveLength(0);
      expect(result.response.communities).toHaveLength(0);
      expect(result.response.learningPlatforms).toHaveLength(0);
      expect(result.response.documentation).toHaveLength(0);
    }
  });
});
