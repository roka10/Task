import React from 'react';
import UpcomingTests from '../../components/student/UpcomingTests';

const UpcomingTestsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Tests</h1>
      <UpcomingTests />
    </div>
  );
};

export default UpcomingTestsPage;