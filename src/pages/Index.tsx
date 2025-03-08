
import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import QueryInterface from '../components/QueryInterface';
import ResponseCard from '../components/ResponseCard';
import ConsensusVisual from '../components/ConsensusVisual';
import { QueryProvider, useQueryContext } from '../context/QueryContext';

const MainContent = () => {
  const { responses, query } = useQueryContext();
  
  // Function to get the most verified response
  const getMostVerifiedResponse = () => {
    if (!responses.length) return null;
    
    // Sort by verified status and confidence
    const sortedResponses = [...responses].sort((a, b) => {
      if (a.verified === b.verified) {
        return b.confidence - a.confidence;
      }
      return a.verified ? -1 : 1;
    });
    
    return sortedResponses[0];
  };
  
  const primaryResponse = getMostVerifiedResponse();
  
  return (
    <div className="relative min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <div className="blur-background">
        <div className="blur-circle bg-blue-300 w-[500px] h-[500px] top-[-100px] left-[-200px]" />
        <div className="blur-circle bg-purple-300 w-[400px] h-[400px] bottom-[-100px] right-[-150px]" />
      </div>
      
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium mb-4"
          >
            Powered by Flare Data Connector
          </motion.div>
          
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Verifiable AI Knowledge
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Consensus-verified AI responses you can trust, secured by decentralized validation.
          </p>
        </motion.div>
        
        <QueryInterface />
        
        {responses.length > 0 && (
          <>
            {primaryResponse && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-12 p-6 rounded-xl glass card-shadow"
              >
                <h2 className="text-xl font-semibold mb-2">Response to: "{query}"</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 text-lg">{primaryResponse.content}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center text-sm text-gray-500">
                  <span>Source: {primaryResponse.source}</span>
                  <span className="mx-2">•</span>
                  <span>{primaryResponse.verified ? 'Verified' : 'Pending verification'}</span>
                </div>
              </motion.div>
            )}
            
            <ConsensusVisual responses={responses} />
            
            <div className="mt-12">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-semibold mb-4"
              >
                All AI Responses
              </motion.h2>
              
              <div className="space-y-6">
                {responses.map((response, index) => (
                  <ResponseCard key={response.id} response={response} index={index} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <QueryProvider>
      <Header />
      <MainContent />
    </QueryProvider>
  );
};

export default Index;
