import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  StudentScoreRecord,
  matchStudentQuery,
  evaluateScore,
  normalizeThaiText
} from './src/utils/studentMatcher.ts';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

const CONFIG_FILE = path.resolve(process.cwd(), 'data', 'config.json');
const STUDENTS_FILE = path.resolve(process.cwd(), 'data', 'students.json');

// Ensure data folder exists
if (!fs.existsSync(path.resolve(process.cwd(), 'data'))) {
  fs.mkdirSync(path.resolve(process.cwd(), 'data'), { recursive: true });
}

interface AppConfig {
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
  adminPassword?: string;
  lastUpdated?: string;
}

const DEFAULT_CONFIG: AppConfig = {
  m13FormUrl: 'https://forms.gle/ThaiLangContestM13Example',
  m46FormUrl: 'https://forms.gle/ThaiLangContestM46Example',
  scoreSheetId: '',
  scoreSheetName: 'คะแนนแบบทดสอบ',
  certificateSheetId: '',
  certificateSheetName: 'ข้อมูลเกียรติบัตร',
  countdownTarget: '2026-11-25T16:30:00+07:00',
  passingPercentage: 60,
  maxScoreDefault: 30,
  projectTitle: 'โครงการส่งเสริมและพัฒนาความรู้ความสามารถด้านภาษาไทย : สืบศิลป์ถิ่นอักษร สืบสุนทรภาษาไทย',
  schoolName: 'โรงเรียนกระทุ่มแบน "วิเศษสมุทคุณ"',
  isExamOpen: true,
  certificatePdfColumn: 'pdf_link',
  adminPassword: '696667***',
  lastUpdated: new Date().toISOString()
};

function readConfig(): AppConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error reading config file:', err);
  }
  return DEFAULT_CONFIG;
}

function writeConfig(config: AppConfig): boolean {
  try {
    config.lastUpdated = new Date().toISOString();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving config file:', err);
    return false;
  }
}

function readLocalStudents(): StudentScoreRecord[] {
  try {
    if (fs.existsSync(STUDENTS_FILE)) {
      const data = fs.readFileSync(STUDENTS_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading students file:', err);
  }
  return [];
}

function writeLocalStudents(students: StudentScoreRecord[]): boolean {
  try {
    fs.writeFileSync(STUDENTS_FILE, JSON.stringify(students, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving students file:', err);
    return false;
  }
}

/**
 * Extracts clean Google Sheet ID from URL or raw ID string.
 */
function extractSheetId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

/**
 * Parses CSV lines into array of string arrays.
 */
function parseCsv(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let cur = '';

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push(cur.trim());
      cur = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      row.push(cur.trim());
      cur = '';
      if (row.some(cell => cell.length > 0)) {
        lines.push(row);
      }
      row = [];
    } else {
      cur += c;
    }
  }
  if (cur.length > 0 || row.length > 0) {
    row.push(cur.trim());
    if (row.some(cell => cell.length > 0)) {
      lines.push(row);
    }
  }
  return lines;
}

/**
 * Attempts to fetch live student data from Google Sheet ID.
 */
async function fetchGoogleSheetData(sheetIdRaw: string, sheetName: string = '', passingPercent: number = 60): Promise<StudentScoreRecord[]> {
  const sheetId = extractSheetId(sheetIdRaw);
  if (!sheetId) return [];

  let url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
  if (sheetName) {
    url += `&sheet=${encodeURIComponent(sheetName)}`;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`Google Sheet fetch returned status ${res.status}`);
      return [];
    }

    const csvText = await res.text();
    const rows = parseCsv(csvText);
    if (rows.length < 2) return [];

    const headers = rows[0].map(h => h.toLowerCase());
    
    let nameIdx = headers.findIndex(h => h.includes('ชื่อ') || h.includes('name'));
    let scoreIdx = headers.findIndex(h => h.includes('คะแนน') || h.includes('score'));
    let levelIdx = headers.findIndex(h => h.includes('ระดับ') || h.includes('ชั้น') || h.includes('level') || h.includes('class'));
    let schoolIdx = headers.findIndex(h => h.includes('โรงเรียน') || h.includes('school'));
    let idIdx = headers.findIndex(h => h.includes('รหัส') || h.includes('id') || h.includes('เลขที่'));
    let dateIdx = headers.findIndex(h => h.includes('เวลา') || h.includes('timestamp') || h.includes('date'));

    if (nameIdx === -1) nameIdx = 1;
    if (scoreIdx === -1) scoreIdx = 2;

    const records: StudentScoreRecord[] = [];

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const fullName = (row[nameIdx] || '').trim();
      if (!fullName) continue;

      const rawScore = (row[scoreIdx] || '0').trim();
      const level = (levelIdx !== -1 && row[levelIdx]) ? row[levelIdx].trim() : 'มัธยมศึกษา';
      const school = (schoolIdx !== -1 && row[schoolIdx]) ? row[schoolIdx].trim() : 'โรงเรียนกระทุ่มแบน "วิเศษสมุทคุณ"';
      const studentId = (idIdx !== -1 && row[idIdx]) ? row[idIdx].trim() : `ST-${r}`;
      const completedAt = (dateIdx !== -1 && row[dateIdx]) ? row[dateIdx].trim() : '';

      const evalResult = evaluateScore(rawScore, passingPercent);

      const nameParts = fullName.split(/\s+/);
      const firstName = nameParts[0] || fullName;
      const lastName = nameParts.slice(1).join(' ') || '';

      records.push({
        id: `SHEET-${r}-${Date.now()}`,
        firstName,
        lastName,
        fullName,
        studentId,
        level,
        school,
        rawScore,
        scoreNumber: evalResult.scoreNumber,
        maxScore: evalResult.maxScore,
        percentage: evalResult.percentage,
        isPassed: evalResult.isPassed,
        statusText: evalResult.statusText,
        completedAt,
        certificateNumber: `WSK-THAI-2569-${String(r).padStart(4, '0')}`
      });
    }

    return records;
  } catch (err) {
    console.warn('Could not fetch Google Sheet directly (may be private or offline):', (err as Error).message);
    return [];
  }
}

// In-memory admin session token
let activeAdminToken: string | null = null;

// Public API: Get App Config (safe fields only, no password)
app.get('/api/config', (req: Request, res: Response) => {
  const config = readConfig();
  res.json({
    m13FormUrl: config.m13FormUrl,
    m46FormUrl: config.m46FormUrl,
    scoreSheetId: config.scoreSheetId,
    scoreSheetName: config.scoreSheetName,
    certificateSheetId: config.certificateSheetId,
    certificateSheetName: config.certificateSheetName,
    countdownTarget: config.countdownTarget,
    passingPercentage: config.passingPercentage,
    maxScoreDefault: config.maxScoreDefault,
    projectTitle: config.projectTitle,
    schoolName: config.schoolName,
    isExamOpen: config.isExamOpen,
    certificatePdfColumn: config.certificatePdfColumn,
    lastUpdated: config.lastUpdated
  });
});

// Admin API: Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const config = readConfig();
  const currentPassword = config.adminPassword || '696667***';

  if (username === 'thaiadmin69' && password === currentPassword) {
    activeAdminToken = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    return res.json({
      success: true,
      token: activeAdminToken,
      message: 'เข้าสู่ระบบผู้ดูแลสำเร็จ'
    });
  }
  return res.status(401).json({
    success: false,
    message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
  });
});

// Admin API: Verify Session
app.get('/api/admin/check-auth', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  if (token && token === activeAdminToken) {
    return res.json({ authenticated: true, username: 'thaiadmin69' });
  }
  return res.json({ authenticated: false });
});

