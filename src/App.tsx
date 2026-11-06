import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ExamView } from './components/ExamView';
import { ScoreView } from './components/ScoreView';
import { CertificateView } from './components/CertificateView';
import { AdminView } from './components/AdminView';
import { Footer } from './components/Footer';
import { ViewMode, AppConfig, StudentScoreRecord } from './types';

const INITIAL_CONFIG: AppConfig = {
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
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [config, setConfig] = useState<AppConfig>(INITIAL_CONFIG);
  const [selectedStudent, setSelectedStudent] = useState<StudentScoreRecord | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Load app configuration from server
  const loadConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
      }
    } catch (err) {
      console.warn('Could not load config from server, using defaults:', err);
    } finally {
      setLoadingConfig(false);
    }
  };

  // Check admin session
  const checkAdminSession = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const res = await fetch('/api/admin/check-auth', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.authenticated) {
        setIsAdminLoggedIn(true);
      } else {
        localStorage.removeItem('adminToken');
        setIsAdminLoggedIn(false);
      }
    } catch {
      // safe fallback
    }
  };

  useEffect(() => {
    loadConfig();
    checkAdminSession();
  }, []);

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStudentForCert = (student: StudentScoreRecord) => {
    setSelectedStudent(student);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8FD] text-[#30283A] selection:bg-[#D6AF55] selection:text-[#4B267D]">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentView === 'home' && (
          <HomeView config={config} onNavigate={handleNavigate} />
        )}

        {currentView === 'exam' && (
          <ExamView config={config} onNavigate={handleNavigate} />
        )}

        {currentView === 'score' && (
          <ScoreView
            onNavigate={handleNavigate}
            onSelectStudentForCert={handleSelectStudentForCert}
          />
        )}

        {currentView === 'certificate' && (
          <CertificateView
            config={config}
            selectedStudent={selectedStudent}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            config={config}
            onUpdateConfig={setConfig}
            onNavigate={handleNavigate}
            isAdminLoggedIn={isAdminLoggedIn}
            onSetAdminLoggedIn={setIsAdminLoggedIn}
          />
        )}
      </main>

      {/* Footer / Credit Bar */}
      <Footer />
    </div>
  );
}
