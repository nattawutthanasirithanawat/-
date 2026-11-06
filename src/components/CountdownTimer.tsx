import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  isExamOpen: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isEnded: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, isExamOpen }) => {
  const calculateTimeLeft = (): TimeLeft => {
    try {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0 || !isExamOpen) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isEnded: false
      };
    } catch {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: false };
    }
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, isExamOpen]);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-2xl bg-white border border-[#4B267D]/15 p-5 md:p-6 shadow-md">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 mb-4 border-b border-purple-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#FAF8FD] border border-[#4B267D]/20 flex items-center justify-center text-[#4B267D]">
            <Clock className="w-4 h-4 text-[#7043A6]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#4B267D] font-heading">
              นับถอยหลังสู่การปิดระบบรับสมัคร
            </h3>
            <p className="text-xs text-[#81788B]">
              กำหนดปิดระบบ: {new Date(targetDate).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} น.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          {timeLeft.isEnded ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5" />
              ปิดระบบรับสมัครแล้ว
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              ระบบกำลังเปิดรับสมัคร
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 text-center">
        <div className="bg-[#FAF8FD] border border-[#4B267D]/10 rounded-xl p-3 sm:p-4 flex flex-col items-center">
          <span className="text-2xl sm:text-4xl font-bold font-heading text-[#4B267D] tabular-nums">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-xs text-[#81788B] mt-1 font-medium">วัน</span>
        </div>

        <div className="bg-[#FAF8FD] border border-[#4B267D]/10 rounded-xl p-3 sm:p-4 flex flex-col items-center">
          <span className="text-2xl sm:text-4xl font-bold font-heading text-[#4B267D] tabular-nums">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-xs text-[#81788B] mt-1 font-medium">ชั่วโมง</span>
        </div>

        <div className="bg-[#FAF8FD] border border-[#4B267D]/10 rounded-xl p-3 sm:p-4 flex flex-col items-center">
          <span className="text-2xl sm:text-4xl font-bold font-heading text-[#4B267D] tabular-nums">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-xs text-[#81788B] mt-1 font-medium">นาที</span>
        </div>

        <div className="bg-[#FAF8FD] border border-[#4B267D]/10 rounded-xl p-3 sm:p-4 flex flex-col items-center">
          <span className="text-2xl sm:text-4xl font-bold font-heading text-[#D6AF55] tabular-nums">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-xs text-[#81788B] mt-1 font-medium">วินาที</span>
        </div>
      </div>
    </div>
  );
};
