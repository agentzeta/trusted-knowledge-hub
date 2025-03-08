
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
  const [geminiKey, setGeminiKey] = useState(apiKeys.gemini || '');
  const [perplexityKey, setPerplexityKey] = useState(apiKeys.perplexity || '');
  const [isOpen, setIsOpen] = useState(false);

  const handleSaveOpenAI = () => {
    if (openaiKey) setApiKey('openai', openaiKey);
  };

  const handleSaveAnthropic = () => {
    if (anthropicKey) setApiKey('anthropic', anthropicKey);
  };

  const handleSaveGemini = () => {
    if (geminiKey) setApiKey('gemini', geminiKey);
  };

  const handleSavePerplexity = () => {
    if (perplexityKey) setApiKey('perplexity', perplexityKey);
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
            Add your API keys to connect to real AI models. Your keys are stored locally in your browser.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="openai" className="w-full mt-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
            <TabsTrigger value="gemini">Gemini</TabsTrigger>
            <TabsTrigger value="perplexity">Perplexity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="openai" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key">OpenAI API Key (for GPT-4)</Label>
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
              <Label htmlFor="anthropic-key">Anthropic API Key</Label>
              <Input
                id="anthropic-key"
                type="password"
                placeholder="sk-ant-..."
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
              />
              <p className="text-xs text-gray-500">Provides access to Claude 3 model.</p>
            </div>
            <Button onClick={handleSaveAnthropic} disabled={!anthropicKey}>Save Anthropic Key</Button>
          </TabsContent>
          
          <TabsContent value="gemini" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="gemini-key">Google AI API Key</Label>
              <Input
                id="gemini-key"
                type="password"
                placeholder="AIza..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
              />
              <p className="text-xs text-gray-500">Provides access to Gemini model.</p>
            </div>
            <Button onClick={handleSaveGemini} disabled={!geminiKey}>Save Gemini Key</Button>
          </TabsContent>
          
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
              <p className="text-xs text-gray-500">Provides access to Perplexity AI models.</p>
            </div>
            <Button onClick={handleSavePerplexity} disabled={!perplexityKey}>Save Perplexity Key</Button>
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
