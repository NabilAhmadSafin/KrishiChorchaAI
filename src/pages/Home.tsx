import { ArrowRight, Activity, Cpu, BookOpen, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-[#F4F7F5] py-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-100">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#1B4332] tracking-tight whitespace-pre-line">
            {t("Your Smart Farming Companion\nআপনার স্মার্ট কৃষিকাজ সঙ্গী")}
          </h1>
          <p className="text-lg md:text-xl text-emerald-700 opacity-80 max-w-2xl mx-auto whitespace-pre-line">
            {t("Lightning-fast crop disease diagnosis powered by agricultural expert rules and AI fallback.\nকৃষি বিশেষজ্ঞ নিয়ম এবং এআই ব্যাকআপ দ্বারা দ্রুততম রোগ নির্ণয়।")}
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/diagnosis"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium text-white bg-emerald-600 rounded-2xl hover:bg-emerald-700 hover:scale-105 transition-all shadow-lg shadow-emerald-200/50"
            >
              <span>{t("Diagnose My Crop | ফসল নির্ণয় করুন")}</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/library"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium text-emerald-900 bg-white border border-emerald-100 rounded-2xl hover:bg-emerald-50 transition-all shadow-sm"
            >
              <span>{t("Knowledge Library | তথ্য ভান্ডার")}</span>
              <BookOpen className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#1B4332]">{t("Platform Features | প্ল্যাটফর্ম বৈশিষ্ট্য")}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Activity,
              title: "Fast Expert Diagnosis | দ্রুত বিশেষজ্ঞ নির্ণয়",
              desc: "Instant rules-based logic provides immediate results without waiting. | কোনো অপেক্ষা ছাড়াই তাৎক্ষণিক নিয়ম-ভিত্তিক লজিক উত্তর দেয়।"
            },
            {
              icon: Cpu,
              title: "AI Assistance | এআই সহায়তা",
              desc: "Deep learning fallback steps in when symptoms are complex or uncertain. | লক্ষণগুলো জটিল হলে এআই সহায়তা দেয়।"
            },
            {
              icon: ShieldCheck,
              title: "Farmer Friendly | কৃষক বান্ধব",
              desc: "Bilingual interface designed specifically for mobile devices. | মোবাইল ডিভাইসের জন্য ডিজাইন করা দ্বিভাষিক ইন্টারফেস।"
            }
          ].map((feat, i) => (
            <div key={i} className="p-8 bg-white border border-emerald-50 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#1B4332] mb-4 whitespace-pre-line">{t(feat.title)}</h3>
              <p className="text-emerald-800 opacity-70 leading-relaxed whitespace-pre-line">{t(feat.desc)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="w-full bg-gradient-to-br from-emerald-800 to-emerald-950 text-white py-24 px-4 sm:px-6 lg:px-8 xl:m-8 xl:rounded-3xl border-4 border-white shadow-xl xl:max-w-7xl mx-auto m-0 relative overflow-hidden">
        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-emerald-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -left-24 -top-24 w-64 h-64 bg-emerald-400 rounded-full opacity-10 blur-2xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">{t("How It Works | এটি কীভাবে কাজ করে")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Select Crop | ফসল নির্বাচন", desc: "Choose your affected plant. | আপনার ক্ষতিগ্রস্ত গাছ নির্বাচন করুন।" },
              { step: "2", title: "Upload Image | ছবি আপলোড", desc: "Take a picture for reference. | রেফারেন্সের জন্য একটি ছবি তুলুন।" },
              { step: "3", title: "Answer Questions | প্রশ্নের উত্তর", desc: "Tell us about the symptoms. | লক্ষণ সম্পর্কে আমাদের জানান।" },
              { step: "4", title: "Get Report | রিপোর্ট পান", desc: "Receive treatment plan instantly. | তাত্ক্ষণিকভাবে চিকিৎসা পরিকল্পনা পান।" },
            ].map((step, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 border border-emerald-400 text-white flex items-center justify-center text-2xl font-bold mb-6 z-10 shadow-lg shadow-emerald-900/50">
                  {step.step}
                </div>
                {i < 3 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-emerald-700" />}
                <h3 className="text-lg font-bold mb-2 whitespace-pre-line">{t(step.title)}</h3>
                <p className="text-emerald-100 text-sm whitespace-pre-line opacity-80">{t(step.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
