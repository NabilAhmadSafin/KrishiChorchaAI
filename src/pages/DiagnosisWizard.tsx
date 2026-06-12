import React, { useState, useRef } from "react";
import { crops } from "../data/crops";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, Upload, CheckCircle2, AlertTriangle, Loader2, Camera } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function DiagnosisWizard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedCropId, setSelectedCropId] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    let interval: any;
    if (isProcessing) {
      interval = setInterval(() => {
        setCurrentTipIndex(i => (i + 1) % 4);
      }, 4500);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const currentCrop = crops.find(c => c.id === selectedCropId);

  const handleNext = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }
    
    setIsNextLoading(true);
    
    setTimeout(() => {
      setIsNextLoading(false);
      if (step === 3 && currentCrop) {
        // Allow currentQuestionIndex to go to questions.length (the additional info page)
        if (currentQuestionIndex < currentCrop.questions.length) {
          setCurrentQuestionIndex(i => i + 1);
        } else {
          processDiagnosis();
        }
      } else {
        setStep(s => s + 1);
        if (step === 2) {
          setCurrentQuestionIndex(0);
        }
      }
    }, 1000);
  };

  const handleBack = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }
    if (step === 3 && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(i => i - 1);
    } else {
      setStep(s => Math.max(1, s - 1));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const toggleAnswer = (questionId: string, optionIdx: number, isMulti: boolean) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (isMulti) {
        if (current.includes(optionIdx)) {
          return { ...prev, [questionId]: current.filter((i: number) => i !== optionIdx) };
        } else {
          return { ...prev, [questionId]: [...current, optionIdx] };
        }
      } else {
        return { ...prev, [questionId]: [optionIdx] };
      }
    });
  };

  const processDiagnosis = async () => {
    if (!currentCrop) return;
    setIsProcessing(true);

    // Rule Engine Calculation
    const scores: Record<string, number> = {};
    let hasCustomAnswer = false;
    let summary: string[] = [];

    // Initialize scores
    currentCrop.diseases.forEach(d => scores[d.id] = 0);

    currentCrop.questions.forEach((q) => {
      const selectedIndices = answers[q.id] || [];
      const selectedOpts = selectedIndices.map((i: number) => q.options[i]);
      
      selectedOpts.forEach((opt: any) => {
        Object.entries(opt.points).forEach(([diseaseId, points]) => {
          scores[diseaseId] = (scores[diseaseId] || 0) + (points as number);
        });
        summary.push(opt.text);
      });

      if (customAnswers[q.id] && customAnswers[q.id].trim() !== "") {
        hasCustomAnswer = true;
      }
    });

    if (additionalInfo && additionalInfo.trim() !== "") {
      hasCustomAnswer = true;
    }

    // Find the top disease
    const sortedDiseases = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topScore = sortedDiseases[0]?.[1] || 0;
    const runnerUpScore = sortedDiseases[1]?.[1] || 0;
    
    // Thresholds for relying solely on rules
    const CONFIDENCE_THRESHOLD = 8;
    const MARGIN_THRESHOLD = 3;

    const needsAi = 
      hasCustomAnswer || 
      topScore < CONFIDENCE_THRESHOLD || 
      (topScore - runnerUpScore) < MARGIN_THRESHOLD;

    try {
      if (!needsAi) {
        // High confidence rule-based match
        const topDiseaseId = sortedDiseases[0][0];
        const diagnosis = currentCrop.diseases.find(d => d.id === topDiseaseId);
        
        setTimeout(() => {
          setIsProcessing(false);
          navigate("/results", {
            state: {
              crop: currentCrop,
              result: {
                isAi: false,
                rawScores: scores,
                diagnosis: { ...diagnosis, confidence: 92 }
              }
            }
          });
        }, 1500); // Artificial delay to simulate processing
      } else {
        // Fallback to Gemini AI Server Route
        const response = await fetch("/api/diagnose-fallback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            crop: currentCrop.name,
            scores,
            answers: summary,
            customAnswers,
            additionalInfo,
            summary: "User provided mixed or custom symptoms requiring AI analysis."
          })
        });

        if (!response.ok) {
          throw new Error("AI Fallback failed");
        }
        const aiDiagnosis = await response.json();

        setIsProcessing(false);
        navigate("/results", {
          state: {
            crop: currentCrop,
            result: {
              isAi: true,
              rawScores: scores,
              diagnosis: aiDiagnosis
            }
          }
        });
      }
    } catch (err) {
      console.warn("AI fallback API error:", err);
      
      const topDiseaseId = sortedDiseases[0]?.[0];
      const diagnosis = currentCrop.diseases.find(d => d.id === topDiseaseId);
      
      if (diagnosis) {
        alert(t("AI analysis is currently unavailable due to high demand. Showing the best matched rule-based result instead. | অতিরিক্ত চাহিদার কারণে এআই বিশ্লেষণ বর্তমানে অনুপলব্ধ। বিকল্পভাবে সেরা ম্যাচ করা নিয়ম-ভিত্তিক ফলাফল দেখানো হচ্ছে।"));
        setIsProcessing(false);
        navigate("/results", {
          state: {
            crop: currentCrop,
            result: {
              isAi: false,
              rawScores: scores,
              diagnosis: { ...diagnosis, confidence: 50 } 
            }
          }
        });
      } else {
        setIsProcessing(false);
        alert(t("An error occurred during diagnosis. Please try again. | রোগ নির্ণয়ের সময় একটি ত্রুটি ঘটেছে. আবার চেষ্টা করুন."));
      }
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return !selectedCropId;
    if (step === 2) return false; // Image upload is optional/simulated
    if (step === 3 && currentCrop) {
      // Must answer at least one question across all questions before finalizing
      if (currentQuestionIndex === currentCrop.questions.length) {
        return Object.keys(answers).length === 0 && Object.keys(customAnswers).length === 0 && additionalInfo.trim() === "";
      }
      return false;
    }
    return false;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 relative">
      
      {/* Processing State with Tips Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm">
          <div className="bg-emerald-800 text-white p-8 rounded-3xl shadow-2xl max-w-sm w-full animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-900">
               <div className="h-full bg-emerald-400 w-1/3 animate-[translateX_1s_ease-in-out_infinite]" style={{ animationDuration: '2s', width: '30%', animationName: 'progress' }}></div>
            </div>
            <style>{`
              @keyframes progress {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(400%); }
              }
            `}</style>
            <div className="text-center mb-6">
               <Loader2 className="w-12 h-12 animate-spin mx-auto text-emerald-400 mb-4" />
               <h3 className="text-xl font-bold">{t("AI is analyzing your crop... | এআই আপনার ফসল বিশ্লেষণ করছে...")}</h3>
            </div>
            
            <div className="bg-emerald-900/50 rounded-2xl p-6 min-h-[160px] flex flex-col justify-center relative overflow-hidden group">
               <span className="text-emerald-400 text-sm font-bold uppercase tracking-wider mb-3 block flex items-center justify-center gap-2">
                 <AlertTriangle className="w-4 h-4" /> {t("Gardening Tip | বাগান করার টিপস")}
               </span>
               <div className="relative h-full flex items-center justify-center text-center">
                 <p className="font-medium leading-relaxed text-emerald-50 text-base animate-in fade-in slide-in-from-right-4 duration-500" key={currentTipIndex}>
                    {currentTipIndex === 0 && t("Did you know? Rotating crops yearly prevents soil diseases. | আপনি কি জানেন? প্রতি বছর ফসল পরিবর্তন করে চাষ করলে মাটির রোগ প্রতিরোধ হয়।")}
                    {currentTipIndex === 1 && t("Avoid watering leaves directly to prevent fungal infections. | ছত্রাক সংক্রমণ রোধ করতে পাতায় সরাসরি জল দেওয়া থেকে বিরত থাকুন।")}
                    {currentTipIndex === 2 && t("Healthy soil makes healthy plants. Test your soil regularly. | স্বাস্থ্যকর মাটি স্বাস্থ্যকর গাছ তৈরি করে। নিয়মিত আপনার মাটি পরীক্ষা করুন।")}
                    {currentTipIndex === 3 && t("Remove diseased plants immediately to stop the spread. | রোগ ছড়ানো বন্ধ করতে অবিলম্বে আক্রান্ত গাছগুলো সরিয়ে ফেলুন।")}
                 </p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-emerald-100 -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 -z-10 transition-all duration-500"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
          
          {[
            { num: 1, label: t("Crop | ফসল") },
            { num: 2, label: t("Image | ছবি") },
            { num: 3, label: t("Symptoms | লক্ষণ") }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                step >= s.num ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30" : "bg-white border-2 border-emerald-100 text-emerald-400"
              }`}>
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span className={`text-[10px] md:text-xs text-center mt-2 font-medium uppercase tracking-wider whitespace-pre-line ${
                step >= s.num ? "text-[#1B4332]" : "text-emerald-400"
              }`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-emerald-50 min-h-[400px]">
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#1B4332]">{t("Select Crop | ফসল নির্বাচন করুন")}</h2>
              <p className="text-emerald-700 opacity-70 mt-2">{t("Which crop are you evaluating? | আপনি কোন ফসল মূল্যায়ন করছেন?")}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {crops.map((crop) => (
                <button
                  key={crop.id}
                  onClick={() => setSelectedCropId(crop.id)}
                  disabled={crop.questions.length === 0}
                  className={`p-6 rounded-3xl border-2 flex flex-col items-center text-center transition-all ${
                    selectedCropId === crop.id 
                      ? "border-emerald-500 bg-emerald-50" 
                      : crop.questions.length === 0 
                        ? "border-emerald-50 bg-[#F4F7F5] opacity-50 cursor-not-allowed"
                        : "border-emerald-50 hover:border-emerald-300 hover:bg-[#F4F7F5]"
                  }`}
                >
                  <span className="text-4xl mb-3">{crop.icon}</span>
                  <span className="font-bold text-[#1B4332] whitespace-pre-line">{t(crop.name)}</span>
                  {crop.questions.length === 0 && <span className="text-[10px] text-emerald-500 mt-2">{t("Coming soon")}</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#1B4332]">{t("Upload Image | ছবি আপলোড করুন")}</h2>
            </div>
            
            <div className="max-w-md mx-auto">
              {!imagePreview ? (
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-3xl border-2 border-dashed border-emerald-200 bg-[#F4F7F5] flex flex-col items-center justify-center text-emerald-600 opacity-80 hover:bg-emerald-50 hover:border-emerald-400 transition-colors p-4 text-center"
                  >
                    <Upload className="w-10 h-10 mb-4 text-emerald-600" />
                    <span className="font-medium text-lg whitespace-pre-line">{t("Upload Photo\nছবি আপলোড")}</span>
                  </button>
                  <button 
                    onClick={() => cameraInputRef.current?.click()}
                    className="aspect-square rounded-3xl border-2 border-dashed border-emerald-200 bg-[#F4F7F5] flex flex-col items-center justify-center text-emerald-600 opacity-80 hover:bg-emerald-50 hover:border-emerald-400 transition-colors p-4 text-center"
                  >
                    <Camera className="w-10 h-10 mb-4 text-emerald-600" />
                    <span className="font-medium text-lg whitespace-pre-line">{t("Take Photo\nছবি তুলুন")}</span>
                  </button>
                </div>
              ) : (
                <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-emerald-100 shadow-inner group">
                  <img src={imagePreview} alt="Crop preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button 
                      onClick={() => setImagePreview(null)}
                      className="px-6 py-2 bg-white text-[#1B4332] rounded-full font-bold shadow-lg"
                    >
                      {t("Change Image | ছবি পরিবর্তন করুন")}
                    </button>
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <input 
                type="file" 
                ref={cameraInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                capture="environment"
                className="hidden" 
              />
            </div>
          </div>
        )}

        {step === 3 && currentCrop && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#1B4332]">{t("Symptoms | লক্ষণ")}</h2>
              <p className="text-emerald-700 opacity-70 mt-2">
                {t("Please answer the following | নিচের প্রশ্নটির উত্তর দিন")}
              </p>
            </div>

            <div className="space-y-12">
              {(() => {
                if (currentQuestionIndex === currentCrop.questions.length) {
                  return (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-[#1B4332] flex items-start gap-3">
                        <div className="w-3 h-3 mt-2 shrink-0 rounded-full bg-emerald-400"></div>
                        <span className="whitespace-pre-line leading-relaxed">{t("Additional Information | অতিরিক্ত তথ্য")}</span>
                      </h3>
                      <div className="pl-11">
                        <label className="text-sm font-bold text-emerald-800 opacity-70 mb-2 block">{t("Do you want to add any other details? | আপনি কি অন্য কোন বিবরণ যোগ করতে চান?")}</label>
                        <textarea 
                          rows={4}
                          className="w-full px-4 py-3 rounded-2xl border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                          placeholder={t("Say more if needed... | প্রয়োজন হলে আরও বলুন...")}
                          value={additionalInfo}
                          onChange={(e) => setAdditionalInfo(e.target.value)}
                        />
                      </div>
                    </div>
                  );
                }

                const q = currentCrop.questions[currentQuestionIndex];
                return (
                  <div key={q.id} className="space-y-4">
                    <h3 className="text-xl font-bold text-[#1B4332] flex items-start gap-3">
                      <div className="w-3 h-3 mt-2 shrink-0 rounded-full bg-emerald-400"></div>
                      <span className="whitespace-pre-line leading-relaxed">{t(q.question)}</span>
                    </h3>
                    
                    <div className="grid gap-3 pl-11">
                      {q.options.map((opt, oIndex) => {
                        const isSelected = (answers[q.id] || []).includes(oIndex);
                        return (
                          <button
                            key={oIndex}
                            onClick={() => toggleAnswer(q.id, oIndex, !!q.optionsAreMultipleSelect)}
                            className={`text-left p-4 rounded-2xl border transition-all ${
                              isSelected 
                                ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500" 
                                : "border-emerald-100 bg-white hover:border-emerald-300 hover:bg-[#F4F7F5]"
                            }`}
                          >
                            <span className={`${isSelected ? "text-emerald-900 font-medium" : "text-emerald-800 opacity-80"} block whitespace-pre-line`}>
                              {t(opt.text)}
                            </span>
                          </button>
                        );
                      })}
                      
                      {/* Other Context */}
                      <div className="mt-2">
                         <label className="text-sm font-bold text-emerald-800 opacity-70 mb-2 block">{t("Other / Custom text | অন্যান্য / কাস্টম পাঠ্য:")}</label>
                         <input 
                           type="text" 
                           className="w-full px-4 py-3 rounded-2xl border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                           placeholder={t("Type here if none of the above matches... | যদি উপরের কোনটি না মিলে তবে এখানে লিখুন...")}
                           value={customAnswers[q.id] || ""}
                           onChange={(e) => setCustomAnswers({...customAnswers, [q.id]: e.target.value})}
                         />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 flex items-center justify-between">
        {step > 1 ? (
          <button 
            onClick={handleBack}
            disabled={isProcessing}
            className="px-6 py-3 rounded-2xl flex items-center gap-2 font-medium text-emerald-700 bg-white border border-emerald-100 hover:bg-emerald-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" /> {t("Back | পিছনে")}
          </button>
        ) : <div />}

        <button 
          onClick={handleNext} 
          disabled={isNextDisabled() || isProcessing || isNextLoading}
          className="px-8 py-3 rounded-2xl flex items-center gap-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-200/50 transition-all"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> {t("Processing AI... | এআই প্রসেংসিং হচ্ছে")}
            </>
          ) : isNextLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> {t("AI thinking... | এআই ভাবছে...")}
            </>
          ) : step === 3 && currentCrop && currentQuestionIndex === currentCrop.questions.length ? (
            t("Analyze | বিশ্লেষণ করুন")
          ) : (
            <>
              {t("Next | পরবর্তী")} <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

    </div>
  );
}
