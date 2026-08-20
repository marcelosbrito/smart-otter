import { GroqProvider } from './groq-provider';
import { OllamaProvider } from './ollama-provider';
import type { ProviderInterface } from './provider';

const providers: Record<string, new () => ProviderInterface> = {
  groq: GroqProvider,
  ollama: OllamaProvider,
};

export function createProvider(name: string): ProviderInterface | null {
  const ProviderClass = providers[name.toLowerCase()];
  if (!ProviderClass) {
    return null;
  }
  try {
    return new ProviderClass();
  } catch {
    return null;
  }
}

export { GroqProvider, OllamaProvider };
