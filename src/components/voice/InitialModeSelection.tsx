
import React, { useState, useRef } from 'react';
import { Mic, MessageSquare, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import AgentVeritasAvatar from '../AgentVeritasAvatar';

interface InitialModeSelectionProps {
  agentScript: string[];
  isListening: boolean;
  onModeSelect: (input: string) => void;
}

const InitialModeSelection: React.FC<InitialModeSelectionProps> = ({
  agentScript,
  isListening,
  onModeSelect
}) => {
  const [userInput, setUserInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onModeSelect(userInput);
    setUserInput('');
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1 }}
      className="p-6 text-center"
    >
      <motion.div
        variants={itemVariants}
        className="flex justify-center mb-6"
      >
        <AgentVeritasAvatar size="lg" />
      </motion.div>
      
      <motion.p 
        variants={itemVariants}
        className="mb-8 text-lg font-light text-slate-700 dark:text-slate-300"
      >
        {agentScript[0]}
      </motion.p>
      
      <motion.form 
        variants={itemVariants}
        onSubmit={handleFormSubmit} 
        className="mb-6"
      >
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your response..."
          className="w-full px-4 py-3 mb-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-slate-200 backdrop-blur-sm"
          autoFocus
        />
      </motion.form>
      
      <motion.div 
        variants={itemVariants}
        className="flex justify-center gap-4"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={() => onModeSelect('speak to agent')}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-5 py-6 h-auto"
            variant="default"
          >
            <Mic className="h-4 w-4" />
            Voice Chat
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={() => onModeSelect('use text')}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 px-5 py-6 h-auto"
            variant="outline"
          >
            <MessageSquare className="h-4 w-4" />
            Text Chat
          </Button>
        </motion.div>
      </motion.div>
      
      {!isListening && (
        <motion.p 
          variants={itemVariants}
          className="mt-6 text-sm text-slate-500 dark:text-slate-400"
        >
          You can also speak your response. Click the microphone button or say "speak to agent" or "use text chat".
        </motion.p>
      )}
      
      {isListening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 flex items-center justify-center"
        >
          <div className="flex items-center gap-2 text-sm text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <p>I'm listening... Say "speak to agent" or "use text chat"</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InitialModeSelection;
