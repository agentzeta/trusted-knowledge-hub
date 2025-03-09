
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface Voice {
  id: string;
  name: string;
  description?: string;
}

export const availableVoices: Voice[] = [
  { id: "9BWtsMINqrJLrRacOk9x", name: "Aria", description: "Professional female voice" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", description: "Friendly female voice" },
  { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie", description: "Enthusiastic male voice" },
  { id: "FGY2WhTYpPnrIDTdsKH5", name: "Laura", description: "Calm female voice" },
  { id: "N2lVS1w4EtoT3dr4eOWO", name: "Callum", description: "Young male voice" },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", description: "Energetic young female voice" },
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte", description: "Friendly female voice" },
  { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger", description: "Professional male voice" },
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George", description: "Deep male voice" },
  { id: "SAz9YHcvj6GT2YYXdXww", name: "River", description: "Neutral voice" }
];

export const useVoiceAgentSettings = () => {
  // Default to Lily - an energetic young female voice
  const defaultVoice = availableVoices.find(v => v.name === "Lily") || availableVoices[0];
  
  const [selectedVoice, setSelectedVoice] = useState<Voice>(defaultVoice);
  const [voicePreferences, setVoicePreferences] = useState<{[key: string]: string}>({});
  
  // Load saved preferences from local storage
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem('voiceAgentPreferences');
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs);
        setVoicePreferences(prefs);
        
        // Set selected voice if saved
        if (prefs.selectedVoiceId) {
          const voice = availableVoices.find(v => v.id === prefs.selectedVoiceId);
          if (voice) {
            setSelectedVoice(voice);
          }
        }
      } else {
        // No saved preferences, set default to Lily
        savePreferences({ selectedVoiceId: defaultVoice.id });
      }
    } catch (error) {
      console.error('Error loading voice preferences:', error);
    }
  }, []);
  
  // Save preferences to local storage
  const savePreferences = (prefs: {[key: string]: string}) => {
    try {
      const updatedPrefs = { ...voicePreferences, ...prefs };
      localStorage.setItem('voiceAgentPreferences', JSON.stringify(updatedPrefs));
      setVoicePreferences(updatedPrefs);
      
      toast({
        title: "Preferences Saved",
        description: "Your voice agent settings have been saved",
      });
    } catch (error) {
      console.error('Error saving voice preferences:', error);
      toast({
        title: "Error Saving Preferences",
        description: "There was an error saving your settings",
        variant: "destructive",
      });
    }
  };
  
  const changeVoice = (voice: Voice) => {
    setSelectedVoice(voice);
    savePreferences({ selectedVoiceId: voice.id });
    
    toast({
      title: "Voice Changed",
      description: `Agent voice changed to ${voice.name}`,
    });
  };
  
  return {
    selectedVoice,
    changeVoice,
    availableVoices,
    voicePreferences,
    savePreferences
  };
};
