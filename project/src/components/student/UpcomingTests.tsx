import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { useTests } from '../../contexts/TestContext';
import { format } from 'date-fns';

const UpcomingTests: React.FC = () => {
  const { tests } = useTests();
  
  const upcomingTests = tests
    .filter(test => test.status === 'scheduled')
    .sort((a, b) => {
      if (!a.scheduledFor || !b.scheduledFor) return 0;
      return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime();
    });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Tests</h2>
      
      {upcomingTests.length > 0 ? (
        <div className="space-y-4">
          {upcomingTests.map(test => (
            <div 
              key={test.id} 
              className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{test.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{test.subject}</p>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="text-gray-400 dark:text-gray-500 mr-1" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">{test.duration} mins</span>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {test.scheduledFor ? format(new Date(test.scheduledFor), 'MMM do, yyyy • h:mm a') : 'Not scheduled'}
                </div>
                <Link 
                  to={`/student/test/${test.id}`}
                  className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                >
                  Preview
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Calendar size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
          <p>No upcoming tests scheduled</p>
        </div>
      )}
    </div>
  );
};

export default UpcomingTests;