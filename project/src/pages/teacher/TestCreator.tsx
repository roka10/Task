import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  Calendar,
  Clock,
  AlertTriangle,
  HelpCircle,
  CheckCircle
} from 'lucide-react';
import { useTests, Question, Test } from '../../contexts/TestContext';
import { useAuth } from '../../contexts/AuthContext';

type QuestionFormData = {
  id: string;
  text: string;
  type: 'multiple-choice' | 'single-choice' | 'true-false' | 'short-answer';
  options: string[];
  correctAnswer: string | string[];
  points: number;
};

const TestCreator: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const { user } = useAuth();
  const { getTestById, addTest, updateTest } = useTests();
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState(60);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [questions, setQuestions] = useState<QuestionFormData[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  
  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Load test data if editing
  useEffect(() => {
    if (testId) {
      const test = getTestById(testId);
      if (test) {
        setIsEditing(true);
        setTitle(test.title);
        setDescription(test.description);
        setSubject(test.subject);
        setDuration(test.duration);
        
        if (test.scheduledFor) {
          const date = new Date(test.scheduledFor);
          setScheduledDate(date.toISOString().split('T')[0]);
          setScheduledTime(date.toTimeString().slice(0, 5));
        }
        
        setQuestions(test.questions.map(q => ({
          ...q,
          options: q.options || []
        })));
      }
    } else {
      // Initialize with an empty question for new tests
      addEmptyQuestion();
    }
  }, [testId, getTestById]);
  
  const addEmptyQuestion = () => {
    const newQuestion: QuestionFormData = {
      id: `new-${questions.length + 1}`,
      text: '',
      type: 'single-choice',
      options: ['', ''],
      correctAnswer: '',
      points: 5
    };
    
    setQuestions([...questions, newQuestion]);
    setCurrentQuestionIndex(questions.length);
  };
  
  const handleQuestionChange = (key: keyof QuestionFormData, value: any) => {
    const updatedQuestions = [...questions];
    const question = { ...updatedQuestions[currentQuestionIndex] };
    
    // Handle special case for question type change
    if (key === 'type') {
      if (value === 'true-false') {
        question.options = ['True', 'False'];
        question.correctAnswer = 'True';
      } else if (value === 'multiple-choice') {
        if (!Array.isArray(question.correctAnswer)) {
          question.correctAnswer = [question.correctAnswer as string];
        }
      } else if (value === 'single-choice') {
        if (Array.isArray(question.correctAnswer)) {
          question.correctAnswer = question.correctAnswer[0] || '';
        }
      } else if (value === 'short-answer') {
        question.options = [];
        question.correctAnswer = '';
      }
    }
    
    // Update the specified key
    question[key] = value;
    updatedQuestions[currentQuestionIndex] = question;
    
    setQuestions(updatedQuestions);
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    const question = { ...updatedQuestions[currentQuestionIndex] };
    const options = [...question.options];
    options[index] = value;
    question.options = options;
    updatedQuestions[currentQuestionIndex] = question;
    setQuestions(updatedQuestions);
  };
  
  const addOption = () => {
    const updatedQuestions = [...questions];
    const question = { ...updatedQuestions[currentQuestionIndex] };
    question.options = [...question.options, ''];
    updatedQuestions[currentQuestionIndex] = question;
    setQuestions(updatedQuestions);
  };
  
  const removeOption = (index: number) => {
    const updatedQuestions = [...questions];
    const question = { ...updatedQuestions[currentQuestionIndex] };
    
    // Update correct answer if needed
    if (question.type === 'single-choice' && question.correctAnswer === question.options[index]) {
      question.correctAnswer = '';
    } else if (question.type === 'multiple-choice' && Array.isArray(question.correctAnswer)) {
      question.correctAnswer = question.correctAnswer.filter(
        ans => ans !== question.options[index]
      );
    }
    
    question.options = question.options.filter((_, i) => i !== index);
    updatedQuestions[currentQuestionIndex] = question;
    setQuestions(updatedQuestions);
  };
  
  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      return; // Don't remove the last question
    }
    
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    
    // Update current question index if needed
    if (currentQuestionIndex >= updatedQuestions.length) {
      setCurrentQuestionIndex(updatedQuestions.length - 1);
    }
  };
  
  const handleSingleChoiceAnswer = (option: string) => {
    handleQuestionChange('correctAnswer', option);
  };
  
  const handleMultipleChoiceAnswer = (option: string) => {
    const question = questions[currentQuestionIndex];
    let correctAnswers = Array.isArray(question.correctAnswer) 
      ? [...question.correctAnswer] 
      : [];
    
    if (correctAnswers.includes(option)) {
      correctAnswers = correctAnswers.filter(ans => ans !== option);
    } else {
      correctAnswers.push(option);
    }
    
    handleQuestionChange('correctAnswer', correctAnswers);
  };
  
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!subject.trim()) newErrors.subject = 'Subject is required';
    if (duration <= 0) newErrors.duration = 'Duration must be greater than 0';
    
    // Validate scheduled date/time if provided
    if (scheduledDate && !scheduledTime) {
      newErrors.scheduledTime = 'Time is required if date is provided';
    }
    
    // Validate questions
    const questionErrors: string[] = [];
    
    questions.forEach((question, index) => {
      if (!question.text.trim()) {
        questionErrors.push(`Question ${index + 1}: Text is required`);
      }
      
      if (['single-choice', 'multiple-choice'].includes(question.type)) {
        if (question.options.length < 2) {
          questionErrors.push(`Question ${index + 1}: At least 2 options are required`);
        }
        
        if (question.options.some(opt => !opt.trim())) {
          questionErrors.push(`Question ${index + 1}: All options must have content`);
        }
        
        if (question.type === 'single-choice' && !question.correctAnswer) {
          questionErrors.push(`Question ${index + 1}: Correct answer must be selected`);
        }
        
        if (question.type === 'multiple-choice' && 
            (!Array.isArray(question.correctAnswer) || question.correctAnswer.length === 0)) {
          questionErrors.push(`Question ${index + 1}: At least one correct answer must be selected`);
        }
      }
      
      if (question.type === 'short-answer' && !question.correctAnswer) {
        questionErrors.push(`Question ${index + 1}: Correct answer is required`);
      }
    });
    
    if (questions.length === 0) {
      questionErrors.push('At least one question is required');
    }
    
    if (questionErrors.length > 0) {
      newErrors.questions = questionErrors.join('. ');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Format scheduled date/time if provided
      let scheduledFor = undefined;
      if (scheduledDate && scheduledTime) {
        scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
      }
      
      const testData: Omit<Test, 'id' | 'createdAt'> = {
        title,
        description,
        subject,
        duration,
        questions: questions.map(q => ({
          id: q.id,
          text: q.text,
          type: q.type,
          options: q.type === 'short-answer' ? undefined : q.options,
          correctAnswer: q.correctAnswer,
          points: q.points
        })),
        createdBy: user?.id || '',
        scheduledFor,
        status: scheduledFor ? 'scheduled' : 'draft'
      };
      
      if (isEditing && testId) {
        updateTest(testId, testData);
      } else {
        addTest(testData);
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/teacher/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error saving test:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/teacher/dashboard')}
          className="inline-flex items-center text-blue-700 hover:text-blue-900"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </button>
      </div>
      
      {/* Success message */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 flex items-center">
            <CheckCircle size={24} className="text-green-500 mr-3" />
            <p className="text-lg font-medium">Test saved successfully!</p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditing ? 'Edit Test' : 'Create New Test'}
          </h1>
          
          <form onSubmit={handleSubmit}>
            {/* Test details */}
            <div className="space-y-6 mb-8">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Test Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Thermodynamics Midterm"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Describe the purpose and scope of the test"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="e.g., Engineering Physics"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    min="1"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="scheduledDate"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        className="w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="time"
                        id="scheduledTime"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    {errors.scheduledTime && (
                      <p className="mt-1 text-sm text-red-600">{errors.scheduledTime}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-8"></div>
            
            {/* Questions */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Questions</h2>
                <button
                  type="button"
                  onClick={addEmptyQuestion}
                  className="inline-flex items-center px-3 py-1.5 border border-blue-700 text-blue-700 rounded-md hover:bg-blue-50"
                >
                  <Plus size={16} className="mr-1" />
                  Add Question
                </button>
              </div>
              
              {errors.questions && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  <div className="flex">
                    <AlertTriangle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                    <p>{errors.questions}</p>
                  </div>
                </div>
              )}
              
              {/* Question Tabs */}
              <div className="mb-4 overflow-x-auto">
                <div className="flex space-x-2 border-b border-gray-200">
                  {questions.map((question, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                        currentQuestionIndex === index
                          ? 'bg-blue-100 text-blue-800 border-b-2 border-blue-700'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      Q{index + 1}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Current Question Editor */}
              {questions.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-md font-medium text-gray-900">
                      Question {currentQuestionIndex + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeQuestion(currentQuestionIndex)}
                      className="text-red-600 hover:text-red-800 flex items-center text-sm"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Remove
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Text *
                      </label>
                      <textarea
                        value={questions[currentQuestionIndex]?.text || ''}
                        onChange={(e) => handleQuestionChange('text', e.target.value)}
                        rows={2}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter the question"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question Type *
                        </label>
                        <select
                          value={questions[currentQuestionIndex]?.type || 'single-choice'}
                          onChange={(e) => handleQuestionChange('type', e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="single-choice">Single Choice</option>
                          <option value="multiple-choice">Multiple Choice</option>
                          <option value="true-false">True/False</option>
                          <option value="short-answer">Short Answer</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Points *
                        </label>
                        <input
                          type="number"
                          value={questions[currentQuestionIndex]?.points || 5}
                          onChange={(e) => handleQuestionChange('points', parseInt(e.target.value))}
                          min="1"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    
                    {/* Options and Answer (depends on question type) */}
                    {['single-choice', 'multiple-choice'].includes(questions[currentQuestionIndex]?.type) && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Options
                          </label>
                          <button
                            type="button"
                            onClick={addOption}
                            className="text-sm text-blue-700 hover:text-blue-900 flex items-center"
                          >
                            <Plus size={14} className="mr-1" />
                            Add Option
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          {questions[currentQuestionIndex]?.options.map((option, index) => (
                            <div key={index} className="flex items-center">
                              <div className="mr-3">
                                {questions[currentQuestionIndex]?.type === 'single-choice' ? (
                                  <input
                                    type="radio"
                                    checked={questions[currentQuestionIndex]?.correctAnswer === option}
                                    onChange={() => handleSingleChoiceAnswer(option)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    disabled={!option.trim()}
                                  />
                                ) : (
                                  <input
                                    type="checkbox"
                                    checked={Array.isArray(questions[currentQuestionIndex]?.correctAnswer) && 
                                           questions[currentQuestionIndex]?.correctAnswer.includes(option)}
                                    onChange={() => handleMultipleChoiceAnswer(option)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    disabled={!option.trim()}
                                  />
                                )}
                              </div>
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              />
                              <button
                                type="button"
                                onClick={() => removeOption(index)}
                                className="ml-2 text-gray-400 hover:text-red-600"
                                disabled={questions[currentQuestionIndex]?.options.length <= 2}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <p className="mt-2 text-xs text-gray-500">
                          {questions[currentQuestionIndex]?.type === 'single-choice'
                            ? 'Select the radio button next to the correct answer.'
                            : 'Check all options that are correct answers.'
                          }
                        </p>
                      </div>
                    )}
                    
                    {questions[currentQuestionIndex]?.type === 'true-false' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Correct Answer
                        </label>
                        <div className="flex space-x-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              checked={questions[currentQuestionIndex]?.correctAnswer === 'true'}
                              onChange={() => handleQuestionChange('correctAnswer', 'true')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2">True</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              checked={questions[currentQuestionIndex]?.correctAnswer === 'false'}
                              onChange={() => handleQuestionChange('correctAnswer', 'false')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2">False</span>
                          </label>
                        </div>
                      </div>
                    )}
                    
                    {questions[currentQuestionIndex]?.type === 'short-answer' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Keywords for Correct Answer *
                        </label>
                        <div className="flex items-start">
                          <input
                            type="text"
                            value={questions[currentQuestionIndex]?.correctAnswer as string || ''}
                            onChange={(e) => handleQuestionChange('correctAnswer', e.target.value)}
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter keywords that should appear in the answer"
                          />
                          <div className="ml-2 text-gray-400" title="Scoring Information">
                            <HelpCircle size={18} />
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          For short answer questions, enter keywords that should appear in a correct answer.
                          The student's answer will be checked for these keywords.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Submit Button */}
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`inline-flex items-center px-6 py-3 rounded-md text-white font-medium ${
                    isSaving
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  <Save size={16} className="mr-2" />
                  {isSaving ? 'Saving...' : isEditing ? 'Update Test' : 'Save Test'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestCreator;