
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OpenAIKeyForm from './OpenAIKeyForm';
import AnthropicKeyForm from './AnthropicKeyForm';
import GoogleKeyForm from './GoogleKeyForm';
import PerplexityKeyForm from './PerplexityKeyForm';
import OtherModelKeysForm from './OtherModelKeysForm';

const ApiKeyTabs: React.FC = () => {
  return (
    <>
      <Tabs defaultValue="openai" className="w-full mt-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="openai">OpenAI</TabsTrigger>
          <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
          <TabsTrigger value="google">Google</TabsTrigger>
        </TabsList>
        
        <TabsContent value="openai">
          <OpenAIKeyForm />
        </TabsContent>
        
        <TabsContent value="anthropic">
          <AnthropicKeyForm />
        </TabsContent>
        
        <TabsContent value="google">
          <GoogleKeyForm />
        </TabsContent>
      </Tabs>
      
      <Tabs defaultValue="perplexity" className="w-full mt-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="perplexity">Perplexity</TabsTrigger>
          <TabsTrigger value="other1">DeepSeek/Grok</TabsTrigger>
          <TabsTrigger value="other2">Qwen</TabsTrigger>
        </TabsList>
        
        <TabsContent value="perplexity">
          <PerplexityKeyForm />
        </TabsContent>
        
        <TabsContent value="other1" className="space-y-4 mt-4">
          <OtherModelKeysForm />
        </TabsContent>
        
        <TabsContent value="other2" className="space-y-4 mt-4">
          <div className="space-y-2">
            {/* This section shows individual Qwen model, but the actual form is handled in OtherModelKeysForm */}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ApiKeyTabs;
