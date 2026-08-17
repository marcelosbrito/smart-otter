import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ProviderInterface, RawResponse } from './provider';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

const SYSTEM_PROMPT = `You are a resource discovery assistant. Given a profession or technical domain, return a curated list of resources grouped into these categories: Tools, Communities, Learning Platforms, Documentation.

For each resource, provide:
- name: The name of the resource
- url: A valid URL to the resource
- explanation: A brief (1-2 sentences) explanation of why this resource is recommended for professionals in this field

Return ONLY a valid JSON object matching this exact structure — no markdown, no code blocks, no explanations outside the JSON:
{
  "profession": "<the profession or domain>",
  "categories": {
    "Tools": [{"name": "...", "url": "...", "explanation": "..."}],
    "Communities": [{"name": "...", "url": "...", "explanation": "..."}],
    "LearningPlatforms": [{"name": "...", "url": "...", "explanation": "..."}],
    "Documentation": [{"name": "...", "url": "...", "explanation": "..."}]
  }
}

If a category has no relevant resources, include it with an empty array. Always return valid JSON.`;

const MODEL_FALLBACKS: Record<string, string[]> = {
  'gemini-flash-latest': ['gemini-2.0-flash'],
  'gemini-2.0-flash': ['gemini-flash-latest'],
};

const MAX_RETRIES = 3;
const BASE_DELAY = 1000;
const MIN_JITTER = 100;
const MAX_JITTER = 500;

function getFallbackModels(primary: string): string[] {
  return MODEL_FALLBACKS[primary] || [];
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isGeminiRetryableError(error: unknown): boolean {
  const msg = String(error);
  if (error instanceof Error) {
    if (msg.includes('503') || msg.includes('Service Unavailable')) return true;
    if (msg.includes('upstream server overload') || msg.includes('server overload')) return true;
    const statusMatch = error.message.match(/(?:status|code)[=:]\s*5\d{2}/i);
    if (statusMatch && !error.message.match(/4[0-9]{3}/)) {
      return ['429', '500', '502', '503', '504'].some(code => error.message.includes(code));
    }
  }
  return false;
}

function isModelNotFoundError(error: unknown): boolean {
  const msg = String(error);
  if (error instanceof Error) {
    if (msg.includes('404') && (msg.includes('Not Found') || msg.includes('is not found'))) return true;
    if (msg.includes('is not supported for generateContent')) return true;
    if (msg.includes('Call ModelService.ListModels')) return true;
  }
  return false;
}

export class GeminiProvider implements ProviderInterface {
  readonly name = 'Gemini';

  async search(query: string): Promise<RawResponse> {
    const primaryModel = process.env.GEMINI_MODEL || 'gemini-flash-latest';
    const modelNames = [primaryModel, ...getFallbackModels(primaryModel)];

    for (let attempt = 0; attempt < MAX_RETRIES + 1; attempt++) {
      if (attempt >= modelNames.length) break;
      const modelName = modelNames[attempt];

      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(`${SYSTEM_PROMPT}\n\nProfession or domain: ${query}`);
        const response = result.response;
        const text = response.candidates?.[0]?.content?.parts?.[0]?.toString() || '';

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Gemini provider returned malformed response — no JSON found');
        }

        try {
          return JSON.parse(jsonMatch[0]) as RawResponse;
        } catch {
          throw new Error('Gemini provider returned unparseable JSON');
        }
      } catch (error) {
        if (isModelNotFoundError(error)) {
          console.warn(`[GeminiProvider] Model ${modelName} not found or unsupported, skipping to next fallback...`);
          continue;
        }

        if (!isGeminiRetryableError(error)) {
          throw error;
        }

        const isLastFallback = attempt >= modelNames.length - 1;

        if (isLastFallback) {
          console.error(
            `[GeminiProvider] All retries exhausted. Primary: ${primaryModel}, Fallbacks exhausted after ${attempt + 1} attempts.`
          );
          throw new Error(
            'The AI service is currently experiencing high demand. Please try again in a few moments.'
          );
        }

        const delay = BASE_DELAY * Math.pow(2, attempt) + MIN_JITTER + Math.random() * (MAX_JITTER - MIN_JITTER);
        console.log(`[GeminiProvider] Error on ${modelName}, retrying in ~${Math.round(delay)}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`);
        await sleep(delay);
      }
    }

    throw new Error('The AI service is currently experiencing high demand. Please try again in a few moments.');
  }
}