// Admin API: Change Password
app.post('/api/admin/change-password', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  if (!token || token !== activeAdminToken) {
    return res.status(403).json({ error: 'ไม่มีสิทธิ์เข้าถึง กรุณาเข้าสู่ระบบ' });
  }

  const { oldPassword, newPassword } = req.body;
  const config = readConfig();
  const currentPassword = config.adminPassword || '696667***';

  if (oldPassword !== currentPassword) {
    return res.status(400).json({ error: 'รหัสผ่านเดิมไม่ถูกต้อง' });
  }
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร' });
  }

  config.adminPassword = newPassword;
  writeConfig(config);

  return res.json({ success: true, message: 'เปลี่ยนรหัสผ่านผู้ดูแลระบบสำเร็จแล้ว' });
});

// Admin API: Update Configuration (Permanently saved)
app.post('/api/admin/config', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  if (!token || token !== activeAdminToken) {
    return res.status(403).json({ error: 'ไม่มีสิทธิ์เข้าถึง กรุณาเข้าสู่ระบบ' });
  }

  const current = readConfig();
  const updated: AppConfig = {
    ...current,
    m13FormUrl: req.body.m13FormUrl !== undefined ? String(req.body.m13FormUrl).trim() : current.m13FormUrl,
    m46FormUrl: req.body.m46FormUrl !== undefined ? String(req.body.m46FormUrl).trim() : current.m46FormUrl,
    scoreSheetId: req.body.scoreSheetId !== undefined ? extractSheetId(String(req.body.scoreSheetId)) : current.scoreSheetId,
    scoreSheetName: req.body.scoreSheetName !== undefined ? String(req.body.scoreSheetName).trim() : current.scoreSheetName,
    certificateSheetId: req.body.certificateSheetId !== undefined ? extractSheetId(String(req.body.certificateSheetId)) : current.certificateSheetId,
    certificateSheetName: req.body.certificateSheetName !== undefined ? String(req.body.certificateSheetName).trim() : current.certificateSheetName,
    countdownTarget: req.body.countdownTarget || current.countdownTarget,
    passingPercentage: typeof req.body.passingPercentage === 'number' ? req.body.passingPercentage : current.passingPercentage,
    maxScoreDefault: typeof req.body.maxScoreDefault === 'number' ? req.body.maxScoreDefault : current.maxScoreDefault,
    isExamOpen: typeof req.body.isExamOpen === 'boolean' ? req.body.isExamOpen : current.isExamOpen,
    certificatePdfColumn: req.body.certificatePdfColumn !== undefined ? String(req.body.certificatePdfColumn).trim() : current.certificatePdfColumn,
  };

  const success = writeConfig(updated);
  if (success) {
    return res.json({
      success: true,
      message: 'บันทึกการตั้งค่าระบบเรียบร้อยแล้ว และมีผลถาวรทุกอุปกรณ์',
      config: updated
    });
  } else {
    return res.status(500).json({ error: 'ไม่สามารถบันทึกการตั้งค่าได้' });
  }
});

// Admin API: Test sync sheet
app.post('/api/admin/sync-sheet', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  if (!token || token !== activeAdminToken) {
    return res.status(403).json({ error: 'ไม่มีสิทธิ์เข้าถึง กรุณาเข้าสู่ระบบ' });
  }

  const { sheetId, sheetName } = req.body;
  const config = readConfig();
  const idToUse = extractSheetId(sheetId || config.scoreSheetId);
  const nameToUse = sheetName || config.scoreSheetName;

  if (!idToUse) {
    return res.json({
      success: false,
      message: 'กรุณากรอก Google Sheet ID'
    });
  }

  const sheetRecords = await fetchGoogleSheetData(idToUse, nameToUse, config.passingPercentage);
  if (sheetRecords.length > 0) {
    writeLocalStudents(sheetRecords);
    return res.json({
      success: true,
      count: sheetRecords.length,
      preview: sheetRecords.slice(0, 5),
      message: `ดึงข้อมูลจาก Google Sheet สำเร็จ พบ ${sheetRecords.length} รายการ`
    });
  } else {
    return res.json({
      success: false,
      count: 0,
      message: 'ไม่สามารถดึงข้อมูลจาก Sheet ได้ กรุณาตรวจสอบว่าเปิดสิทธิ์ "ทุกคนที่มีลิงก์มีสิทธิ์ดู" (Anyone with the link can view) แล้ว'
    });
  }
});

