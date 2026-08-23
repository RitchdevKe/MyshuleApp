import { toast } from "react-hot-toast";
import React, { useState } from 'react';
import { 
  LogIn, 
  Key, 
  Mail, 
  GraduationCap, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Shield, 
  Users, 
  BookOpen, 
  Briefcase, 
  CreditCard,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'motion/react';
import schoolBanner from '../assets/images/school_campus_banner_1779960085729.png';
import learningSystemBg from '../assets/images/school_learning_system_bg_1780045413458.png';
import { SchoolSettings } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (teacherInfo: { name: string; email: string; role: string }) => void;
  schoolSettings: SchoolSettings | null;
}

export function LoginScreen({ onLoginSuccess, schoolSettings }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
 
    setTimeout(() => {
      const lowerUser = username.trim().toLowerCase();
      if (
        (lowerUser === 'danielgitumuhia@karegasec' || lowerUser === 'daniel') &&
        password === '843820'
      ) {
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess({ name: 'Daniel Gitumu Hia', email: 'danielgitumuhia@karegasec.co.ke', role: 'Teacher' });
          setLoading(false);
        }, 1000);
      } else if (
        (lowerUser === 'admin@zira.co.ke' || lowerUser === 'admin') &&
        (password === '843820' || password === 'admin')
      ) {
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess({ name: 'Super Admin Director', email: 'admin@zira.co.ke', role: 'Super Admin' });
          setLoading(false);
        }, 1000);
      } else if (
        (lowerUser === 'principal@karegasec.co.ke' || lowerUser === 'principal') &&
        password === '843820'
      ) {
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess({ name: 'Julius Karega', email: 'principal@karegasec.co.ke', role: 'School Admin' });
          setLoading(false);
        }, 1000);
      } else if (
        (lowerUser === 'headteacher@karegasec.co.ke' || lowerUser === 'headteacher') &&
        password === '843820'
      ) {
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess({ name: 'Mercy Chepkoech', email: 'headteacher@karegasec.co.ke', role: 'Head Teacher' });
          setLoading(false);
        }, 1000);
      } else if (
        (lowerUser === 'accountant@karegasec.co.ke' || lowerUser === 'accountant') &&
        password === '843820'
      ) {
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess({ name: 'Shadrack Kiprop', email: 'accountant@karegasec.co.ke', role: 'Accountant' });
          setLoading(false);
        }, 1000);
      } else if (
        (lowerUser === 'parent@karegasec.co.ke' || lowerUser === 'parent') &&
        password === '843820'
      ) {
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess({ name: 'Bernard Kiprop (Parent)', email: 'parent@karegasec.co.ke', role: 'Parent' });
          setLoading(false);
        }, 1000);
      } else if (
        (lowerUser === 'student@karegasec.co.ke' || lowerUser === 'student') &&
        password === '843820'
      ) {
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess({ name: 'Douglas Omari (Student)', email: 'student@karegasec.co.ke', role: 'Student' });
          setLoading(false);
        }, 1000);
      } else if (
        (lowerUser === 'librarian@karegasec.co.ke' || lowerUser === 'librarian') &&
        password === '843820'
      ) {
        setIsSuccess(true);
        setTimeout(() => {
          onLoginSuccess({ name: 'Jane Smith (Librarian)', email: 'librarian@karegasec.co.ke', role: 'Librarian' });
          setLoading(false);
        }, 1000);
      } else {
        setError('Incorrect credentials. Please verify your Shule Portal login details.');
        setLoading(false);
      }
    }, 1200);
  };

  const handleAutocompleteAdmin = () => {
    setUsername('admin@zira.co.ke');
    setPassword('843820');
  };

  const autofillUser = (user: string) => {
    setUsername(`${user}@karegasec.co.ke`);
    setPassword('843820');
  };

  const getGreeting = () => {
    try {
      const hourStr = new Date().toLocaleString("en-US", { timeZone: "Africa/Nairobi", hour: 'numeric', hour12: false });
      const h = parseInt(hourStr, 10);
      if (h < 12) return 'Good morning';
      if (h < 18) return 'Good afternoon';
      return 'Good evening';
    } catch {
      const h = new Date().getHours();
      if (h < 12) return 'Good morning';
      if (h < 18) return 'Good afternoon';
      return 'Good evening';
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#3D1D3F] relative overflow-hidden">
      
      {/* Full-bleed background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={learningSystemBg}
          alt="Zira Learning System background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-950/78" />
      </div>

      {/* Left branding panel — desktop only */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#3D1D3F] relative overflow-hidden flex-col justify-between px-14 py-12 z-10 border-r border-white/8">
        <img 
          src={schoolBanner}
          alt="School Campus"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-950/82" />
        
        {/* Top: logo + tagline */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 shadow-xl overflow-hidden">
              {schoolSettings?.logo ? (
                <img src={schoolSettings.logo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              ) : (
                <GraduationCap className="w-7 h-7 text-white" />
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-white/50 uppercase tracking-wide mb-0.5">Powered by</p>
              <span className="font-semibold text-xl text-white tracking-tight">
                {schoolSettings?.schoolName || 'Zira Academy'}
              </span>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-sm"
          >
            <h1 className="text-4xl font-semibold text-white leading-[1.15] tracking-tight mb-5">
              The intelligence platform for{' '}
              <span className="text-[#C20F47]">smart schools.</span>
            </h1>
            <p className="text-base text-white/65 leading-relaxed font-normal">
              Unify academic operations, fee collection, and parent communications into one seamless experience.
            </p>
          </motion.div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            {['Student Analytics', 'Fee Management', 'Staff HR', 'Parent Portal'].map(f => (
              <span key={f} className="text-xs font-medium text-white/60 border border-white/15 rounded-full px-3 py-1">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom: social proof */}
        <div className="relative z-10 flex items-center gap-3 text-sm text-white/60 font-normal border-t border-white/10 pt-6">
          <div className="flex -space-x-2">
            {[33, 47, 12].map(n => (
              <div key={n} className="w-7 h-7 rounded-full border-2 border-[#3D1D3F] bg-slate-200 overflow-hidden shadow">
                <img src={`https://i.pravatar.cc/100?img=${n}`} alt="Avatar" referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          <span>Trusted by 10,000+ educators</span>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 relative overflow-y-auto z-10">
        <div className="w-full max-w-[360px] mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-[#3D1D3F]/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-[#C20F47]/60 overflow-hidden text-white"
          >
            {/* Card header */}
            <div className="px-7 pt-7 pb-5 text-center border-b border-white/8">
              <div className="lg:hidden text-lg font-semibold text-white tracking-tight mb-1">
                {schoolSettings?.schoolName || 'Zira Academy'}
              </div>

              <div className="mx-auto w-14 h-14 rounded-xl flex items-center justify-center mb-4 overflow-hidden border border-white/15 bg-white/5">
                {schoolSettings?.logo ? (
                  <img src={schoolSettings.logo} alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <GraduationCap className="w-7 h-7 text-[#C20F47]" />
                )}
              </div>

              <div className="text-xs font-medium text-[#C20F47] uppercase tracking-wide mb-2">
                My Shule App
              </div>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                {getGreeting()}
              </h2>
              <p className="text-sm text-white/50 mt-1 font-normal">Sign in to your portal</p>
            </div>

            {/* Form body */}
            <div className="px-7 py-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 p-3.5 rounded-lg text-sm bg-rose-500/12 text-rose-300 border border-rose-500/25 flex items-start gap-2.5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span className="font-normal leading-snug">{error}</span>
                </motion.div>
              )}

              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 flex items-center justify-center mb-4">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Signed in</h3>
                  <p className="text-sm text-white/55 mt-1 font-normal">
                    Welcome back — loading your workspace…
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">
                      Email or username
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/35">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="username-input"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. daniel@karegasec.co.ke"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/12 bg-white/6 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/40 focus:bg-white/8 transition-all font-normal"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-xs font-medium text-white/50 uppercase tracking-wide">
                        Password
                      </label>
                      <button
                        type="button"
                        className="text-xs font-medium text-[#C20F47] hover:text-[#e02060] transition bg-transparent border-none cursor-pointer p-0"
                        onClick={() => toast.success("Please use the demo credentials below.")}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-white/35">
                        <Key className="w-4 h-4" />
                      </div>
                      <input
                        id="password-input"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-white/12 bg-white/6 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/40 focus:bg-white/8 transition-all font-normal"
                      />
                      <button
                        type="button"
                        id="toggle-password-visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white/80 transition-colors focus:outline-none cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    id="login-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-gradient-to-r from-[#C20F47] to-[#3D1D3F] hover:opacity-90 text-white font-medium text-sm rounded-lg shadow-md shadow-[#C20F47]/15 hover:scale-[1.01] active:scale-[0.99] transition duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign in to My Shule</span>
                        <LogIn className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
            
            {/* Quick Access demo logins */}
            <div className="bg-white/[0.025] border-t border-white/8 px-7 py-5">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <Sparkles className="w-3.5 h-3.5 text-[#C20F47]" />
                <span className="text-[11px] font-medium text-white/40 uppercase tracking-wide">
                  Quick Access
                </span>
              </div>
              
              {/* Students & Families */}
              <div className="mb-3">
                <span className="text-[10.5px] font-medium text-white/30 tracking-wide uppercase mb-2 block">
                  Students & Families
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { key: 'student', label: 'Student', desc: 'Academic Portal', icon: GraduationCap, action: () => autofillUser('student') },
                    { key: 'parent', label: 'Parent', desc: 'Track progress', icon: Users, action: () => autofillUser('parent') }
                  ].map((demo) => {
                    const Icon = demo.icon;
                    return (
                      <button
                        key={demo.key}
                        type="button"
                        onClick={demo.action}
                        className="p-2.5 rounded-lg border border-white/8 bg-white/4 hover:border-white/15 hover:bg-white/8 transition-all flex flex-col gap-1 text-left group cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="w-5 h-5 rounded-md bg-[#C20F47]/15 text-[#C20F47] flex items-center justify-center shrink-0">
                            <Icon className="w-3 h-3" />
                          </div>
                          <ArrowRight className="w-2.5 h-2.5 text-white/25 group-hover:text-[#C20F47] transition-colors" />
                        </div>
                        <span className="text-[11px] font-semibold text-white/90 group-hover:text-white transition-colors leading-none mt-0.5">
                          {demo.label}
                        </span>
                        <span className="text-[10px] text-white/40 leading-tight font-normal">
                          {demo.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Staff & Administration */}
              <div>
                <span className="text-[10.5px] font-medium text-white/30 tracking-wide uppercase mb-2 block">
                  Staff & Administration
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { key: 'administrator', label: 'Administrator', desc: 'School management', icon: Shield, action: () => autofillUser('principal') },
                    { key: 'hr_staff', label: 'Head Teacher', desc: 'Staff & HR', icon: Briefcase, action: () => autofillUser('headteacher') },
                    { key: 'accountant', label: 'Accountant', desc: 'Finance & fees', icon: CreditCard, action: () => autofillUser('accountant') },
                    { key: 'librarian', label: 'Librarian', desc: 'Library admin', icon: BookOpen, action: () => autofillUser('librarian') }
                  ].map((demo) => {
                    const Icon = demo.icon;
                    return (
                      <button
                        key={demo.key}
                        type="button"
                        onClick={demo.action}
                        className="p-2.5 rounded-lg border border-white/8 bg-white/4 hover:border-white/15 hover:bg-white/8 transition-all flex flex-col gap-1 text-left group cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="w-5 h-5 rounded-md bg-[#C20F47]/15 text-[#C20F47] flex items-center justify-center shrink-0">
                            <Icon className="w-3 h-3" />
                          </div>
                          <ArrowRight className="w-2.5 h-2.5 text-white/25 group-hover:text-[#C20F47] transition-colors" />
                        </div>
                        <span className="text-[11px] font-semibold text-white/90 group-hover:text-white transition-colors leading-none mt-0.5">
                          {demo.label}
                        </span>
                        <span className="text-[10px] text-white/40 leading-tight font-normal">
                          {demo.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SaaS Admin entry */}
              <div className="mt-4 pt-4 border-t border-white/6 space-y-3 text-center">
                <button
                  type="button"
                  onClick={() => {
                    handleAutocompleteAdmin();
                    toast.success("Platform admin credentials populated.");
                  }}
                  className="w-full py-2.5 px-4 rounded-lg border border-white/10 bg-white/5 hover:border-[#C20F47]/40 hover:bg-white/8 transition-all text-xs font-medium text-white/60 hover:text-white cursor-pointer tracking-widest uppercase"
                >
                  Integral — Platform Admin
                </button>
                <p className="text-[11px] text-white/35 font-normal leading-relaxed">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-[#C20F47] font-medium hover:underline cursor-pointer bg-transparent border-none p-0"
                    onClick={() => toast.success("Please contact your school administrator.")}
                  >
                    Contact administration
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
