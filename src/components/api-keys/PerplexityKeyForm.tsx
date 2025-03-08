
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryContext } from '@/context/QueryContext';

const PerplexityKeyForm: React.FC = () => {
  const { setApiKey, apiKeys } = useQueryContext();
  const [perplexityKey, setPerplexityKey] = React.useState(apiKeys.perplexity || '');

  const handleSavePerplexity = () => {
    if (perplexityKey) setApiKey('perplexity', perplexityKey);
  };

  return (
    <div className="space-y-4 mt-4">
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
    </div>
  );
};

export default PerplexityKeyForm;
