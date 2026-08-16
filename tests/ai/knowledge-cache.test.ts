import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { KnowledgeCache } from '../../src/lib/cache/knowledge-cache';
import type { NormalizedResponse } from '../../src/lib/ai/provider';

const TEST_CACHE_DIR = path.join(process.cwd(), '.cache', '__test__');
const CACHE_FILE = path.join(TEST_CACHE_DIR, 'results.json');

function cleanTestCache(): void {
  if (fs.existsSync(TEST_CACHE_DIR)) {
    try {
      fs.rmSync(TEST_CACHE_DIR, { recursive: true, force: true });
    } catch { /* ignore */ }
  }
}

beforeEach(() => {
  cleanTestCache();
});

function createTestCache(): KnowledgeCache {
  return new KnowledgeCache(TEST_CACHE_DIR);
}

describe('KnowledgeCache', () => {
  it('should store and retrieve responses from memory', () => {
    const cache = createTestCache();
    const response: NormalizedResponse = {
      profession: 'Frontend Developer',
      tools: [{ name: 'VS Code', url: 'https://code.visualstudio.com', explanation: 'Popular code editor' }],
      communities: [],
      learningPlatforms: [],
      documentation: [],
    };

    cache.set('frontend-developer', response);
    const retrieved = cache.get('frontend-developer');

    expect(retrieved).toEqual(response);
  });

  it('should return null for non-existent keys', () => {
    const cache = createTestCache();
    expect(cache.get('nonexistent')).toBeNull();
  });

  it('should generate consistent cache keys (lowercase, trimmed)', () => {
    const cache = createTestCache();
    const response: NormalizedResponse = {
      profession: 'Test',
      tools: [], communities: [], learningPlatforms: [], documentation: [],
    };

    cache.set('  Frontend Developer  ', response);
    expect(cache.get('frontend-developer')).not.toBeNull();
    expect(cache.get('Frontend Developer')).not.toBeNull();
    expect(cache.get('  frontend developer  ')).not.toBeNull();
  });

  it('should clear all cached entries', () => {
    const cache = createTestCache();
    const response: NormalizedResponse = {
      profession: 'Test',
      tools: [], communities: [], learningPlatforms: [], documentation: [],
    };

    cache.set('test-query', response);
    expect(cache.get('test-query')).not.toBeNull();

    cache.clear();
    expect(cache.get('test-query')).toBeNull();
  });

  it('should persist to file and reload from file', () => {
    const cache1 = createTestCache();
    const response: NormalizedResponse = {
      profession: 'Data Scientist',
      tools: [{ name: 'Jupyter', url: 'https://jupyter.org', explanation: 'Interactive computing' }],
      communities: [], learningPlatforms: [], documentation: [],
    };

    cache1.set('data-scientist', response);
    expect(cache1.get('data-scientist')).toEqual(response);

    const cache2 = createTestCache();
    const loaded = cache2.get('data-scientist');
    expect(loaded).not.toBeNull();
    if (loaded) {
      expect(loaded.profession).toBe('Data Scientist');
      expect(loaded.tools[0].name).toBe('Jupyter');
    }
  });

  it('should handle empty category arrays', () => {
    const cache = createTestCache();
    const response: NormalizedResponse = {
      profession: 'Empty Test',
      tools: [], communities: [], learningPlatforms: [], documentation: [],
    };

    cache.set('empty-test', response);
    const retrieved = cache.get('empty-test');

    expect(retrieved).toEqual(response);
    expect(retrieved?.tools).toHaveLength(0);
  });
});
