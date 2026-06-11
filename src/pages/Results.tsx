import { useLocation, Link, Navigate } from "react-router-dom";
import { AlertCircle, FileText, Shield, Sprout, Download, Thermometer, CalendarClock, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import html2pdf from "html2pdf.js";
import { useRef, useState, useEffect } from "react";

export default function Results() {
  const { t } = useLanguage();
  const location = useLocation();
  const result = location.state?.result;
  const crop = location.state?.crop;
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);

  useEffect(() => {
    // Automatically log this diagnosis to history and schedule a checkup
    if (result && crop) {
      try {
        const history = JSON.parse(localStorage.getItem("agrosathi_history") || "[]");
        const checkups = JSON.parse(localStorage.getItem("agrosathi_checkups") || "[]");
        
        // Check if we already logged this exact diagnosis recently to prevent duplicates on refresh
        const lastEntry = history[0];
        if (!lastEntry || lastEntry.cropId !== crop.id || new Date().getTime() - new Date(lastEntry.date).getTime() > 60000) {
          const entryId = Date.now().toString();
          const currentDate = new Date();
          
          history.unshift({
            id: entryId,
            date: currentDate.toISOString(),
            cropId: crop.id,
            cropName: crop.name,
            disease: result.diagnosis.name || result.diagnosis.disease,
            isAi: result.isAi
          });
          localStorage.setItem("agrosathi_history", JSON.stringify(history.slice(0, 50))); // Keep last 50

          // Automatically schedule a checkup 2 days later
          const checkupDate = new Date();
          checkupDate.setDate(checkupDate.getDate() + 2); // 2 days from now
          
          checkups.push({
            id: entryId,
            createdAt: currentDate.toISOString(),
            scheduledFor: checkupDate.toISOString(),
            cropId: crop.id,
            cropName: crop.name,
            disease: result.diagnosis.name || result.diagnosis.disease,
            status: 'pending' // 'pending', 'resolved', 'no_improvement'
          });
          localStorage.setItem("agrosathi_checkups", JSON.stringify(checkups));
        }
      } catch (e) {
        console.error("Failed to save history or schedule checkup", e);
      }
    }
  }, [result, crop]);


  if (!result || !crop) {
    return <Navigate to="/diagnosis" replace />;
  }

  const { isAi, rawScores, diagnosis } = result;

  const handleExportPDF = () => {
    setIsExporting(true);
    
    // Create an HTML string with standard hex colors instead of Tailwind/oklch
    const htmlString = `
      <div style="padding: 20px; font-family: sans-serif; color: #1B4332; background-color: #ffffff; width: 800px; box-sizing: border-box;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1B4332; font-size: 32px; margin-bottom: 8px; font-weight: bold;">${t("Diagnosis Report | রোগ নির্ণয় রিপোর্ট")}</h1>
          <p style="color: #4b5563; font-size: 18px;">${t("Crop | ফসল")}: ${t(crop.name)}</p>
        </div>
        
        <div style="background-color: #059669; color: white; padding: 24px; border-radius: 12px; margin-bottom: 30px;">
          <p style="font-size: 14px; margin-bottom: 8px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.05em;">${t("Primary Diagnosis | প্রাথমিক রোগ নির্ণয়")}</p>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2 style="font-size: 28px; margin: 0; font-weight: bold;">${t(diagnosis.name || diagnosis.disease)}</h2>
            <div style="background-color: rgba(255,255,255,0.2); padding: 12px 16px; border-radius: 8px; text-align: center;">
              <p style="font-size: 12px; margin: 0 0 4px 0; opacity: 0.9;">${t("Confidence | আত্মবিশ্বাস")}</p>
              <p style="font-size: 24px; margin: 0; font-weight: bold;">${diagnosis.confidence || 95}%</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <h3 style="color: #1B4332; font-size: 20px; border-bottom: 2px solid #ecfdf5; padding-bottom: 8px; font-weight: bold;">${t("Explanation & Severity | ব্যাখ্যা এবং তীব্রতা")}</h3>
          <p style="color: #374151; line-height: 1.6; margin-top: 12px; font-size: 16px;">${t(diagnosis.description || diagnosis.explanation)}</p>
          <div style="background-color: #ffedd5; color: #9a3412; padding: 8px 12px; border-radius: 6px; display: inline-block; margin-top: 12px; font-weight: bold; font-size: 14px;">
            ${t("Severity/Urgency: | তীব্রতা/জরুরি অবস্থা:")} ${t(diagnosis.severity || diagnosis.urgency)}
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <h3 style="color: #1B4332; font-size: 20px; border-bottom: 2px solid #ecfdf5; padding-bottom: 8px; font-weight: bold;">${t("Treatment Plan | চিকিৎসা পরিকল্পনা")}</h3>
          <ul style="color: #374151; padding-left: 24px; margin-top: 12px; line-height: 1.6; font-size: 16px;">
            ${diagnosis.treatment.map((tItem: string) => `<li style="margin-bottom: 8px;">${t(tItem)}</li>`).join('')}
          </ul>
        </div>

        <div>
          <h3 style="color: #1B4332; font-size: 20px; border-bottom: 2px solid #ecfdf5; padding-bottom: 8px; font-weight: bold;">${t("Prevention | প্রতিরোধ ব্যবস্থা")}</h3>
          <ul style="color: #374151; padding-left: 24px; margin-top: 12px; line-height: 1.6; font-size: 16px;">
            ${diagnosis.prevention.map((p: string, i: number) => `<li style="margin-bottom: 8px;"><b>${i + 1}.</b> ${t(p)}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;

    const opt = {
      margin:       15,
      filename:     `Diagnosis_Report_${crop.name}.pdf`,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(htmlString).save().then(() => {
      setIsExporting(false);
    }).catch((err: any) => {
      console.error("PDF generation failed:", err);
      setIsExporting(false);
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div ref={reportRef} className="bg-[#F4F7F5] p-2">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#1B4332] mb-2">{t("Diagnosis Report | রোগ নির্ণয় রিপোর্ট")}</h1>
          <p className="text-emerald-700 opacity-70 font-medium text-lg">{t("Crop | ফসল")}: {t(crop.name)}</p>
          
          {isAi && (
            <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold border border-blue-100">
              <AlertCircle className="w-4 h-4" />
              {t("AI Fallback Activated: Complex Symptoms Detected | এআই ব্যাকআপ সক্রিয় করা হয়েছে")}
            </div>
          )}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-lg shadow-emerald-100/50 border border-emerald-50 overflow-hidden mb-8">
          <div className="bg-emerald-600 px-6 py-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-20"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-emerald-100 font-medium mb-1 tracking-wide uppercase text-sm">{t("Primary Diagnosis | প্রাথমিক রোগ নির্ণয়")}</p>
                <h2 className="text-3xl font-bold">{t(diagnosis.name || diagnosis.disease)}</h2>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center min-w-[120px] border border-white/20">
                <p className="text-emerald-100 text-sm mb-1">{t("Confidence | আত্মবিশ্বাস")}</p>
                <p className="text-3xl font-bold">{diagnosis.confidence || 95}%</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-[#1B4332] border-b border-emerald-50 pb-2">
                <AlertCircle className="w-5 h-5 text-emerald-400" /> 
                {t("Explanation & Severity | ব্যাখ্যা এবং তীব্রতা")}
              </h3>
              <p className="text-emerald-800 opacity-80 text-lg leading-relaxed">{t(diagnosis.description || diagnosis.explanation)}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-100 text-orange-800 font-semibold text-sm">
                <Thermometer className="w-4 h-4" />
                {t("Severity/Urgency: | তীব্রতা/জরুরি অবস্থা:")} {t(diagnosis.severity || diagnosis.urgency)}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-[#1B4332] border-b border-emerald-50 pb-2">
                <Sprout className="w-5 h-5 text-blue-500" /> 
                {t("Treatment Plan | চিকিৎসা পরিকল্পনা")}
              </h3>
              <ul className="space-y-3">
                {diagnosis.treatment.map((tItem: string, i: number) => (
                  <li key={i} className="flex gap-3 text-emerald-900 opacity-90 bg-[#F4F7F5] p-4 rounded-2xl border border-emerald-50">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0 text-sm">{i + 1}</div>
                    <span className="pt-0.5">{t(tItem)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-[#1B4332] border-b border-emerald-50 pb-2">
                <Shield className="w-5 h-5 text-emerald-500" /> 
                {t("Prevention | প্রতিরোধ ব্যবস্থা")}
              </h3>
              <ul className="space-y-3">
                {diagnosis.prevention.map((p: string, i: number) => (
                  <li key={i} className="flex gap-3 text-emerald-900 opacity-90">
                    <div className="relative flex items-center justify-center w-6 h-6 shrink-0 mt-0.5">
                      <Shield className="w-6 h-6 text-emerald-500 fill-emerald-100 absolute inset-0" />
                      <span className="text-[10px] font-bold text-emerald-800 z-10 relative pt-0.5">{i + 1}</span>
                    </div>
                    <span className="pt-0.5">{t(p)}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 print:hidden">
        <Link to="/diagnosis" className="px-6 py-3 rounded-2xl border border-emerald-100 bg-white text-emerald-800 font-medium hover:bg-emerald-50 flex items-center justify-center transition-colors">
          {t("Start New Diagnosis | নতুনভাবে নির্ণয় করুন")}
        </Link>
        <button 
          onClick={handleExportPDF}
          disabled={isExporting}
          className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-600/20"
        >
          <Download className="w-5 h-5" /> 
          {isExporting ? t("Exporting... | পিডিএফ তৈরি হচ্ছে...") : t("Export as PDF | পিডিএফ ডাউনলোড")}
        </button>
      </div>

    </div>
  );
}
