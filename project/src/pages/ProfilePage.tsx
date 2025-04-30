import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTests } from '../contexts/TestContext';
import { format } from 'date-fns';
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  Clock, 
  AlertTriangle, 
  Phone, 
  Building, 
  Car as IdCard,
  Camera,
  Upload,
  Save,
  CheckCircle
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { tests, results, getStudentResults, getTeacherTests } = useTests();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [profileImage, setProfileImage] = useState<string | null>(user?.profilePicture || null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const userTests = user?.role === 'teacher' 
    ? getTeacherTests(user.id)
    : getStudentResults(user.id);
  
  const calculateStats = () => {
    if (user?.role === 'student') {
      const completedTests = results.filter(r => r.studentId === user.id && r.completed);
      const totalScore = completedTests.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0);
      const averageScore = completedTests.length > 0 ? totalScore / completedTests.length : 0;
      
      return {
        totalTests: completedTests.length,
        averageScore,
        securityViolations: completedTests.reduce((sum, r) => sum + r.tabSwitches, 0),
      };
    } else {
      const createdTests = tests.filter(t => t.createdBy === user?.id);
      const activeTests = createdTests.filter(t => t.status === 'active' || t.status === 'scheduled');
      
      return {
        totalTests: createdTests.length,
        activeTests: activeTests.length,
        totalStudents: new Set(results.map(r => r.studentId)).size,
      };
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!editedUser) return;
    
    setIsSaving(true);
    try {
      await updateProfile({
        ...editedUser,
        profilePicture: profileImage
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const stats = calculateStats();
  
  if (!user || !editedUser) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 dark:from-blue-800 dark:to-blue-700 p-6 sm:p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <div 
                  className="h-20 w-20 rounded-full overflow-hidden bg-white cursor-pointer"
                  onClick={() => isEditing && fileInputRef.current?.click()}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-100">
                      <Camera size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg"
                  >
                    <Camera size={16} className="text-blue-600" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="ml-6">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    className="text-2xl font-bold bg-transparent text-white border-b border-white/30 focus:border-white focus:outline-none"
                  />
                ) : (
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                )}
                <div className="flex items-center mt-1">
                  <IdCard className="h-4 w-4 mr-1" />
                  <span className="text-blue-100">
                    {user.role === 'teacher' ? `Teacher ID: ${user.teacherId}` : `Student ID: ${user.studentId}`}
                  </span>
                </div>
              </div>
            </div>
            <div>
              {isEditing ? (
                <div className="space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 font-medium flex items-center"
                  >
                    <Save size={16} className="mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedUser(user);
                      setProfileImage(user.profilePicture || null);
                    }}
                    className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Success Message */}
        {showSuccess && (
          <div className="absolute top-4 right-4 bg-green-100 border border-green-200 text-green-700 px-4 py-2 rounded-lg flex items-center">
            <CheckCircle size={16} className="mr-2" />
            Profile updated successfully!
          </div>
        )}
        
        {/* Profile Details */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Mail className="h-5 w-5 mr-2" />
                {isEditing ? (
                  <input
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    className="bg-gray-50 border border-gray-300 rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <span>{user.email}</span>
                )}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Phone className="h-5 w-5 mr-2" />
                {isEditing ? (
                  <input
                    type="tel"
                    value={editedUser.phoneNumber || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, phoneNumber: e.target.value })}
                    className="bg-gray-50 border border-gray-300 rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <span>{user.phoneNumber}</span>
                )}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Building className="h-5 w-5 mr-2" />
                {isEditing ? (
                  <input
                    type="text"
                    value={editedUser.department || ''}
                    onChange={(e) => setEditedUser({ ...editedUser, department: e.target.value })}
                    className="bg-gray-50 border border-gray-300 rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <span>{user.department}</span>
                )}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Joined {format(new Date(user.joinedDate), 'MMMM yyyy')}</span>
              </div>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {user.role === 'student' ? (
              <>
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <div className="ml-3">
                      <p className="text-sm text-blue-600 dark:text-blue-400">Tests Completed</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTests}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
                    <div className="ml-3">
                      <p className="text-sm text-green-600 dark:text-green-400">Average Score</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.averageScore.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    <div className="ml-3">
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Security Violations</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.securityViolations}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <div className="ml-3">
                      <p className="text-sm text-blue-600 dark:text-blue-400">Total Tests Created</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTests}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-green-600 dark:text-green-400" />
                    <div className="ml-3">
                      <p className="text-sm text-green-600 dark:text-green-400">Active Tests</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeTests}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4">
                  <div className="flex items-center">
                    <User className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <div className="ml-3">
                      <p className="text-sm text-purple-600 dark:text-purple-400">Total Students</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Recent Activity */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {userTests.slice(0, 5).map((item: any) => (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {user.role === 'student' ? (
                    <>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {tests.find(t => t.id === item.testId)?.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Completed on {format(new Date(item.endTime), 'PPp')}
                          </p>
                        </div>
                        <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                          {((item.score / item.maxScore) * 100).toFixed(1)}%
                        </div>
                      </div>
                      {item.tabSwitches > 0 && (
                        <div className="mt-2 flex items-center text-yellow-600 dark:text-yellow-400 text-sm">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          {item.tabSwitches} security violations detected
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Created on {format(new Date(item.createdAt), 'PPp')}
                        </p>
                      </div>
                      <div className="text-sm font-medium px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {item.status}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;