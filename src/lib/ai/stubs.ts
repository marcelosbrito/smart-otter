import type { ProviderInterface, RawResponse } from './provider';

export class GroqProvider implements ProviderInterface {
  readonly name = 'Groq';

  async search(_query: string): Promise<RawResponse> {
    return { profession: '', categories: {} };
  }
}

export class OllamaProvider implements ProviderInterface {
  readonly name = 'Ollama';

  async search(_query: string): Promise<RawResponse> {
    return { profession: '', categories: {} };
  }
}
