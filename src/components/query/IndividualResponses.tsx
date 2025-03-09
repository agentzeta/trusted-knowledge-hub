import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Response } from '../../types/query';

interface IndividualResponsesProps {
  responses: Response[];
}

const IndividualResponses: React.FC<IndividualResponsesProps> = ({ responses }) => {
  useEffect(() => {
    console.log('IndividualResponses MOUNT with:', {
      count: responses.length, 
      sources: responses.map(r => r.source).join(', '),
      responseIds: responses.map(r => r.id)
    });
    
    // Log each response in detail
    responses.forEach((response, index) => {
      console.log(`Response #${index + 1} from ${response.source}:`, {
        id: response.id,
        contentLength: response.content.length,
        contentPreview: response.content.substring(0, 50) + '...',
        verified: response.verified,
        timestamp: response.timestamp
      });
    });
    
    return () => {
      console.log('IndividualResponses UNMOUNT');
    };
  }, [responses]);
  
  // Additional log on every render
  console.log('IndividualResponses RENDER with responses:', responses.length);
  
  if (responses.length === 0) {
    console.log('No responses to display in IndividualResponses');
    return null;
  }
  
  // Sort responses alphabetically by source name for consistent display
  const sortedResponses = [...responses].sort((a, b) => a.source.localeCompare(b.source));
  
  // Helper function to render a single response
  const renderSingleResponse = (response: Response) => (
    <div 
      key={response.id} 
      className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow mb-4"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="font-medium">{response.source}</span>
        <span className={response.verified ? 
          "text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100" : 
          "text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100"}>
          {response.verified ? 'Verified' : 'Divergent'}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{response.content}</p>
    </div>
  );
  
  // Group responses by category
  const claudeResponses = sortedResponses.filter(r => r.source.includes('Claude'));
  const gpt4Responses = sortedResponses.filter(r => r.source.includes('GPT-4'));
  const geminiResponses = sortedResponses.filter(r => (
    r.source.includes('Gemini') && !r.source.includes('OpenRouter')
  ));
  
  // OpenRouter specific model groupings
  const orClaudeResponses = sortedResponses.filter(r => r.source === 'Claude 3.7 Opus' || r.source === 'Claude 3.5 Sonnet');
  const orGeminiResponses = sortedResponses.filter(r => r.source === 'Gemini 1.5 Pro (OpenRouter)');
  const orLlamaResponses = sortedResponses.filter(r => r.source === 'Llama 3 70B');
  const orMistralResponses = sortedResponses.filter(r => r.source === 'Mistral Large');
  const orDeepseekResponses = sortedResponses.filter(r => r.source === 'DeepSeek V2');
  const orCohereResponses = sortedResponses.filter(r => r.source === 'Cohere Command-R+');
  const orPerplexityResponses = sortedResponses.filter(r => r.source === 'Perplexity Sonar');
  
  // Other models
  const perplexityResponses = sortedResponses.filter(r => 
    r.source.includes('Perplexity') && r.source !== 'Perplexity Sonar'
  );
  const deepseekResponses = sortedResponses.filter(r => 
    r.source.includes('DeepSeek') && r.source !== 'DeepSeek V2'
  );
  
  // Count all OpenRouter models
  const orModelCount = 
    orClaudeResponses.length + 
    orGeminiResponses.length + 
    orLlamaResponses.length + 
    orMistralResponses.length + 
    orDeepseekResponses.length + 
    orCohereResponses.length + 
    orPerplexityResponses.length;
  
  // Count direct models (non-OpenRouter)
  const directModelCount = 
    claudeResponses.length + 
    gpt4Responses.length + 
    geminiResponses.length + 
    perplexityResponses.length + 
    deepseekResponses.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-6 rounded-xl glass card-shadow"
    >
      <div className="p-6">
        <h3 className="text-lg font-medium mb-4">Individual AI Responses ({responses.length}):</h3>
        
        {/* OpenRouter Models Section */}
        {orModelCount > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-medium text-blue-600 mb-4">
              OpenRouter Models ({orModelCount})
            </h4>
            
            {/* Claude models from OpenRouter */}
            {orClaudeResponses.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Claude Models ({orClaudeResponses.length})</h5>
                {orClaudeResponses.map(renderSingleResponse)}
              </div>
            )}
            
            {/* Gemini models from OpenRouter */}
            {orGeminiResponses.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Gemini Models ({orGeminiResponses.length})</h5>
                {orGeminiResponses.map(renderSingleResponse)}
              </div>
            )}
            
            {/* Llama models from OpenRouter */}
            {orLlamaResponses.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Llama Models ({orLlamaResponses.length})</h5>
                {orLlamaResponses.map(renderSingleResponse)}
              </div>
            )}
            
            {/* Mistral models from OpenRouter */}
            {orMistralResponses.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Mistral Models ({orMistralResponses.length})</h5>
                {orMistralResponses.map(renderSingleResponse)}
              </div>
            )}
            
            {/* DeepSeek models from OpenRouter */}
            {orDeepseekResponses.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">DeepSeek Models ({orDeepseekResponses.length})</h5>
                {orDeepseekResponses.map(renderSingleResponse)}
              </div>
            )}
            
            {/* Cohere models from OpenRouter */}
            {orCohereResponses.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Cohere Models ({orCohereResponses.length})</h5>
                {orCohereResponses.map(renderSingleResponse)}
              </div>
            )}
            
            {/* Perplexity models from OpenRouter */}
            {orPerplexityResponses.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Perplexity Models ({orPerplexityResponses.length})</h5>
                {orPerplexityResponses.map(renderSingleResponse)}
              </div>
            )}
          </div>
        )}
        
        {/* Direct API Models Section */}
        {directModelCount > 0 && (
          <div>
            <h4 className="text-md font-medium mb-4 text-green-600">Direct API Models ({directModelCount})</h4>
            
            {/* Claude direct models */}
            {claudeResponses.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Claude Models ({claudeResponses.length})</h5>
                {claudeResponses.map(renderSingleResponse)}
              </div>
            )}
            
            {/* GPT-4 direct models */}
            {gpt4Responses.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">GPT-4 Models ({gpt4Responses.length})</h5>
                {gpt4Responses.map(renderSingleResponse)}
              </div>
            )}
            
            {/* Gemini direct models */}
            {geminiResponses.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Gemini Models ({geminiResponses.length})</h5>
                {geminiResponses.map(renderSingleResponse)}
              </div>
            )}
            
            {/* Perplexity direct models */}
            {perplexityResponses.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">Perplexity Models ({perplexityResponses.length})</h5>
                {perplexityResponses.map(renderSingleResponse)}
              </div>
            )}
            
            {/* DeepSeek direct models */}
            {deepseekResponses.length > 0 && (
              <div className="mb-4">
                <h5 className="text-sm font-medium mb-2">DeepSeek Models ({deepseekResponses.length})</h5>
                {deepseekResponses.map(renderSingleResponse)}
              </div>
            )}
          </div>
        )}
        
        {/* Fallback if we couldn't categorize any responses */}
        {orModelCount === 0 && directModelCount === 0 && (
          <div className="grid grid-cols-1 gap-4">
            {sortedResponses.map(renderSingleResponse)}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default IndividualResponses;
