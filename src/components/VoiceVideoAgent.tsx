
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/components/ui/use-toast';

// Import components and hooks
import VoiceVideoAgentHeader from './voice/VoiceVideoAgentHeader';
import AgentModeRenderer from './voice/AgentModeRenderer';
import { useVoiceVideoDialog } from '@/hooks/voice/useVoiceVideoDialog';

interface VoiceVideoAgentProps {
  initialMode?: 'voice' | 'video';
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const VoiceVideoAgent: React.FC<VoiceVideoAgentProps> = ({ 
  initialMode = 'voice',
  isOpen: propIsOpen,
  onOpenChange
}) => {
  const { user } = useSupabaseAuth();
  
  const {
    isOpen,
    handleOpenChange,
    mode,
    currentStep,
    isListening,
    agentScript,
    isRecording,
    recordedVideo,
    videoRef,
    processUserInput,
    handleVideoMode,
    startRecording,
    stopRecording,
    saveRecording,
    submitUserQuery
  } = useVoiceVideoDialog(initialMode, propIsOpen, onOpenChange);

  const handleModeSelect = (input: string) => {
    const result = processUserInput(input);
    if (result === 'close') {
      handleOpenChange(false);
    } else if (result === 'video') {
      handleVideoMode();
    }
  };

  const handleSaveRecording = async () => {
    if (!recordedVideo || !user) return;
    
    await saveRecording();
    
    toast({
      title: "Video Saved",
      description: "Your conversation with Agent Vera has been saved.",
    });
    
    handleOpenChange(false);
  };

  const handleCancel = () => {
    handleOpenChange(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <VoiceVideoAgentHeader mode={mode} isListening={isListening} />
          
          <AgentModeRenderer
            mode={mode}
            currentStep={currentStep}
            agentScript={agentScript}
            agentResponding={false}
            isRecording={isRecording}
            recordedVideo={recordedVideo}
            videoRef={videoRef}
            isListening={isListening}
            onModeSelect={handleModeSelect}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onCancel={handleCancel}
            onDiscard={() => {
              stopRecording();
              handleVideoMode();
            }}
            onSave={handleSaveRecording}
            onSubmitQuery={(query) => {
              const result = submitUserQuery(query);
              if (result === 'close') {
                setTimeout(() => handleOpenChange(false), 1000);
              }
            }}
            onClose={() => handleOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

const VoiceVideoAgentDefault: React.FC = () => {
  return <VoiceVideoAgent initialMode="voice" />;
};

export default VoiceVideoAgentDefault;
