import React, { useState } from 'react';
import { Users, Plus, Trash2, UserPlus, X } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Group {
  id: string;
  name: string;
  students: Student[];
}

interface StudentGroupManagerProps {
  groups: Group[];
  students: Student[];
  onCreateGroup: (name: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onAddStudentToGroup: (groupId: string, studentId: string) => void;
  onRemoveStudentFromGroup: (groupId: string, studentId: string) => void;
}

const StudentGroupManager: React.FC<StudentGroupManagerProps> = ({
  groups,
  students,
  onCreateGroup,
  onDeleteGroup,
  onAddStudentToGroup,
  onRemoveStudentFromGroup,
}) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      onCreateGroup(newGroupName.trim());
      setNewGroupName('');
    }
  };

  const availableStudents = students.filter(student => {
    const group = groups.find(g => g.id === selectedGroup);
    return !group?.students.some(s => s.id === student.id);
  });

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Groups</h2>
        
        {/* Create new group form */}
        <form onSubmit={handleCreateGroup} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={16} className="mr-2" />
              Create Group
            </button>
          </div>
        </form>

        {/* Groups list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Groups sidebar */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-3">Groups</h3>
            <div className="space-y-2">
              {groups.map(group => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-md ${
                    selectedGroup === group.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    <span>{group.name}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({group.students.length})
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteGroup(group.id);
                    }}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </button>
              ))}
            </div>
          </div>

          {/* Group details and management */}
          <div className="md:col-span-2 border rounded-lg p-4">
            {selectedGroup ? (
              <>
                <h3 className="font-medium text-gray-700 mb-4">
                  {groups.find(g => g.id === selectedGroup)?.name} - Members
                </h3>
                
                {/* Add students */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Add Students
                  </label>
                  <div className="space-y-2">
                    {availableStudents.map(student => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
                      >
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                        <button
                          onClick={() => onAddStudentToGroup(selectedGroup, student.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <UserPlus size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current members */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Members</h4>
                  <div className="space-y-2">
                    {groups
                      .find(g => g.id === selectedGroup)
                      ?.students.map(student => (
                        <div
                          key={student.id}
                          className="flex items-center justify-between p-2 rounded-md bg-gray-50"
                        >
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                          <button
                            onClick={() => onRemoveStudentFromGroup(selectedGroup, student.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users size={40} className="mx-auto text-gray-300 mb-2" />
                <p>Select a group to manage members</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGroupManager;