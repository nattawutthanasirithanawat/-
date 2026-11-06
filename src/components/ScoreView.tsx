import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, Award, ArrowLeft, School, Sparkles, Filter, RefreshCw, AlertCircle, ChevronRight } from 'lucide-react';
import { StudentScoreRecord, ViewMode } from '../types';

interface ScoreViewProps {
  onNavigate: (view: ViewMode) => void;
  onSelectStudentForCert: (student: StudentScoreRecord) => void;
}

export const ScoreView: React.FC<ScoreViewProps> = ({ onNavigate, onSelectStudentForCert }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<StudentScoreRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchScores = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setErrorMessage('กรุณากรอกชื่อ หรือชื่อ-นามสกุลเพื่อค้นหาผลคะแนน');
      return;
    }

    setLoading(true);
    setSearched(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/scores?q=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      } else {
        setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล กรุณาลองใหม่อีกครั้ง');
      }
    } catch {
      setErrorMessage('ไม่สามารถเชื่อมต่อระบบได้ กรุณาตรวจสอบอินเทอร์เน็ต');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchScores(searchQuery);
  };

  const handleSampleClick = (name: string) => {
    setSearchQuery(name);
    fetchScores(name);
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
            onClick={() => onNavigate('exam')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-[#FAF8FD] text-[#4B267D] border border-[#4B267D]/20 shadow-sm transition-colors cursor-pointer"
          >
            <span>เข้าทำแบบทดสอบ</span>
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

      {/* 5.1 Search Interface Header */}
      <div className="rounded-3xl bg-white border border-[#4B267D]/15 p-6 sm:p-10 text-center space-y-6 shadow-md">
        <div className="space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8FD] border border-[#4B267D]/20 text-[#4B267D] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#D6AF55]" />
            <span>ระบบตรวจสอบผลการทดสอบออนไลน์</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4B267D] font-heading">
            ตรวจสอบผลคะแนนการทดสอบความรู้ความสามารถด้านภาษาไทย
          </h1>
          <p className="text-xs sm:text-sm text-[#81788B] leading-relaxed">
            กรุณากรอกชื่อหรือชื่อ-นามสกุลของผู้เข้าร่วมโครงการ เพื่อค้นหาผลคะแนน (ค้นหาได้ทั้งแบบมีหรือไม่มีคำนำหน้า)
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#81788B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="กรอกชื่อ, ชื่อ-นามสกุล หรือ คำนำหน้า เช่น นายสมชาย ใจดี..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 text-[#30283A] placeholder-[#81788B]/60 focus:outline-none focus:ring-2 focus:ring-[#D6AF55] focus:border-transparent text-sm sm:text-base shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-7 py-3.5 rounded-xl bg-[#4B267D] hover:bg-[#7043A6] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-[#D6AF55]" />
                <span>กำลังค้นหา...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4 text-[#D6AF55]" />
                <span>ค้นหาข้อมูล</span>
              </>
            )}
          </button>
        </form>

        {/* Error or Empty query Alert */}
        {errorMessage && (
          <div className="max-w-2xl mx-auto p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Quick Sample Search Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-[#81788B]">
          <span className="flex items-center gap-1 font-medium">
            <Filter className="w-3.5 h-3.5 text-[#D6AF55]" />
            ตัวอย่างค้นหาด่วน:
          </span>
          {['สมชาย ใจดี', 'กานดา', 'เด็กหญิงปิยฉัตร', 'วรเมธ', 'ภานุวัฒน์'].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => handleSampleClick(name)}
              className="px-2.5 py-1 rounded-md bg-[#FAF8FD] hover:bg-purple-100/60 text-[#4B267D] border border-[#4B267D]/15 transition-colors cursor-pointer"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* 5.3 & 5.4 Search Results Section */}
      <div className="space-y-4">
        {searched && !loading && (
          <div className="flex items-center justify-between text-xs sm:text-sm text-[#81788B] px-1 font-medium">
            <span>
              ผลการค้นหาสำหรับ &ldquo;<strong className="text-[#4B267D]">{searchQuery}</strong>&rdquo;
            </span>
            <span>พบ {results.length} รายการ</span>
          </div>
        )}

        {/* Result Cards */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 gap-5">
            {results.map((student) => (
              <div
                key={student.id}
                className="rounded-2xl bg-white border border-[#4B267D]/15 p-6 sm:p-7 academic-card-shadow space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Student Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xl sm:text-2xl font-bold text-[#4B267D] font-heading">
                        {student.fullName}
                      </span>
                      <span className="text-xs px-3 py-0.5 rounded-full bg-[#FAF8FD] text-[#4B267D] border border-[#4B267D]/20 font-semibold">
                        {student.level}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#81788B]">
                      <School className="w-3.5 h-3.5 text-[#D6AF55]" />
                      <span>{student.school || 'โรงเรียนกระทุ่มแบน "วิเศษสมุทคุณ"'}</span>
                      {student.completedAt && (
                        <>
                          <span>·</span>
                          <span>วันที่บันทึกคะแนน: {student.completedAt}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0 self-start sm:self-center">
                    {student.isPassed ? (
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs sm:text-sm font-bold shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>ผ่าน</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-300 text-xs sm:text-sm font-bold shadow-sm">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>ไม่ผ่าน</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Score & Progress Bar Section */}
                <div className="bg-[#FAF8FD] rounded-xl p-4 sm:p-5 border border-[#4B267D]/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[#81788B]">คะแนนที่ได้รับ</span>
                      <div className="text-xl sm:text-2xl font-bold font-heading text-[#4B267D] tabular-nums">
                        {student.scoreNumber} <span className="text-sm font-normal text-[#81788B]">/ {student.maxScore} คะแนน</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-[#81788B]">คะแนนคิดเป็น</span>
                      <div className="text-xl sm:text-2xl font-bold font-heading text-[#D6AF55] tabular-nums">
                        {student.percentage}%
                      </div>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          student.isPassed
                            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                            : 'bg-gradient-to-r from-rose-400 to-rose-600'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(5, student.percentage))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#81788B] pt-0.5">
                      <span>0%</span>
                      <span className="text-[#4B267D] font-medium">เกณฑ์ผ่าน: 60%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>

                {/* Direct Certificate Download CTA if Passed */}
                {student.isPassed && (
                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5">
                    <div className="flex items-center gap-2 text-xs text-amber-900">
                      <Award className="w-4 h-4 text-[#D6AF55] shrink-0" />
                      <span>ยินดีด้วย! ท่านผ่านเกณฑ์และมีสิทธิ์ได้รับเกียรติบัตรอิเล็กทรอนิกส์</span>
                    </div>
                    <button
                      onClick={() => {
                        onSelectStudentForCert(student);
                        onNavigate('certificate');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4B267D] hover:bg-[#7043A6] text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap cursor-pointer"
                    >
                      <span>ไปที่หน้าดาวน์โหลดเกียรติบัตร</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#D6AF55]" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : searched && !loading ? (
          <div className="rounded-2xl bg-white border border-[#4B267D]/15 p-10 text-center space-y-3 shadow-sm">
            <XCircle className="w-10 h-10 text-rose-400 mx-auto" />
            <h3 className="text-base font-bold text-[#4B267D] font-heading">ไม่พบข้อมูลผลคะแนน</h3>
            <p className="text-xs sm:text-sm text-[#81788B] max-w-md mx-auto leading-relaxed">
              ไม่พบข้อมูลผลการทดสอบที่ตรงกับคำค้นหา &ldquo;{searchQuery}&rdquo;
              กรุณาตรวจสอบการสะกดชื่อ หรือลองค้นหาด้วยชื่อจริงโดยไม่ต้องใส่คำนำหน้าหรือนามสกุล
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
