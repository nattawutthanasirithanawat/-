/**
 * Utility functions for Thai student name normalization, flexible search matching,
 * and academic score/percentage evaluation.
 */

export interface StudentScoreRecord {
  id: string;
  prefix?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  studentId?: string;
  level: string; // e.g. "มัธยมศึกษาตอนต้น (ม.1 - 3)" or "มัธยมศึกษาตอนปลาย (ม.4 - 6)"
  school?: string;
  rawScore: string | number; // e.g. "25/30" or 85
  scoreNumber: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  statusText: 'ผ่าน' | 'ไม่ผ่าน';
  completedAt?: string;
  certificateNumber?: string;
}

const COMMON_THAI_PREFIXES = [
  'เด็กชาย',
  'เด็กหญิง',
  'ด.ช.',
  'ด.ช',
  'ด.ญ.',
  'ด.ญ',
  'นาย',
  'นางสาว',
  'น.ส.',
  'น.ส',
  'นาง',
  'อาจารย์',
  'ครู'
];

/**
 * Strips common Thai titles from a name to enable fuzzy/prefix-agnostic matching.
 */
export function stripThaiPrefix(name: string): string {
  if (!name) return '';
  let cleaned = name.trim();
  for (const prefix of COMMON_THAI_PREFIXES) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.slice(prefix.length).trim();
      break;
    }
  }
  return cleaned;
}

/**
 * Normalizes Thai text for comparison by collapsing multiple whitespaces and trimming.
 */
export function normalizeThaiText(text: string): string {
  if (!text) return '';
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Checks whether a student record matches a user's search query.
 * Matches:
 * 1. Exact or partial first name (e.g. "สมชาย")
 * 2. Full name without prefix (e.g. "สมชาย ใจดี")
 * 3. Full name with prefix (e.g. "ด.ช.สมชาย ใจดี" or "เด็กชายสมชาย")
 * 4. Student code/id if applicable
 */
export function matchStudentQuery(student: StudentScoreRecord, query: string): boolean {
  if (!query || !query.trim()) return false;

  const normalizedQuery = normalizeThaiText(query).toLowerCase();
  const queryNoPrefix = stripThaiPrefix(normalizedQuery).replace(/\s+/g, '');
  const queryNoSpace = normalizedQuery.replace(/\s+/g, '');

  const normalizedFullName = normalizeThaiText(student.fullName).toLowerCase();
  const fullNameNoPrefix = stripThaiPrefix(normalizedFullName).replace(/\s+/g, '');
  const fullNameNoSpace = normalizedFullName.replace(/\s+/g, '');

  const normalizedFirstName = normalizeThaiText(student.firstName).toLowerCase();
  const firstNameNoPrefix = stripThaiPrefix(normalizedFirstName).replace(/\s+/g, '');

  const studentId = student.studentId ? student.studentId.trim().toLowerCase() : '';

  // 1. Direct match on ID
  if (studentId && (studentId === normalizedQuery || studentId === queryNoSpace)) {
    return true;
  }

  // 2. Full name match (with or without spaces/prefixes)
  if (fullNameNoSpace.includes(queryNoSpace) || queryNoSpace.includes(fullNameNoSpace)) {
    return true;
  }

  // 3. Name without prefix match
  if (fullNameNoPrefix.includes(queryNoPrefix) || queryNoPrefix.includes(fullNameNoPrefix)) {
    return true;
  }

  // 4. First name match
  if (firstNameNoPrefix.includes(queryNoPrefix) || queryNoPrefix.includes(firstNameNoPrefix)) {
    return true;
  }

  return false;
}

/**
 * Parses a raw score (e.g. "24/30", "80", "18/20", "85%") into numeric score, max score, percentage, and pass status.
 */
export function evaluateScore(
  rawScoreInput: string | number,
  passingPercentage: number = 60
): {
  scoreNumber: number;
  maxScore: number;
  percentage: number;
  isPassed: boolean;
  statusText: 'ผ่าน' | 'ไม่ผ่าน';
} {
  const str = String(rawScoreInput || '0').trim();
  let score = 0;
  let max = 100;

  if (str.includes('/')) {
    const parts = str.split('/');
    score = parseFloat(parts[0]) || 0;
    max = parseFloat(parts[1]) || 100;
  } else if (str.endsWith('%')) {
    score = parseFloat(str.replace('%', '')) || 0;
    max = 100;
  } else {
    score = parseFloat(str) || 0;
    // If score <= 30 and integer, could be out of 30 or 100; if caller specifies, otherwise default 100
    if (score <= 30 && score > 0) {
      max = 30; // standard 30-item test for Thai school contests
    } else {
      max = 100;
    }
  }

  const percentage = max > 0 ? Math.round(((score / max) * 100) * 100) / 100 : 0;
  const isPassed = percentage >= passingPercentage;

  return {
    scoreNumber: score,
    maxScore: max,
    percentage,
    isPassed,
    statusText: isPassed ? 'ผ่าน' : 'ไม่ผ่าน'
  };
}
