import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BookOpen, 
  ClipboardList, 
  Home, 
  Users, 
  BarChart, 
  Settings, 
  BookMarked,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  return (
    <aside className="w-64 bg-blue-900 dark:bg-gray-800 text-white hidden md:flex flex-col">
      <div className="p-5 border-b border-blue-800 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <GraduationCap size={28} className="text-blue-300 dark:text-gray-300" />
          <h1 className="text-xl font-bold">ExamMatrix</h1>
        </div>
        <p className="text-blue-300 dark:text-gray-400 text-sm mt-1">Engineering Test Platform</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          <li>
            <NavLink 
              to={`/${user?.role}/dashboard`}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-800 dark:bg-gray-700 text-white' 
                    : 'text-blue-200 dark:text-gray-300 hover:bg-blue-800 dark:hover:bg-gray-700 hover:text-white'
                }`
              }
            >
              <Home size={18} className="mr-3" />
              Dashboard
            </NavLink>
          </li>
          
          {isTeacher ? (
            <>
              <li>
                <NavLink 
                  to="/teacher/test/create"
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-800 dark:bg-gray-700 text-white' 
                        : 'text-blue-200 dark:text-gray-300 hover:bg-blue-800 dark:hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <ClipboardList size={18} className="mr-3" />
                  Create Test
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/teacher/students"
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-800 dark:bg-gray-700 text-white' 
                        : 'text-blue-200 dark:text-gray-300 hover:bg-blue-800 dark:hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <Users size={18} className="mr-3" />
                  Students
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/teacher/analytics"
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-800 dark:bg-gray-700 text-white' 
                        : 'text-blue-200 dark:text-gray-300 hover:bg-blue-800 dark:hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <BarChart size={18} className="mr-3" />
                  Analytics
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink 
                  to="/student/upcoming-tests"
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-800 dark:bg-gray-700 text-white' 
                        : 'text-blue-200 dark:text-gray-300 hover:bg-blue-800 dark:hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <BookOpen size={18} className="mr-3" />
                  Upcoming Tests
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/student/results"
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-800 dark:bg-gray-700 text-white' 
                        : 'text-blue-200 dark:text-gray-300 hover:bg-blue-800 dark:hover:bg-gray-700 hover:text-white'
                    }`
                  }
                >
                  <BookMarked size={18} className="mr-3" />
                  Results
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-blue-800 dark:border-gray-700">
        <NavLink 
          to="/settings"
          className={({ isActive }) => 
            `flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-800 dark:bg-gray-700 text-white' 
                : 'text-blue-200 dark:text-gray-300 hover:bg-blue-800 dark:hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <Settings size={18} className="mr-3" />
          Settings
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;