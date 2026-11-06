import React from 'react';
import { School, MapPin, Phone, Mail, Globe, Facebook, UserCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#4B267D] text-white pt-12 pb-8 px-4 lg:px-8 mt-16 border-t-2 border-[#D6AF55] shadow-inner">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Grid: School Info & Developer Credits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Column 1: School Identity & Address */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white p-0.5 shadow-md shrink-0 border border-[#D6AF55]">
                <img
                  src="/src/assets/images/school_crest_emblem_1793861181767.jpg"
                  alt="ตราสัญลักษณ์โรงเรียน"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>
              <div>
                <span className="text-[11px] text-[#D6AF55] font-semibold uppercase tracking-wider">
                  จัดทำโดย
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white font-heading leading-tight">
                  กลุ่มสาระการเรียนรู้ภาษาไทย โรงเรียนกระทุ่มแบน &quot;วิเศษสมุทคุณ&quot;
                </h3>
                <p className="text-xs text-purple-200">
                  สำนักงานเขตพื้นที่การศึกษามัธยมศึกษาสมุทรสาคร สมุทรสงคราม
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-purple-100 leading-relaxed pl-1">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D6AF55] shrink-0 mt-0.5" />
                <span>
                  ที่ตั้ง 442/30 ต.ตลาดกระทุ่มแบน อ.กระทุ่มแบน จ.สมุทรสาคร 74110
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D6AF55] shrink-0" />
                <span>โทรศัพท์ 034-471902 · โทรสาร 034-471901</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D6AF55] shrink-0" />
                <span>อีเมล: <a href="mailto:wisetschool@gmail.com" className="text-[#E5C378] hover:underline">wisetschool@gmail.com</a></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-[#D6AF55] shrink-0" />
                <span>
                  เว็บไซต์โรงเรียน: <a href="https://www.wsk.ac.th/wp/" target="_blank" rel="noreferrer" className="text-[#E5C378] hover:underline font-medium">https://www.wsk.ac.th/wp/</a>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Facebook className="w-4 h-4 text-[#D6AF55] shrink-0" />
                <span>เพจ โรงเรียนกระทุ่มแบน &quot;วิเศษสมุทคุณ&quot; สพมสคสส.</span>
              </div>
            </div>
          </div>

          {/* Column 2: System Developer Credit */}
          <div className="lg:col-span-6 space-y-4 lg:pl-8 lg:border-l border-purple-400/20">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#D6AF55]" />
              <h4 className="text-base font-bold font-heading text-white">
                SYSTEM DEVELOPER CREDIT
              </h4>
            </div>

            <div className="p-5 rounded-2xl bg-[#3A1B64] border border-[#D6AF55]/30 space-y-3 shadow-md">
              <div>
                <span className="text-[11px] text-[#D6AF55] font-semibold uppercase tracking-wider">
                  จัดทำระบบโดย
                </span>
                <p className="text-sm sm:text-base font-bold text-white mt-0.5">
                  นายณัฐวุฒิ ธนาศิริธนวัชร์
                </p>
                <p className="text-xs text-purple-200 leading-relaxed mt-1">
                  นักศึกษาฝึกประสบการณ์วิชาชีพครู ชั้นปีที่ 2<br />
                  สาขาวิชาภาษาไทย คณะศึกษาศาสตร์ มหาวิทยาลัยศิลปากร
                </p>
              </div>

              <div className="pt-2.5 border-t border-purple-400/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-purple-200">
                  ติดต่อผู้ดูแลระบบ:
                </span>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/30 transition-colors"
                >
                  <Facebook className="w-3.5 h-3.5 text-blue-300" />
                  <span>Facebook: Nattawut BK</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="pt-6 border-t border-purple-400/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-purple-200/80 text-center sm:text-left">
          <p>
            © ๒๕๖๙ โครงการส่งเสริมและพัฒนาความรู้ความสามารถด้านภาษาไทย (สืบศิลป์ถิ่นอักษร สืบสุนทรภาษาไทย)
          </p>
          <p>
            กลุ่มสาระการเรียนรู้ภาษาไทย โรงเรียนกระทุ่มแบน &quot;วิเศษสมุทคุณ&quot;
          </p>
        </div>
      </div>
    </footer>
  );
};
