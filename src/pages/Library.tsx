import { useState } from "react";
import { Search } from "lucide-react";
import { crops } from "../data/crops";
import { useLanguage } from "../contexts/LanguageContext";

export default function Library() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedCrop, setSelectedCrop] = useState(crops[0].id);

  const currentCrop = crops.find(c => c.id === selectedCrop);

  const filteredDiseases = currentCrop?.diseases.filter(d => 
    d.name.toLowerCase().includes(query.toLowerCase()) || 
    d.description.toLowerCase().includes(query.toLowerCase())
  ) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B4332] mb-2">{t("Knowledge Library | তথ্য ভান্ডার")}</h1>
        <p className="text-emerald-800 opacity-80">{t("Browse diseases, treatments, and prevention measures. | রোগ, চিকিৎসা এবং প্রতিরোধ ব্যবস্থা ব্রাউজ করুন।")}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <h3 className="text-sm font-bold text-emerald-700 opacity-70 uppercase tracking-wider mb-4">{t("Crops | ফসল")}</h3>
          {crops.map((crop) => (
            <button
              key={crop.id}
              onClick={() => setSelectedCrop(crop.id)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-between ${
                selectedCrop === crop.id 
                  ? "bg-emerald-100 text-emerald-900"
                  : "bg-white text-emerald-800 opacity-80 hover:bg-emerald-50 hover:opacity-100"
              }`}
            >
              <span>{crop.icon} {t(crop.name)}</span>
              <span className="text-xs opacity-50 bg-black/5 px-2 py-1 rounded-full">{crop.diseases.length}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-emerald-400" />
            </div>
            <input
              type="text"
              placeholder={t("Search diseases... | রোগ অনুসন্ধান করুন...")}
              className="block w-full pl-10 pr-3 py-3 border border-emerald-100 rounded-2xl leading-5 bg-white placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm shadow-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="space-y-6">
            {filteredDiseases.length === 0 ? (
              <div className="text-center py-12 bg-white border border-emerald-100 rounded-3xl border-dashed">
                <p className="text-emerald-600 opacity-70 text-lg">{t(`No diseases found matching "${query}" | "${query}" এর সাথে মিলে এমন কোনো রোগ পাওয়া যায়নি`)}</p>
              </div>
            ) : (
              filteredDiseases.map((disease) => (
                <div key={disease.id} className="bg-white border border-emerald-50 rounded-3xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-emerald-50">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold text-emerald-900 mb-2">{t(disease.name)}</h2>
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                        disease.severity.includes('High') || disease.severity.includes('উচ্চ') ? 'bg-red-100 text-red-700' :
                        disease.severity.includes('Medium') || disease.severity.includes('মাঝারি') ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {t("Severity: | তীব্রতা:")} {t(disease.severity)}
                      </span>
                    </div>
                    <p className="text-emerald-800 opacity-80 text-lg leading-relaxed">{t(disease.description)}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-emerald-50">
                    <div className="p-6">
                      <h4 className="font-bold text-[#1B4332] mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span> {t("Symptoms | লক্ষণ")}
                      </h4>
                      <ul className="space-y-2">
                        {disease.symptoms.map((s, i) => (
                          <li key={i} className="text-sm text-emerald-800 opacity-80 flex items-start gap-2">
                            <span className="text-emerald-300 mt-0.5">•</span>
                            <span>{t(s)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6 bg-emerald-50/50">
                      <h4 className="font-bold text-[#1B4332] mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> {t("Treatment | চিকিৎসা")}
                      </h4>
                      <ul className="space-y-2">
                        {disease.treatment.map((tItem, i) => (
                          <li key={i} className="text-sm text-[#1B4332] opacity-90 flex items-start gap-2">
                            <span className="text-blue-400 mt-0.5">✓</span>
                            <span>{t(tItem)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-[#1B4332] mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {t("Prevention | প্রতিরোধ")}
                      </h4>
                      <ul className="space-y-2">
                        {disease.prevention.map((p, i) => (
                          <li key={i} className="text-sm text-emerald-800 opacity-80 flex items-start gap-2">
                            <span className="text-emerald-500 mt-0.5">🛡️</span>
                            <span>{t(p)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
