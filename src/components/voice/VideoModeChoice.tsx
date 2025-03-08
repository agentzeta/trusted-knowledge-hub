
import React from 'react';
import { Button } from '@/components/ui/button';
import { Video, Mic } from 'lucide-react';

interface VideoModeChoiceProps {
  agentScript: string[];
  onModeSelect: (choice: string) => void;
}

const VideoModeChoice: React.FC<VideoModeChoiceProps> = ({
  agentScript,
  onModeSelect
}) => {
  return (
    <div className="p-6">
      <div className="text-center mb-6 text-gray-700">
        <p className="mb-4">Would you prefer to record a video with Agent Veritas, so that the Agent can see you and your background?</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button 
          className="flex items-center gap-2 w-full sm:w-auto"
          onClick={() => onModeSelect('video')}
        >
          <Video size={16} />
          Yes, enable video
        </Button>
        
        <Button 
          variant="outline"
          className="flex items-center gap-2 w-full sm:w-auto"
          onClick={() => onModeSelect('voice')}
        >
          <Mic size={16} />
          No, just voice is enough
        </Button>
      </div>
    </div>
  );
};

export default VideoModeChoice;
