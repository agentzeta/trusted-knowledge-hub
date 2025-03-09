
export interface ResponseMediaType {
  type: 'image' | 'audio' | 'video';
  url: string;
  alt?: string;
}

export interface Response {
  id: string;
  content: string;
  source: string;
  verified: boolean;
  confidence: number;
  timestamp: number;
  media?: ResponseMediaType[];
}

export interface ApiKeys {
  openai: string;
  anthropic: string;
  anthropicClaude35: string;
  gemini: string;
  geminiProExperimental: string;
  perplexity: string;
  deepseek: string;
  grok: string;
  qwen: string;
  openrouter: string;
  llama: string;
  elevenlabs: string;
  [key: string]: string;
}

export interface ModelSource {
  id: string;
  name: string;
  isAvailable: boolean;
  apiKeyName: keyof ApiKeys;
}

export interface QueryContextType {
  query: string | null;
  responses: Response[];
  isLoading: boolean;
  consensusResponse: string | null;
  submitQuery: (queryText: string) => Promise<void>;
  cancelQuery: () => void;
  setApiKey: (key: keyof ApiKeys, value: string) => void;
  setWalletKey: (value: string) => void;
  privateKey: string | null;
  apiKeys: ApiKeys;
  blockchainReference: string | null;
  attestationId: string | null;
  isRecordingOnChain: boolean;
  user: any;
  exportToGoogleDocs: () => Promise<void>;
}
