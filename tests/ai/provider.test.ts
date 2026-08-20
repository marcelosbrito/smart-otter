import { describe, it, expect } from 'vitest';
import { createProvider, GroqProvider, OllamaProvider } from '../../src/lib/ai/factory';
import type { ProviderInterface } from '../../src/lib/ai/provider';

describe('Provider Interface', () => {
  it('should define a valid GroqProvider contract', async () => {
    const provider = new GroqProvider();
    expect(provider).toHaveProperty('name');
    expect(typeof provider.name).toBe('string');
    expect(typeof provider.search).toBe('function');

    await expect(provider.search('test query')).rejects.toThrow(/GROQ_API_KEY is not set/i);
  });

  it('GroqProvider should return name "Groq"', () => {
    const provider = new GroqProvider();
    expect(provider.name).toBe('Groq');
  });

  it('OllamaProvider should return name "Ollama"', () => {
    const provider = new OllamaProvider();
    expect(provider.name).toBe('Ollama');
  });

  it('GroqProvider should throw when GROQ_API_KEY is not set', async () => {
    const groq = new GroqProvider();
    await expect(groq.search('any query')).rejects.toThrow(/GROQ_API_KEY is not set/i);
  });

  it('OllamaProvider should throw when OLLAMA_BASE_URL is unreachable', async () => {
    const ollama = new OllamaProvider();
    await expect(ollama.search('any query')).rejects.toThrow(/Failed to connect|Ollama API returned/i);
  });
});

describe('createProvider factory', () => {
  it('should create a GroqProvider for "groq"', () => {
    const provider = createProvider('groq');
    expect(provider).toBeInstanceOf(GroqProvider);
    if (provider) {
      expect(provider.name).toBe('Groq');
    }
  });

  it('should be case-insensitive', () => {
    const upper = createProvider('GROQ');
    const lower = createProvider('groq');
    expect(upper?.name).toBe(lower?.name);
  });

  it('should return null for unknown provider names', () => {
    expect(createProvider('unknown')).toBeNull();
    expect(createProvider('')).toBeNull();
    expect(createProvider('anthropic')).toBeNull();
  });

  it('GroqProvider and OllamaProvider should be instantiable and throw on search without env vars', async () => {
    const originalGrok = process.env.GROQ_API_KEY;
    const originalOllama = process.env.OLLAMA_BASE_URL;

    try {
      delete process.env.GROQ_API_KEY;
      delete process.env.OLLAMA_BASE_URL;

      const groq = createProvider('groq');
      const ollama = createProvider('ollama');

      if (groq) {
        expect(groq).toBeInstanceOf(GroqProvider);
        await expect(groq.search('test')).rejects.toThrow(/GROQ_API_KEY is not set/i);
      } else {
        throw new Error('Expected GroqProvider to be created');
      }

      if (ollama) {
        expect(ollama).toBeInstanceOf(OllamaProvider);
        await expect(ollama.search('test')).rejects.toThrow(/Failed to connect|Ollama API returned/i);
      } else {
        throw new Error('Expected OllamaProvider to be created');
      }
    } finally {
      process.env.GROQ_API_KEY = originalGrok;
      process.env.OLLAMA_BASE_URL = originalOllama;
    }
  });

  it('should return provider instances even without env vars (lazy validation)', () => {
    const originalGrok = process.env.GROQ_API_KEY;
    const originalOllama = process.env.OLLAMA_BASE_URL;

    try {
      delete process.env.GROQ_API_KEY;
      delete process.env.OLLAMA_BASE_URL;

      expect(createProvider('groq')).toBeInstanceOf(GroqProvider);
      expect(createProvider('ollama')).toBeInstanceOf(OllamaProvider);
    } finally {
      if (originalGrok) process.env.GROQ_API_KEY = originalGrok;
      if (originalOllama) process.env.OLLAMA_BASE_URL = originalOllama;
    }
  });
});
