import React from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, HelpCircle } from 'lucide-react';

interface TestSummaryProps {
  questions: {
    id: string;
    text: string;
    timeSpent: number;
    isAnswered: boolean;
    isCorrect?: boolean;
  }[];
  totalTime: number;
  tabSwitches: number;
  onClose: () => void;
}

const TestSummary: React.FC<TestSummaryProps> = ({
  questions,
  totalTime,
  tabSwitches,
  onClose,
}) => {
  const attempted = questions.filter(q => q.isAnswered).length;
  const correct = questions.filter(q => q.isCorrect).length;
  const unattempted = questions.length - attempted;
  
  return (
    <div className="bg-white rounded-xl shadow-lg max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Summary</h2>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-blue-600">Attempted</p>
              <p className="text-xl font-bold text-gray-900">{attempted}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm text-red-600">Unattempted</p>
              <p className="text-xl font-bold text-gray-900">{unattempted}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm text-green-600">Correct</p>
              <p className="text-xl font-bold text-gray-900">{correct}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm text-yellow-600">Total Time</p>
              <p className="text-xl font-bold text-gray-900">{Math.floor(totalTime / 60)}m</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Security Warning */}
      {tabSwitches > 0 && (
        <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Security Violations Detected</h3>
              <p className="mt-1 text-sm text-red-700">
                Tab switching was detected {tabSwitches} times during your test.
                This may affect your test evaluation.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Question Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Question Details</h3>
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="border rounded-lg p-4 bg-gray-50"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  Question {index + 1}
                </h4>
                <p className="mt-1 text-sm text-gray-600">{question.text}</p>
              </div>
              <div className="ml-4 flex items-center space-x-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-600">
                    {Math.floor(question.timeSpent / 60)}m {question.timeSpent % 60}s
                  </span>
                </div>
                {question.isAnswered ? (
                  question.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )
                ) : (
                  <HelpCircle className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Close Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Close Summary
        </button>
      </div>
    </div>
  );
};

export default TestSummary;