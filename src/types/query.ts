
// API types for QueryContext
export interface Response {
  id: string;
  content: string;
  source: string;
  verified: boolean;
  timestamp: number;
  confidence: number;
}

export interface ApiKeys {
  openai?: string;
  anthropic?: string;
  anthropicClaude35?: string; // Kept for backward compatibility
  gemini?: string;
  geminiProExperimental?: string;
  perplexity?: string;
  deepseek?: string;
  grok?: string;
  qwen?: string;
  openrouter?: string;
  llama?: string;      // Added for consolidated Llama models access
  elevenlabs?: string; // Added for voice synthesis
}

export interface QueryContextType {
  query: string | null;
  responses: Response[];
  isLoading: boolean;
  submitQuery: (query: string) => void;
  setApiKey: (provider: string, key: string) => void;
  setWalletKey: (key: string) => void;
  privateKey: string | null;
  apiKeys: ApiKeys;
  consensusResponse: string | null;
  blockchainReference: string | null;
  attestationId: string | null;
  isRecordingOnChain: boolean;
  user: any;
  exportToGoogleDocs: () => Promise<void>;
}
