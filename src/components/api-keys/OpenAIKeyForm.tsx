import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryContext } from '@/hooks/useQueryContext';

const OpenAIKeyForm: React.FC = () => {
  const { setApiKey, apiKeys } = useQueryContext();
  const [openaiKey, setOpenaiKey] = React.useState(apiKeys.openai || '');

  const handleSaveOpenAI = () => {
    if (openaiKey) setApiKey('openai', openaiKey);
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="openai-key">OpenAI API Key (for GPT-4o)</Label>
        <Input
          id="openai-key"
          type="password"
          placeholder="sk-..."
          value={openaiKey}
          onChange={(e) => setOpenaiKey(e.target.value)}
        />
        <p className="text-xs text-gray-500">Provides access to GPT-4o model.</p>
      </div>
      <Button onClick={handleSaveOpenAI} disabled={!openaiKey}>Save OpenAI Key</Button>
    </div>
  );
};

export default OpenAIKeyForm;
