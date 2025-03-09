
import { OPENROUTER_MODEL_IDS } from '../constants';
import { OpenRouterModel } from './types';

// Define accurate OpenRouter model IDs with display names
export const OPENROUTER_MODELS: OpenRouterModel[] = [
  // Anthropic Models
  { id: OPENROUTER_MODEL_IDS.CLAUDE_OPUS, displayName: 'Claude 3.7 Opus' },
  { id: OPENROUTER_MODEL_IDS.CLAUDE_SONNET, displayName: 'Claude 3.5 Sonnet' },
  { id: OPENROUTER_MODEL_IDS.CLAUDE_HAIKU, displayName: 'Claude 3 Haiku' },
  
  // Google Models
  { id: OPENROUTER_MODEL_IDS.GEMINI_PRO, displayName: 'Gemini 1.5 Pro' },
  { id: OPENROUTER_MODEL_IDS.GEMINI_FLASH, displayName: 'Gemini 1.5 Flash' },
  
  // Meta Models
  { id: OPENROUTER_MODEL_IDS.LLAMA_70B, displayName: 'Llama 3.1 70B' },
  { id: OPENROUTER_MODEL_IDS.LLAMA_8B, displayName: 'Llama 3 8B' },
  
  // xAI Models
  { id: OPENROUTER_MODEL_IDS.GROK_1_5, displayName: 'Grok-1.5' },
  
  // DeepSeek Models
  { id: OPENROUTER_MODEL_IDS.DEEPSEEK_V2, displayName: 'DeepSeek V2' },
  { id: OPENROUTER_MODEL_IDS.DEEPSEEK_CODER, displayName: 'DeepSeek Coder' },
  
  // Alibaba Models
  { id: OPENROUTER_MODEL_IDS.QWEN_72B, displayName: 'Qwen2 72B' },
  
  // Perplexity Models
  { id: OPENROUTER_MODEL_IDS.PERPLEXITY_SONAR, displayName: 'Perplexity Sonar' },
  
  // Cohere Models
  { id: OPENROUTER_MODEL_IDS.COHERE_COMMAND, displayName: 'Cohere Command-R+' },
  
  // Mistral Models
  { id: OPENROUTER_MODEL_IDS.MISTRAL_LARGE, displayName: 'Mistral Large' },
  
  // Specialized/Finetuned Models
  { id: OPENROUTER_MODEL_IDS.CLAUDE_3_5_SONNET_MEDICINE, displayName: 'Claude 3.5 Medical' },
  { id: OPENROUTER_MODEL_IDS.LLAMA_3_8B_INSTRUCT_RL, displayName: 'Llama 3 8B (RL-Optimized)' },
  { id: OPENROUTER_MODEL_IDS.OPENCHAT_35, displayName: 'OpenChat 3.5' }
];
