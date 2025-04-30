import { openDB } from 'idb';

const DB_NAME = 'testDB';
const STORE_NAME = 'testProgress';

interface TestProgress {
  testId: string;
  studentId: string;
  answers: { [key: string]: string | string[] };
  remainingTime: number;
  currentQuestionIndex: number;
  tabSwitches: number;
  lastSaved: number;
}

const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: ['testId', 'studentId'] });
      }
    },
  });
};

export const saveTestProgress = async (progress: TestProgress) => {
  const db = await initDB();
  await db.put(STORE_NAME, {
    ...progress,
    lastSaved: Date.now(),
  });
};

export const getTestProgress = async (testId: string, studentId: string) => {
  const db = await initDB();
  return db.get(STORE_NAME, [testId, studentId]);
};

export const clearTestProgress = async (testId: string, studentId: string) => {
  const db = await initDB();
  await db.delete(STORE_NAME, [testId, studentId]);
};

// Auto-save functionality
let saveTimeout: NodeJS.Timeout | null = null;

export const scheduleAutoSave = (progress: TestProgress) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  saveTimeout = setTimeout(() => {
    saveTestProgress(progress);
  }, 2000); // Auto-save every 2 seconds after last change
};