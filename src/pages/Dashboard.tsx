import { Activity, Beaker, Sprout, CalendarClock, Beaker as BeakerIcon, Clock, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { t } = useLanguage();
  const [history, setHistory] = useState<any[]>([]);
  const [checkups, setCheckups] = useState<any[]>([]);

  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem("agrosathi_history") || "[]");
      setHistory(savedHistory);
      
      const savedCheckups = JSON.parse(localStorage.getItem("agrosathi_checkups") || "[]");
      // Sort checkups, pending ones first
      const sortedCheckups = savedCheckups.map((c: any) => ({
        ...c,
        status: c.status || (c.completed ? 'resolved' : 'pending')
      })).sort((a: any, b: any) => {
        const aPending = a.status === 'pending';
        const bPending = b.status === 'pending';
        if (aPending === bPending) {
          return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime();
        }
        return aPending ? -1 : 1;
      });
      setCheckups(sortedCheckups);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const markCheckupStatus = (id: string, status: string) => {
    const updated = checkups.map(c => 
      c.id === id ? { ...c, status, completed: true } : c
    );
    setCheckups(updated);
    localStorage.setItem("agrosathi_checkups", JSON.stringify(updated));
  };

  const getDaysDiff = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const aiInvocations = history.filter(h => h.isAi).length;
  const uniqueCrops = new Set(history.map(h => h.cropId)).size;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-[#1B4332] mb-2">{t("Farmer Dashboard | কৃষক ড্যাশবোর্ড")}</h1>
        <p className="text-emerald-700 opacity-80">{t("Track your crop diagnosis history and save resources. | আপনার ফসলের রোগ নির্ণয়ের ইতিহাস ট্র্যাক করুন এবং সংরক্ষণ করুন।")}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-emerald-600 opacity-70 font-medium">{t("Total Diagnoses | মোট নির্ণয়")}</p>
            <p className="text-2xl font-bold text-[#1B4332]">{history.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
            <Sprout className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-blue-600 opacity-70 font-medium">{t("Saved Crops | সংরক্ষিত ফসল")}</p>
            <p className="text-2xl font-bold text-[#1B4332]">{uniqueCrops}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-emerald-50 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-orange-50 text-orange-600 border border-orange-100 rounded-xl">
            <BeakerIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-orange-600 opacity-70 font-medium">{t("AI Invocations | এআই সহায়তা")}</p>
            <p className="text-2xl font-bold text-[#1B4332]">{aiInvocations}</p>
          </div>
        </div>
      </div>

      {checkups.length > 0 && (
        <div className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-blue-50 bg-blue-50/30 flex items-center gap-3">
            <CalendarClock className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-[#1B4332]">{t("Upcoming Check-ups | আসন্ন চেক-আপ")}</h2>
          </div>
          <div className="divide-y divide-emerald-50">
            {checkups.map(checkup => {
              const daysLeft = getDaysDiff(checkup.scheduledFor);
              const isPending = checkup.status === 'pending';
              const isDue = isPending && daysLeft <= 0;
              
              return (
                <div key={checkup.id} className={`p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors ${!isPending ? 'bg-gray-50/50' : 'hover:bg-emerald-50/30'}`}>
                  <div>
                    <h3 className={`font-bold text-lg mb-1 ${!isPending ? 'text-gray-500 line-through' : 'text-[#1B4332]'}`}>
                      {t(checkup.cropName)} - {t(checkup.disease)}
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-emerald-700 opacity-80 flex items-center gap-1">
                        <Clock className="w-4 h-4" /> 
                        {new Date(checkup.scheduledFor).toLocaleDateString()}
                      </span>
                      {isPending && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          daysLeft < 0 ? 'bg-red-100 text-red-700' :
                          daysLeft === 0 ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {daysLeft < 0 ? t("Overdue | সময় পার হয়ে গেছে") : 
                           daysLeft === 0 ? t("Today | আজ") : 
                           t(`In ${daysLeft} days | ${daysLeft} দিন পর`)}
                        </span>
                      )}
                      {!isPending && (
                         <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${checkup.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {checkup.status === 'resolved' ? t("Resolved | নিরাময় হয়েছে") : t("No Improvement | কোনো উন্নতি হয়নি")}
                         </span>
                      )}
                    </div>
                  </div>
                  
                  {isDue && (
                    <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto">
                      <button 
                        onClick={() => markCheckupStatus(checkup.id, 'resolved')}
                        className="flex-1 md:flex-none px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-medium transition-colors border border-emerald-200 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {t("Resolved | নিরাময়")}
                      </button>
                      <button 
                        onClick={() => markCheckupStatus(checkup.id, 'no_improvement')}
                        className="flex-1 md:flex-none px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl font-medium transition-colors border border-red-200 flex items-center justify-center gap-2"
                      >
                        {t("No Improve | উন্নতি নেই")}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-emerald-50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-emerald-50 flex items-center gap-2 justify-between">
          <h2 className="text-xl font-bold text-[#1B4332]">{t("Recent History | সাম্প্রতিক ইতিহাস")}</h2>
          <Link to="/diagnosis" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
            {t("New Diagnosis + | নতুন নির্ণয় +")}
          </Link>
        </div>
        
        {history.length === 0 ? (
          <div className="p-12 text-center text-emerald-600 opacity-70">
            <p className="text-lg">{t("No diagnoses found yet. | এখনো কোনো নির্ণয় পাওয়া যায়নি।")}</p>
          </div>
        ) : (
          <div className="divide-y divide-emerald-50">
            {history.map(item => (
              <div key={item.id} className="p-6 flex items-center justify-between gap-4 hover:bg-emerald-50/30 transition-colors">
                <div>
                  <h3 className="font-bold text-[#1B4332] text-lg mb-1">{t(item.cropName)}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-700 opacity-80 text-sm font-medium">{t(item.disease)}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-200"></span>
                    <span className="text-emerald-600 opacity-60 text-xs">{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
                {item.isAi && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 shrink-0">
                    AI Assist
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
