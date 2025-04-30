import React from 'react';
import TestResults from '../../components/student/TestResults';

const ResultsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Test Results</h1>
      <TestResults />
    </div>
  );
};

export default ResultsPage;