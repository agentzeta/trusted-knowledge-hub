import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQueryContext } from '../hooks/useQueryContext';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import QueryHeader from './QueryHeader';
import QuerySearchInput from './QuerySearchInput';
import ExampleQueriesSection from './ExampleQueriesSection';
import UserAuthStatus from './UserAuthStatus';
import QueryResponses from './QueryResponses';

const storedQueries = [
  { id: 1, query: "How does climate change affect coral reefs?" },
  { id: 2, query: "What is quantum computing?" },
  { id: 3, query: "How do vaccines work?" },
  { id: 4, query: "Who was Nikola Tesla?" },
  { id: 5, query: "What caused the 2008 financial crisis?" },
  { id: 6, query: "How are black holes formed?" },
  { id: 7, query: "What is the theory of relativity?" },
  { id: 8, query: "How does machine learning work?" },
  { id: 9, query: "What are the effects of meditation on the brain?" },
  { id: 10, query: "How do electric cars work?" }
];

const QueryInterface: React.FC = () => {
  const { submitQuery, isLoading, query, responses, consensusResponse } = useQueryContext();
  const { user, signInWithGoogle } = useSupabaseAuth();
  const [inputQuery, setInputQuery] = useState('');
  const [suggestions, setSuggestions] = useState<typeof storedQueries>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (inputQuery.trim() && inputQuery.length > 2) {
      const filteredSuggestions = storedQueries.filter(q => 
        q.query.toLowerCase().includes(inputQuery.toLowerCase())
      ).slice(0, 5);
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      submitQuery(inputQuery.trim());
    }
  };

  const handleExampleClick = (query: string) => {
    setInputQuery(query);
    submitQuery(query);
  };

  const handleSuggestionClick = (query: string) => {
    setInputQuery(query);
    submitQuery(query);
    setShowSuggestions(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      // Error is already handled in the hook
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-3xl mx-auto mt-8"
    >
      <QueryHeader
        handleGoogleSignIn={handleGoogleSignIn}
        user={user}
      />
      
      <QuerySearchInput
        inputQuery={inputQuery}
        setInputQuery={setInputQuery}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        suggestions={suggestions}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        handleSuggestionClick={handleSuggestionClick}
      />
      
      <ExampleQueriesSection
        onExampleClick={handleExampleClick}
        isLoading={isLoading}
      />
      
      <UserAuthStatus user={user} />
      
      <QueryResponses
        isLoading={isLoading}
        consensusResponse={consensusResponse}
        responses={responses}
      />
    </motion.div>
  );
};

export default QueryInterface;
