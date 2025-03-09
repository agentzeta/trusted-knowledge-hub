
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { useQueryContext } from '@/hooks/useQueryContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BadgeCheck, InfoIcon, KeyRound } from 'lucide-react';

const OpenRouterKeyForm: React.FC = () => {
  const { setApiKey, apiKeys } = useQueryContext();
  const [openRouterKey, setOpenRouterKey] = React.useState(apiKeys.openrouter || '');

  const handleSaveOpenRouter = () => {
    if (openRouterKey) setApiKey('openrouter', openRouterKey);
  };

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
            <li>Claude 3.7 Opus (Anthropic)</li>
            <li>Claude 3.5 Sonnet (Anthropic)</li>
            <li>Gemini 1.5 Pro (Google)</li>
            <li>Mistral Large (Mistral AI)</li>
            <li>Llama 3 70B (Meta)</li>
            <li>DeepSeek V2 (DeepSeek)</li>
            <li>Command R+ (Cohere)</li>
            <li>Sonar (Perplexity)</li>
          </ul>
        </div>
      
        <div className="space-y-2">
          <Label htmlFor="openrouter-key" className="flex items-center gap-1">
            <KeyRound className="h-4 w-4" />
            OpenRouter API Key(s)
          </Label>
          <Textarea
            id="openrouter-key"
            placeholder="sk-or-... (You can paste multiple keys separated by commas)"
            value={openRouterKey}
            onChange={(e) => setOpenRouterKey(e.target.value)}
            className="font-mono text-sm"
            rows={3}
          />
          <div className="text-xs text-gray-500 space-y-1">
            <p>
              Get your key at <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">openrouter.ai/keys</a>
            </p>
            <p className="text-green-600 font-medium">
              NEW: You can enter multiple OpenRouter API keys separated by commas for round-robin assignment to models
            </p>
          </div>
        </div>
      </div>
      
      <Button onClick={handleSaveOpenRouter} disabled={!openRouterKey} className="w-full">Save OpenRouter API Key(s)</Button>
    </div>
  );
};

export default OpenRouterKeyForm;
