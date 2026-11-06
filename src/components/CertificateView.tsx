import React, { useState, useEffect, useRef } from 'react';
import { Search, Download, Printer, Award, ArrowLeft, CheckCircle2, AlertCircle, Share2, Sparkles, RefreshCw, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import { StudentScoreRecord, ViewMode, AppConfig } from '../types';

interface CertificateViewProps {
  config: AppConfig;
  selectedStudent: StudentScoreRecord | null;
  onNavigate: (view: ViewMode) => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ config, selectedStudent, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStudent, setCurrentStudent] = useState<StudentScoreRecord | null>(selectedStudent);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const certCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (selectedStudent) {
      setCurrentStudent(selectedStudent);
      setSearchQuery(selectedStudent.fullName);
      setSearched(true);
      triggerConfetti();
    }
  }, [selectedStudent]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D6AF55', '#4B267D', '#7043A6', '#E5C378']
      });
    } catch {
      // safe fallback
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setErrorMessage('กรุณากรอกชื่อ หรือชื่อ-นามสกุลเพื่อค้นหาเกียรติบัตร');
      return;
    }

    setLoading(true);
    setSearched(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/scores?q=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        const records: StudentScoreRecord[] = data.results || [];
        if (records.length > 0) {
          const found = records[0];
          setCurrentStudent(found);
          if (found.isPassed) {
            triggerConfetti();
          }
        } else {
          setCurrentStudent(null);
        }
      } else {
        setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล');
      }
    } catch {
      setErrorMessage('ไม่สามารถเชื่อมต่อระบบได้ กรุณาตรวจสอบอินเทอร์เน็ต');
    } finally {
      setLoading(false);
    }
  };

  // Draw authentic Royal Thai academic certificate on canvas
  useEffect(() => {
    if (!currentStudent || !currentStudent.isPassed) return;

    const canvas = certCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Standard A4 Landscape dimension ratio: 1200 x 850
    const w = 1200;
    const h = 850;
    canvas.width = w;
    canvas.height = h;

    // Parchment Ivory Background
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, '#fdfbf7');
    bgGrad.addColorStop(0.5, '#ffffff');
    bgGrad.addColorStop(1, '#f9f6ee');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Deep Purple Outer Border
    ctx.strokeStyle = '#4B267D';
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    // Elegant Gold Inner Border
    ctx.strokeStyle = '#D6AF55';
    ctx.lineWidth = 3;
    ctx.strokeRect(32, 32, w - 64, h - 64);

    // Hairline Gold Accent Frame
    ctx.strokeStyle = '#B38933';
    ctx.lineWidth = 1;
    ctx.strokeRect(38, 38, w - 76, h - 76);

    // Corner rosettes
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.strokeStyle = '#D6AF55';
      ctx.fillStyle = '#D6AF55';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 0.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 0.5);
      ctx.stroke();
      ctx.restore();
    };

    drawCorner(38, 38, 0);
    drawCorner(w - 38, 38, 90);
    drawCorner(w - 38, h - 38, 180);
    drawCorner(38, h - 38, 270);

    const emblemImg = new Image();
    emblemImg.crossOrigin = 'anonymous';
    emblemImg.src = '/src/assets/images/school_crest_emblem_1793861181767.jpg';

    const renderText = () => {
      ctx.textAlign = 'center';
      
      // Top Institution Header
      ctx.fillStyle = '#4B267D';
      ctx.font = 'bold 22px Prompt, Sarabun, sans-serif';
      ctx.fillText('กลุ่มสาระการเรียนรู้ภาษาไทย โรงเรียนกระทุ่มแบน "วิเศษสมุทคุณ"', w / 2, 190);

      ctx.fillStyle = '#7043A6';
      ctx.font = '16px Sarabun, sans-serif';
      ctx.fillText('สำนักงานเขตพื้นที่การศึกษามัธยมศึกษาสมุทรสาคร สมุทรสงคราม', w / 2, 220);

      // Certificate Award Title
      ctx.fillStyle = '#B38933';
      ctx.font = 'bold 36px "Prompt", Sarabun, sans-serif';
      ctx.fillText('เกียรติบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า', w / 2, 275);

      // Recipient Student Name
      ctx.fillStyle = '#30283A';
      ctx.font = 'bold 44px "Noto Serif Thai", Sarabun, serif';
      ctx.fillText(currentStudent.fullName, w / 2, 350);

      // School & Level
      ctx.fillStyle = '#71697A';
      ctx.font = '20px Sarabun, sans-serif';
      ctx.fillText(
        `${currentStudent.school || 'โรงเรียนกระทุ่มแบน "วิเศษสมุทคุณ"'} · ระดับ${currentStudent.level}`,
        w / 2,
        395
      );

      // Achievement Prose
      ctx.fillStyle = '#30283A';
      ctx.font = '22px Sarabun, sans-serif';
      ctx.fillText('ได้ผ่านการทดสอบวัดความรู้ความสามารถด้านภาษาไทย', w / 2, 450);

      // Project Name
      ctx.fillStyle = '#4B267D';
      ctx.font = 'bold 26px "Prompt", Sarabun, sans-serif';
      ctx.fillText(
        'โครงการส่งเสริมและพัฒนาความรู้ความสามารถด้านภาษาไทย (สืบศิลป์ถิ่นอักษร สืบสุนทรภาษาไทย)',
        w / 2,
        495
      );

      // Score and Honors Line
      ctx.fillStyle = '#B38933';
      ctx.font = 'bold 21px Sarabun, sans-serif';
      ctx.fillText(
        `ได้รับคะแนน ${currentStudent.scoreNumber}/${currentStudent.maxScore} คะแนน (คิดเป็นร้อยละ ${currentStudent.percentage}%)  ผลการประเมิน: ผ่านเกณฑ์มาตรฐาน`,
        w / 2,
        545
      );

      // Issue date prose
      ctx.fillStyle = '#554C60';
      ctx.font = '17px Sarabun, sans-serif';
      ctx.fillText('ขอให้มีความเจริญก้าวหน้าในวิทยาการและรักษาคุณค่าแห่งภาษาไทยสืบไป', w / 2, 585);

      ctx.fillStyle = '#81788B';
      ctx.font = '16px Sarabun, sans-serif';
      ctx.fillText('ให้ไว้ ณ วันที่ ๔ พฤศจิกายน พุทธศักราช ๒๕๖๙', w / 2, 620);

      // Signatures
      // Left: Project Coordinator
      ctx.beginPath();
      ctx.moveTo(w * 0.25 - 90, 715);
      ctx.lineTo(w * 0.25 + 90, 715);
      ctx.strokeStyle = '#D1CAD8';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#30283A';
      ctx.font = 'bold 15px Sarabun, sans-serif';
      ctx.fillText('(นายณัฐวุฒิ ธนาศิริธนวัชร์)', w * 0.25, 740);
      ctx.font = '13px Sarabun, sans-serif';
      ctx.fillStyle = '#71697A';
      ctx.fillText('นักศึกษาฝึกประสบการณ์วิชาชีพครู', w * 0.25, 760);
      ctx.fillText('ผู้ประสานงานโครงการ', w * 0.25, 778);

      // Right: School Principal
      ctx.beginPath();
      ctx.moveTo(w * 0.75 - 90, 715);
      ctx.lineTo(w * 0.75 + 90, 715);
      ctx.strokeStyle = '#D1CAD8';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#30283A';
      ctx.font = 'bold 15px Sarabun, sans-serif';
      ctx.fillText('(ผู้อำนวยการโรงเรียน)', w * 0.75, 740);
      ctx.font = '13px Sarabun, sans-serif';
      ctx.fillStyle = '#71697A';
      ctx.fillText('ผู้อำนวยการโรงเรียนกระทุ่มแบน "วิเศษสมุทคุณ"', w * 0.75, 760);

      // Certificate Code Bottom
      ctx.textAlign = 'left';
      ctx.fillStyle = '#81788B';
      ctx.font = '11px monospace';
      ctx.fillText(`เลขที่เกียรติบัตร: ${currentStudent.certificateNumber || 'WSK-THAI-2569-' + currentStudent.id}`, 50, h - 45);

      ctx.textAlign = 'right';
      ctx.fillText('ตรวจสอบความถูกต้องได้ที่ wsk.ac.th', w - 50, h - 45);
    };

    emblemImg.onload = () => {
      const size = 100;
      ctx.save();
      ctx.beginPath();
      ctx.arc(w / 2, 105, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(emblemImg, (w - size) / 2, 55, size, size);
      ctx.restore();
      renderText();
    };

    emblemImg.onerror = () => {
      renderText();
    };
  }, [currentStudent]);

  // Download PDF
  const handleDownloadPdf = () => {
    if (!currentStudent || !certCanvasRef.current) return;
    setDownloading(true);

    try {
      const canvas = certCanvasRef.current;
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Standard A4 Landscape: 297 x 210 mm
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
      pdf.save(`เกียรติบัตรภาษาไทย_${currentStudent.fullName}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('ไม่สามารถดาวน์โหลด PDF ได้ กรุณาลองบันทึกเป็นรูปภาพแทน');
    } finally {
      setDownloading(false);
    }
  };

  // Download PNG
  const handleDownloadPng = () => {
    if (!currentStudent || !certCanvasRef.current) return;
    try {
      const canvas = certCanvasRef.current;
      const link = document.createElement('a');
      link.download = `เกียรติบัตรภาษาไทย_${currentStudent.fullName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Error saving PNG:', err);
    }
  };

  // Print
  const handlePrint = () => {
    if (!certCanvasRef.current) return;
    const canvas = certCanvasRef.current;
    const dataUrl = canvas.toDataURL();
    const windowContent = `<!DOCTYPE html><html><head><title>พิมพ์เกียรติบัตร</title><style>@page{size: landscape; margin: 0;} body{margin:0;display:flex;align-items:center;justify-content:center;height:100vh;} img{width:100%;height:auto;max-height:100vh;object-fit:contain;}</style></head><body><img src="${dataUrl}" onload="window.print();window.close();"/></body></html>`;
    const printWin = window.open('', '_blank', 'width=1000,height=700');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(windowContent);
      printWin.document.close();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
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
            <span>ตรวจสอบคะแนน</span>
          </button>
          <button
            onClick={() => onNavigate('exam')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-[#FAF8FD] text-[#4B267D] border border-[#4B267D]/20 shadow-sm transition-colors cursor-pointer"
          >
            <span>เข้าทำแบบทดสอบ</span>
          </button>
        </div>
      </div>

      {/* 6.1 Search Interface Header */}
      <div className="rounded-3xl bg-white border border-[#4B267D]/15 p-6 sm:p-10 text-center space-y-6 shadow-md">
        <div className="space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8FD] border border-[#4B267D]/20 text-[#4B267D] text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-[#D6AF55]" />
            <span>ระบบเกียรติบัตรอิเล็กทรอนิกส์</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4B267D] font-heading">
            ตรวจสอบสิทธิ์และดาวน์โหลดเกียรติบัตร
          </h1>
          <p className="text-xs sm:text-sm text-[#81788B] leading-relaxed">
            กรุณากรอกชื่อหรือชื่อ-นามสกุล เพื่อค้นหาเกียรติบัตรของท่าน (ค้นหาด้วยคำนำหน้า หรือชื่อและนามสกุลในช่องเดียวได้)
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#81788B]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="ค้นหาชื่อผู้รับเกียรติบัตร เช่น สมชาย ใจดี, กานดา..."
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#FAF8FD] border border-[#4B267D]/20 text-[#30283A] placeholder-[#81788B]/60 focus:outline-none focus:ring-2 focus:ring-[#D6AF55] text-sm sm:text-base shadow-inner"
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
                <span>ค้นหาเกียรติบัตร</span>
              </>
            )}
          </button>
        </form>

        {errorMessage && (
          <div className="max-w-2xl mx-auto p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Quick Sample Search Suggestions */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-[#81788B]">
          <span className="font-medium">ตัวอย่างผู้ผ่านเกณฑ์:</span>
          {['สมชาย ใจดี', 'กานดา มณีโชติ', 'วรเมธ', 'ปิยฉัตร', 'ณัฐวุฒิ'].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                setSearchQuery(name);
                setTimeout(() => handleSearch(), 50);
              }}
              className="px-2.5 py-1 rounded-md bg-[#FAF8FD] hover:bg-purple-100/60 text-[#4B267D] border border-[#4B267D]/15 transition-colors cursor-pointer"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* 6.3 Certificate Preview & Download Options */}
      {currentStudent ? (
        currentStudent.isPassed ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Success Bar with Action Buttons */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#4B267D]/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 academic-card-shadow">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#4B267D] font-heading">
                    {currentStudent.fullName}
                  </h3>
                  <p className="text-xs text-[#81788B]">
                    ระดับ{currentStudent.level} · คะแนน {currentStudent.scoreNumber}/{currentStudent.maxScore} (ร้อยละ {currentStudent.percentage}%) · สถานะ: ผ่านเกณฑ์การประเมิน
                  </p>
                </div>
              </div>

              {/* 6.4 Download Actions */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D6AF55] to-[#B38933] hover:from-[#E5C378] hover:to-[#D6AF55] text-[#30283A] font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#30283A]" />
                  <span>ดาวน์โหลดเกียรติบัตร (.PDF)</span>
                </button>

                <button
                  onClick={handleDownloadPng}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FAF8FD] hover:bg-purple-100/60 text-[#4B267D] border border-[#4B267D]/20 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <span>รูปภาพ (.PNG)</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#FAF8FD] hover:bg-purple-100/60 text-[#4B267D] border border-[#4B267D]/20 font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#7043A6]" />
                  <span>พิมพ์</span>
                </button>
              </div>
            </div>

            {/* Embedded Certificate PDF / Canvas Preview */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#81788B] px-1 font-medium">
                <span className="flex items-center gap-1.5 text-[#4B267D]">
                  <Sparkles className="w-3.5 h-3.5 text-[#D6AF55]" />
                  ตัวอย่างเกียรติบัตรอิเล็กทรอนิกส์ (Certificate Preview)
                </span>
                <span>ขนาดมาตรฐาน A4 แนวนอน (Landscape)</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-[#4B267D]/20 shadow-xl bg-slate-100 p-2 sm:p-5 flex items-center justify-center">
                <canvas
                  ref={certCanvasRef}
                  className="w-full h-auto max-w-4xl rounded-lg shadow-md bg-white"
                  style={{ aspectRatio: '1200 / 850' }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Student Found But Did Not Pass */
          <div className="p-8 rounded-2xl bg-white border border-rose-200 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-[#4B267D] font-heading">
                ยังไม่ผ่านเกณฑ์การรับเกียรติบัตร ({currentStudent.fullName})
              </h3>
              <p className="text-xs sm:text-sm text-[#81788B] max-w-md mx-auto leading-relaxed">
                ผู้เข้าร่วมได้คะแนน {currentStudent.scoreNumber}/{currentStudent.maxScore} (คิดเป็นร้อยละ {currentStudent.percentage}%)
                โดยเกณฑ์การรับเกียรติบัตรต้องได้คะแนนตั้งแต่ร้อยละ {config.passingPercentage}% ขึ้นไป
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('exam')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4B267D] hover:bg-[#7043A6] text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              >
                <span>เข้าทำแบบทดสอบเพื่อปรับปรุงคะแนน</span>
              </button>
            </div>
          </div>
        )
      ) : searched && !loading ? (
        <div className="p-10 rounded-2xl bg-white border border-[#4B267D]/15 text-center space-y-3 shadow-sm">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-[#4B267D] font-heading">ไม่พบรายชื่อในระบบเกียรติบัตร</h3>
          <p className="text-xs sm:text-sm text-[#81788B] max-w-md mx-auto leading-relaxed">
            ไม่พบข้อมูลเกียรติบัตรของ &ldquo;{searchQuery}&rdquo;
            กรุณาตรวจสอบการสะกดชื่อ หรือค้นหาในหน้า <strong>&quot;ตรวจสอบคะแนน&quot;</strong> ก่อน
          </p>
        </div>
      ) : null}
    </div>
  );
};
