
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryContext } from '@/hooks/useQueryContext';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from 'lucide-react';

const OtherModelKeysForm: React.FC = () => {
  const { setApiKey, apiKeys } = useQueryContext();
  const [deepseekKey, setDeepseekKey] = React.useState(apiKeys.deepseek || '');
  const [grokKey, setGrokKey] = React.useState(apiKeys.grok || '');
  const [qwenKey, setQwenKey] = React.useState(apiKeys.qwen || '');
  const [llamaKey, setLlamaKey] = React.useState(apiKeys.llama || '');
  const [elevenLabsKey, setElevenLabsKey] = React.useState(apiKeys.elevenlabs || '');

  const handleSaveDeepseek = () => {
    if (deepseekKey) setApiKey('deepseek', deepseekKey);
  };

  const handleSaveGrok = () => {
    if (grokKey) setApiKey('grok', grokKey);
  };

  const handleSaveQwen = () => {
    if (qwenKey) setApiKey('qwen', qwenKey);
  };

  const handleSaveLlama = () => {
    if (llamaKey) setApiKey('llama', llamaKey);
  };

  const handleSaveElevenLabs = () => {
    if (elevenLabsKey) setApiKey('elevenlabs', elevenLabsKey);
  };

  return (
    <>
      <Alert className="bg-blue-50 border-blue-200 mb-4">
        <InfoIcon className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          One API key works for all models from the same provider (all Llama models, all Claude models, etc)
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="llama-key">Llama API Key</Label>
        <Input
          id="llama-key"
          type="password"
          placeholder="llm-..."
          value={llamaKey}
          onChange={(e) => setLlamaKey(e.target.value)}
        />
        <p className="text-xs text-gray-500">Provides access to all Llama models (Llama 3, Llama 3.1, etc).</p>
      </div>
      <Button onClick={handleSaveLlama} disabled={!llamaKey} className="mb-4 w-full">Save Llama Key</Button>
      
      <div className="space-y-2">
        <Label htmlFor="elevenlabs-key">ElevenLabs API Key</Label>
        <Input
          id="elevenlabs-key"
          type="password"
          placeholder="elevenlabs-..."
          value={elevenLabsKey}
          onChange={(e) => setElevenLabsKey(e.target.value)}
        />
        <p className="text-xs text-gray-500">Required for voice synthesis and voice interaction.</p>
      </div>
      <Button onClick={handleSaveElevenLabs} disabled={!elevenLabsKey} className="mb-4 w-full">Save ElevenLabs Key</Button>
      
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
      <Button onClick={handleSaveDeepseek} disabled={!deepseekKey} className="mb-4 w-full">Save DeepSeek Key</Button>
      
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
      <Button onClick={handleSaveGrok} disabled={!grokKey} className="mb-4 w-full">Save Grok Key</Button>

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
      <Button onClick={handleSaveQwen} disabled={!qwenKey} className="w-full">Save Qwen Key</Button>
    </>
  );
};

export default OtherModelKeysForm;
