
import React from 'react';
import { Response } from '../../types/query';
import { calculateJaccardSimilarity } from '../../utils/consensusUtils';

interface SimilarityMatrixProps {
  responses: Response[];
}

const SimilarityMatrix: React.FC<SimilarityMatrixProps> = ({ responses }) => {
  if (responses.length === 0) return null;
  
  return (
    <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl">
      <h3 className="text-sm font-medium mb-2">Jaccard Similarity Matrix</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 bg-gray-100 dark:bg-gray-700">Model</th>
              {responses.map((r, i) => (
                <th key={i} className="border border-gray-300 px-4 py-2 bg-gray-100 dark:bg-gray-700">{r.source}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {responses.map((r1, i) => (
              <tr key={i}>
                <td className="border border-gray-300 px-4 py-2 font-medium">{r1.source}</td>
                {responses.map((r2, j) => {
                  const similarity = r1.id === r2.id 
                    ? 1 
                    : calculateJaccardSimilarity(r1.content, r2.content);
                  
                  // Color scale from red (0) to green (1)
                  const colorValue = Math.round(similarity * 255);
                  const bgColor = similarity === 1
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : `rgb(${255 - colorValue}, ${colorValue}, 100)`;
                  
                  return (
                    <td 
                      key={j} 
                      className={`border border-gray-300 px-4 py-2 text-center ${bgColor}`}
                    >
                      {(similarity * 100).toFixed(0)}%
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SimilarityMatrix;
