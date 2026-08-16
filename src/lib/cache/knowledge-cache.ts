import fs from 'fs';
import path from 'path';
import type { NormalizedResponse } from '../ai/provider';

const DEFAULT_CACHE_DIR = path.join(process.cwd(), '.cache');

export class KnowledgeCache {
  private memoryStore = new Map<string, NormalizedResponse>();
  private cacheFile: string;

  constructor(cacheDir?: string) {
    this.cacheFile = path.join(cacheDir || DEFAULT_CACHE_DIR, 'results.json');
    this.loadFromFile();
  }

  get(queryKey: string): NormalizedResponse | null {
    const key = generateCacheKey(queryKey);
    return this.memoryStore.get(key) ?? null;
  }

  set(queryKey: string, response: NormalizedResponse): void {
    const key = generateCacheKey(queryKey);
    this.memoryStore.set(key, response);
    this.saveToFile();
  }

  clear(): void {
    this.memoryStore.clear();
    if (fs.existsSync(this.cacheFile)) {
      fs.unlinkSync(this.cacheFile);
    }
  }

  getEntries(): Record<string, NormalizedResponse> {
    return Object.fromEntries(this.memoryStore.entries());
  }

  getSize(): number {
    return this.memoryStore.size;
  }

  private loadFromFile(): void {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const data = JSON.parse(fs.readFileSync(this.cacheFile, 'utf-8'));
        for (const [key, value] of Object.entries(data)) {
          this.memoryStore.set(key, value as NormalizedResponse);
        }
      }
    } catch {
      // Corrupted cache file — start fresh
    }
  }

  private saveToFile(): void {
    try {
      const dir = path.dirname(this.cacheFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const entries = Object.fromEntries(this.memoryStore.entries());
      fs.writeFileSync(this.cacheFile, JSON.stringify(entries, null, 2));
    } catch {
      // File persistence is optional — memory cache still works
    }
  }
}

function generateCacheKey(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, '-');
}

export const cache = new KnowledgeCache();
