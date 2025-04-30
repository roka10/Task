import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TestProvider } from './contexts/TestContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/student/StudentDashboard';
import TestSession from './pages/student/TestSession';
import TestResults from './pages/student/TestResults';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TestCreator from './pages/teacher/TestCreator';
import TestAnalytics from './pages/teacher/TestAnalytics';
import StudentsPage from './pages/teacher/StudentsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFound from './pages/NotFound';
import Layout from './components/layout/Layout';
import UpcomingTestsPage from './pages/student/UpcomingTestsPage';
import ResultsPage from './pages/student/ResultsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TestProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                <Route path="/" element={<Layout />}>
                  {/* Student Routes */}
                  <Route path="" element={<Navigate to="/student/dashboard" replace />} />
                  <Route 
                    path="student/dashboard" 
                    element={
                      <ProtectedRoute role="student">
                        <StudentDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="student/test/:testId" 
                    element={
                      <ProtectedRoute role="student">
                        <TestSession />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="student/upcoming-tests" 
                    element={
                      <ProtectedRoute role="student">
                        <UpcomingTestsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="student/results" 
                    element={
                      <ProtectedRoute role="student">
                        <ResultsPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Teacher Routes */}
                  <Route 
                    path="teacher/dashboard" 
                    element={
                      <ProtectedRoute role="teacher">
                        <TeacherDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="teacher/test/create" 
                    element={
                      <ProtectedRoute role="teacher">
                        <TestCreator />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="teacher/test/edit/:testId" 
                    element={
                      <ProtectedRoute role="teacher">
                        <TestCreator />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="teacher/analytics" 
                    element={
                      <ProtectedRoute role="teacher">
                        <TestAnalytics />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="teacher/students" 
                    element={
                      <ProtectedRoute role="teacher">
                        <StudentsPage />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Common Routes */}
                  <Route 
                    path="profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="settings" 
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    } 
                  />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </ThemeProvider>
        </TestProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;