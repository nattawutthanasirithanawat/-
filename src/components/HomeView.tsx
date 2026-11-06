import React from 'react';
import { 
  FileText, 
  CheckSquare, 
  Award, 
  BookOpen, 
  ChevronRight, 
  School, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Bookmark, 
  Sparkles,
  ArrowRight,
  Clock
} from 'lucide-react';
import { ViewMode, AppConfig } from '../types';
import { CountdownTimer } from './CountdownTimer';

interface HomeViewProps {
  config: AppConfig;
  onNavigate: (view: ViewMode) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ config, onNavigate }) => {
  return (
    <div className="space-y-14 pb-16">
      {/* 3.1 Hero Section: Modern Academic & Cultural Banner */}
      <section className="relative overflow-hidden rounded-3xl purple-gradient-hero text-white p-6 sm:p-10 md:p-14 shadow-xl border border-[#D6AF55]/30">
        {/* Subtle decorative Thai graphic silhouettes */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
          <img
            src="/src/assets/images/thai_hero_banner_1793861182011.jpg"
            alt="ลวดลายวรรณคดีไทย"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
          />
        </div>

        {/* Ambient subtle lighting */}
        <div className="absolute -top-24 right-10 w-96 h-96 bg-[#D6AF55]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#D6AF55]/40 text-[#E5C378] text-xs sm:text-sm font-medium backdrop-blur-sm shadow-sm">
            <School className="w-4 h-4 text-[#D6AF55]" />
            <span>กลุ่มสาระการเรียนรู้ภาษาไทย โรงเรียนกระทุ่มแบน &quot;วิเศษสมุทคุณ&quot;</span>
          </div>

          {/* Project Title & Identity */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading leading-tight text-white">
              โครงการส่งเสริมและพัฒนาความรู้ความสามารถด้านภาษาไทย
            </h1>
            <p className="text-xl sm:text-3xl font-bold gold-gradient-text font-serif-thai tracking-wide">
              &ldquo;สืบศิลป์ถิ่นอักษร สืบสุนทรภาษาไทย&rdquo;
            </p>
          </div>

          {/* Inspirational blurb */}
          <p className="text-sm sm:text-base text-purple-100/90 max-w-2xl mx-auto leading-relaxed font-light">
            ร่วมทดสอบสมรรถนะการใช้ภาษาไทย เสริมสร้างภูมิปัญญาทางภาษา อนุรักษ์วรรณศิลป์อันทรงคุณค่า
            และเชิดชูเอกลักษณ์แห่งภาษาไทยสู่มาตรฐานการศึกษายุคใหม่
          </p>

          {/* Project Emblem with subtle golden halo */}
          <div className="py-2 flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#D6AF55] via-purple-300 to-[#D6AF55] blur-md opacity-75 group-hover:opacity-100 transition duration-500" />
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#D6AF55] bg-[#3A1B64] p-1 shadow-2xl overflow-hidden">
                <img
                  src="/src/assets/images/thai_project_emblem_1793861181082.jpg"
                  alt="ตราสัญลักษณ์โครงการ"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>
            </div>
            <p className="text-xs text-[#E5C378] mt-2.5 font-medium tracking-wide">
              ตราสัญลักษณ์ประจำโครงการ
            </p>
          </div>

          {/* 3.2 Countdown Timer */}
          <div className="pt-2">
            <CountdownTimer targetDate={config.countdownTarget} isExamOpen={config.isExamOpen} />
          </div>
        </div>
      </section>

      {/* 3.3 Main Action Cards (Card Design with clean academic elegance) */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4B267D] font-heading">
            ปุ่มดำเนินการหลักของระบบ
          </h2>
          <p className="text-xs sm:text-sm text-[#81788B]">
            เลือกทำรายการที่ต้องการเพื่อเข้าสู่ระบบการทดสอบ ตรวจสอบคะแนน หรือดาวน์โหลดเกียรติบัตร
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* CARD 1 : เข้าทำแบบทดสอบ */}
          <div className="bg-white rounded-2xl border border-[#4B267D]/15 p-6 academic-card-shadow academic-card-hover flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#4B267D]/10 border border-[#4B267D]/20 flex items-center justify-center text-[#4B267D] group-hover:bg-[#4B267D] group-hover:text-[#D6AF55] transition-colors">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-[#D6AF55] uppercase tracking-wider">
                  Examination System
                </span>
                <h3 className="text-lg font-bold text-[#4B267D] font-heading">
                  เข้าทำแบบทดสอบ
                </h3>
                <p className="text-xs sm:text-sm text-[#81788B] leading-relaxed">
                  ทดสอบความรู้ความสามารถด้านภาษาไทย สำหรับระดับมัธยมศึกษาตอนต้น และมัธยมศึกษาตอนปลาย
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onNavigate('exam')}
                className="w-full py-3 rounded-xl bg-[#4B267D] hover:bg-[#7043A6] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <span>เข้าทำแบบทดสอบ</span>
                <ChevronRight className="w-4 h-4 text-[#D6AF55]" />
              </button>
            </div>
          </div>

          {/* CARD 2 : ตรวจสอบคะแนน */}
          <div className="bg-white rounded-2xl border border-[#4B267D]/15 p-6 academic-card-shadow academic-card-hover flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#4B267D]/10 border border-[#4B267D]/20 flex items-center justify-center text-[#4B267D] group-hover:bg-[#4B267D] group-hover:text-[#D6AF55] transition-colors">
                <CheckSquare className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-[#D6AF55] uppercase tracking-wider">
                  Score Verification
                </span>
                <h3 className="text-lg font-bold text-[#4B267D] font-heading">
                  ตรวจสอบคะแนน
                </h3>
                <p className="text-xs sm:text-sm text-[#81788B] leading-relaxed">
                  ตรวจสอบผลคะแนนและผลการทดสอบ พร้อมการคิดคะแนนเป็นร้อยละ และสถานะการประเมิน
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onNavigate('score')}
                className="w-full py-3 rounded-xl bg-[#4B267D] hover:bg-[#7043A6] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <span>ตรวจสอบคะแนน</span>
                <ChevronRight className="w-4 h-4 text-[#D6AF55]" />
              </button>
            </div>
          </div>

          {/* CARD 3 : ดาวน์โหลดเกียรติบัตร */}
          <div className="bg-white rounded-2xl border-2 border-[#D6AF55]/40 p-6 academic-card-shadow academic-card-hover flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#D6AF55] text-[#30283A] text-[10px] font-bold px-3 py-0.5 rounded-bl-lg uppercase tracking-wider">
              E-Certificate
            </div>
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#D6AF55]/15 border border-[#D6AF55]/30 flex items-center justify-center text-[#4B267D] group-hover:bg-[#4B267D] group-hover:text-[#D6AF55] transition-colors">
                <Award className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-[#D6AF55] uppercase tracking-wider">
                  Digital Credential
                </span>
                <h3 className="text-lg font-bold text-[#4B267D] font-heading">
                  ดาวน์โหลดเกียรติบัตร
                </h3>
                <p className="text-xs sm:text-sm text-[#81788B] leading-relaxed">
                  ตรวจสอบสิทธิ์และดาวน์โหลดเกียรติบัตร พร้อมแสดงตัวอย่างไฟล์เกียรติบัตรอิเล็กทรอนิกส์
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onNavigate('certificate')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D6AF55] to-[#B38933] hover:from-[#E5C378] hover:to-[#D6AF55] text-[#30283A] font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <span>ดาวน์โหลดเกียรติบัตร</span>
                <ChevronRight className="w-4 h-4 text-[#30283A]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3.4 Additional Information: University Academic Event Style */}
      <section className="space-y-8 max-w-6xl mx-auto pt-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold text-[#D6AF55] uppercase tracking-wider">
            Academic Information
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#4B267D] font-heading">
            ข้อมูลและรายละเอียดโครงการ
          </h2>
          <p className="text-xs sm:text-sm text-[#81788B] max-w-xl mx-auto">
            ส่งเสริมความเป็นเลิศทางภาษาไทย การประเมินสมรรถนะผู้เรียน และการสร้างเสริมเจตคติที่ดีต่อภาษาประจำชาติ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Block 1: ความเป็นมา */}
          <div className="bg-white rounded-2xl border border-[#4B267D]/10 p-5 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 flex items-center justify-center text-[#4B267D]">
              <Bookmark className="w-5 h-5 text-[#7043A6]" />
            </div>
            <h4 className="text-base font-bold text-[#4B267D] font-heading">
              ความเป็นมาของโครงการ
            </h4>
            <p className="text-xs sm:text-sm text-[#81788B] leading-relaxed">
              ภาษาไทยเป็นสมบัติทางวัฒนธรรมอันล้ำค่าของชาติ กลุ่มสาระการเรียนรู้ภาษาไทยจึงจัดโครงการเพื่อยกระดับผลสัมฤทธิ์
              และเปิดโอกาสให้นักเรียนได้แสดงศักยภาพอย่างสร้างสรรค์
            </p>
          </div>

          {/* Block 2: วัตถุประสงค์ */}
          <div className="bg-white rounded-2xl border border-[#4B267D]/10 p-5 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 flex items-center justify-center text-[#4B267D]">
              <CheckCircle2 className="w-5 h-5 text-[#7043A6]" />
            </div>
            <h4 className="text-base font-bold text-[#4B267D] font-heading">
              วัตถุประสงค์โครงการ
            </h4>
            <ul className="text-xs sm:text-sm text-[#81788B] space-y-1.5 list-disc list-inside leading-relaxed">
              <li>พัฒนาทักษะการใช้ภาษาไทย 4 ด้าน</li>
              <li>กระตุ้นการอ่านและการตีความวรรณคดี</li>
              <li>ประเมินความรู้ตามเกณฑ์มาตรฐาน</li>
            </ul>
          </div>

          {/* Block 3: กลุ่มเป้าหมาย */}
          <div className="bg-white rounded-2xl border border-[#4B267D]/10 p-5 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 flex items-center justify-center text-[#4B267D]">
              <Users className="w-5 h-5 text-[#7043A6]" />
            </div>
            <h4 className="text-base font-bold text-[#4B267D] font-heading">
              กลุ่มเป้าหมายผู้เข้าร่วม
            </h4>
            <p className="text-xs sm:text-sm text-[#81788B] leading-relaxed">
              นักเรียนระดับชั้นมัธยมศึกษาตอนต้น (ม.1–ม.3) และนักเรียนระดับชั้นมัธยมศึกษาตอนปลาย (ม.4–ม.6)
              โรงเรียนกระทุ่มแบน &quot;วิเศษสมุทคุณ&quot; และผู้สนใจทั่วไป
            </p>
          </div>

          {/* Block 4: ประเภทการทดสอบ */}
          <div className="bg-white rounded-2xl border border-[#4B267D]/10 p-5 space-y-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 flex items-center justify-center text-[#4B267D]">
              <Sparkles className="w-5 h-5 text-[#7043A6]" />
            </div>
            <h4 className="text-base font-bold text-[#4B267D] font-heading">
              เกณฑ์และประเภทการทดสอบ
            </h4>
            <p className="text-xs sm:text-sm text-[#81788B] leading-relaxed">
              แบบทดสอบปรนัยวัดความรอบรู้ด้านหลักภาษา วรรณคดี และการคิดวิเคราะห์ ผู้ที่ได้คะแนนร้อยละ{' '}
              <strong className="text-[#4B267D] font-semibold">{config.passingPercentage}%</strong> ขึ้นไปจะได้รับเกียรติบัตรรับรอง
            </p>
          </div>
        </div>

        {/* Schedule & Announcements Banner */}
        <div className="rounded-2xl bg-white border border-[#D6AF55]/30 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 flex items-center justify-center text-[#4B267D] shrink-0">
              <Calendar className="w-6 h-6 text-[#7043A6]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-[#4B267D] font-heading">
                กำหนดการและข่าวประชาสัมพันธ์
              </h4>
              <p className="text-xs sm:text-sm text-[#81788B]">
                เปิดรับสมัครและทำแบบทดสอบออนไลน์ตั้งแต่บัดนี้ จนถึงวันที่{' '}
                {new Date(config.countdownTarget).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })} เวลา 16:30 น.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => onNavigate('exam')}
              className="px-5 py-2.5 rounded-xl bg-[#4B267D] hover:bg-[#7043A6] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>เข้าร่วมทดสอบเลย</span>
              <ArrowRight className="w-4 h-4 text-[#D6AF55]" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
