
import React from 'react';
import { Response } from '../../types/query';
import ResponseGroup from './ResponseGroup';

interface OpenRouterModelsProps {
  responses: Response[];
}

const OpenRouterModels: React.FC<OpenRouterModelsProps> = ({ responses }) => {
  if (responses.length === 0) return null;
  
  // Group OpenRouter models
  const claudeModels = responses.filter(r => r.source.includes('Claude'));
  const geminiModels = responses.filter(r => r.source.includes('Gemini'));
  const llamaModels = responses.filter(r => r.source.includes('Llama'));
  const mistralModels = responses.filter(r => r.source.includes('Mistral'));
  const deepseekModels = responses.filter(r => r.source.includes('DeepSeek'));
  const cohereModels = responses.filter(r => r.source.includes('Cohere'));
  const perplexityModels = responses.filter(r => r.source.includes('Perplexity'));
  const grokModels = responses.filter(r => r.source.includes('Grok'));
  const qwenModels = responses.filter(r => r.source.includes('Qwen'));
  const kimiModels = responses.filter(r => r.source.includes('Kimi'));
  const o3MiniModels = responses.filter(r => r.source.includes('O3 Mini'));
  const openChatModels = responses.filter(r => r.source.includes('OpenChat'));
  
  return (
    <div className="mb-6">
      <h4 className="text-md font-medium text-blue-600 mb-4">
        OpenRouter Models ({responses.length})
      </h4>
      
      <ResponseGroup title="Claude Models" responses={claudeModels} count={claudeModels.length} />
      <ResponseGroup title="Gemini Models" responses={geminiModels} count={geminiModels.length} />
      <ResponseGroup title="Llama Models" responses={llamaModels} count={llamaModels.length} />
      <ResponseGroup title="Mistral Models" responses={mistralModels} count={mistralModels.length} />
      <ResponseGroup title="DeepSeek Models" responses={deepseekModels} count={deepseekModels.length} />
      <ResponseGroup title="Cohere Models" responses={cohereModels} count={cohereModels.length} />
      <ResponseGroup title="Perplexity Models" responses={perplexityModels} count={perplexityModels.length} />
      <ResponseGroup title="Grok Models" responses={grokModels} count={grokModels.length} />
      <ResponseGroup title="Qwen Models" responses={qwenModels} count={qwenModels.length} />
      <ResponseGroup title="Kimi Models" responses={kimiModels} count={kimiModels.length} />
      <ResponseGroup title="O3 Mini Models" responses={o3MiniModels} count={o3MiniModels.length} />
      <ResponseGroup title="OpenChat Models" responses={openChatModels} count={openChatModels.length} />
    </div>
  );
};

export default OpenRouterModels;
