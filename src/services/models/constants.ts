
// Available AI models with updated names to the most powerful free tier options
export const AI_SOURCES = [
  'GPT-4o', 
  'Claude 3 Haiku', 
  'Claude 3.5 Sonnet',
  'Claude 3.7 Opus',
  'Gemini 1.5 Pro', 
  'Gemini 1.5 Flash',
  'Llama 3.1 70B', 
  'Llama 3 8B',
  'Grok-1.5', 
  'Perplexity Sonar', 
  'DeepSeek Coder',
  'Qwen2 72B',
  'OpenRouter' // Added OpenRouter as a source
];

// Default API keys
export const DEFAULT_API_KEYS = {
  openai: import.meta.env.VITE_OPENAI_API_KEY || '',
  anthropic: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
  anthropicClaude35: import.meta.env.VITE_ANTHROPIC_CLAUDE35_API_KEY || '',
  gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
  geminiProExperimental: import.meta.env.VITE_GEMINI_PRO_EXP_API_KEY || '',
  perplexity: import.meta.env.VITE_PERPLEXITY_API_KEY || '',
  deepseek: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
  grok: import.meta.env.VITE_GROK_API_KEY || '',
  qwen: import.meta.env.VITE_QWEN_API_KEY || '',
  openrouter: import.meta.env.VITE_OPENROUTER_API_KEY || '', // Added OpenRouter API key
  llama: import.meta.env.VITE_LLAMA_API_KEY || '',
  elevenlabs: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
};

// OpenRouter model IDs - expanded with more models
export const OPENROUTER_MODEL_IDS = {
  // Anthropic Models
  CLAUDE_OPUS: 'anthropic/claude-3-opus:20240229',
  CLAUDE_SONNET: 'anthropic/claude-3-sonnet:20240229',
  CLAUDE_HAIKU: 'anthropic/claude-3-haiku:20240307',
  
  // Google Models
  GEMINI_PRO: 'google/gemini-1.5-pro',
  GEMINI_FLASH: 'google/gemini-1.5-flash',
  
  // Meta Models
  LLAMA_70B: 'meta-llama/llama-3-70b-instruct',
  LLAMA_8B: 'meta-llama/llama-3-8b-instruct',
  
  // xAI Models
  GROK_1: 'xai/grok-1',
  GROK_1_5: 'xai/grok-1.5',
  
  // Mistral Models
  MISTRAL_LARGE: 'mistralai/mistral-large-2402',
  MISTRAL_MEDIUM: 'mistralai/mistral-medium-2312',
  MISTRAL_SMALL: 'mistralai/mistral-small-2402',
  
  // DeepSeek Models
  DEEPSEEK_V2: 'deepseek-ai/deepseek-v2',
  DEEPSEEK_CODER: 'deepseek-ai/deepseek-coder-v2',
  
  // Alibaba Models
  QWEN_72B: 'qwen/qwen2-72b-instruct',
  QWEN_7B: 'qwen/qwen2-7b-instruct',
  
  // Perplexity Models
  PERPLEXITY_SONAR: 'perplexity/sonar-small-online',
  PERPLEXITY_SONAR_LARGE: 'perplexity/sonar-medium-online',
  
  // Cohere Models
  COHERE_COMMAND: 'cohere/command-r-plus',
  
  // Specialized/Finetuned Models
  CLAUDE_3_5_SONNET_MEDICINE: 'anthropic/claude-3-5-sonnet-20240620:medicine', // Medical specialty
  LLAMA_3_8B_INSTRUCT_RL: 'meta-llama/llama-3-8b-instruct:nitro', // RL-optimized
  OPENCHAT_35: 'openchat/openchat-3.5' // Strong open source model
};
