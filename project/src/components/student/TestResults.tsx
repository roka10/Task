import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Clock, AlertTriangle } from 'lucide-react';
import { useTests } from '../../contexts/TestContext';
import { format } from 'date-fns';

const TestResults: React.FC = () => {
  const { tests, results } = useTests();
  
  const completedResults = results
    .filter(result => result.completed)
    .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime());

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Results</h2>
      
      {completedResults.length > 0 ? (
        <div className="space-y-4">
          {completedResults.map(result => {
            const test = tests.find(t => t.id === result.testId);
            const scorePercentage = (result.score / result.maxScore) * 100;
            let scoreColor;
            
            if (scorePercentage >= 80) scoreColor = 'text-green-600 dark:text-green-400';
            else if (scorePercentage >= 60) scoreColor = 'text-yellow-600 dark:text-yellow-400';
            else scoreColor = 'text-red-600 dark:text-red-400';
            
            return (
              <div 
                key={result.id} 
                className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {test?.title || 'Unknown Test'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {test?.subject || 'Unknown Subject'}
                    </p>
                  </div>
                  <div className={`font-bold text-lg ${scoreColor}`}>
                    {scorePercentage.toFixed(1)}%
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Clock size={14} className="mr-1" />
                      <span className="text-sm">
                        {format(new Date(result.endTime), 'MMM do, yyyy')}
                      </span>
                    </div>
                    {result.tabSwitches > 0 && (
                      <div className="flex items-center text-yellow-600 dark:text-yellow-400">
                        <AlertTriangle size={14} className="mr-1" />
                        <span className="text-sm">{result.tabSwitches} violations</span>
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    to={`/student/results/${result.id}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Award size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
          <p>No test results yet</p>
        </div>
      )}
    </div>
  );
};

export default TestResults;