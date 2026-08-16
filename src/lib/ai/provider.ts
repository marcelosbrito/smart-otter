export interface Resource {
  name: string;
  url: string;
  explanation: string;
}

export interface RawResponse {
  profession: string;
  categories: Record<string, Resource[]>;
}

export interface NormalizedResponse {
  profession: string;
  tools: Resource[];
  communities: Resource[];
  learningPlatforms: Resource[];
  documentation: Resource[];
}

export interface ProviderInterface {
  name: string;
  search(query: string): Promise<RawResponse>;
}
