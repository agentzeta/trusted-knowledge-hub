
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { useToast } from '@/components/ui/use-toast';

const AVAILABLE_VOICES = [
  { id: "9BWtsMINqrJLrRacOk9x", name: "Aria", accent: "American" },
  { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger", accent: "American" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", accent: "American" },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", accent: "British" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam", accent: "American" },
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte", accent: "British" }
];

const VoiceAgentButton: React.FC = () => {
  const { isSpeaking, speakConsensus, stopSpeaking, changeVoice, voiceId } = useVoiceAgent();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  const handleVoiceChange = (id: string, name: string) => {
    changeVoice(id);
    toast({
      title: "Voice Changed",
      description: `Voice set to ${name}`,
      duration: 2000,
    });
    setIsOpen(false);
  };
  
  const currentVoice = AVAILABLE_VOICES.find(v => v.id === voiceId) || AVAILABLE_VOICES[0];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2">
      <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-blue-800 shadow-sm">
        {isSpeaking ? "Speaking" : `Voice: ${currentVoice.name}`}
      </div>
      
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            size="icon" 
            variant="outline" 
            className="rounded-full w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md border-0 hover:shadow-lg hover:opacity-90"
          >
            <motion.div
              animate={{ scale: isSpeaking ? [1, 1.1, 1] : 1 }}
              transition={{ repeat: isSpeaking ? Infinity : 0, duration: 1.5 }}
            >
              {isSpeaking ? <Volume2 className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </motion.div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Voice Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {AVAILABLE_VOICES.map((voice) => (
            <DropdownMenuItem 
              key={voice.id}
              onClick={() => handleVoiceChange(voice.id, voice.name)}
              className={voice.id === voiceId ? "bg-blue-50 text-blue-700" : ""}
            >
              {voice.name} ({voice.accent})
              {voice.id === voiceId && <span className="ml-1">✓</span>}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={isSpeaking ? stopSpeaking : speakConsensus}
            className="text-center font-medium"
          >
            {isSpeaking ? "Stop Speaking" : "Speak Response"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default VoiceAgentButton;
