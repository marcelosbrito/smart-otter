import type { ProviderInterface, RawResponse } from './provider';
import { SYSTEM_PROMPT } from './prompt';

const OLLAMA_TIMEOUT_MS = 15000;

function parseJsonResponse(text: string): RawResponse {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Ollama provider returned malformed response — no JSON found');
  }
  try {
    return JSON.parse(jsonMatch[0]) as RawResponse;
  } catch {
    throw new Error('Ollama provider returned unparseable JSON');
  }
}

export class OllamaProvider implements ProviderInterface {
  readonly name = 'Ollama';

  async search(query: string): Promise<RawResponse> {
    const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    // Use OLLAMA_MODEL env var (e.g., llama3.2); falls back to llama3.2 for better quality.
    const model = process.env.OLLAMA_MODEL || 'llama3.2';

    let res: Response;
    try {
      res = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: query },
          ],
          stream: false,
          temperature: 0.3,
        }),
        signal: AbortSignal.timeout(OLLAMA_TIMEOUT_MS),
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new Error('Ollama provider timed out after 15 seconds.');
      }
      throw new Error(`Failed to connect to Ollama at ${baseUrl}: ${String(error)}`);
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Ollama API returned ${res.status}: ${text}`);
    }

    let data: any;
    try {
      data = await res.json();
    } catch {
      throw new Error('Ollama provider returned invalid JSON');
    }

    const text = data.message?.content || '';
    
    if (!text.trim()) {
      throw new Error('Ollama provider returned empty response');
    }

    console.log(`[OllamaProvider] Raw response (first 200 chars): "${text.slice(0, 200)}..."`);
    return parseJsonResponse(text);
  }
}
