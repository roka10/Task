import Dexie, { Table } from 'dexie';

export interface User {
  id?: number;
  email: string;
  password: string;
  name: string;
  role: 'student' | 'teacher';
  profilePicture?: string;
  department?: string;
  phoneNumber?: string;
  joinedDate: string;
}

export interface Group {
  id?: number;
  name: string;
  teacherId: number;
  studentIds: number[];
  createdAt: string;
}

export interface Test {
  id?: number;
  title: string;
  description: string;
  subject: string;
  teacherId: number;
  groupIds: number[];
  questions: Question[];
  duration: number;
  scheduledFor?: string;
  createdAt: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'single-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export interface TestResult {
  id?: number;
  testId: number;
  studentId: number;
  answers: {
    questionId: string;
    answer: string | string[];
    isCorrect: boolean;
    points: number;
  }[];
  score: number;
  maxScore: number;
  startTime: string;
  endTime: string;
  tabSwitches: number;
  completed: boolean;
}

export class AppDatabase extends Dexie {
  users!: Table<User>;
  groups!: Table<Group>;
  tests!: Table<Test>;
  testResults!: Table<TestResult>;

  constructor() {
    super('testPlatformDB');
    this.version(1).stores({
      users: '++id, email, role',
      groups: '++id, teacherId',
      tests: '++id, teacherId, status',
      testResults: '++id, testId, studentId'
    });
  }

  async registerUser(userData: Omit<User, 'id'>): Promise<number> {
    const existingUser = await this.users.where('email').equals(userData.email).first();
    if (existingUser) {
      throw new Error('Email already registered');
    }
    return await this.users.add(userData);
  }

  async loginUser(email: string, password: string): Promise<User> {
    const user = await this.users.where('email').equals(email).first();
    
    if (!user) {
      throw new Error('User not found');
    }

    if (user.password !== password) {
      throw new Error('Invalid password');
    }

    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<void> {
    await this.users.update(id, updates);
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    const user = await this.users.where('email').equals(email).first();
    if (!user) {
      throw new Error('User not found');
    }
    await this.users.update(user.id!, { password: newPassword });
  }

  async createGroup(groupData: Omit<Group, 'id'>): Promise<number> {
    return await this.groups.add(groupData);
  }

  async getTeacherGroups(teacherId: number): Promise<Group[]> {
    return await this.groups.where('teacherId').equals(teacherId).toArray();
  }

  async createTest(testData: Omit<Test, 'id'>): Promise<number> {
    return await this.tests.add(testData);
  }

  async getTeacherTests(teacherId: number): Promise<Test[]> {
    return await this.tests.where('teacherId').equals(teacherId).toArray();
  }

  async getStudentTests(studentId: number): Promise<Test[]> {
    const groups = await this.groups.where('studentIds').equals(studentId).toArray();
    const groupIds = groups.map(g => g.id!);
    return await this.tests
      .where('groupIds')
      .anyOf(groupIds)
      .and(test => test.status !== 'draft')
      .toArray();
  }

  async submitTestResult(resultData: Omit<TestResult, 'id'>): Promise<number> {
    return await this.testResults.add(resultData);
  }

  async getTestResults(testId: number): Promise<TestResult[]> {
    return await this.testResults.where('testId').equals(testId).toArray();
  }

  async getStudentResults(studentId: number): Promise<TestResult[]> {
    return await this.testResults.where('studentId').equals(studentId).toArray();
  }
}

export const db = new AppDatabase();