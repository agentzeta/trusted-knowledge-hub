
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; 
import { Label } from "@/components/ui/label";
import { useQueryContext } from '@/hooks/useQueryContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BadgeCheck, InfoIcon, KeyRound, AlertCircle } from 'lucide-react';

const OpenRouterKeyForm: React.FC = () => {
  const { setApiKey, apiKeys } = useQueryContext();
  const [openRouterKey, setOpenRouterKey] = React.useState(apiKeys.openrouter || '');

  const handleSaveOpenRouter = () => {
    if (openRouterKey) setApiKey('openrouter', openRouterKey);
  };

  // Calculate how many API keys are provided (for display purposes)
  const apiKeyCount = openRouterKey 
    ? openRouterKey.split(',').filter(key => key.trim().length > 0).length 
    : 0;

  return (
    <div className="space-y-4 mt-4">
      <Alert className="bg-blue-50 border-blue-200 mb-4">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          OpenRouter provides access to multiple high-quality AI models through a single API key
        </AlertDescription>
      </Alert>
      
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800 flex items-center gap-1 mb-2">
            <BadgeCheck className="h-4 w-4 text-blue-500" />
            Models available with OpenRouter
          </h3>
          <ul className="text-xs text-blue-700 space-y-1 pl-5 list-disc">
            <li>Claude 3.7 Opus (Anthropic) - <code className="text-xs bg-blue-50 px-1">anthropic/claude-3-opus:20240229</code></li>
            <li>Claude 3.5 Sonnet (Anthropic) - <code className="text-xs bg-blue-50 px-1">anthropic/claude-3-sonnet:20240229</code></li>
            <li>Gemini 1.5 Pro (Google) - <code className="text-xs bg-blue-50 px-1">google/gemini-1.5-pro</code></li>
            <li>Mistral Large (Mistral AI) - <code className="text-xs bg-blue-50 px-1">mistralai/mistral-large</code></li>
            <li>Llama 3 70B (Meta) - <code className="text-xs bg-blue-50 px-1">meta-llama/llama-3-70b-instruct</code></li>
            <li>DeepSeek V2 (DeepSeek) - <code className="text-xs bg-blue-50 px-1">deepseek-ai/deepseek-v2</code></li>
            <li>Command R+ (Cohere) - <code className="text-xs bg-blue-50 px-1">cohere/command-r-plus</code></li>
            <li>Sonar (Perplexity) - <code className="text-xs bg-blue-50 px-1">perplexity/sonar-small-online</code></li>
          </ul>
        </div>
      
        <Alert className="bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700">
            OpenRouter has rate limits. Providing multiple API keys (separated by commas) helps distribute the load across keys.
          </AlertDescription>
        </Alert>
      
        <div className="space-y-2">
          <Label htmlFor="openrouter-key" className="flex items-center gap-1">
            <KeyRound className="h-4 w-4" />
            OpenRouter API Key(s) {apiKeyCount > 0 && <span className="text-green-600 text-xs ml-2">({apiKeyCount} keys provided)</span>}
          </Label>
          <Textarea
            id="openrouter-key"
            placeholder="sk-or-... (You can paste multiple keys separated by commas for round-robin assignment)"
            value={openRouterKey}
            onChange={(e) => setOpenRouterKey(e.target.value)}
            className="font-mono text-sm"
            rows={3}
          />
          <div className="text-xs space-y-1">
            <p className="text-gray-500">
              Get your key at <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">openrouter.ai/keys</a>
            </p>
            <p className="text-green-600 font-medium">
              IMPORTANT: Enter multiple OpenRouter API keys separated by commas for round-robin assignment to models
            </p>
            <p className="text-amber-600">
              Each model query uses one API key in rotation, so adding multiple keys increases throughput
            </p>
          </div>
        </div>
      </div>
      
      <Button 
        onClick={handleSaveOpenRouter} 
        disabled={!openRouterKey} 
        className="w-full"
      >
        Save {apiKeyCount > 1 ? `${apiKeyCount} OpenRouter API Keys` : 'OpenRouter API Key'}
      </Button>
    </div>
  );
};

export default OpenRouterKeyForm;
