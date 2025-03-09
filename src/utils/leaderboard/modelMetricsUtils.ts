
import { Response } from '../../types/query';
import { calculateJaccardSimilarity } from '../consensus/similarityUtils';

/**
 * Calculate various accuracy metrics for a model based on its responses
 */
export interface ModelMetrics {
  modelName: string;
  accuracyScore: number;
  hallucinationRate: number;
  consensusAgreement: number;
  responseQuality: number;
  factualConsistency: number;
  outlierScore: number;
  contradictionRate: number;
  totalResponses: number;
  verifiedResponses: number;
}

/**
 * Calculate accuracy metrics for a single model
 */
export const calculateModelMetrics = (
  modelResponses: Response[],
  allResponses: Response[],
  consensusText: string
): ModelMetrics => {
  if (modelResponses.length === 0) {
    return createEmptyMetrics('Unknown');
  }
  
  const modelName = modelResponses[0].source;
  const totalResponses = modelResponses.length;
  const verifiedResponses = modelResponses.filter(r => r.verified).length;
  
  // Calculate average similarity to consensus (accuracy)
  const consensusAgreement = modelResponses.reduce((sum, response) => {
    return sum + calculateJaccardSimilarity(response.content, consensusText);
  }, 0) / totalResponses;
  
  // Calculate response quality based on confidence
  const responseQuality = modelResponses.reduce((sum, response) => {
    return sum + response.confidence;
  }, 0) / totalResponses;
  
  // Calculate outlier score (how different from other models)
  const outlierScore = calculateOutlierScore(modelResponses, allResponses);
  
  // Calculate contradiction rate (internal consistency between model responses)
  const contradictionRate = calculateContradictionRate(modelResponses);
  
  // Calculate hallucination rate (inverse of factual consistency)
  const factualConsistency = (consensusAgreement + responseQuality) / 2;
  const hallucinationRate = Math.max(0, 1 - factualConsistency);
  
  // Overall accuracy score (weighted combination of metrics)
  const accuracyScore = calculateAccuracyScore(
    consensusAgreement,
    responseQuality,
    factualConsistency,
    1 - outlierScore,
    1 - contradictionRate
  );
  
  return {
    modelName,
    accuracyScore,
    hallucinationRate,
    consensusAgreement,
    responseQuality,
    factualConsistency,
    outlierScore,
    contradictionRate,
    totalResponses,
    verifiedResponses
  };
};

/**
 * Calculate outlier score based on average similarity to other models
 */
const calculateOutlierScore = (modelResponses: Response[], allResponses: Response[]): number => {
  if (modelResponses.length === 0 || allResponses.length <= 1) return 0;
  
  // For each model response, calculate average similarity to all other models
  let totalSimilarity = 0;
  let comparisonCount = 0;
  
  modelResponses.forEach(modelResponse => {
    allResponses.forEach(otherResponse => {
      // Skip comparing to same model
      if (modelResponse.id === otherResponse.id) return;
      
      const similarity = calculateJaccardSimilarity(
        modelResponse.content,
        otherResponse.content
      );
      
      totalSimilarity += similarity;
      comparisonCount++;
    });
  });
  
  // Invert similarity to get outlier score (1 = completely different, 0 = identical)
  return comparisonCount > 0 
    ? 1 - (totalSimilarity / comparisonCount)
    : 0;
};

/**
 * Calculate contradiction rate within a model's responses
 */
const calculateContradictionRate = (modelResponses: Response[]): number => {
  if (modelResponses.length <= 1) return 0;
  
  // Compare each response to others from same model
  let totalSimilarity = 0;
  let comparisonCount = 0;
  
  for (let i = 0; i < modelResponses.length; i++) {
    for (let j = i + 1; j < modelResponses.length; j++) {
      const similarity = calculateJaccardSimilarity(
        modelResponses[i].content,
        modelResponses[j].content
      );
      
      totalSimilarity += similarity;
      comparisonCount++;
    }
  }
  
  // Invert to get contradiction rate
  return comparisonCount > 0
    ? 1 - (totalSimilarity / comparisonCount)
    : 0;
};

/**
 * Calculate weighted accuracy score from multiple metrics
 */
const calculateAccuracyScore = (
  consensusAgreement: number,
  responseQuality: number,
  factualConsistency: number,
  outlierScore: number,
  contradictionScore: number
): number => {
  // Weight factors (can be adjusted)
  const weights = {
    consensusAgreement: 0.3,
    responseQuality: 0.2,
    factualConsistency: 0.2,
    outlierScore: 0.15,
    contradictionScore: 0.15
  };
  
  return (
    consensusAgreement * weights.consensusAgreement +
    responseQuality * weights.responseQuality +
    factualConsistency * weights.factualConsistency +
    outlierScore * weights.outlierScore +
    contradictionScore * weights.contradictionScore
  );
};

/**
 * Group responses by model and calculate metrics for each model
 */
export const calculateAllModelMetrics = (
  responses: Response[],
  consensusText: string
): ModelMetrics[] => {
  // Group responses by model
  const modelResponsesMap: Record<string, Response[]> = {};
  
  responses.forEach(response => {
    if (!modelResponsesMap[response.source]) {
      modelResponsesMap[response.source] = [];
    }
    modelResponsesMap[response.source].push(response);
  });
  
  // Calculate metrics for each model
  return Object.values(modelResponsesMap).map(modelResponses => 
    calculateModelMetrics(modelResponses, responses, consensusText)
  );
};

/**
 * Create empty metrics object for a model
 */
const createEmptyMetrics = (modelName: string): ModelMetrics => ({
  modelName,
  accuracyScore: 0,
  hallucinationRate: 0,
  consensusAgreement: 0,
  responseQuality: 0,
  factualConsistency: 0,
  outlierScore: 0,
  contradictionRate: 0,
  totalResponses: 0,
  verifiedResponses: 0
});
