import { StudentScoreRecord } from '../utils/studentMatcher';

export type ViewMode = 'home' | 'exam' | 'score' | 'certificate' | 'admin';

export interface AppConfig {
  m13FormUrl: string;
  m46FormUrl: string;
  scoreSheetId: string;
  scoreSheetName: string;
  certificateSheetId: string;
  certificateSheetName: string;
  countdownTarget: string;
  passingPercentage: number;
  maxScoreDefault: number;
  projectTitle: string;
  schoolName: string;
  isExamOpen: boolean;
  certificatePdfColumn?: string;
  lastUpdated?: string;
}

export interface AdminSession {
  authenticated: boolean;
  username: string;
  token?: string;
}

export type { StudentScoreRecord };
