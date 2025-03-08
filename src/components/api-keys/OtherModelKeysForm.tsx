
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryContext } from '@/context/QueryContext';

const OtherModelKeysForm: React.FC = () => {
  const { setApiKey, apiKeys } = useQueryContext();
  const [deepseekKey, setDeepseekKey] = React.useState(apiKeys.deepseek || '');
  const [grokKey, setGrokKey] = React.useState(apiKeys.grok || '');
  const [qwenKey, setQwenKey] = React.useState(apiKeys.qwen || '');

  const handleSaveDeepseek = () => {
    if (deepseekKey) setApiKey('deepseek', deepseekKey);
  };

  const handleSaveGrok = () => {
    if (grokKey) setApiKey('grok', grokKey);
  };

  const handleSaveQwen = () => {
    if (qwenKey) setApiKey('qwen', qwenKey);
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="deepseek-key">DeepSeek API Key</Label>
        <Input
          id="deepseek-key"
          type="password"
          placeholder="sk-..."
          value={deepseekKey}
          onChange={(e) => setDeepseekKey(e.target.value)}
        />
        <p className="text-xs text-gray-500">Provides access to DeepSeek Coder model.</p>
      </div>
      <Button onClick={handleSaveDeepseek} disabled={!deepseekKey} className="mb-4">Save DeepSeek Key</Button>
      
      <div className="space-y-2">
        <Label htmlFor="grok-key">Grok API Key</Label>
        <Input
          id="grok-key"
          type="password"
          placeholder="grok-..."
          value={grokKey}
          onChange={(e) => setGrokKey(e.target.value)}
        />
        <p className="text-xs text-gray-500">Provides access to Grok-1.5 model.</p>
      </div>
      <Button onClick={handleSaveGrok} disabled={!grokKey} className="mb-4">Save Grok Key</Button>

      <div className="space-y-2">
        <Label htmlFor="qwen-key">Qwen API Key</Label>
        <Input
          id="qwen-key"
          type="password"
          placeholder="qwen-..."
          value={qwenKey}
          onChange={(e) => setQwenKey(e.target.value)}
        />
        <p className="text-xs text-gray-500">Provides access to Alibaba Qwen2 72B model.</p>
      </div>
      <Button onClick={handleSaveQwen} disabled={!qwenKey}>Save Qwen Key</Button>
    </>
  );
};

export default OtherModelKeysForm;
