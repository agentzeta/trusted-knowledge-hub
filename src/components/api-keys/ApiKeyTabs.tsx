
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OpenAIKeyForm from "./OpenAIKeyForm";
import AnthropicKeyForm from "./AnthropicKeyForm";
import GoogleKeyForm from "./GoogleKeyForm";
import PerplexityKeyForm from "./PerplexityKeyForm";
import OtherModelKeysForm from "./OtherModelKeysForm";
import BlockchainKeyForm from "./BlockchainKeyForm";
import OpenRouterKeyForm from "./OpenRouterKeyForm";

const ApiKeyTabs = () => {
  return (
    <Tabs defaultValue="openai" className="mt-4">
      <TabsList className="grid grid-cols-7">
        <TabsTrigger value="openai">OpenAI</TabsTrigger>
        <TabsTrigger value="anthropic">Anthropic</TabsTrigger>
        <TabsTrigger value="google">Google</TabsTrigger>
        <TabsTrigger value="perplexity">Perplexity</TabsTrigger>
        <TabsTrigger value="openrouter">OpenRouter</TabsTrigger>
        <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        <TabsTrigger value="other">Other</TabsTrigger>
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
      <TabsContent value="perplexity">
        <PerplexityKeyForm />
      </TabsContent>
      <TabsContent value="openrouter">
        <OpenRouterKeyForm />
      </TabsContent>
      <TabsContent value="blockchain">
        <BlockchainKeyForm />
      </TabsContent>
      <TabsContent value="other">
        <OtherModelKeysForm />
      </TabsContent>
    </Tabs>
  );
};

export default ApiKeyTabs;
