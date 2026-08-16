import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ProviderInterface, RawResponse, NormalizedResponse } from './provider';

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

export class GeminiProvider implements ProviderInterface {
  readonly name = 'Gemini';

  async search(query: string): Promise<RawResponse> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
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
  }
}
