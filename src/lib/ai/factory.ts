import { GeminiProvider } from './gemini-provider';
import { GroqProvider, OllamaProvider } from './stubs';
import type { ProviderInterface } from './provider';

const providers: Record<string, new () => ProviderInterface> = {
  gemini: GeminiProvider,
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

export { GeminiProvider, GroqProvider, OllamaProvider };
