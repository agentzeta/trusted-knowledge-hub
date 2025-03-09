
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
