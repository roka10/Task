import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Award, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { useTests } from '../../contexts/TestContext';
import { format } from 'date-fns';

const TestResults: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const { getResultById, getTestById } = useTests();
  const navigate = useNavigate();
  
  const result = resultId ? getResultById(resultId) : null;
  const test = result?.testId ? getTestById(result.testId) : null;
  
  if (!result || !test) {
    return (
      <div className="flex flex-col items-center justify-center h-80">
        <FileText size={48} className="text-gray-300 mb-4" />
        <p className="text-gray-500">Result not found</p>
        <button
          onClick={() => navigate('/student/dashboard')}
          className="mt-4 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  const scorePercentage = (result.score / result.maxScore) * 100;
  let scoreColor, scoreGrade, scoreMessage;
  
  if (scorePercentage >= 90) {
    scoreColor = 'text-green-600';
    scoreGrade = 'A';
    scoreMessage = 'Excellent! Outstanding performance.';
  } else if (scorePercentage >= 80) {
    scoreColor = 'text-green-600';
    scoreGrade = 'B';
    scoreMessage = 'Great job! Very good understanding.';
  } else if (scorePercentage >= 70) {
    scoreColor = 'text-yellow-600';
    scoreGrade = 'C';
    scoreMessage = 'Good work. Solid performance.';
  } else if (scorePercentage >= 60) {
    scoreColor = 'text-yellow-600';
    scoreGrade = 'D';
    scoreMessage = 'Fair. Some areas need improvement.';
  } else {
    scoreColor = 'text-red-600';
    scoreGrade = 'F';
    scoreMessage = 'Needs improvement. Review the material again.';
  }
  
  // Calculate time taken
  const startTime = new Date(result.startTime);
  const endTime = new Date(result.endTime);
  const timeTakenMs = endTime.getTime() - startTime.getTime();
  const timeTakenMinutes = Math.floor(timeTakenMs / 60000);
  const timeTakenSeconds = Math.floor((timeTakenMs % 60000) / 1000);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          to="/student/dashboard"
          className="inline-flex items-center text-blue-700 hover:text-blue-900"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{test.title}</h1>
          <p className="text-gray-600 mb-6">{test.subject}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Score card */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Score</p>
                  <div className="flex items-baseline mt-1">
                    <p className={`text-3xl font-bold ${scoreColor}`}>{scorePercentage.toFixed(1)}%</p>
                    <p className="ml-2 text-gray-500">
                      ({result.score}/{result.maxScore})
                    </p>
                  </div>
                </div>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  scorePercentage >= 70 ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  <Award size={20} className={
                    scorePercentage >= 70 ? 'text-green-600' : 'text-yellow-600'
                  } />
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">{scoreMessage}</p>
            </div>
            
            {/* Grade card */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100 p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-purple-700 font-medium">Grade</p>
                  <p className={`text-3xl font-bold mt-1 ${scoreColor}`}>{scoreGrade}</p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
                  <FileText size={20} className="text-purple-600" />
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                {scoreGrade === 'A' || scoreGrade === 'B' 
                  ? 'Well done on achieving a high grade!' 
                  : 'Keep practicing to improve your grade.'}
              </p>
            </div>
            
            {/* Time card */}
            <div className="bg-gradient-to-br from-cyan-50 to-white rounded-xl border border-cyan-100 p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-cyan-700 font-medium">Time Taken</p>
                  <p className="text-3xl font-bold mt-1 text-gray-800">
                    {timeTakenMinutes}:{timeTakenSeconds.toString().padStart(2, '0')}
                  </p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-100">
                  <Clock size={20} className="text-cyan-600" />
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Test completed on {format(endTime, 'MMMM d, yyyy')}
              </p>
            </div>
          </div>
          
          {/* Tab switching warning */}
          {result.tabSwitches > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <div className="flex items-start">
                <AlertTriangle size={20} className="text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Tab Switching Detected</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your test session recorded {result.tabSwitches} instances of tab switching.
                    This may be subject to review by instructors.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Answers review */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Answers Review</h2>
            <div className="space-y-6">
              {result.answers.map((answer, index) => {
                const question = test.questions.find(q => q.id === answer.questionId);
                if (!question) return null;
                
                return (
                  <div 
                    key={question.id}
                    className={`border rounded-lg p-5 ${
                      answer.isCorrect 
                        ? 'border-green-200 bg-green-50' 
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-gray-900">
                        Question {index + 1}
                        <span className="ml-2 text-sm text-gray-500">({question.points} points)</span>
                      </h3>
                      
                      {answer.isCorrect ? (
                        <div className="flex items-center text-green-600">
                          <CheckCircle size={16} className="mr-1" />
                          <span className="text-sm font-medium">Correct</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <XCircle size={16} className="mr-1" />
                          <span className="text-sm font-medium">Incorrect</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-800 mb-4">{question.text}</p>
                    
                    <div className="space-y-3">
                      {/* Your answer */}
                      <div>
                        <p className="text-sm font-medium text-gray-700">Your Answer:</p>
                        {Array.isArray(answer.answer) ? (
                          <ul className="list-disc list-inside text-gray-800 ml-2 mt-1">
                            {answer.answer.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-800 mt-1">{answer.answer}</p>
                        )}
                      </div>
                      
                      {/* Correct answer */}
                      {!answer.isCorrect && (
                        <div>
                          <p className="text-sm font-medium text-green-700">Correct Answer:</p>
                          {Array.isArray(question.correctAnswer) ? (
                            <ul className="list-disc list-inside text-gray-800 ml-2 mt-1">
                              {question.correctAnswer.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-800 mt-1">{question.correctAnswer}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResults;