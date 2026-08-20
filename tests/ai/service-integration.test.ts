import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { RawResponse } from '../../src/lib/ai/provider';

describe('Search Service Integration', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.GROQ_API_KEY = undefined;
    process.env.OLLAMA_BASE_URL = undefined;
  });

  it('should complete full pipeline: cache miss → Groq provider call → normalization → cache store', async () => {
    const mockRawResponse: RawResponse = {
      profession: 'Frontend Developer',
      categories: {
        Tools: [{ name: 'VS Code', url: 'https://code.visualstudio.com', explanation: 'Industry standard editor' }],
        Communities: [{ name: 'r/webdev', url: 'https://reddit.com/r/webdev', explanation: 'Active web dev community' }],
        LearningPlatforms: [],
        Documentation: [],
      },
    };

    const createProviderMock = vi.fn().mockImplementation((name) => {
      if (name === 'groq') {
        return { name: 'Groq', search: vi.fn().mockResolvedValue(mockRawResponse) };
      }
      return null;
    });
    vi.doMock('../../src/lib/ai/factory', () => ({ createProvider: createProviderMock, GroqProvider: class {}, OllamaProvider: class {} }));

    const cacheModule = await vi.importActual('../../src/lib/cache/knowledge-cache') as any;
    const { searchService } = await import('../../src/lib/ai/service');

    cacheModule.cache.clear();

    const result = await searchService('Frontend Developer', 'groq');

    expect(createProviderMock).toHaveBeenCalledWith('groq');
    expect(result.response).not.toBeNull();
    if (result.response) {
      expect(result.response.profession).toBe('Frontend Developer');
      expect(result.metrics.cacheHit).toBe(false);
      expect(result.metrics.provider).toBe('Groq');
    }

    const secondResult = await searchService('Frontend Developer', 'groq');
    expect(secondResult.metrics.cacheHit).toBe(true);
  });

  it('should handle all providers unavailable and fall back to cache', async () => {
    vi.doMock('../../src/lib/ai/factory', () => ({ createProvider: () => null, GroqProvider: class {}, OllamaProvider: class {} }));

    const cacheModule = await vi.importActual('../../src/lib/cache/knowledge-cache') as any;
    const { searchService } = await import('../../src/lib/ai/service');

    cacheModule.cache.clear();

    // Set a cached value first
    const mockCached: RawResponse = { profession: 'Test', categories: {} };
    (cacheModule.cache as any).set('cached query', mockCached);

    const result = await searchService('cached query', 'groq');

    expect(result.response).not.toBeNull();
    if (result.response) {
      expect(result.metrics.cacheHit).toBe(true);
      expect(result.metrics.provider).toBe('Cache');
    }
  });

  it('should throw when all providers fail and no cache exists', async () => {
    vi.doMock('../../src/lib/ai/factory', () => ({ createProvider: () => null, GroqProvider: class {}, OllamaProvider: class {} }));

    const cacheModule = await vi.importActual('../../src/lib/cache/knowledge-cache') as any;
    const { searchService } = await import('../../src/lib/ai/service');

    cacheModule.cache.clear();

    await expect(searchService('no providers available')).rejects.toThrow(/Search failed after trying all providers/i);
  });

  it('should return normalized response when provider returns empty categories', async () => {
    const createProviderMock = vi.fn().mockImplementation((name) => {
      if (name === 'groq') {
        return { name: 'Groq', search: vi.fn().mockResolvedValue({ profession: '', categories: {} }) };
      }
      return null;
    });
    vi.doMock('../../src/lib/ai/factory', () => ({ createProvider: createProviderMock, GroqProvider: class {}, OllamaProvider: class {} }));

    const cacheModule = await vi.importActual('../../src/lib/cache/knowledge-cache') as any;
    const { searchService } = await import('../../src/lib/ai/service');

    cacheModule.cache.clear();

    const result = await searchService('unknown domain', 'groq');

    expect(result.response).not.toBeNull();
    if (result.response) {
      expect(result.response.tools).toHaveLength(0);
      expect(result.response.communities).toHaveLength(0);
      expect(result.response.learningPlatforms).toHaveLength(0);
      expect(result.response.documentation).toHaveLength(0);
    }
  });

  it('should use Ollama as fallback when Groq fails', async () => {
    const ollamaSearchMock = vi.fn().mockResolvedValue({ profession: 'Game Developer', categories: {} });
    const createProviderMock = vi.fn().mockImplementation((name) => {
      if (name === 'groq') {
        return { name: 'Groq', search: vi.fn().mockRejectedValue(new Error('Rate limited')) };
      }
      if (name === 'ollama') {
        return { name: 'Ollama', search: ollamaSearchMock };
      }
      return null;
    });
    vi.doMock('../../src/lib/ai/factory', () => ({ createProvider: createProviderMock, GroqProvider: class {}, OllamaProvider: class {} }));

    const cacheModule = await vi.importActual('../../src/lib/cache/knowledge-cache') as any;
    const { searchService } = await import('../../src/lib/ai/service');

    cacheModule.cache.clear();

    process.env.GROQ_API_KEY = 'test-key';
    process.env.OLLAMA_BASE_URL = 'http://localhost:9000';

    const result = await searchService('Game Developer', 'groq');

    expect(result.response).not.toBeNull();
    if (result.response) {
      expect(ollamaSearchMock).toHaveBeenCalled();
      expect(result.metrics.provider).toBe('Fallback');
    }
  });

  it('should report correct provider and error chain in metrics when fallback activates', async () => {
    const ollamaSearchMock = vi.fn().mockResolvedValue({ profession: 'Data Engineer', categories: {} });
    const createProviderMock = vi.fn().mockImplementation((name) => {
      if (name === 'groq') {
        return { name: 'Groq', search: vi.fn().mockRejectedValue(new Error('Rate limited')) };
      }
      if (name === 'ollama') {
        return { name: 'Ollama', search: ollamaSearchMock };
      }
      return null;
    });
    vi.doMock('../../src/lib/ai/factory', () => ({ createProvider: createProviderMock, GroqProvider: class {}, OllamaProvider: class {} }));

    const cacheModule = await vi.importActual('../../src/lib/cache/knowledge-cache') as any;
    const { searchService } = await import('../../src/lib/ai/service');

    cacheModule.cache.clear();

    process.env.GROQ_API_KEY = 'test-key';
    process.env.OLLAMA_BASE_URL = 'http://localhost:9000';

    const result = await searchService('Data Engineer', 'groq');

    expect(result.response).not.toBeNull();
    if (result.response) {
      expect(ollamaSearchMock).toHaveBeenCalledOnce();
      expect(result.metrics.provider).toBe('Fallback');
      expect(result.metrics.cacheHit).toBe(false);
      expect(result.metrics.durationMs).toBeGreaterThanOrEqual(0);
      expect(result.metrics.error).toBeDefined();
      expect(result.metrics.error).toContain('Providers tried: Groq: Rate limited');
    }
  });

  it('should report correct metrics when primary provider succeeds on first attempt', async () => {
    const mockRawResponse: RawResponse = {
      profession: 'Frontend Developer',
      categories: {
        Tools: [{ name: 'VS Code', url: 'https://code.visualstudio.com', explanation: 'Industry standard editor' }],
        Communities: [],
        LearningPlatforms: [],
        Documentation: [],
      },
    };

    const createProviderMock = vi.fn().mockImplementation((name) => {
      if (name === 'groq') {
        return { name: 'Groq', search: vi.fn().mockResolvedValue(mockRawResponse) };
      }
      return null;
    });
    vi.doMock('../../src/lib/ai/factory', () => ({ createProvider: createProviderMock, GroqProvider: class {}, OllamaProvider: class {} }));

    const cacheModule = await vi.importActual('../../src/lib/cache/knowledge-cache') as any;
    const { searchService } = await import('../../src/lib/ai/service');

    cacheModule.cache.clear();

    const result = await searchService('Frontend Developer', 'groq');

    expect(result.response).not.toBeNull();
    if (result.response) {
      expect(createProviderMock).toHaveBeenCalledWith('groq');
      expect(result.metrics.provider).toBe('Groq');
      expect(result.metrics.cacheHit).toBe(false);
      expect(result.metrics.durationMs).toBeGreaterThanOrEqual(0);
      expect(result.metrics.error).toBeUndefined();
    }
  });
});
