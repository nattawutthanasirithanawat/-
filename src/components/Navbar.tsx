import React, { useState } from 'react';
import { Menu, X, Home, FileText, Award, CheckSquare, ShieldCheck, ExternalLink, GraduationCap, ChevronRight } from 'lucide-react';
import { ViewMode } from '../types';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, isAdminLoggedIn }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavClick = (view: ViewMode) => {
    onNavigate(view);
    setDrawerOpen(false);
  };

  const navItems = [
    { id: 'home' as ViewMode, label: 'หน้าแรก', icon: Home },
    { id: 'exam' as ViewMode, label: 'เข้าทำแบบทดสอบ', icon: FileText },
    { id: 'score' as ViewMode, label: 'ตรวจสอบคะแนน', icon: CheckSquare },
    { id: 'certificate' as ViewMode, label: 'ดาวน์โหลดเกียรติบัตร', icon: Award },
    { id: 'admin' as ViewMode, label: 'ผู้ดูแลระบบ', icon: ShieldCheck },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#4B267D]/10 px-4 lg:px-8 py-3.5 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Zone */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6AF55] rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#4B267D] to-[#D6AF55] p-0.5 shadow-sm shrink-0">
              <img
                src="/src/assets/images/thai_project_emblem_1793861181082.jpg"
                alt="ตราโครงการ"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-[#4B267D] font-heading tracking-tight group-hover:text-[#7043A6] transition-colors">
                  สืบศิลป์ถิ่นอักษร สืบสุนทรภาษาไทย
                </span>
              </div>
              <p className="text-[11px] text-[#81788B] hidden sm:block truncate max-w-md font-medium">
                กลุ่มสาระการเรียนรู้ภาษาไทย โรงเรียนกระทุ่มแบน &quot;วิเศษสมุทคุณ&quot;
              </p>
            </div>
          </button>

          {/* Desktop Nav Links (Zone 2) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 py-1 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-[#4B267D] font-bold border-b-2 border-[#D6AF55]'
                      : 'text-[#30283A]/80 hover:text-[#4B267D]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#D6AF55]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Admin Button & Hamburger Drawer Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('admin')}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                currentView === 'admin'
                  ? 'bg-[#4B267D] text-[#D6AF55] shadow-sm font-bold'
                  : 'bg-[#FAF8FD] hover:bg-[#4B267D]/10 text-[#4B267D] border border-[#4B267D]/20'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D6AF55]" />
              <span>{isAdminLoggedIn ? 'จัดการระบบ (Admin)' : 'ผู้ดูแลระบบ'}</span>
            </button>

            {/* Hamburger button (3 bars icon on top right) */}
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              aria-label="เปิดเมนูด้านข้างของระบบ"
              className="p-2 rounded-lg bg-[#FAF8FD] hover:bg-[#4B267D]/10 text-[#4B267D] border border-[#4B267D]/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D6AF55]"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Side Navigation Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          <aside className="relative w-full max-w-xs bg-white text-[#30283A] h-full border-l border-[#4B267D]/10 p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-purple-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#4B267D] flex items-center justify-center text-[#D6AF55]">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4B267D] font-heading">
                      เมนูระบบภาษาไทย
                    </h4>
                    <p className="text-[11px] text-[#81788B]">
                      โรงเรียนกระทุ่มแบน &quot;วิเศษสมุทคุณ&quot;
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="ปิดเมนู"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#4B267D] hover:bg-[#FAF8FD] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links in Drawer */}
              <div className="mt-6 flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                        isActive
                          ? 'bg-[#4B267D] text-white shadow-sm font-semibold'
                          : 'text-[#30283A] hover:bg-[#FAF8FD] hover:text-[#4B267D]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-[#D6AF55]' : 'text-[#7043A6]'}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#D6AF55]' : 'text-slate-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* School Quick Link in Drawer */}
            <div className="pt-6 border-t border-purple-100 text-xs text-[#81788B] space-y-2">
              <p className="font-semibold text-[#4B267D]">
                กลุ่มสาระการเรียนรู้ภาษาไทย
              </p>
              <a
                href="https://www.wsk.ac.th/wp/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[#7043A6] hover:underline font-medium"
              >
                <span>เว็บไซต์โรงเรียน (wsk.ac.th)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};