// Admin API: Get Statistics & Student List
app.get('/api/admin/students', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  if (!token || token !== activeAdminToken) {
    return res.status(403).json({ error: 'ไม่มีสิทธิ์เข้าถึง' });
  }

  const students = readLocalStudents();
  const passedCount = students.filter(s => s.isPassed).length;
  const failedCount = students.length - passedCount;
  const avgPercentage = students.length > 0 
    ? Math.round((students.reduce((acc, s) => acc + s.percentage, 0) / students.length) * 100) / 100 
    : 0;

  res.json({
    students,
    stats: {
      total: students.length,
      passed: passedCount,
      failed: failedCount,
      avgPercentage
    }
  });
});

// Admin API: Add or Edit Student
app.post('/api/admin/students', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  if (!token || token !== activeAdminToken) {
    return res.status(403).json({ error: 'ไม่มีสิทธิ์เข้าถึง' });
  }

  const studentData = req.body;
  const students = readLocalStudents();
  const config = readConfig();

  const evalResult = evaluateScore(studentData.rawScore || studentData.scoreNumber, config.passingPercentage);

  const newOrUpdated: StudentScoreRecord = {
    id: studentData.id || `WSK-MANUAL-${Date.now()}`,
    prefix: studentData.prefix || '',
    firstName: studentData.firstName || '',
    lastName: studentData.lastName || '',
    fullName: studentData.fullName || `${studentData.prefix || ''}${studentData.firstName || ''} ${studentData.lastName || ''}`.trim(),
    studentId: studentData.studentId || '',
    level: studentData.level || 'มัธยมศึกษาตอนต้น (ม.1 - 3)',
    school: studentData.school || 'โรงเรียนกระทุ่มแบน "วิเศษสมุทคุณ"',
    rawScore: studentData.rawScore || evalResult.scoreNumber,
    scoreNumber: evalResult.scoreNumber,
    maxScore: evalResult.maxScore,
    percentage: evalResult.percentage,
    isPassed: evalResult.isPassed,
    statusText: evalResult.statusText,
    completedAt: studentData.completedAt || new Date().toISOString().slice(0, 10),
    certificateNumber: studentData.certificateNumber || `WSK-THAI-2569-${String(students.length + 1).padStart(4, '0')}`
  };

  const existingIndex = students.findIndex(s => s.id === newOrUpdated.id);
  if (existingIndex >= 0) {
    students[existingIndex] = newOrUpdated;
  } else {
    students.unshift(newOrUpdated);
  }

  writeLocalStudents(students);
  res.json({ success: true, student: newOrUpdated });
});

// Admin API: Delete Student
app.delete('/api/admin/students/:id', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '');
  if (!token || token !== activeAdminToken) {
    return res.status(403).json({ error: 'ไม่มีสิทธิ์เข้าถึง' });
  }

  const { id } = req.params;
  const students = readLocalStudents();
  const filtered = students.filter(s => s.id !== id);
  writeLocalStudents(filtered);

  res.json({ success: true, count: filtered.length });
});

// Search Scores API
app.get('/api/scores', async (req: Request, res: Response) => {
  const query = String(req.query.q || '').trim();
  const config = readConfig();

  let allStudents = readLocalStudents();

  // If scoreSheetId is set, attempt to get fresh data
  if (config.scoreSheetId) {
    try {
      const sheetStudents = await fetchGoogleSheetData(config.scoreSheetId, config.scoreSheetName, config.passingPercentage);
      if (sheetStudents && sheetStudents.length > 0) {
        allStudents = sheetStudents;
      }
    } catch {
      // Keep local fallback
    }
  }

  if (!query) {
    return res.json({
      results: [],
      totalAvailable: allStudents.length
    });
  }

  const matched = allStudents.filter(student => matchStudentQuery(student, query));

  res.json({
    query,
    count: matched.length,
    results: matched
  });
});

// Start Express Server
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Thai Educational System running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
