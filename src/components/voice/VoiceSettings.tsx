
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings, Mic, Volume2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { availableVoices, useVoiceAgentSettings, Voice } from '@/hooks/useVoiceAgentSettings';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';

interface VoiceSettingsProps {
  trigger?: React.ReactNode;
}

const VoiceSettings: React.FC<VoiceSettingsProps> = ({ 
  trigger 
}) => {
  const { selectedVoice, changeVoice } = useVoiceAgentSettings();
  const { speakResponse, changeVoice: updateAgentVoice } = useVoiceAgent();
  
  const handleVoiceChange = (voice: Voice) => {
    changeVoice(voice);
    updateAgentVoice(voice.id);
  };
  
  const handleTestVoice = (voice: Voice) => {
    updateAgentVoice(voice.id);
    speakResponse(`This is a sample of the ${voice.name} voice. How does it sound?`);
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm">
            <Settings className="h-4 w-4" />
            <span>Voice Settings</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">Voice Agent Settings</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-4 text-gray-700 dark:text-gray-300">Agent Voice</h3>
            <RadioGroup 
              defaultValue={selectedVoice.id} 
              onValueChange={(value) => {
                const voice = availableVoices.find(v => v.id === value);
                if (voice) handleVoiceChange(voice);
              }}
              className="space-y-2"
            >
              {availableVoices.map((voice) => (
                <div key={voice.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={voice.id} id={voice.id} />
                    <Label htmlFor={voice.id} className="flex items-center cursor-pointer">
                      <span className="font-medium">{voice.name}</span>
                      {voice.description && (
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({voice.description})</span>
                      )}
                    </Label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleTestVoice(voice)}
                  >
                    <Volume2 className="h-4 w-4 mr-1" />
                    Test
                  </Button>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Agent's Personality</h3>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              <p>Agent Veritas is configured to provide verifiable information from multiple AI models, focusing on consensus knowledge and highlighting areas of agreement and disagreement.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSettings;
