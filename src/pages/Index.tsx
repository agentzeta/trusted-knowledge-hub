
import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import QueryInterface from '../components/QueryInterface';
import ConsensusVisual from '../components/ConsensusVisual';
import ConsensusStatistics from '../components/ConsensusStatistics';
import BlockchainVerification from '../components/BlockchainVerification';
import CommunityQueries from '../components/CommunityQueries';
import { useQueryContext } from '../hooks/useQueryContext';
import { Shield, Settings } from 'lucide-react';
import GoogleAuth from '../components/GoogleAuth';
import VoiceAgentButton from '../components/VoiceAgentButton';
import VideoAgentButton from '../components/VideoAgentButton';
import AgentVeritasAvatar from '../components/AgentVeritasAvatar';
import VoiceSettings from '../components/voice/VoiceSettings';
import { Button } from '@/components/ui/button';

const TruthfulLogo = () => (
  <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg shadow-md">
    <div className="text-xl font-bold text-white flex items-center gap-2">
      <Shield className="w-6 h-6" />
      <span>Truthful</span>
    </div>
  </div>
);

const AgentVeritasLogo = () => (
  <div className="flex items-center gap-2">
    <div className="relative">
      <div className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-1">
        <AgentVeritasAvatar size="lg" />
      </div>
      <div className="absolute -bottom-1 -right-1 bg-pink-600 rounded-full p-1 border-2 border-white">
        <Shield className="w-3 h-3 text-white" />
      </div>
    </div>
    <div>
      <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
        Agent Veritas
      </div>
    </div>
  </div>
);

const Index = () => {
  const { responses, query } = useQueryContext();
  
  return (
    <div className="relative min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <Header />
      <GoogleAuth />
      <VoiceAgentButton />
      <VideoAgentButton />
      
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
          
          <div className="flex flex-col items-center justify-center mb-4 gap-6">
            <TruthfulLogo />
            <div className="mt-3">
              <AgentVeritasLogo />
            </div>
          </div>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Verifiable knowledge you can trust from AI - powered by Consensus Learning
          </p>
        </motion.div>
        
        <QueryInterface />
        
        {responses.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6"
          >
            <ConsensusVisual responses={responses} />
            <ConsensusStatistics responses={responses} />
            <BlockchainVerification />
          </motion.div>
        )}

        <CommunityQueries />
      </div>
    </div>
  );
};

export default Index;
