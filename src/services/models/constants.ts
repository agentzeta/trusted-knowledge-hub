
// Available AI models with updated names to the most powerful free tier options
export const AI_SOURCES = [
  'GPT-4o', 
  'Claude 3 Haiku', 
  'Claude 3.5 Sonnet',
  'Gemini 1.5 Pro', 
  'Gemini 1.5 Flash',
  'Llama 3.1 70B', 
  'Grok-1.5', 
  'Perplexity Sonar', 
  'DeepSeek Coder',
  'Qwen2 72B'
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
};
