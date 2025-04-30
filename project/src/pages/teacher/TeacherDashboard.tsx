import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  BarChart2, 
  Users, 
  ChevronRight,
  Clock, 
  PlusCircle,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTests } from '../../contexts/TestContext';
import { format, isPast } from 'date-fns';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const { tests, results, getTeacherTests, getTestResults } = useTests();
  
  const teacherTests = user ? getTeacherTests(user.id) : [];
  
  // Scheduled tests
  const scheduledTests = teacherTests
    .filter(test => test.status === 'scheduled' && test.scheduledFor)
    .sort((a, b) => {
      if (!a.scheduledFor || !b.scheduledFor) return 0;
      return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime();
    });
    
  // Calculate number of students who've taken tests
  const uniqueStudentIds = new Set(results.map(result => result.studentId));
  const studentCount = uniqueStudentIds.size;
  
  // Calculate number of completed tests
  const completedTestsCount = results.filter(result => result.completed).length;
  
  // Calculate average score
  const averageScore = results.length > 0
    ? results.reduce((acc, curr) => acc + (curr.score / curr.maxScore) * 100, 0) / results.length
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="text-gray-500">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/teacher/test/create"
          className="bg-white rounded-xl shadow-md overflow-hidden flex items-center hover:shadow-lg transition-shadow"
        >
          <div className="bg-blue-700 p-6 flex items-center justify-center">
            <PlusCircle size={24} className="text-white" />
          </div>
          <div className="p-6 flex-1">
            <h2 className="text-lg font-semibold text-gray-900">Create New Test</h2>
            <p className="text-sm text-gray-500 mt-1">
              Design a new assessment for your students
            </p>
          </div>
          <div className="p-4">
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </Link>
        
        <Link
          to="/teacher/analytics"
          className="bg-white rounded-xl shadow-md overflow-hidden flex items-center hover:shadow-lg transition-shadow"
        >
          <div className="bg-indigo-700 p-6 flex items-center justify-center">
            <BarChart2 size={24} className="text-white" />
          </div>
          <div className="p-6 flex-1">
            <h2 className="text-lg font-semibold text-gray-900">View Analytics</h2>
            <p className="text-sm text-gray-500 mt-1">
              Review performance data and insights
            </p>
          </div>
          <div className="p-4">
            <ChevronRight size={20} className="text-gray-400" />
          </div>
        </Link>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar size={20} className="text-blue-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active Tests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{teacherTests.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users size={20} className="text-green-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{studentCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <BarChart2 size={20} className="text-indigo-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Average Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{averageScore.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Upcoming Tests */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Scheduled Tests</h2>
          <Link to="/teacher/tests" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
            View all <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {scheduledTests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {scheduledTests.map((test) => {
                  const testDate = test.scheduledFor ? new Date(test.scheduledFor) : null;
                  const isTestPast = testDate ? isPast(testDate) : false;
                  
                  return (
                    <tr key={test.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{test.title}</div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-gray-500">
                        {test.subject}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-gray-500">
                        {test.scheduledFor ? format(new Date(test.scheduledFor), 'MMM d, yyyy • h:mm a') : 'Not scheduled'}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-gray-500">
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1 text-gray-400" />
                          {test.duration} mins
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isTestPast
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {isTestPast ? 'In Progress' : 'Upcoming'}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-right">
                        <Link 
                          to={`/teacher/test/edit/${test.id}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </Link>
                        <Link 
                          to={`/teacher/analytics/${test.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Results
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BookOpen size={40} className="mx-auto text-gray-300 mb-2" />
            <p>No tests scheduled</p>
            <p className="text-sm mt-1">Create a new test to get started</p>
          </div>
        )}
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Test Submissions</h2>
        </div>
        
        {results.length > 0 ? (
          <div className="space-y-4">
            {results.slice(0, 5).map(result => {
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
                      <p className="text-sm text-gray-500 mt-1">
                        Student #{result.studentId} • Completed {format(new Date(result.endTime), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className={`font-bold text-lg ${scoreColor}`}>
                      {scorePercentage.toFixed(1)}%
                    </div>
                  </div>
                  
                  {result.tabSwitches > 0 && (
                    <div className="mt-2 text-xs text-yellow-600 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      Tab switches detected: {result.tabSwitches}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users size={40} className="mx-auto text-gray-300 mb-2" />
            <p>No test submissions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;