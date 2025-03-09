
import React from 'react';
import { Response } from '../../types/query';
import ResponseGroup from './ResponseGroup';

interface DirectApiModelsProps {
  responses: Response[];
}

const DirectApiModels: React.FC<DirectApiModelsProps> = ({ responses }) => {
  if (responses.length === 0) return null;
  
  // Group Direct API models
  const directClaudeModels = responses.filter(r => r.source.includes('Claude') && !r.source.includes('OpenRouter'));
  const directGPTModels = responses.filter(r => r.source.includes('GPT'));
  const directGeminiModels = responses.filter(r => r.source.includes('Gemini') && !r.source.includes('OpenRouter'));
  const directPerplexityModels = responses.filter(r => r.source.includes('Perplexity') && !r.source.includes('Sonar'));
  const directDeepseekModels = responses.filter(r => r.source.includes('DeepSeek') && !r.source.includes('V2'));
  const directGrokModels = responses.filter(r => r.source.includes('Grok') && !r.source.includes('OpenRouter'));
  const directQwenModels = responses.filter(r => r.source.includes('Qwen') && !r.source.includes('OpenRouter'));
  
  const otherDirectModels = responses.filter(r => 
    !directClaudeModels.includes(r) && 
    !directGPTModels.includes(r) && 
    !directGeminiModels.includes(r) &&
    !directPerplexityModels.includes(r) &&
    !directDeepseekModels.includes(r) &&
    !directGrokModels.includes(r) &&
    !directQwenModels.includes(r)
  );
  
  return (
    <div>
      <h4 className="text-md font-medium mb-4 text-green-600">Direct API Models ({responses.length})</h4>
      
      <ResponseGroup title="Claude Models" responses={directClaudeModels} count={directClaudeModels.length} />
      <ResponseGroup title="GPT Models" responses={directGPTModels} count={directGPTModels.length} />
      <ResponseGroup title="Gemini Models" responses={directGeminiModels} count={directGeminiModels.length} />
      <ResponseGroup title="Perplexity Models" responses={directPerplexityModels} count={directPerplexityModels.length} />
      <ResponseGroup title="DeepSeek Models" responses={directDeepseekModels} count={directDeepseekModels.length} />
      <ResponseGroup title="Grok Models" responses={directGrokModels} count={directGrokModels.length} />
      <ResponseGroup title="Qwen Models" responses={directQwenModels} count={directQwenModels.length} />
      <ResponseGroup title="Other Models" responses={otherDirectModels} count={otherDirectModels.length} />
    </div>
  );
};

export default DirectApiModels;
