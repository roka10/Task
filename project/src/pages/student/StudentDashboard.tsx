import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Award, 
  BarChart2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTests } from '../../contexts/TestContext';
import { format } from 'date-fns';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { tests, results, getStudentTests, getStudentResults } = useTests();
  
  const studentTests = user ? getStudentTests(user.id) : [];
  const studentResults = user ? getStudentResults(user.id) : [];
  
  // Upcoming tests - tests that are scheduled and not yet completed
  const upcomingTests = studentTests
    .filter(test => test.status === 'scheduled')
    .sort((a, b) => {
      if (!a.scheduledFor || !b.scheduledFor) return 0;
      return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime();
    })
    .slice(0, 3);
  
  // Calculate averages
  const completedResultsCount = studentResults.filter(r => r.completed).length;
  
  const averageScore = completedResultsCount > 0
    ? studentResults.reduce((acc, curr) => acc + (curr.score / curr.maxScore) * 100, 0) / completedResultsCount
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-500">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm">Upcoming Tests</p>
              <p className="text-3xl font-bold mt-1">{upcomingTests.length}</p>
            </div>
            <div className="p-2 bg-blue-800 bg-opacity-30 rounded-lg">
              <Calendar size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-blue-100">
            <Clock size={14} className="mr-1" />
            <span className="text-xs">Next test: {upcomingTests.length > 0 && upcomingTests[0].scheduledFor ? 
              format(new Date(upcomingTests[0].scheduledFor), 'MMM do, h:mm a') : 
              'No upcoming tests'}</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-teal-100 text-sm">Tests Completed</p>
              <p className="text-3xl font-bold mt-1">{completedResultsCount}</p>
            </div>
            <div className="p-2 bg-teal-800 bg-opacity-30 rounded-lg">
              <BookOpen size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-teal-100">
            <Award size={14} className="mr-1" />
            <span className="text-xs">Keep going! You're doing great.</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-indigo-100 text-sm">Average Score</p>
              <p className="text-3xl font-bold mt-1">{averageScore.toFixed(1)}%</p>
            </div>
            <div className="p-2 bg-indigo-800 bg-opacity-30 rounded-lg">
              <BarChart2 size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-indigo-100">
            {averageScore >= 70 ? (
              <>
                <Award size={14} className="mr-1" />
                <span className="text-xs">Excellent performance!</span>
              </>
            ) : (
              <>
                <AlertCircle size={14} className="mr-1" />
                <span className="text-xs">Room for improvement</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Upcoming Tests */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Tests</h2>
          <Link to="/student/upcoming-tests" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            View all <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {upcomingTests.length > 0 ? (
          <div className="space-y-4">
            {upcomingTests.map(test => (
              <div 
                key={test.id} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition duration-150"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{test.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{test.subject}</p>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{test.duration} mins</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    {test.scheduledFor ? format(new Date(test.scheduledFor), 'MMM do, yyyy • h:mm a') : 'Not scheduled'}
                  </div>
                  <Link 
                    to={`/student/test/${test.id}`}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition"
                  >
                    Preview
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={40} className="mx-auto text-gray-300 mb-2" />
            <p>No upcoming tests scheduled</p>
          </div>
        )}
      </div>
      
      {/* Recent Results */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Results</h2>
          <Link to="/student/results" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            View all <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {studentResults.length > 0 ? (
          <div className="space-y-4">
            {studentResults.slice(0, 3).map(result => {
              const test = tests.find(t => t.id === result.testId);
              const scorePercentage = (result.score / result.maxScore) * 100;
              let scoreColor;
              
              if (scorePercentage >= 80) scoreColor = 'text-green-600';
              else if (scorePercentage >= 60) scoreColor = 'text-yellow-600';
              else scoreColor = 'text-red-600';
              
              return (
                <div 
                  key={result.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-150"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{test?.title || 'Unknown Test'}</h3>
                      <p className="text-sm text-gray-500 mt-1">{test?.subject || 'Unknown Subject'}</p>
                    </div>
                    <div className={`font-bold text-lg ${scoreColor}`}>
                      {scorePercentage.toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-500">
                      {format(new Date(result.endTime), 'MMM do, yyyy')}
                    </div>
                    <Link 
                      to={`/student/results/${result.id}`}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Award size={40} className="mx-auto text-gray-300 mb-2" />
            <p>No test results yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;