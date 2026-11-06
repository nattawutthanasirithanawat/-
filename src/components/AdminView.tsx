import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  LogOut, 
  FileText, 
  Database, 
  Award, 
  Clock, 
  ArrowLeft, 
  ExternalLink, 
  Settings, 
  LayoutDashboard,
  Users,
  BookOpen,
  HelpCircle,
  Lock,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye
} from 'lucide-react';
import { AppConfig, ViewMode, StudentScoreRecord } from '../types';

interface AdminViewProps {
  config: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
  onNavigate: (view: ViewMode) => void;
  isAdminLoggedIn: boolean;
  onSetAdminLoggedIn: (status: boolean) => void;
}

type AdminTab = 'overview' | 'forms' | 'scores' | 'certs' | 'deadline' | 'students' | 'password' | 'guide';

export const AdminView: React.FC<AdminViewProps> = ({
  config,
  onUpdateConfig,
  onNavigate,
  isAdminLoggedIn,
  onSetAdminLoggedIn
}) => {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Login form state
  const [username, setUsername] = useState('thaiadmin69');
  const [password, setPassword] = useState('696667***');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Admin config editable state
  const [m13FormUrl, setM13FormUrl] = useState(config.m13FormUrl);
  const [m46FormUrl, setM46FormUrl] = useState(config.m46FormUrl);
  const [scoreSheetId, setScoreSheetId] = useState(config.scoreSheetId);
  const [scoreSheetName, setScoreSheetName] = useState(config.scoreSheetName || 'คะแนนแบบทดสอบ');
  const [certificateSheetId, setCertificateSheetId] = useState(config.certificateSheetId);
  const [certificateSheetName, setCertificateSheetName] = useState(config.certificateSheetName || 'ข้อมูลเกียรติบัตร');
  const [countdownTarget, setCountdownTarget] = useState(config.countdownTarget);
  const [passingPercentage, setPassingPercentage] = useState(config.passingPercentage);
  const [maxScoreDefault, setMaxScoreDefault] = useState(config.maxScoreDefault || 30);
  const [isExamOpen, setIsExamOpen] = useState(config.isExamOpen);

  // Student list & stats from server
  const [students, setStudents] = useState<StudentScoreRecord[]>([]);
  const [stats, setStats] = useState({ total: 0, passed: 0, failed: 0, avgPercentage: 0 });
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Status feedback
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // New Student Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentLevel, setNewStudentLevel] = useState('มัธยมศึกษาตอนต้น (ม.1 - 3)');
  const [newStudentScore, setNewStudentScore] = useState(25);
  const [newStudentSchool, setNewStudentSchool] = useState('โรงเรียนกระทุ่มแบน "วิเศษสมุทคุณ"');

  // Keep local fields in sync if config updates
  useEffect(() => {
    setM13FormUrl(config.m13FormUrl);
    setM46FormUrl(config.m46FormUrl);
    setScoreSheetId(config.scoreSheetId);
    setScoreSheetName(config.scoreSheetName || 'คะแนนแบบทดสอบ');
    setCertificateSheetId(config.certificateSheetId);
    setCertificateSheetName(config.certificateSheetName || 'ข้อมูลเกียรติบัตร');
    setCountdownTarget(config.countdownTarget);
    setPassingPercentage(config.passingPercentage);
    setMaxScoreDefault(config.maxScoreDefault || 30);
    setIsExamOpen(config.isExamOpen);
  }, [config]);

  // Load students and stats if admin is logged in
  const loadAdminStudents = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;
    setLoadingStudents(true);
    try {
      const res = await fetch('/api/admin/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data.students || []);
        if (data.stats) setStats(data.stats);
      }
    } catch {
      // safe fallback
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      loadAdminStudents();
    }
  }, [isAdminLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('adminToken', data.token);
        onSetAdminLoggedIn(true);
      } else {
        setLoginError(data.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    } catch {
      setLoginError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    onSetAdminLoggedIn(false);
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          m13FormUrl,
          m46FormUrl,
          scoreSheetId,
          scoreSheetName,
          certificateSheetId,
          certificateSheetName,
          countdownTarget,
          passingPercentage: Number(passingPercentage),
          maxScoreDefault: Number(maxScoreDefault),
          isExamOpen
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSaveStatus({
          type: 'success',
          message: 'บันทึกข้อมูลเรียบร้อยแล้ว! ระบบฝังการตั้งค่าถาวรสำหรับทุกอุปกรณ์'
        });
        onUpdateConfig(data.config);
      } else {
        setSaveStatus({
          type: 'error',
          message: data.error || 'เกิดข้อผิดพลาดในการบันทึก'
        });
      }
    } catch {
      setSaveStatus({
        type: 'error',
        message: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestSyncSheet = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    const token = localStorage.getItem('adminToken');

    try {
      const res = await fetch('/api/admin/sync-sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          sheetId: scoreSheetId,
          sheetName: scoreSheetName 
        })
      });

      const data = await res.json();
      if (data.success) {
        setSyncStatus(`เชื่อมต่อสำเร็จ: พบ ${data.count} รายการใน Google Sheet`);
        loadAdminStudents();
      } else {
        setSyncStatus(data.message || 'ไม่สามารถดึงข้อมูลได้ กรุณาตรวจความถูกต้องของ Sheet ID และการแชร์');
      }
    } catch {
      setSyncStatus('เกิดข้อผิดพลาดขณะทดสอบดึงข้อมูล');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeStatus(null);
    if (newPassword !== confirmPassword) {
      setPasswordChangeStatus({ type: 'error', message: 'รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน' });
      return;
    }

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordChangeStatus({ type: 'success', message: 'เปลี่ยนรหัสผ่านสำเร็จแล้ว' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordChangeStatus({ type: 'error', message: data.error || 'ไม่สามารถเปลี่ยนรหัสผ่านได้' });
      }
    } catch {
      setPasswordChangeStatus({ type: 'error', message: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' });
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName: newStudentName.trim(),
          level: newStudentLevel,
          scoreNumber: newStudentScore,
          maxScore: maxScoreDefault,
          rawScore: `${newStudentScore}/${maxScoreDefault}`,
          school: newStudentSchool
        })
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewStudentName('');
        loadAdminStudents();
      }
    } catch {
      // safe fallback
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm('ยืนยันการลบข้อมูลผู้สอบรายนี้หรือไม่?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        loadAdminStudents();
      }
    } catch {
      // safe fallback
    }
  };

  // 7.1 Login View
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto space-y-6 py-12">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-sm text-[#4B267D] hover:text-[#7043A6] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#D6AF55]" />
          <span>กลับสู่หน้าแรก</span>
        </button>

        <div className="rounded-3xl bg-white border border-[#4B267D]/15 p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF8FD] border border-[#4B267D]/20 flex items-center justify-center text-[#4B267D] mx-auto shadow-inner">
              <ShieldCheck className="w-7 h-7 text-[#7043A6]" />
            </div>
            <h1 className="text-2xl font-bold text-[#4B267D] font-heading">
              เข้าสู่ระบบผู้ดูแลระบบ (ADMINISTRATOR)
            </h1>
            <p className="text-xs text-[#81788B]">
              ระบบควบคุมส่วนกลาง โครงการสืบศิลป์ถิ่นอักษร สืบสุนทรภาษาไทย
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#4B267D] mb-1.5">
                ชื่อผู้ใช้งาน (Username)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="thaiadmin69"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 text-[#30283A] placeholder-[#81788B]/50 focus:outline-none focus:ring-2 focus:ring-[#D6AF55] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B267D] mb-1.5">
                รหัสผ่าน (Password)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="696667***"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 text-[#30283A] placeholder-[#81788B]/50 focus:outline-none focus:ring-2 focus:ring-[#D6AF55] text-sm"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-[#4B267D] hover:bg-[#7043A6] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#D6AF55]" />
                  <span>กำลังตรวจสอบสิทธิ์...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-[#D6AF55]" />
                  <span>เข้าสู่ระบบ</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-purple-100 text-center">
            <span className="text-[11px] text-[#81788B]">
              ข้อมูลเข้าสู่ระบบเริ่มต้น: Username: thaiadmin69 / Pass: 696667***
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 7.2 Admin Dashboard
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Admin Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#4B267D] flex items-center justify-center text-[#D6AF55] shadow-sm">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#4B267D] font-heading">
                ADMINISTRATOR DASHBOARD
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D6AF55] text-[#30283A]">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-xs text-[#81788B]">
              เข้าสู่ระบบในชื่อ: <strong className="text-[#4B267D]">thaiadmin69</strong> · กลุ่มสาระการเรียนรู้ภาษาไทย โรงเรียนกระทุ่มแบน &quot;วิเศษสมุทคุณ&quot;
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-[#FAF8FD] text-[#4B267D] border border-[#4B267D]/20 shadow-sm transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#D6AF55]" />
            <span>ดูหน้าเว็บหลัก</span>
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* Save Notification Alert */}
      {saveStatus && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-sm animate-in fade-in duration-200 ${
            saveStatus.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          {saveStatus.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{saveStatus.message}</span>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-purple-100 pb-3">
        {[
          { id: 'overview' as AdminTab, label: '1. ภาพรวมระบบ', icon: LayoutDashboard },
          { id: 'forms' as AdminTab, label: '2. จัดการแบบทดสอบ', icon: FileText },
          { id: 'scores' as AdminTab, label: '3. จัดการตรวจคะแนน', icon: Database },
          { id: 'certs' as AdminTab, label: '4. จัดการเกียรติบัตร', icon: Award },
          { id: 'deadline' as AdminTab, label: '5. ตั้งค่าวันรับสมัคร', icon: Clock },
          { id: 'students' as AdminTab, label: '6. ฐานข้อมูลผู้สอบ', icon: Users },
          { id: 'password' as AdminTab, label: '7. เปลี่ยนรหัสผ่าน', icon: Lock },
          { id: 'guide' as AdminTab, label: '8. คู่มือการตั้งค่า', icon: HelpCircle },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#4B267D] text-white shadow-sm'
                  : 'bg-white hover:bg-[#FAF8FD] text-[#30283A] border border-[#4B267D]/10'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D6AF55]' : 'text-[#7043A6]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* 1. ภาพรวมระบบ (Overview) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-[#4B267D]/15 p-5 shadow-sm space-y-1">
              <span className="text-xs text-[#81788B] font-medium">ผู้เข้าสอบทั้งหมด</span>
              <div className="text-2xl sm:text-3xl font-bold font-heading text-[#4B267D]">
                {stats.total} <span className="text-xs font-normal text-[#81788B]">คน</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-sm space-y-1">
              <span className="text-xs text-emerald-700 font-medium">ผ่านเกณฑ์การประเมิน</span>
              <div className="text-2xl sm:text-3xl font-bold font-heading text-emerald-600">
                {stats.passed} <span className="text-xs font-normal text-[#81788B]">คน</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-sm space-y-1">
              <span className="text-xs text-rose-700 font-medium">ไม่ผ่านเกณฑ์</span>
              <div className="text-2xl sm:text-3xl font-bold font-heading text-rose-600">
                {stats.failed} <span className="text-xs font-normal text-[#81788B]">คน</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#D6AF55]/40 p-5 shadow-sm space-y-1">
              <span className="text-xs text-[#81788B] font-medium">คะแนนเฉลี่ยโครงการ</span>
              <div className="text-2xl sm:text-3xl font-bold font-heading text-[#D6AF55]">
                {stats.avgPercentage}%
              </div>
            </div>
          </div>

          {/* Connection Status Grid */}
          <div className="bg-white rounded-2xl border border-[#4B267D]/15 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#4B267D] font-heading">
              สถานะการเชื่อมต่อระบบภายนอก (Integration Status)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#4B267D]" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#4B267D]">Google Forms (ม.ต้น & ม.ปลาย)</h4>
                    <p className="text-[11px] text-[#81788B]">
                      {m13FormUrl && m46FormUrl ? 'กำหนดลิงก์พร้อมใช้งานแล้ว' : 'ยังระบุไม่ครบถ้วน'}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  ONLINE
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-[#4B267D]" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#4B267D]">Google Sheets (คะแนน & เกียรติบัตร)</h4>
                    <p className="text-[11px] text-[#81788B]">
                      {scoreSheetId ? `Sheet ID: ${scoreSheetId.slice(0, 12)}...` : 'ใช้ฐานข้อมูลระบบ'}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-[#4B267D]">
                  READY
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. จัดการระบบแบบฟอร์ม (Google Forms) */}
      {activeTab === 'forms' && (
        <div className="bg-white rounded-2xl border border-[#4B267D]/15 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1 pb-4 border-b border-purple-100">
            <h3 className="text-lg font-bold text-[#4B267D] font-heading">
              7.3 จัดการระบบแบบฟอร์ม (Google Forms)
            </h3>
            <p className="text-xs sm:text-sm text-[#81788B]">
              ระบุลิงก์ Google Form เพื่อเชื่อมโยงกับปุ่มเข้าทำแบบทดสอบ เมื่อบันทึกแล้วระบบจะฝังไว้ถาวรทุกอุปกรณ์
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#4B267D] mb-1.5">
                ลิงก์ Google Forms ระดับมัธยมศึกษาตอนต้น (ม.1–ม.3)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={m13FormUrl}
                  onChange={(e) => setM13FormUrl(e.target.value)}
                  placeholder="https://docs.google.com/forms/d/e/.../viewform"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#D6AF55]"
                />
                <button
                  type="button"
                  onClick={() => m13FormUrl && window.open(m13FormUrl, '_blank')}
                  className="px-3 py-2 rounded-xl bg-[#FAF8FD] hover:bg-purple-100/60 text-[#4B267D] border border-[#4B267D]/20 text-xs font-semibold flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#D6AF55]" />
                  <span>ทดสอบ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setM13FormUrl('')}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold"
                >
                  ล้าง
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4B267D] mb-1.5">
                ลิงก์ Google Forms ระดับมัธยมศึกษาตอนปลาย (ม.4–ม.6)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={m46FormUrl}
                  onChange={(e) => setM46FormUrl(e.target.value)}
                  placeholder="https://docs.google.com/forms/d/e/.../viewform"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#D6AF55]"
                />
                <button
                  type="button"
                  onClick={() => m46FormUrl && window.open(m46FormUrl, '_blank')}
                  className="px-3 py-2 rounded-xl bg-[#FAF8FD] hover:bg-purple-100/60 text-[#4B267D] border border-[#4B267D]/20 text-xs font-semibold flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#D6AF55]" />
                  <span>ทดสอบ</span>
                </button>
                <button
                  type="button"
                  onClick={() => setM46FormUrl('')}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold"
                >
                  ล้าง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. จัดการระบบตรวจสอบคะแนน (Score Checking) */}
      {activeTab === 'scores' && (
        <div className="bg-white rounded-2xl border border-[#4B267D]/15 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1 pb-4 border-b border-purple-100">
            <h3 className="text-lg font-bold text-[#4B267D] font-heading">
              7.4 จัดการระบบตรวจสอบคะแนน (Google Sheets)
            </h3>
            <p className="text-xs sm:text-sm text-[#81788B]">
              ระบุ Google Spreadsheet ID เพื่อดึงผลคะแนนสอบจากแบบฟอร์มมาแสดงผลในระบบค้นหา
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#4B267D] mb-1.5">
                Google Spreadsheet ID หรือ URL เต็ม
              </label>
              <input
                type="text"
                value={scoreSheetId}
                onChange={(e) => setScoreSheetId(e.target.value)}
                placeholder="เช่น 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms หรือ URL ของ Sheet"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#D6AF55]"
              />
              <p className="text-[11px] text-[#81788B] mt-1">
                * ต้องตั้งค่าสิทธิ์ของ Google Sheet ให้เป็น &ldquo;ทุกคนที่มีลิงก์มีสิทธิ์ดู&rdquo; (Anyone with the link can view)
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4B267D] mb-1.5">
                ชื่อ Sheet ที่ต้องการอ่านข้อมูล
              </label>
              <input
                type="text"
                value={scoreSheetName}
                onChange={(e) => setScoreSheetName(e.target.value)}
                placeholder="คะแนนแบบทดสอบ หรือ Sheet1"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D6AF55]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4B267D] mb-1.5">
                คะแนนเต็มเริ่มต้น (Max Score)
              </label>
              <input
                type="number"
                value={maxScoreDefault}
                onChange={(e) => setMaxScoreDefault(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D6AF55]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4B267D] mb-1.5">
                เกณฑ์คะแนนผ่านการประเมิน (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={passingPercentage}
                onChange={(e) => setPassingPercentage(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D6AF55]"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleTestSyncSheet}
                disabled={isSyncing}
                className="w-full py-2.5 rounded-xl bg-[#FAF8FD] hover:bg-purple-100/60 text-[#4B267D] border border-[#4B267D]/20 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#D6AF55] ${isSyncing ? 'animate-spin' : ''}`} />
                <span>ทดสอบการเชื่อมต่อ Google Sheet</span>
              </button>
            </div>
          </div>

          {syncStatus && (
            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-[#4B267D]">
              {syncStatus}
            </div>
          )}
        </div>
      )}

      {/* 4. จัดการระบบเกียรติบัตร (Certificate) */}
      {activeTab === 'certs' && (
        <div className="bg-white rounded-2xl border border-[#4B267D]/15 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1 pb-4 border-b border-purple-100">
            <h3 className="text-lg font-bold text-[#4B267D] font-heading">
              7.5 จัดการระบบเกียรติบัตร (Certificate Management)
            </h3>
            <p className="text-xs sm:text-sm text-[#81788B]">
              ตั้งค่าฐานข้อมูลเกียรติบัตรและเทมเพลตการออกเกียรติบัตรอิเล็กทรอนิกส์
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#4B267D] mb-1.5">
                Google Spreadsheet ID ของเกียรติบัตร
              </label>
              <input
                type="text"
                value={certificateSheetId}
                onChange={(e) => setCertificateSheetId(e.target.value)}
                placeholder="หากเว้นว่าง จะใช้ ID จากหน้าตรวจสอบคะแนนโดยอัตโนมัติ"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#D6AF55]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4B267D] mb-1.5">
                ชื่อ Sheet ข้อมูลเกียรติบัตร
              </label>
              <input
                type="text"
                value={certificateSheetName}
                onChange={(e) => setCertificateSheetName(e.target.value)}
                placeholder="ข้อมูลเกียรติบัตร"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D6AF55]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4B267D] mb-1.5">
                สถานะการเปิดดาวน์โหลดเกียรติบัตร
              </label>
              <div className="flex items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  เปิดให้บริการดาวน์โหลดตามปกติ
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. ตั้งค่าวันรับสมัคร (Deadline) */}
      {activeTab === 'deadline' && (
        <div className="bg-white rounded-2xl border border-[#4B267D]/15 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1 pb-4 border-b border-purple-100">
            <h3 className="text-lg font-bold text-[#4B267D] font-heading">
              7.6 จัดการวันปิดรับสมัครและปิดระบบ (Registration Deadline)
            </h3>
            <p className="text-xs sm:text-sm text-[#81788B]">
              กำหนดวันเวลาสิ้นสุดการรับสมัคร ซึ่งจะเชื่อมต่อกับนาฬิกานับถอยหลังหน้าแรกโดยอัตโนมัติ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#4B267D] mb-1.5">
                กำหนดวันและเวลาปิดระบบรับสมัคร
              </label>
              <input
                type="datetime-local"
                value={countdownTarget.slice(0, 16)}
                onChange={(e) => setCountdownTarget(e.target.value ? new Date(e.target.value).toISOString() : countdownTarget)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D6AF55]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4B267D] mb-1.5">
                สถานะระบบรับสมัคร (เปิด / ปิด)
              </label>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsExamOpen(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    isExamOpen ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  เปิดรับสมัคร
                </button>
                <button
                  type="button"
                  onClick={() => setIsExamOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    !isExamOpen ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  ปิดรับสมัคร
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. ฐานข้อมูลผู้สอบ (Students Database) */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-[#4B267D]/15 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-100">
            <div>
              <h3 className="text-lg font-bold text-[#4B267D] font-heading">
                ฐานข้อมูลผลการทดสอบ ({students.length} รายการ)
              </h3>
              <p className="text-xs text-[#81788B]">
                รายชื่อผู้สอบที่บันทึกไว้ในระบบ สามารถเพิ่มหรือลบรายชื่อได้
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4B267D] hover:bg-[#7043A6] text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#D6AF55]" />
              <span>เพิ่มรายชื่อผู้สอบ</span>
            </button>
          </div>

          {/* Student Table */}
          <div className="overflow-x-auto rounded-xl border border-purple-100">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#FAF8FD] text-[#4B267D] font-bold border-b border-purple-100 uppercase">
                <tr>
                  <th className="px-4 py-3">ชื่อ-นามสกุล</th>
                  <th className="px-4 py-3">ระดับชั้น</th>
                  <th className="px-4 py-3 text-center">คะแนน</th>
                  <th className="px-4 py-3 text-center">ร้อยละ (%)</th>
                  <th className="px-4 py-3 text-center">ผลการประเมิน</th>
                  <th className="px-4 py-3 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-purple-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#30283A]">
                      {student.fullName}
                    </td>
                    <td className="px-4 py-3 text-[#81788B]">
                      {student.level}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-[#4B267D]">
                      {student.scoreNumber}/{student.maxScore}
                    </td>
                    <td className="px-4 py-3 text-center font-mono font-bold text-[#D6AF55]">
                      {student.percentage}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      {student.isPassed ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          ผ่าน
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          ไม่ผ่าน
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="ลบรายการ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. เปลี่ยนรหัสผ่านแอดมิน (Change Password) */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-2xl border border-[#4B267D]/15 p-6 sm:p-8 shadow-sm space-y-6 max-w-xl">
          <div className="space-y-1 pb-4 border-b border-purple-100">
            <h3 className="text-lg font-bold text-[#4B267D] font-heading">
              เปลี่ยนรหัสผ่านผู้ดูแลระบบ (Change Password)
            </h3>
            <p className="text-xs text-[#81788B]">
              เพื่อความปลอดภัย แนะนำให้เปลี่ยนรหัสผ่านเริ่มต้นเป็นรหัสผ่านเฉพาะของท่าน
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#4B267D] mb-1.5">
                รหัสผ่านเดิม (Current Password)
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D6AF55]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4B267D] mb-1.5">
                รหัสผ่านใหม่ (New Password)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D6AF55]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4B267D] mb-1.5">
                ยืนยันรหัสผ่านใหม่ (Confirm New Password)
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#D6AF55]"
              />
            </div>

            {passwordChangeStatus && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  passwordChangeStatus.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {passwordChangeStatus.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>{passwordChangeStatus.message}</span>
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#4B267D] hover:bg-[#7043A6] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              บันทึกรหัสผ่านใหม่
            </button>
          </form>
        </div>
      )}

      {/* 8. คู่มือการตั้งค่า (Setup Guide) */}
      {activeTab === 'guide' && (
        <div className="bg-white rounded-2xl border border-[#4B267D]/15 p-6 sm:p-8 shadow-sm space-y-6 leading-relaxed">
          <div className="space-y-1 pb-4 border-b border-purple-100">
            <h3 className="text-lg font-bold text-[#4B267D] font-heading">
              คู่มือการตั้งค่าระบบสำหรับผู้ดูแล (Admin Setup Guide)
            </h3>
            <p className="text-xs text-[#81788B]">
              คำแนะนำขั้นตอนการเชื่อมโยง Google Forms และ Google Sheets
            </p>
          </div>

          <div className="space-y-5 text-xs sm:text-sm text-[#30283A]">
            <div className="space-y-2">
              <h4 className="font-bold text-[#4B267D] text-base">
                1. การเชื่อมต่อ Google Forms
              </h4>
              <p className="text-[#81788B]">
                - สร้าง Google Forms สำหรับชุดข้อสอบ ม.ต้น และ ม.ปลาย<br />
                - กดปุ่ม &quot;ส่ง&quot; (Send) ใน Google Forms แล้วคัดลอกลิงก์ฟอร์ม (Link)<br />
                - นำมาวางในช่อง <strong>&quot;2. จัดการแบบทดสอบ&quot;</strong> แล้วกดปุ่ม <strong>&quot;บันทึกผลการตั้งค่าระบบ&quot;</strong>
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#4B267D] text-base">
                2. การเชื่อมต่อ Google Sheets สำหรับตรวจสอบคะแนน
              </h4>
              <p className="text-[#81788B]">
                - ใน Google Forms ให้กดแถบ &quot;การตอบกลับ&quot; (Responses) แล้วเลือกสร้าง Google Sheets<br />
                - กดปุ่ม <strong>&quot;แชร์&quot; (Share)</strong> ที่มุมขวาบนของ Google Sheets แล้วเปลี่ยนสิทธิ์การเข้าถึงทั่วไปเป็น <strong>&quot;ทุกคนที่มีลิงก์มีสิทธิ์ดู&quot; (Anyone with the link can view)</strong><br />
                - คัดลอก Spreadsheet ID (ตัวอักษรและตัวเลขยาว ๆ ใน URL ระหว่าง <code>/d/</code> กับ <code>/edit</code>) มาวางในช่อง Google Spreadsheet ID<br />
                - กดปุ่ม <strong>&quot;ทดสอบการเชื่อมต่อ&quot;</strong> เพื่อดูตัวอย่างรายการที่ระบบดึงข้อมูลได้
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-[#4B267D] text-base">
                3. คอลัมน์ที่รองรับใน Google Sheets
              </h4>
              <p className="text-[#81788B]">
                ระบบจะตรวจสอบชื่อหัวตารางโดยอัตโนมัติ (เช่น คอลัมน์ที่มีคำว่า &quot;ชื่อ&quot;, &quot;คะแนน&quot;, &quot;ระดับชั้น&quot;) หากไม่พบชื่อหัวตาราง ระบบจะใช้คอลัมน์มาตรฐานจาก Google Forms ตอบกลับโดยตรง
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Save Bar */}
      <div className="sticky bottom-6 z-20 flex justify-end">
        <button
          onClick={handleSaveConfig}
          disabled={isSaving}
          className="px-8 py-3.5 rounded-2xl bg-[#4B267D] hover:bg-[#7043A6] text-white font-bold text-sm sm:text-base shadow-xl transition-all flex items-center gap-2.5 cursor-pointer transform hover:-translate-y-0.5 border border-[#D6AF55]/40"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-[#D6AF55]" />
              <span>กำลังบันทึกและฝังการตั้งค่าถาวร...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5 text-[#D6AF55]" />
              <span>บันทึกผลการตั้งค่าระบบ (บันทึกถาวรทุกอุปกรณ์)</span>
            </>
          )}
        </button>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-purple-100 z-10 space-y-4">
            <h3 className="text-lg font-bold text-[#4B267D] font-heading">
              เพิ่มรายชื่อผู้เข้าร่วมการทดสอบ
            </h3>
            <form onSubmit={handleAddStudent} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-[#4B267D] mb-1">ชื่อ-นามสกุล (พร้อมคำนำหน้า)</label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="เช่น เด็กชายเอกชัย บุญเรือง"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-purple-200 bg-[#FAF8FD]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4B267D] mb-1">ระดับชั้น</label>
                <select
                  value={newStudentLevel}
                  onChange={(e) => setNewStudentLevel(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-purple-200 bg-[#FAF8FD]"
                >
                  <option value="มัธยมศึกษาตอนต้น (ม.1 - 3)">มัธยมศึกษาตอนต้น (ม.1 - 3)</option>
                  <option value="มัธยมศึกษาตอนปลาย (ม.4 - 6)">มัธยมศึกษาตอนปลาย (ม.4 - 6)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#4B267D] mb-1">คะแนนที่ได้</label>
                  <input
                    type="number"
                    value={newStudentScore}
                    onChange={(e) => setNewStudentScore(Number(e.target.value))}
                    max={maxScoreDefault}
                    min={0}
                    className="w-full px-3.5 py-2 rounded-xl border border-purple-200 bg-[#FAF8FD]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#4B267D] mb-1">คะแนนเต็ม</label>
                  <input
                    type="number"
                    value={maxScoreDefault}
                    disabled
                    className="w-full px-3.5 py-2 rounded-xl border border-purple-200 bg-slate-100 text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#4B267D] mb-1">โรงเรียน</label>
                <input
                  type="text"
                  value={newStudentSchool}
                  onChange={(e) => setNewStudentSchool(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-purple-200 bg-[#FAF8FD]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#4B267D] text-white text-xs font-bold"
                >
                  เพิ่มรายชื่อ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
