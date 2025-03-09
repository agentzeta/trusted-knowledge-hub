
import React from 'react';

const MetricsExplanation: React.FC = () => {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <h4>Understanding Our Model Metrics</h4>
      
      <p>
        We evaluate AI models using several key metrics that help determine their reliability and accuracy. 
        Here's what each metric means in plain English:
      </p>
      
      <div className="mt-4 space-y-4">
        <div>
          <h5 className="text-blue-600 dark:text-blue-400">Accuracy Score</h5>
          <p>
            A combined score that represents overall model reliability. Higher is better. 
            This takes into account all other metrics to provide a comprehensive quality rating.
          </p>
        </div>
        
        <div>
          <h5 className="text-red-500 dark:text-red-400">Hallucination Rate</h5>
          <p>
            How often a model makes things up or provides incorrect information. 
            Lower is better. This is calculated by analyzing factual consistency and deviation from consensus.
          </p>
        </div>
        
        <div>
          <h5 className="text-green-600 dark:text-green-400">Consensus Agreement</h5>
          <p>
            How often the model's responses align with the majority view across all models. 
            Higher is better. This measures how well the model keeps to widely agreed-upon information.
          </p>
        </div>
        
        <div>
          <h5 className="text-amber-500 dark:text-amber-400">Response Quality</h5>
          <p>
            A measure of how well-structured, comprehensive, and useful the model's responses are, 
            independent of factual accuracy. Higher is better.
          </p>
        </div>
        
        <div>
          <h5 className="text-purple-500 dark:text-purple-400">Factual Consistency</h5>
          <p>
            How consistent the model is with established facts and information patterns. 
            Higher is better. This is a key component in determining hallucination rate.
          </p>
        </div>
        
        <div>
          <h5 className="text-indigo-500 dark:text-indigo-400">Outlier Score</h5>
          <p>
            How often the model's responses significantly differ from other models. 
            Lower is better for factual questions, though uniqueness can be valuable for creative tasks.
          </p>
        </div>
        
        <div>
          <h5 className="text-orange-500 dark:text-orange-400">Contradiction Rate</h5>
          <p>
            How often the model contradicts itself across different responses. 
            Lower is better. This measures internal consistency in the model's knowledge.
          </p>
        </div>
      </div>
      
      <p className="mt-4 text-sm border-t pt-2 border-gray-200 dark:border-gray-700">
        These metrics are calculated dynamically based on model responses to your queries 
        and improve in accuracy as more data is collected.
      </p>
    </div>
  );
};

export default MetricsExplanation;
