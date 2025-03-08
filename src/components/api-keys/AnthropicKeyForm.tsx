import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryContext } from '@/hooks/useQueryContext';

const AnthropicKeyForm: React.FC = () => {
  const { setApiKey, apiKeys } = useQueryContext();
  const [anthropicKey, setAnthropicKey] = React.useState(apiKeys.anthropic || '');
  const [anthropicClaude35Key, setAnthropicClaude35Key] = React.useState(apiKeys.anthropicClaude35 || '');

  const handleSaveAnthropic = () => {
    if (anthropicKey) setApiKey('anthropic', anthropicKey);
  };

  const handleSaveAnthropicClaude35 = () => {
    if (anthropicClaude35Key) setApiKey('anthropicClaude35', anthropicClaude35Key);
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="anthropic-key">Anthropic API Key (Claude 3 Haiku)</Label>
        <Input
          id="anthropic-key"
          type="password"
          placeholder="sk-ant-..."
          value={anthropicKey}
          onChange={(e) => setAnthropicKey(e.target.value)}
        />
        <p className="text-xs text-gray-500">Provides access to Claude 3 Haiku model.</p>
      </div>
      <Button onClick={handleSaveAnthropic} disabled={!anthropicKey} className="mb-4">Save Claude 3 Haiku Key</Button>
      
      <div className="space-y-2">
        <Label htmlFor="anthropic-claude35-key">Anthropic API Key (Claude 3.5 Sonnet)</Label>
        <Input
          id="anthropic-claude35-key"
          type="password"
          placeholder="sk-ant-..."
          value={anthropicClaude35Key}
          onChange={(e) => setAnthropicClaude35Key(e.target.value)}
        />
        <p className="text-xs text-gray-500">Provides access to Claude 3.5 Sonnet model.</p>
      </div>
      <Button onClick={handleSaveAnthropicClaude35} disabled={!anthropicClaude35Key}>Save Claude 3.5 Sonnet Key</Button>
    </div>
  );
};

export default AnthropicKeyForm;
