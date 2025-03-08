
import { RefObject } from 'react';

export interface VoiceAgentState {
  isSpeaking: boolean;
  isListening: boolean;
  voiceId: string;
}

export interface VoiceAgentControls {
  startListening: () => void;
  stopListening: () => void;
  speakResponse: (text: string) => Promise<void>;
  speakConsensus: () => void;
  stopSpeaking: () => void;
  changeVoice: (newVoiceId: string) => void;
}

export interface SpeechRecognitionRefValue {
  current: SpeechRecognition | null;
}

export interface AudioRefValue {
  current: HTMLAudioElement | null;
}
