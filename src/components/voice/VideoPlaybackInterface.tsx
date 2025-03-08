
import React from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlaybackInterfaceProps {
  recordedVideo: string | null;
  onDiscard: () => void;
  onSave: () => void;
}

const VideoPlaybackInterface: React.FC<VideoPlaybackInterfaceProps> = ({
  recordedVideo,
  onDiscard,
  onSave
}) => {
  return (
    <div className="p-6">
      <div className="relative mb-4 rounded-lg overflow-hidden bg-black">
        <video 
          src={recordedVideo || undefined} 
          className="w-full h-64 object-cover" 
          controls
        />
      </div>
      
      <div className="flex justify-center gap-4">
        <Button 
          onClick={onDiscard}
          variant="outline"
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" /> Discard
        </Button>
        
        <Button 
          onClick={onSave}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
        >
          <Save className="h-4 w-4" /> Save Recording
        </Button>
      </div>
    </div>
  );
};

export default VideoPlaybackInterface;
