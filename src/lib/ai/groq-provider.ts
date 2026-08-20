import { Groq } from 'groq-sdk';
import type { ProviderInterface, RawResponse } from './provider';
import { SYSTEM_PROMPT } from './prompt';

const MAX_RETRIES = 3;
const BASE_DELAY = 1000;
const MIN_JITTER = 100;
const MAX_JITTER = 500;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isGroqRetryableError(error: unknown): boolean {
  const msg = String(error);
  if (error instanceof Error) {
    if (msg.includes('429') || msg.includes('rate limit')) return true;
    if (msg.includes('503') || msg.includes('Service Unavailable')) return true;
    if (msg.includes('upstream server overload') || msg.includes('server overload')) return true;
  }
  const statusMatch = error instanceof Error && error.message?.match(/(?:status|code)[=:]\s*5\d{2}/i);
  return !!statusMatch;
}

function parseJsonResponse(text: string): RawResponse {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Groq provider returned malformed response — no JSON found');
  }
  try {
    return JSON.parse(jsonMatch[0]) as RawResponse;
  } catch {
    throw new Error('Groq provider returned unparseable JSON');
  }
}

export class GroqProvider implements ProviderInterface {
  readonly name = 'Groq';

  async search(query: string): Promise<RawResponse> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not set');
    }

    const groq = new Groq({ apiKey });
    const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: query },
          ],
          model,
          temperature: 0.1,
        });

        const text = completion.choices?.[0]?.message?.content || '';
        return parseJsonResponse(text);
      } catch (error) {
        if (!isGroqRetryableError(error)) {
          throw error;
        }

        if (attempt === MAX_RETRIES - 1) {
          console.error(`[GroqProvider] All retries exhausted after ${MAX_RETRIES} attempts.`);
          throw new Error('The AI service is currently experiencing high demand. Please try again in a few moments.');
        }

        const delay = BASE_DELAY * Math.pow(2, attempt) + MIN_JITTER + Math.random() * (MAX_JITTER - MIN_JITTER);
        console.log(`[GroqProvider] Rate limit or server error on attempt ${attempt + 1}, retrying in ~${Math.round(delay)}ms...`);
        await sleep(delay);
      }
    }

    throw new Error('The AI service is currently experiencing high demand. Please try again in a few moments.');
  }
}
