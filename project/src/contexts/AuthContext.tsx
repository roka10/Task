import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  profilePicture?: string;
  joinedDate: string;
  department?: string;
  studentId?: string;
  teacherId?: string;
  phoneNumber?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'teacher';
    department?: string;
    phoneNumber?: string;
    profileImage?: string | null;
  }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Teacher',
    email: 'teacher@example.com',
    password: 'password123',
    role: 'teacher' as const,
    profilePicture: 'https://i.pravatar.cc/150?u=teacher',
    joinedDate: '2025-01-15T00:00:00Z',
    department: 'Computer Science',
    teacherId: 'TCH001',
    phoneNumber: '+1234567890'
  },
  {
    id: '2',
    name: 'Jane Student',
    email: 'student@example.com',
    password: 'password123',
    role: 'student' as const,
    profilePicture: 'https://i.pravatar.cc/150?u=student',
    joinedDate: '2025-02-01T00:00:00Z',
    department: 'Engineering',
    studentId: 'STU001',
    phoneNumber: '+1987654321'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved auth state on load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
        
        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          setLoading(false);
          resolve();
        } else {
          setLoading(false);
          reject(new Error('Invalid email or password'));
        }
      }, 800);
    });
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'teacher';
    department?: string;
    phoneNumber?: string;
    profileImage?: string | null;
  }): Promise<void> => {
    setLoading(true);
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userExists = MOCK_USERS.find(u => u.email === data.email);
        
        if (userExists) {
          setLoading(false);
          reject(new Error('User with this email already exists'));
        } else {
          const newUser = {
            id: `${MOCK_USERS.length + 1}`,
            name: data.name,
            email: data.email,
            password: data.password,
            role: data.role,
            profilePicture: data.profileImage || `https://i.pravatar.cc/150?u=${data.email}`,
            joinedDate: new Date().toISOString(),
            department: data.department,
            phoneNumber: data.phoneNumber,
            ...(data.role === 'student' 
              ? { studentId: `STU${Math.floor(1000 + Math.random() * 9000)}` }
              : { teacherId: `TCH${Math.floor(1000 + Math.random() * 9000)}` }
            )
          };
          
          // Add to mock users array
          MOCK_USERS.push(newUser);
          
          // Store user without password
          const { password: _, ...userWithoutPassword } = newUser;
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          setLoading(false);
          resolve();
        }
      }, 800);
    });
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update mock users array
        const userIndex = MOCK_USERS.findIndex(u => u.id === user?.id);
        if (userIndex !== -1) {
          MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...data };
        }
        
        setLoading(false);
        resolve();
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login,
      register, 
      logout,
      updateProfile,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};