import { describe, it, expect } from 'vitest';
import { createProvider, GroqProvider, OllamaProvider } from '../../src/lib/ai/factory';
import { GeminiProvider } from '../../src/lib/ai/gemini-provider';
import type { ProviderInterface, RawResponse } from '../../src/lib/ai/provider';

describe('Provider Interface', () => {
  it('should define a valid ProviderInterface contract', async () => {
    const provider = new GroqProvider();
    expect(provider).toHaveProperty('name');
    expect(typeof provider.name).toBe('string');
    expect(typeof provider.search).toBe('function');

    const result = await provider.search('test query');
    expect(result).toBeDefined();
    expect(result).toHaveProperty('profession');
    expect(result).toHaveProperty('categories');
  });

  it('GroqProvider should return name "Groq"', () => {
    const provider = new GroqProvider();
    expect(provider.name).toBe('Groq');
  });

  it('OllamaProvider should return name "Ollama"', () => {
    const provider = new OllamaProvider();
    expect(provider.name).toBe('Ollama');
  });

  it('stub providers should return empty RawResponse', async () => {
    const groq = new GroqProvider();
    const ollama = new OllamaProvider();

    const groqResult = await groq.search('any query');
    expect(groqResult.profession).toBe('');
    expect(Object.keys(groqResult.categories)).toHaveLength(0);

    const ollamaResult = await ollama.search('any query');
    expect(ollamaResult.profession).toBe('');
    expect(Object.keys(ollamaResult.categories)).toHaveLength(0);
  });
});

describe('createProvider factory', () => {
  it('should create a GeminiProvider for "gemini"', () => {
    const provider = createProvider('gemini');
    expect(provider).toBeInstanceOf(GeminiProvider);
    if (provider) {
      expect(provider.name).toBe('Gemini');
    }
  });

  it('should be case-insensitive', () => {
    const upper = createProvider('GEMINI');
    const lower = createProvider('gemini');
    expect(upper?.name).toBe(lower?.name);
  });

  it('should return null for unknown provider names', () => {
    expect(createProvider('unknown')).toBeNull();
    expect(createProvider('')).toBeNull();
    expect(createProvider('anthropic')).toBeNull();
  });

  it('GroqProvider and OllamaProvider should implement ProviderInterface', async () => {
    const groq = createProvider('groq');
    const ollama = createProvider('ollama');

    if (groq && ollama) {
      expect(groq).toBeInstanceOf(GroqProvider);
      expect(ollama).toBeInstanceOf(OllamaProvider);

      const groqResult: RawResponse = await groq.search('test');
      expect(groqResult.profession).toBeDefined();
      expect(groqResult.categories).toBeDefined();

      const ollamaResult: RawResponse = await ollama.search('test');
      expect(ollamaResult.profession).toBeDefined();
      expect(ollamaResult.categories).toBeDefined();
    }
  });
});
