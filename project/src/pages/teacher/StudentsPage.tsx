import React, { useState, useEffect } from 'react';
import StudentGroupManager from '../../components/teacher/StudentGroupManager';
import { db } from '../../utils/db';
import { User } from '../../utils/db';
import { Users, Plus, Search } from 'lucide-react';

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [groups, setGroups] = useState<{
    id: string;
    name: string;
    students: User[];
  }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const allUsers = await db.users.where('role').equals('student').toArray();
      setStudents(allUsers);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const handleCreateGroup = (name: string) => {
    const newGroup = {
      id: `group-${Date.now()}`,
      name,
      students: []
    };
    setGroups([...groups, newGroup]);
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter(group => group.id !== groupId));
  };

  const handleAddStudentToGroup = (groupId: string, studentId: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        const student = students.find(s => s.id === Number(studentId));
        if (student) {
          return {
            ...group,
            students: [...group.students, student]
          };
        }
      }
      return group;
    }));
  };

  const handleRemoveStudentFromGroup = (groupId: string, studentId: string) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          students: group.students.filter(s => s.id !== Number(studentId))
        };
      }
      return group;
    }));
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => handleCreateGroup('New Group')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2" />
            Create Group
          </button>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">No Students Yet</h2>
          <p className="text-gray-500">Students will appear here once they register.</p>
        </div>
      ) : (
        <StudentGroupManager
          groups={groups}
          students={filteredStudents.map(s => ({
            id: String(s.id),
            name: s.name,
            email: s.email
          }))}
          onCreateGroup={handleCreateGroup}
          onDeleteGroup={handleDeleteGroup}
          onAddStudentToGroup={handleAddStudentToGroup}
          onRemoveStudentFromGroup={handleRemoveStudentFromGroup}
        />
      )}
    </div>
  );
};

export default StudentsPage;