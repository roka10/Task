import React, { createContext, useContext, useState, ReactNode } from 'react';
import { format } from 'date-fns';

export type Question = {
  id: string;
  text: string;
  type: 'multiple-choice' | 'single-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
};

export type Test = {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration: number; // in minutes
  questions: Question[];
  createdBy: string;
  createdAt: string;
  scheduledFor?: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
};

export type TestResult = {
  id: string;
  testId: string;
  studentId: string;
  startTime: string;
  endTime: string;
  answers: {
    questionId: string;
    answer: string | string[];
    isCorrect: boolean;
    points: number;
  }[];
  score: number;
  maxScore: number;
  tabSwitches: number;
  completed: boolean;
};

type TestContextType = {
  tests: Test[];
  results: TestResult[];
  addTest: (test: Omit<Test, 'id' | 'createdAt'>) => void;
  updateTest: (id: string, updates: Partial<Test>) => void;
  deleteTest: (id: string) => void;
  getTestById: (id: string) => Test | undefined;
  getStudentTests: (studentId: string) => Test[];
  getTeacherTests: (teacherId: string) => Test[];
  submitTestResult: (result: Omit<TestResult, 'id'>) => void;
  getTestResults: (testId: string) => TestResult[];
  getStudentResults: (studentId: string) => TestResult[];
  getResultById: (id: string) => TestResult | undefined;
};

// Sample data
const initialTests: Test[] = [
  {
    id: '1',
    title: 'Thermodynamics Basics',
    description: 'Test your knowledge on basic thermodynamic principles',
    subject: 'Engineering Physics',
    duration: 60,
    questions: [
      {
        id: '1-1',
        text: 'What is the first law of thermodynamics?',
        type: 'single-choice',
        options: [
          'Energy cannot be created or destroyed, only transferred or converted',
          'Heat naturally flows from regions of higher temperature to regions of lower temperature',
          'The entropy of an isolated system not in equilibrium will tend to increase over time',
          'For a reversible process, the entropy change is zero'
        ],
        correctAnswer: 'Energy cannot be created or destroyed, only transferred or converted',
        points: 5
      },
      {
        id: '1-2',
        text: 'True or False: The efficiency of a Carnot engine depends on the working substance.',
        type: 'true-false',
        correctAnswer: 'false',
        points: 3
      },
      {
        id: '1-3',
        text: 'Which of the following are state functions? (Select all that apply)',
        type: 'multiple-choice',
        options: [
          'Internal Energy',
          'Heat',
          'Enthalpy',
          'Work'
        ],
        correctAnswer: ['Internal Energy', 'Enthalpy'],
        points: 5
      },
      {
        id: '1-4',
        text: 'Define entropy in your own words.',
        type: 'short-answer',
        correctAnswer: 'entropy',
        points: 7
      }
    ],
    createdBy: '1', // Teacher ID
    createdAt: '2025-04-10T10:00:00Z',
    scheduledFor: '2025-04-15T14:00:00Z',
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Circuit Analysis',
    description: 'Test on fundamental circuit analysis techniques',
    subject: 'Electrical Engineering',
    duration: 90,
    questions: [
      {
        id: '2-1',
        text: 'What is Kirchhoff\'s Current Law?',
        type: 'single-choice',
        options: [
          'The algebraic sum of currents entering a node is zero',
          'The algebraic sum of voltages around a closed loop is zero',
          'Current is directly proportional to voltage',
          'Power equals voltage times current'
        ],
        correctAnswer: 'The algebraic sum of currents entering a node is zero',
        points: 5
      },
      {
        id: '2-2',
        text: 'True or False: In a parallel circuit, the voltage is the same across all components.',
        type: 'true-false',
        correctAnswer: 'true',
        points: 3
      }
    ],
    createdBy: '1', // Teacher ID
    createdAt: '2025-04-05T15:30:00Z',
    scheduledFor: '2025-04-20T10:00:00Z',
    status: 'scheduled'
  }
];

const initialResults: TestResult[] = [
  {
    id: '1',
    testId: '1',
    studentId: '2',
    startTime: '2025-04-15T14:00:00Z',
    endTime: '2025-04-15T14:45:30Z',
    answers: [
      {
        questionId: '1-1',
        answer: 'Energy cannot be created or destroyed, only transferred or converted',
        isCorrect: true,
        points: 5
      },
      {
        questionId: '1-2',
        answer: 'false',
        isCorrect: true,
        points: 3
      },
      {
        questionId: '1-3',
        answer: ['Internal Energy', 'Enthalpy'],
        isCorrect: true,
        points: 5
      },
      {
        questionId: '1-4',
        answer: 'Entropy is a measure of disorder or randomness in a system',
        isCorrect: true,
        points: 7
      }
    ],
    score: 20,
    maxScore: 20,
    tabSwitches: 0,
    completed: true
  }
];

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tests, setTests] = useState<Test[]>(initialTests);
  const [results, setResults] = useState<TestResult[]>(initialResults);

  const addTest = (test: Omit<Test, 'id' | 'createdAt'>) => {
    const newTest: Test = {
      ...test,
      id: `${tests.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    setTests([...tests, newTest]);
  };

  const updateTest = (id: string, updates: Partial<Test>) => {
    setTests(tests.map(test => test.id === id ? { ...test, ...updates } : test));
  };

  const deleteTest = (id: string) => {
    setTests(tests.filter(test => test.id !== id));
  };

  const getTestById = (id: string) => {
    return tests.find(test => test.id === id);
  };

  const getStudentTests = (studentId: string) => {
    // Return tests that are either active or scheduled
    return tests.filter(test => test.status === 'active' || test.status === 'scheduled');
  };

  const getTeacherTests = (teacherId: string) => {
    // Return tests created by this teacher
    return tests.filter(test => test.createdBy === teacherId);
  };

  const submitTestResult = (result: Omit<TestResult, 'id'>) => {
    const newResult: TestResult = {
      ...result,
      id: `${results.length + 1}`
    };
    setResults([...results, newResult]);
  };

  const getTestResults = (testId: string) => {
    return results.filter(result => result.testId === testId);
  };

  const getStudentResults = (studentId: string) => {
    return results.filter(result => result.studentId === studentId);
  };

  const getResultById = (id: string) => {
    return results.find(result => result.id === id);
  };

  return (
    <TestContext.Provider value={{
      tests,
      results,
      addTest,
      updateTest,
      deleteTest,
      getTestById,
      getStudentTests,
      getTeacherTests,
      submitTestResult,
      getTestResults,
      getStudentResults,
      getResultById
    }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTests = (): TestContextType => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTests must be used within a TestProvider');
  }
  return context;
};