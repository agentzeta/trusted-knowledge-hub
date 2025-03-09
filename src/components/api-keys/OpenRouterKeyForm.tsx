
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryContext } from '@/hooks/useQueryContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';

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
          When enabled, Truthful will fetch responses from 8 different models through OpenRouter
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
        <Input
          id="openrouter-key"
          type="password"
          placeholder="sk-or-..."
          value={openRouterKey}
          onChange={(e) => setOpenRouterKey(e.target.value)}
        />
        <p className="text-xs text-gray-500">
          Provides access to models like Claude 3.7, Llama 3, Gemini 1.5 Pro, Mistral, DeepSeek, and more through a single API.
          Get your key at <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">openrouter.ai/keys</a>
        </p>
      </div>
      <Button onClick={handleSaveOpenRouter} disabled={!openRouterKey} className="w-full">Save OpenRouter API Key</Button>
    </div>
  );
};

export default OpenRouterKeyForm;
