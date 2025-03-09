
export interface ApiKeys {
  openai?: string;
  anthropic?: string;
  anthropicClaude35?: string;
  gemini?: string;
  geminiProExperimental?: string;
  perplexity?: string;
  openrouter?: string;
  deepseek?: string;
  grok?: string;
  qwen?: string;
  llama?: string;
}

export interface Response {
  id: string;
  source: string;
  content: string;
  confidence: number;
  timestamp: number;
  verified?: boolean;
}

export interface QueryContextType {
  query: string | null;
  responses: Response[];
  isLoading: boolean;
  consensusResponse: string | null;
  submitQuery: (queryText: string) => void;
  cancelQuery: () => void;
  setApiKey: (keyType: keyof ApiKeys, value: string) => void;
  setWalletKey: (privateKey: string) => void;
  privateKey: string | null;
  apiKeys: ApiKeys;
  blockchainReference: string | null;
  attestationId: string | null;
  isRecordingOnChain: boolean;
  recordResponseOnBlockchain: (
    privateKey: string | null,
    userId: string | null, 
    queryText: string, 
    consensusResponse: string, 
    responses: Response[]
  ) => Promise<any>;
  user: any;
  exportToGoogleDocs: () => Promise<void>;
}
