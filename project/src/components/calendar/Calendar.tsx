import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useTests } from '../../contexts/TestContext';
import { useAuth } from '../../contexts/AuthContext';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user } = useAuth();
  const { tests } = useTests();

  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });

  const scheduledTests = tests.filter(test => test.scheduledFor && 
    isSameMonth(new Date(test.scheduledFor), currentDate));

  const getTestsForDay = (date: Date) => {
    return scheduledTests.filter(test => 
      test.scheduledFor && isSameDay(new Date(test.scheduledFor), date)
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
          Academic Calendar
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentDate(prev => subMonths(prev, 1))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentDate(prev => addMonths(prev, 1))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {format(currentDate, 'MMMM yyyy')}
        </h3>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const testsOnDay = getTestsForDay(day);
          const hasTests = testsOnDay.length > 0;
          
          return (
            <div
              key={day.toString()}
              className={`min-h-[80px] p-2 border rounded-lg ${
                hasTests ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
              }`}
            >
              <div className="text-right">
                <span className={`text-sm ${
                  hasTests ? 'font-medium text-blue-900' : 'text-gray-700'
                }`}>
                  {format(day, 'd')}
                </span>
              </div>
              {hasTests && (
                <div className="mt-1">
                  {testsOnDay.map(test => (
                    <div
                      key={test.id}
                      className="text-xs bg-blue-100 text-blue-800 rounded px-1 py-0.5 mb-1"
                      title={test.title}
                    >
                      {test.title.length > 15 
                        ? `${test.title.substring(0, 15)}...` 
                        : test.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;