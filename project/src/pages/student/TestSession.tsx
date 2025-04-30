import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTests } from '../../contexts/TestContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTestSecurity } from '../../hooks/useTestSecurity';
import VideoProctoring from '../../components/test/VideoProctoring';
import TestWarningModal from '../../components/test/TestWarningModal';
import TestSummary from '../../components/test/TestSummary';
import { AlertTriangle, Clock, ChevronLeft, ChevronRight, Save } from 'lucide-react';

const TestSession: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const { user } = useAuth();
  const { getTestById, submitTestResult } = useTests();
  const navigate = useNavigate();

  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>({});
  const [remainingTime, setRemainingTime] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const test = testId ? getTestById(testId) : null;

  const { tabSwitches, isFullScreen, toggleFullScreen } = useTestSecurity({
    maxTabSwitches: 3,
    onMaxViolations: () => {
      setWarningMessage('Maximum tab switches detected. This will be reported.');
      setShowWarning(true);
    },
    onViolation: (count) => {
      setWarningMessage(`Warning: Tab switching detected (${count}/3)`);
      setShowWarning(true);
    },
  });

  useEffect(() => {
    if (test && testStarted && !testCompleted) {
      setRemainingTime(test.duration * 60);
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [test, testStarted, testCompleted]);

  const handleStartTest = async () => {
    if (!isFullScreen) {
      await toggleFullScreen();
    }
    setTestStarted(true);
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleTestComplete = () => {
    if (!test || !user) return;

    const results = {
      testId: test.id,
      studentId: user.id,
      startTime: new Date(Date.now() - test.duration * 60000).toISOString(),
      endTime: new Date().toISOString(),
      answers: test.questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] || '',
        isCorrect: Array.isArray(q.correctAnswer)
          ? Array.isArray(answers[q.id]) &&
            q.correctAnswer.every((a) => (answers[q.id] as string[]).includes(a))
          : q.correctAnswer === answers[q.id],
        points: q.points,
      })),
      score: test.questions.reduce((sum, q) => {
        const isCorrect = Array.isArray(q.correctAnswer)
          ? Array.isArray(answers[q.id]) &&
            q.correctAnswer.every((a) => (answers[q.id] as string[]).includes(a))
          : q.correctAnswer === answers[q.id];
        return sum + (isCorrect ? q.points : 0);
      }, 0),
      maxScore: test.questions.reduce((sum, q) => sum + q.points, 0),
      tabSwitches,
      completed: true,
    };

    submitTestResult(results);
    setTestCompleted(true);
  };

  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Not Found</h2>
        <p className="text-gray-600 mb-4">The test you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/student/dashboard')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <TestSummary
        questions={test.questions.map((q) => ({
          id: q.id,
          text: q.text,
          timeSpent: 0, // You could track time per question if needed
          isAnswered: !!answers[q.id],
          isCorrect: Array.isArray(q.correctAnswer)
            ? Array.isArray(answers[q.id]) &&
              q.correctAnswer.every((a) => (answers[q.id] as string[]).includes(a))
            : q.correctAnswer === answers[q.id],
        }))}
        totalTime={test.duration * 60 - remainingTime}
        tabSwitches={tabSwitches}
        onClose={() => navigate('/student/dashboard')}
      />
    );
  }

  if (!testStarted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{test.title}</h1>
          <div className="mb-6">
            <p className="text-gray-600">{test.description}</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2" />
              <span>Duration: {test.duration} minutes</span>
            </div>
            <div className="flex items-center text-gray-700">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>Questions: {test.questions.length}</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <h3 className="font-medium text-yellow-800 mb-2">Important Instructions</h3>
            <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
              <li>The test will be conducted in full-screen mode</li>
              <li>Tab switching or leaving the window will be recorded</li>
              <li>Ensure stable internet connection before starting</li>
              <li>Timer will start immediately after clicking "Start Test"</li>
            </ul>
          </div>

          <button
            onClick={handleStartTest}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showWarning && (
        <TestWarningModal
          message={warningMessage}
          onClose={() => setShowWarning(false)}
        />
      )}

      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">{test.title}</h1>
            <div className="flex items-center space-x-4">
              <div className="text-gray-600">
                Time Remaining:{' '}
                <span className="font-medium">
                  {Math.floor(remainingTime / 60)}:
                  {(remainingTime % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <button
                onClick={handleTestComplete}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Question {currentQuestionIndex + 1} of {test.questions.length}
            </h2>
            <p className="text-gray-800">{test.questions[currentQuestionIndex].text}</p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {test.questions[currentQuestionIndex].type === 'multiple-choice' && (
              test.questions[currentQuestionIndex].options?.map((option, index) => (
                <label key={index} className="flex items-start">
                  <input
                    type="checkbox"
                    checked={Array.isArray(answers[test.questions[currentQuestionIndex].id]) &&
                      (answers[test.questions[currentQuestionIndex].id] as string[]).includes(option)}
                    onChange={(e) => {
                      const currentAnswers = Array.isArray(answers[test.questions[currentQuestionIndex].id])
                        ? answers[test.questions[currentQuestionIndex].id] as string[]
                        : [];
                      
                      if (e.target.checked) {
                        handleAnswerChange(test.questions[currentQuestionIndex].id, [...currentAnswers, option]);
                      } else {
                        handleAnswerChange(
                          test.questions[currentQuestionIndex].id,
                          currentAnswers.filter((a) => a !== option)
                        );
                      }
                    }}
                    className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-gray-700">{option}</span>
                </label>
              ))
            )}

            {test.questions[currentQuestionIndex].type === 'single-choice' && (
              test.questions[currentQuestionIndex].options?.map((option, index) => (
                <label key={index} className="flex items-start">
                  <input
                    type="radio"
                    checked={answers[test.questions[currentQuestionIndex].id] === option}
                    onChange={() => handleAnswerChange(test.questions[currentQuestionIndex].id, option)}
                    name={`question-${test.questions[currentQuestionIndex].id}`}
                    className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-gray-700">{option}</span>
                </label>
              ))
            )}

            {test.questions[currentQuestionIndex].type === 'true-false' && (
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={answers[test.questions[currentQuestionIndex].id] === 'true'}
                    onChange={() => handleAnswerChange(test.questions[currentQuestionIndex].id, 'true')}
                    name={`question-${test.questions[currentQuestionIndex].id}`}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">True</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={answers[test.questions[currentQuestionIndex].id] === 'false'}
                    onChange={() => handleAnswerChange(test.questions[currentQuestionIndex].id, 'false')}
                    name={`question-${test.questions[currentQuestionIndex].id}`}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-gray-700">False</span>
                </label>
              </div>
            )}

            {test.questions[currentQuestionIndex].type === 'short-answer' && (
              <textarea
                value={answers[test.questions[currentQuestionIndex].id] as string || ''}
                onChange={(e) => handleAnswerChange(test.questions[currentQuestionIndex].id, e.target.value)}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter your answer here..."
              />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} className="mr-1" />
            Previous
          </button>
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.min(test.questions.length - 1, prev + 1))}
            disabled={currentQuestionIndex === test.questions.length - 1}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>

      <VideoProctoring onViolation={() => setTabSwitches((prev) => prev + 1)} />
    </div>
  );
};

export default TestSession;