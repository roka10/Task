import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  BarChart2, 
  Users, 
  Clock, 
  Printer, 
  Download, 
  ArrowLeft,
  AlertTriangle,
  FileText,
  ClipboardList
} from 'lucide-react';
import { useTests } from '../../contexts/TestContext';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const TestAnalytics: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const { getTestById, getTestResults } = useTests();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'students'>('overview');
  
  const test = testId ? getTestById(testId) : null;
  const results = testId ? getTestResults(testId) : [];
  
  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center h-80">
        <FileText size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-500">Test not found</p>
        <button
          onClick={() => navigate('/teacher/dashboard')}
          className="mt-4 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  // Calculate test stats
  const studentCount = results.length;
  const completedCount = results.filter(r => r.completed).length;
  
  const avgScore = studentCount > 0
    ? results.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0) / studentCount
    : 0;
  
  const avgTime = completedCount > 0
    ? results.reduce((sum, r) => {
        const startTime = new Date(r.startTime).getTime();
        const endTime = new Date(r.endTime).getTime();
        return sum + (endTime - startTime) / 60000; // Convert to minutes
      }, 0) / completedCount
    : 0;
  
  // Calculate score distribution
  const scoreRanges = [
    { name: '90-100%', count: 0 },
    { name: '80-89%', count: 0 },
    { name: '70-79%', count: 0 },
    { name: '60-69%', count: 0 },
    { name: '0-59%', count: 0 }
  ];
  
  results.forEach(result => {
    const score = (result.score / result.maxScore) * 100;
    if (score >= 90) scoreRanges[0].count++;
    else if (score >= 80) scoreRanges[1].count++;
    else if (score >= 70) scoreRanges[2].count++;
    else if (score >= 60) scoreRanges[3].count++;
    else scoreRanges[4].count++;
  });
  
  // Calculate per-question stats
  const questionStats = test.questions.map(question => {
    const totalAttempts = results.filter(r => 
      r.answers.some(a => a.questionId === question.id)
    ).length;
    
    const correctCount = results.filter(r => 
      r.answers.some(a => a.questionId === question.id && a.isCorrect)
    ).length;
    
    const correctPercentage = totalAttempts > 0
      ? (correctCount / totalAttempts) * 100
      : 0;
    
    return {
      id: question.id,
      text: question.text,
      correctPercentage,
      correctCount,
      totalAttempts
    };
  });
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link
          to="/teacher/dashboard"
          className="inline-flex items-center text-blue-700 hover:text-blue-900"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{test.title}</h1>
              <p className="text-gray-600">{test.subject}</p>
            </div>
            
            <div className="flex space-x-3">
              <button
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
              >
                <Printer size={16} className="mr-1" />
                <span className="text-sm">Print</span>
              </button>
              <button
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
              >
                <Download size={16} className="mr-1" />
                <span className="text-sm">Export</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-md">
                  <Users size={18} className="text-blue-700" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">Students</p>
                  <p className="text-xl font-bold text-gray-900">{studentCount}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-md">
                  <BarChart2 size={18} className="text-green-700" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">Avg. Score</p>
                  <p className="text-xl font-bold text-gray-900">{avgScore.toFixed(1)}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-md">
                  <Clock size={18} className="text-yellow-700" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">Avg. Time</p>
                  <p className="text-xl font-bold text-gray-900">{avgTime.toFixed(1)} mins</p>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-md">
                  <ClipboardList size={18} className="text-indigo-700" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-indigo-700">Questions</p>
                  <p className="text-xl font-bold text-gray-900">{test.questions.length}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'questions'
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Questions
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'students'
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Students
              </button>
            </nav>
          </div>
          
          {/* Tab content */}
          {activeTab === 'overview' && (
            <div>
              {results.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <ClipboardList size={48} className="mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No test results yet</h3>
                  <p className="text-gray-500">
                    Results will appear here after students complete the test.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Score Distribution</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={scoreRanges}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3B82F6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={scoreRanges}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            >
                              {scoreRanges.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                  
                  {/* Security issues */}
                  {results.some(r => r.tabSwitches > 0) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertTriangle size={20} className="text-yellow-600 mr-3 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-yellow-800">Potential Security Issues Detected</h3>
                          <p className="text-sm text-yellow-700 mt-1">
                            {results.filter(r => r.tabSwitches > 0).length} students had tab switching activity during the test.
                            This may indicate attempts to access unauthorized resources.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'questions' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Question Performance</h2>
              
              {/* Question performance chart */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={questionStats.map((q, i) => ({ 
                      name: `Q${i+1}`, 
                      correctPercentage: q.correctPercentage 
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Correct Answers (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Correct']} />
                    <Bar dataKey="correctPercentage" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Question list */}
              <div className="space-y-4">
                {questionStats.map((questionStat, index) => (
                  <div key={questionStat.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">Question {index + 1}</h3>
                        <p className="text-gray-700 mt-1">{questionStat.text}</p>
                      </div>
                      <div className="ml-4">
                        <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                          questionStat.correctPercentage >= 70
                            ? 'bg-green-100 text-green-800'
                            : questionStat.correctPercentage >= 40
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {questionStat.correctPercentage.toFixed(1)}% correct
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      {questionStat.correctCount} out of {questionStat.totalAttempts} students answered correctly
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'students' && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Student Results</h2>
              
              {results.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                  <Users size={48} className="mx-auto text-gray-300 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No student results</h3>
                  <p className="text-gray-500">
                    Results will appear here after students complete the test.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Taken</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                        <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Security</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {results.map((result) => {
                        const scorePercentage = (result.score / result.maxScore) * 100;
                        const startTime = new Date(result.startTime);
                        const endTime = new Date(result.endTime);
                        const timeTakenMinutes = Math.floor((endTime.getTime() - startTime.getTime()) / 60000);
                        
                        return (
                          <tr key={result.id} className="hover:bg-gray-50">
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">Student #{result.studentId}</div>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <div className={`font-medium ${
                                scorePercentage >= 80
                                  ? 'text-green-600'
                                  : scorePercentage >= 60
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              }`}>
                                {scorePercentage.toFixed(1)}%
                              </div>
                              <div className="text-xs text-gray-500">
                                {result.score}/{result.maxScore} points
                              </div>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-gray-500">
                              {timeTakenMinutes} minutes
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              {result.completed ? (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                  Completed
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                  Incomplete
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              {result.tabSwitches > 0 ? (
                                <div className="flex items-center text-yellow-600">
                                  <AlertTriangle size={14} className="mr-1" />
                                  <span className="text-xs">
                                    {result.tabSwitches} tab switches
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-green-600">No issues</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestAnalytics;