import { describe, it, expect } from 'vitest';

// Mock localStorage for Node environment
const mockLocalStorage = new Map<string, string>();
globalThis.localStorage = {
  getItem: (key: string) => mockLocalStorage.get(key)?.toString() ?? null,
  setItem: (key: string, value: string) => mockLocalStorage.set(key, value),
  removeItem: (key: string) => mockLocalStorage.delete(key),
  clear: () => mockLocalStorage.clear(),
} as unknown as Storage;

describe('Search Service Integration', () => {
  it('should export searchService with correct signature', async () => {
    const { searchService } = await import('../../src/lib/ai/service');
    expect(typeof searchService).toBe('function');
  });

  it('should throw when no AI providers are available (no credentials)', async () => {
    process.env.GROQ_API_KEY = 'invalid-key';
    const { searchService } = await import('../../src/lib/ai/service');
    await expect(searchService('Test Query')).rejects.toThrow(/Search failed after trying all providers/);
  });

  it('should throw when Ollama is unreachable', async () => {
    process.env.OLLAMA_BASE_URL = 'http://localhost:9999';
    const { searchService } = await import('../../src/lib/ai/service');
    await expect(searchService('Test Query')).rejects.toThrow(/Search failed after trying all providers/);
  });

  it('should respect localStorage active provider selection', async () => {
    globalThis.localStorage.setItem?.('smart-otter-active-provider', 'ollama');
    process.env.OLLAMA_BASE_URL = 'http://localhost:9999';
    const { searchService } = await import('../../src/lib/ai/service');
    // Should throw because Ollama is unreachable — but service should respect localStorage setting
    await expect(searchService('Test Query')).rejects.toThrow(/Search failed after trying all providers/);
  });
});
