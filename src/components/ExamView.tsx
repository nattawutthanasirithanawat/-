import React, { useState } from 'react';
import { ExternalLink, CheckSquare, Award, ArrowLeft, BookOpen, AlertCircle, Sparkles, Lock } from 'lucide-react';
import { AppConfig, ViewMode } from '../types';

interface ExamViewProps {
  config: AppConfig;
  onNavigate: (view: ViewMode) => void;
}

export const ExamView: React.FC<ExamViewProps> = ({ config, onNavigate }) => {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Check if deadline has passed
  const isDeadlinePassed = new Date(config.countdownTarget).getTime() <= Date.now();
  const isClosed = !config.isExamOpen || isDeadlinePassed;

  const handleOpenForm = (url: string, levelName: string) => {
    setWarningMessage(null);

    if (isClosed) {
      setWarningMessage('ขออภัย ขณะนี้ระบบได้ปิดรับสมัครและปิดการทำแบบทดสอบแล้วตามกำหนดเวลา');
      return;
    }

    if (!url || !url.trim() || url === 'https://forms.gle/ThaiLangContestM13Example' || url === 'https://forms.gle/ThaiLangContestM46Example') {
      // If placeholder or empty
      if (!url || !url.trim()) {
        setWarningMessage(`ยังไม่ได้ตั้งค่าลิงก์ Google Forms สำหรับ${levelName} กรุณาแจ้งผู้ดูแลระบบเพื่อทำการระบุลิงก์ในระบบจัดการ`);
        return;
      }
    }

    try {
      new URL(url);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      setWarningMessage(`รูปแบบลิงก์สำหรับ${levelName}ไม่ถูกต้อง กรุณาติดต่อผู้ดูแลระบบเพื่อตรวจสอบลิงก์`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Navigation Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-sm text-[#4B267D] hover:text-[#7043A6] font-medium transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-[#D6AF55]" />
          <span>กลับสู่หน้าแรก</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('score')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-[#FAF8FD] text-[#4B267D] border border-[#4B267D]/20 shadow-sm transition-colors cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5 text-[#D6AF55]" />
            <span>ตรวจสอบคะแนน</span>
          </button>
          <button
            onClick={() => onNavigate('certificate')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-[#FAF8FD] text-[#4B267D] border border-[#4B267D]/20 shadow-sm transition-colors cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-[#D6AF55]" />
            <span>ดาวน์โหลดเกียรติบัตร</span>
          </button>
        </div>
      </div>

      {/* Main Header Banner */}
      <div className="rounded-3xl purple-gradient-hero text-white p-6 sm:p-10 text-center space-y-3 shadow-lg border border-[#D6AF55]/30">
        <div className="w-12 h-12 rounded-xl bg-white/10 border border-[#D6AF55]/40 flex items-center justify-center text-[#D6AF55] mx-auto shadow-inner">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
          เข้าทำแบบทดสอบ
        </h1>
        <p className="text-xs sm:text-sm text-purple-100/90 max-w-xl mx-auto leading-relaxed">
          โครงการส่งเสริมและพัฒนาความรู้ความสามารถด้านภาษาไทย (สืบศิลป์ถิ่นอักษร สืบสุนทรภาษาไทย)
          กรุณาเลือกระดับชั้นของท่านเพื่อเข้าสู่ระบบแบบทดสอบออนไลน์
        </p>
      </div>

      {/* Warning/Closure Notification */}
      {isClosed && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3">
          <Lock className="w-5 h-5 text-rose-600 shrink-0" />
          <span>
            <strong>ปิดรับการทดสอบแล้ว:</strong> ขณะนี้ระบบได้ปิดรับการทำแบบทดสอบตามกำหนดการเรียบร้อยแล้ว
            ท่านยังคงสามารถตรวจสอบคะแนนและดาวน์โหลดเกียรติบัตรได้ตามปกติ
          </span>
        </div>
      )}

      {warningMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* 2 Large Cards: Grid on Desktop, Vertical Stack on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1 : ระดับมัธยมศึกษาตอนต้น */}
        <div className="bg-white rounded-2xl border border-[#4B267D]/15 p-6 sm:p-8 academic-card-shadow academic-card-hover flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8FD] text-[#4B267D] border border-[#4B267D]/20">
                ม.1 – ม.3
              </span>
              <span className="text-xs text-[#81788B]">ชุดข้อสอบที่ 1</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#4B267D] font-heading">
                ข้อสอบวัดความรู้ความสามารถด้านภาษาไทย
              </h3>
              <p className="text-sm font-semibold text-[#D6AF55]">
                ระดับชั้นมัธยมศึกษาตอนต้น (ม.1–ม.3)
              </p>
              <p className="text-xs sm:text-sm text-[#81788B] leading-relaxed">
                สำหรับนักเรียนระดับชั้นมัธยมศึกษาตอนต้น ครอบคลุมเนื้อหาหลักภาษา วรรณคดีวิจักษ์ ศิลปะการประพันธ์ และการอ่านจับใจความ
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleOpenForm(config.m13FormUrl, 'ระดับมัธยมศึกษาตอนต้น')}
              disabled={isClosed}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                isClosed
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-[#4B267D] hover:bg-[#7043A6] text-white hover:shadow-md'
              }`}
            >
              <span>เข้าสู่แบบทดสอบ</span>
              <ExternalLink className="w-4 h-4 text-[#D6AF55]" />
            </button>
          </div>
        </div>

        {/* CARD 2 : ระดับมัธยมศึกษาตอนปลาย */}
        <div className="bg-white rounded-2xl border border-[#4B267D]/15 p-6 sm:p-8 academic-card-shadow academic-card-hover flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8FD] text-[#4B267D] border border-[#4B267D]/20">
                ม.4 – ม.6
              </span>
              <span className="text-xs text-[#81788B]">ชุดข้อสอบที่ 2</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-[#4B267D] font-heading">
                ข้อสอบวัดความรู้ความสามารถด้านภาษาไทย
              </h3>
              <p className="text-sm font-semibold text-[#D6AF55]">
                ระดับชั้นมัธยมศึกษาตอนปลาย (ม.4–ม.6)
              </p>
              <p className="text-xs sm:text-sm text-[#81788B] leading-relaxed">
                สำหรับนักเรียนระดับชั้นมัธยมศึกษาตอนปลาย ครอบคลุมภาษาเพื่อการสื่อสาร การวิเคราะห์วรรณกรรมมรดก และหลักภาษาขั้นสูง
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleOpenForm(config.m46FormUrl, 'ระดับมัธยมศึกษาตอนปลาย')}
              disabled={isClosed}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                isClosed
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-[#4B267D] hover:bg-[#7043A6] text-white hover:shadow-md'
              }`}
            >
              <span>เข้าสู่แบบทดสอบ</span>
              <ExternalLink className="w-4 h-4 text-[#D6AF55]" />
            </button>
          </div>
        </div>
      </div>

      {/* Instructions card */}
      <div className="rounded-2xl bg-white border border-[#4B267D]/15 p-6 space-y-3 text-xs sm:text-sm text-[#81788B] shadow-sm">
        <div className="flex items-center gap-2 text-[#4B267D] font-bold">
          <Sparkles className="w-4 h-4 text-[#D6AF55]" />
          <span>คำแนะนำในการทำแบบทดสอบ</span>
        </div>
        <ul className="list-disc list-inside space-y-1.5 pl-1 leading-relaxed">
          <li>กรอกข้อมูลคำนำหน้า ชื่อ-นามสกุล และระดับชั้นให้ตรงกับความเป็นจริง เพื่อนำไปประมวลผลเกียรติบัตร</li>
          <li>แบบทดสอบจะเปิดในหน้าต่างใหม่ (Google Forms) ขอให้ผู้สอบตรวจสอบการเชื่อมต่ออินเทอร์เน็ตก่อนเริ่มทำ</li>
          <li>เมื่อส่งคำตอบใน Google Forms แล้ว ท่านสามารถกลับมายังหน้านี้เพื่อ <strong>ตรวจสอบคะแนน</strong> และ <strong>ดาวน์โหลดเกียรติบัตร</strong> ได้ทันที</li>
        </ul>
      </div>
    </div>
  );
};
