export type UserRole = 'ADMIN' | 'STUDENT';

export interface User {
  id: string;
  name: string;
  mobile: string;
  role: UserRole;
  isActive: boolean;
  activeDeviceId?: string | null;
  activeDeviceName?: string | null;
  lastLoginAt?: string | null;
  createdAt: string;
}

export interface Question {
  id: string;
  testId: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  timerMinutes: number;
  totalMarks: number;
  isPublished: boolean;
  questionCount?: number;
  createdAt: string;
}

export interface PDFMetadata {
  id: string;
  title: string;
  category: string;
  fileKey: string;
  fileUrl: string;
  fileSize?: string;
  uploadDate: string;
}

export interface DeviceSession {
  studentId: string;
  deviceId: string;
  deviceName: string;
  ipAddress?: string;
  loginTime: string;
  isCurrentDevice?: boolean;
}

export interface TestSubmission {
  testId: string;
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  timeTakenSeconds: number;
}

export interface TestResult {
  testId: string;
  testTitle: string;
  totalQuestions: number;
  totalMarks: number;
  obtainedMarks: number;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  percentage: number;
  timeTakenSeconds: number;
  questionsWithAnswers: {
    question: Question;
    selectedOption?: 'A' | 'B' | 'C' | 'D';
    isCorrect: boolean;
  }[];
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

export interface CloudflareR2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicDomain: string;
  isConnected: boolean;
}

export interface AppSettings {
  supabase: SupabaseConfig;
  cloudflareR2: CloudflareR2Config;
}
