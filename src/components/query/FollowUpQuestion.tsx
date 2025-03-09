
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendIcon, Loader2 } from 'lucide-react';

interface FollowUpQuestionProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

const FollowUpQuestion: React.FC<FollowUpQuestionProps> = ({ onSubmit, isLoading }) => {
  const [followUpQuestion, setFollowUpQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (followUpQuestion.trim()) {
      onSubmit(followUpQuestion.trim());
      setFollowUpQuestion('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 p-4 rounded-xl glass card-shadow"
    >
      <h3 className="text-lg font-medium mb-3">Follow-up Question</h3>
      <p className="text-sm text-gray-600 mb-4">
        Would you like to ask a follow-up question related to the responses above?
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={followUpQuestion}
          onChange={(e) => setFollowUpQuestion(e.target.value)}
          placeholder="Ask a follow-up question..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !followUpQuestion.trim()}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SendIcon className="h-4 w-4" />
          )}
          <span className="ml-2">Ask</span>
        </Button>
      </form>
    </motion.div>
  );
};

export default FollowUpQuestion;
