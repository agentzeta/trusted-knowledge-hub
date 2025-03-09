
// This file is now just a re-export of all consensus utilities for backward compatibility
// It helps maintain compatibility with existing imports while we transition to the new structure

import { 
  calculateJaccardSimilarity
} from './consensus/similarityUtils';

import {
  isOutlier,
  clusterResponses,
  extractCommonInformation,
  calculateConsensusConfidence
} from './consensus/clusteringUtils';

import {
  verifyResponses
} from './consensus/verificationUtils';

import {
  analyzeConsensus,
  calculateAverageSimilarity
} from './consensus/analysisUtils';

import {
  deriveConsensusResponse
} from './consensus/derivationUtils';

import {
  generateConsensusExplanation
} from './consensus/explanationUtils';

// Re-export everything for backward compatibility
export {
  calculateJaccardSimilarity,
  isOutlier,
  clusterResponses,
  extractCommonInformation,
  calculateConsensusConfidence,
  verifyResponses,
  analyzeConsensus,
  calculateAverageSimilarity,
  deriveConsensusResponse,
  generateConsensusExplanation
};
