import React, { useState } from 'react';
import { Calendar, Clock, Users, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface Group {
  id: string;
  name: string;
  students: { id: string; name: string }[];
}

interface TestSchedulerProps {
  testId: string;
  groups: Group[];
  onSchedule: (data: {
    testId: string;
    scheduledFor: string;
    groups: string[];
    notifyStudents: boolean;
  }) => void;
}

const TestScheduler: React.FC<TestSchedulerProps> = ({
  testId,
  groups,
  onSchedule,
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [notifyStudents, setNotifyStudents] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!date || !time) {
      setError('Please select both date and time');
      return;
    }

    if (selectedGroups.length === 0) {
      setError('Please select at least one group');
      return;
    }

    const scheduledFor = new Date(`${date}T${time}`);
    if (scheduledFor < new Date()) {
      setError('Cannot schedule test in the past');
      return;
    }

    onSchedule({
      testId,
      scheduledFor: scheduledFor.toISOString(),
      groups: selectedGroups,
      notifyStudents,
    });
  };

  const totalStudents = selectedGroups.reduce((count, groupId) => {
    const group = groups.find(g => g.id === groupId);
    return count + (group?.students.length || 0);
  }, 0);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Schedule Test</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>

            {/* Time selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Group selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Groups
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map(group => (
                <label
                  key={group.id}
                  className={`relative flex items-start p-4 rounded-lg border ${
                    selectedGroups.includes(group.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(group.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedGroups([...selectedGroups, group.id]);
                          } else {
                            setSelectedGroups(selectedGroups.filter(id => id !== group.id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-900">
                          {group.name}
                        </span>
                        <span className="block text-sm text-gray-500">
                          {group.students.length} students
                        </span>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Summary */}
          {selectedGroups.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-400" />
                <span className="ml-2 text-sm text-blue-700">
                  {totalStudents} students will be assigned to this test
                </span>
              </div>
            </div>
          )}

          {/* Notification option */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={notifyStudents}
              onChange={(e) => setNotifyStudents(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Notify students via email
            </label>
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Schedule Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestScheduler;