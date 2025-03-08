
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryContext } from '@/context/QueryContext';
import { Settings } from 'lucide-react';

const ApiKeyManager: React.FC = () => {
  const { setApiKey, apiKeys } = useQueryContext();
  const [openaiKey, setOpenaiKey] = useState(apiKeys.openai || '');
  const [anthropicKey, setAnthropicKey] = useState(apiKeys.anthropic || '');
  const [anthropicClaude35Key, setAnthropicClaude35Key] = useState(apiKeys.anthropicClaude35 || '');
  const [geminiKey, setGeminiKey] = useState(apiKeys.gemini || '');
  const [geminiProExpKey, setGeminiProExpKey] = useState(apiKeys.geminiProExperimental || '');
  const [perplexityKey, setPerplexityKey] = useState(apiKeys.perplexity || '');
  const [deepseekKey, setDeepseekKey] = useState(apiKeys.deepseek || '');
  const [grokKey, setGrokKey] = useState(apiKeys.grok || '');
  const [qwenKey, setQwenKey] = useState(apiKeys.qwen || '');
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveOpenAI = () => {
    if (openaiKey) setApiKey('openai', openaiKey);
  };

  const handleSaveAnthropic = () => {
    if (anthropicKey) setApiKey('anthropic', anthropicKey);
  };

  const handleSaveAnthropicClaude35 = () => {
    if (anthropicClaude35Key) setApiKey('anthropicClaude35', anthropicClaude35Key);
  };

  const handleSaveGemini = () => {
    if (geminiKey) setApiKey('gemini', geminiKey);
  };

  const handleSaveGeminiProExp = () => {
    if (geminiProExpKey) setApiKey('geminiProExperimental', geminiProExpKey);
  };

  const handleSavePerplexity = () => {
    if (perplexityKey) setApiKey('perplexity', perplexityKey);
  };

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>API Key Management</DialogTitle>
          <DialogDescription>
            Add your API keys to connect to real AI models. Keys are stored locally in your browser and will persist across sessions.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="openai" className="w-full mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
          </TabsList>
          
          <TabsContent value="openai" className="space-y-4 mt-4">
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
          </TabsContent>
          
          <TabsContent value="anthropic" className="space-y-4 mt-4">
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
          </TabsContent>
          
          <TabsContent value="google" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="gemini-key">Google AI API Key (Gemini 1.5 Pro)</Label>
              <Input
                id="gemini-key"
                type="password"
                placeholder="AIza..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
              />
              <p className="text-xs text-gray-500">Provides access to Gemini 1.5 Pro model.</p>
            </div>
            <Button onClick={handleSaveGemini} disabled={!geminiKey} className="mb-4">Save Gemini 1.5 Pro Key</Button>
            
            <div className="space-y-2">
              <Label htmlFor="gemini-pro-exp-key">Google AI API Key (Gemini 1.5 Flash)</Label>
              <Input
                id="gemini-pro-exp-key"
                type="password"
                placeholder="AIza..."
                value={geminiProExpKey}
                onChange={(e) => setGeminiProExpKey(e.target.value)}
              />
              <p className="text-xs text-gray-500">Provides access to Gemini 1.5 Flash model.</p>
            </div>
            <Button onClick={handleSaveGeminiProExp} disabled={!geminiProExpKey}>Save Gemini 1.5 Flash Key</Button>
          </TabsContent>
        </Tabs>
        
        <Tabs defaultValue="perplexity" className="w-full mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="perplexity">Perplexity</TabsTrigger>
            <TabsTrigger value="other1">DeepSeek/Grok</TabsTrigger>
            <TabsTrigger value="other2">Qwen</TabsTrigger>
          </TabsList>
          
          <TabsContent value="perplexity" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="perplexity-key">Perplexity API Key</Label>
              <Input
                id="perplexity-key"
                type="password"
                placeholder="pplx-..."
                value={perplexityKey}
                onChange={(e) => setPerplexityKey(e.target.value)}
              />
              <p className="text-xs text-gray-500">Provides access to Perplexity AI models (Llama 3.1 Sonar).</p>
            </div>
            <Button onClick={handleSavePerplexity} disabled={!perplexityKey}>Save Perplexity Key</Button>
          </TabsContent>
          
          <TabsContent value="other1" className="space-y-4 mt-4">
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
            <Button onClick={handleSaveGrok} disabled={!grokKey}>Save Grok Key</Button>
          </TabsContent>
          
          <TabsContent value="other2" className="space-y-4 mt-4">
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
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyManager;
