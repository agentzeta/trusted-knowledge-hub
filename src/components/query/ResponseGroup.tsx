
import React from 'react';
import { Response } from '../../types/query';

interface ResponseGroupProps {
  title: string;
  responses: Response[];
  count: number;
}

const ResponseGroup: React.FC<ResponseGroupProps> = ({ title, responses, count }) => {
  if (responses.length === 0) return null;
  
  return (
    <div className="mb-4">
      <h5 className="text-sm font-medium mb-2">{title} ({count})</h5>
      {responses.map((response) => (
        <div 
          key={response.id} 
          className="p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow mb-4"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="font-medium">{response.source}</span>
            <span className={response.verified ? 
              "text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100" : 
              "text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100"}>
              {response.verified ? 'Verified' : 'Divergent'}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{response.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ResponseGroup;
