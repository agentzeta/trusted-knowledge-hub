import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryContext } from '@/hooks/useQueryContext';

const GoogleKeyForm: React.FC = () => {
  const { setApiKey, apiKeys } = useQueryContext();
  const [geminiKey, setGeminiKey] = React.useState(apiKeys.gemini || '');
  const [geminiProExpKey, setGeminiProExpKey] = React.useState(apiKeys.geminiProExperimental || '');

  const handleSaveGemini = () => {
    if (geminiKey) setApiKey('gemini', geminiKey);
  };

  const handleSaveGeminiProExp = () => {
    if (geminiProExpKey) setApiKey('geminiProExperimental', geminiProExpKey);
  };

  return (
    <div className="space-y-4 mt-4">
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
    </div>
  );
};

export default GoogleKeyForm;
