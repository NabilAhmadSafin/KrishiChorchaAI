import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sprout, BookOpen, LayoutDashboard, Menu, X, ArrowRight, Globe, CheckCircle2, UserCircle, LogOut, LogIn } from "lucide-react";
import { cn } from "../lib/utils";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

export default function Layout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [overdueCheckup, setOverdueCheckup] = useState<any | null>(null);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
  const { user, signInWithGoogle, logout } = useAuth();

  useEffect(() => {
    try {
      const savedCheckups = JSON.parse(localStorage.getItem("agrosathi_checkups") || "[]");
      const pendingOverdue = savedCheckups.find((c: any) => {
        const isPending = c.status === 'pending' || (!c.status && !c.completed);
        const daysDiff = Math.ceil((new Date(c.scheduledFor).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        return isPending && daysDiff <= 0;
      });
      if (pendingOverdue) {
        setOverdueCheckup(pendingOverdue);
      }
    } catch (e) {
      console.error(e);
    }
  }, [location.pathname]);

  const handleFeedback = (status: string) => {
    if (!overdueCheckup) return;
    try {
      const savedCheckups = JSON.parse(localStorage.getItem("agrosathi_checkups") || "[]");
      const updated = savedCheckups.map((c: any) => 
        c.id === overdueCheckup.id ? { ...c, status, completed: true } : c
      );
      localStorage.setItem("agrosathi_checkups", JSON.stringify(updated));
      setOverdueCheckup(null);
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { name: "Home | হোম", path: "/", icon: Sprout },
    { name: "Diagnostic | রোগ নির্ণয়", path: "/diagnosis", icon: ArrowRight },
    { name: "Library | তথ্য ভান্ডার", path: "/library", icon: BookOpen },
    { name: "Dashboard | ড্যাশবোর্ড", path: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7F5] font-sans text-[#1B4332]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-emerald-100 py-3 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">K</div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none text-[#1B4332]">KrishiChorchaAI</span>
                <span className="text-[10px] uppercase tracking-wider text-emerald-600">{t("Smart Farming Companion | স্মার্ট কৃষিকাজ সঙ্গী")}</span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                {navLinks.map((link) => {
                  const active = location.pathname === link.path || (link.path !== "/" && location.pathname.startsWith(link.path));
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={cn(
                        "transition-colors",
                        active ? "text-emerald-900" : "text-emerald-600 opacity-70 hover:opacity-100"
                      )}
                    >
                      {t(link.name)}
                    </Link>
                  );
                })}
              </nav>

              <div className="h-6 w-px bg-emerald-100 hidden md:block"></div>

              {/* Language Toggle */}
              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-100 hover:bg-emerald-100 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'EN' : 'BN'}</span>
              </button>

              <div className="h-6 w-px bg-emerald-100 hidden md:block"></div>

              {/* User Account */}
              <div className="relative hidden md:block">
                {user ? (
                  <div className="relative">
                    <button 
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 group"
                    >
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-emerald-100 group-hover:border-emerald-300" />
                      ) : (
                        <UserCircle className="w-8 h-8 text-emerald-600 opacity-70 group-hover:opacity-100" />
                      )}
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-emerald-100 py-1 overflow-hidden">
                        <div className="px-4 py-3 border-b border-emerald-50 bg-emerald-50/30">
                          <p className="text-sm font-bold text-emerald-900 truncate">{user.displayName || 'Farmer'}</p>
                          <p className="text-xs text-emerald-600 truncate">{user.email}</p>
                        </div>
                        <button 
                          onClick={() => {
                            logout();
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t("Logout | লগআউট")}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={signInWithGoogle}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600 text-white text-sm font-bold shadow-sm shadow-emerald-200 hover:bg-emerald-700 transition"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{t("Sign In | সাইন ইন")}</span>
                  </button>
                )}
              </div>

              {/* Mobile Menu Button  */}
              <button
                className="md:hidden p-2 text-emerald-600 opacity-70 hover:opacity-100"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-emerald-100 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const active = location.pathname === link.path || (link.path !== "/" && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  active ? "bg-emerald-50 text-emerald-900" : "text-emerald-600 opacity-70 hover:opacity-100 hover:bg-emerald-50"
                )}
              >
                {t(link.name)}
              </Link>
            );
          })}
          
          <div className="pt-2 mt-2 border-t border-emerald-100">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-emerald-200" />
                  ) : (
                    <UserCircle className="w-10 h-10 text-emerald-600 opacity-70" />
                  )}
                  <div>
                    <p className="text-sm font-bold text-emerald-900">{user.displayName || 'Farmer'}</p>
                    <p className="text-xs text-emerald-600">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-base text-red-600 font-bold bg-red-50 hover:bg-red-100"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t("Logout | লগআউট")}</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  signInWithGoogle();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-md text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700"
              >
                <LogIn className="w-5 h-5" />
                <span>{t("Sign In with Google | গুগলের মাধ্যমে লগইন")}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Global Overdue Modal */}
      {overdueCheckup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-emerald-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-emerald-100 flex flex-col">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-[#1B4332] mb-2">{t("Check-up Time! | চেক-আপের সময়!")}</h2>
            <p className="text-emerald-700 opacity-80 mb-6">
              {t(`It's time to check on your ${t(overdueCheckup.cropName)} for ${t(overdueCheckup.disease)}. How is it doing now? | আপনার ${t(overdueCheckup.cropName)} এর ${t(overdueCheckup.disease)} চেক করার সময় হয়েছে। এখন অবস্থা কেমন?`)}
            </p>
            <div className="grid gap-3">
              <button 
                onClick={() => handleFeedback('resolved')}
                className="w-full px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl font-bold transition-colors border border-emerald-200 text-left flex justify-between items-center"
              >
                <span>{t("Condition Improved | অবস্থার উন্নতি হয়েছে")}</span>
                <span className="text-xl">🌿</span>
              </button>
              <button 
                onClick={() => handleFeedback('no_improvement')}
                className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-800 rounded-2xl font-bold transition-colors border border-red-200 text-left flex justify-between items-center"
              >
                <span>{t("No Improvement | কোনো উন্নতি নেই")}</span>
                <span className="text-xl">⚠️</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-emerald-50 mt-auto py-3 px-4 sm:px-6 lg:px-8 shrink-0 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">© {new Date().getFullYear()} KrishiChorchaAI • Made for Bangladesh</p>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> {t("System Online | সিস্টেম অনলাইন")}
            </div>
            <div className="hidden md:block h-4 w-px bg-gray-200"></div>
            <p className="hidden md:block text-[10px] text-gray-500 font-medium italic">{t("Support: support@krishichorcha.ai | সমর্থন: support@krishichorcha.ai")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
