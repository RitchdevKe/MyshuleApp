"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Sparkles, GraduationCap, Users, BookOpen, Eye, EyeOff, Bot, ArrowLeft } from "lucide-react";

export default function LoginClient({ 
  backgroundUrl,
  schoolName,
  showSchoolName = true
}: { 
  backgroundUrl?: string;
  schoolName?: string;
  showSchoolName?: boolean;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loginMode, setLoginMode] = useState<"admin" | "parent">("admin");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to login");
      }

      if (loginMode === "parent" || data.role === "Parent") {
        router.push("/parent-portal/home");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const bgImage = backgroundUrl || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop";

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden font-sans bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('" + bgImage + "')" }}
        />
        {/* Gradient Overlay just on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2c0814] via-[#2c0814]/70 via-50% to-transparent" />
      </div>

      {/* Top Center School Name */}
      <div className="absolute top-1 md:top-2 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <h1 className="text-white text-3xl md:text-4xl lg:text-[40px] font-black uppercase tracking-tight text-center drop-shadow-lg">
          {showSchoolName ? (schoolName || "CDM EMMANUEL GROUP OF SCHOOLS") : ""}
        </h1>
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-8 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-8 mt-6">
        
        {/* Left Content */}
        <div className="hidden md:flex w-full md:w-[55%] flex-col items-start text-left">
          <div className="flex items-center gap-4 mb-5">            <div className="h-12 w-12 rounded-full border border-white/20 bg-white/5 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white/90" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black tracking-[0.2em] text-[#e83e60] uppercase mb-1">POWERED BY</div>
              <div className="text-lg font-black text-white tracking-widest uppercase leading-none">ZIRA ANALYTICS</div>
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-[56px] font-black text-white leading-[1.05] tracking-tight mb-6 text-left">
            AI powered intelligence<br/>
            platform for <span className="text-[#e83e60]">smart</span><br/>
            <span className="text-[#fca05f]">schools.</span>
          </h1>
          
          <p className="text-white text-base md:text-[17px] max-w-xl font-medium leading-relaxed mb-6 text-left tracking-wide">
            Unify academic operations, fee collection, and parent<br/>communications into one seamless, powerful experience.
          </p>

          <div className="flex flex-wrap items-center justify-start gap-4 max-w-xl">
             <div className="flex items-center gap-3 px-5 py-2.5 rounded-[20px] border border-white/20 bg-[#2c0814]/60 text-white shadow-sm cursor-default hover:bg-[#2c0814]/80 transition-colors">
               <Bot className="w-4 h-4 text-[#e83e60]" />
               <span className="text-sm font-bold tracking-wide">AI Assistant</span>
             </div>
             <div className="flex items-center gap-3 px-5 py-2.5 rounded-[20px] border border-white/20 bg-[#2c0814]/60 text-white shadow-sm cursor-default hover:bg-[#2c0814]/80 transition-colors">
               <Users className="w-4 h-4 text-[#e83e60]" />
               <span className="text-sm font-bold tracking-wide">Student Analytics</span>
             </div>
             <div className="flex items-center gap-3 px-5 py-2.5 rounded-[20px] border border-white/20 bg-[#2c0814]/60 text-white shadow-sm cursor-default hover:bg-[#2c0814]/80 transition-colors">
               <BookOpen className="w-4 h-4 text-[#e83e60]" />
               <span className="text-sm font-bold tracking-wide">Curriculum</span>
             </div>
             <div className="flex items-center gap-3 px-5 py-2.5 rounded-[20px] border border-[#fca05f]/40 bg-[#fca05f]/20 text-white shadow-sm cursor-default">
               <Sparkles className="w-4 h-4 text-[#fca05f]" />
               <span className="text-sm font-bold tracking-wide">Smart Reporting</span>
             </div>
             <div className="flex items-center gap-3 px-5 py-2.5 rounded-[20px] border border-white/20 bg-[#2c0814]/60 text-white shadow-sm cursor-default hover:bg-[#2c0814]/80 transition-colors">
               <GraduationCap className="w-4 h-4 text-[#e83e60]" />
               <span className="text-sm font-bold tracking-wide">Parent Portal</span>
             </div>
          </div>
        </div>

        {/* Right Content (Login Card) */}
        <div className="w-full md:w-[45%] flex items-center justify-end p-4 sm:p-8">
          <div className="w-full max-w-[360px] bg-white/10 backdrop-blur-md rounded-[32px] p-6 lg:p-8 shadow-2xl relative border border-white/20">
             
             {/* Header */}
             <div className="flex flex-col items-center mb-6 relative">
                {loginMode === "parent" && (
                  <button 
                    onClick={() => setLoginMode("admin")}
                    className="absolute -left-2 -top-2 p-2 text-white/70 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                
                <div className="h-12 w-12 rounded-full border border-[#e83e60]/30 bg-white/40 flex items-center justify-center mb-4">
                   <GraduationCap className="w-5 h-5 text-[#e83e60]" />
                </div>
                
                <h2 className="text-[#e83e60] text-2xl font-black mb-1.5 tracking-wide text-center uppercase">
                  MY SHULE APP
                </h2>

                <h3 className="text-white text-[11px] font-bold tracking-[0.1em] mb-1.5 uppercase text-center">WELCOME BACK</h3>
                <p className="text-white/80 text-[13px] font-medium text-center">
                  {loginMode === "admin" ? "Sign in to your administration portal" : "Sign in to your family portal"}
                </p>
             </div>

             {/* Form */}
             <form className="space-y-5" onSubmit={handleLogin}>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
                    <p className="text-red-400 text-xs font-bold">{error}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-[10px] font-bold text-white mb-2 uppercase tracking-wider">
                    {loginMode === "admin" ? "EMAIL" : "PARENT EMAIL"}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full pl-11 pr-4 py-2.5 border-0 rounded-full bg-[#eef1f6] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e83e60]/50 text-[14px] font-medium transition-all"
                      placeholder={loginMode === "admin" ? "admin@demo.myshule.ke" : "parent@email.com"}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                     <label className="block text-[10px] font-bold text-white uppercase tracking-wider">PASSWORD</label>
                     <a href="#" className="text-[11px] font-bold text-[#e83e60] hover:text-[#d33454] transition-colors">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="block w-full pl-11 pr-12 py-2.5 border-0 rounded-full bg-[#eef1f6] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#e83e60]/50 text-[14px] tracking-widest font-bold transition-all"
                      placeholder="•••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#e83e60] hover:text-[#d33454] transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-full shadow-lg text-base font-bold text-white bg-[#e83e60] hover:bg-[#d33454] focus:outline-none transition-all active:scale-[0.98] disabled:opacity-70 group/btn"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Authenticating...
                      </span>
                    ) : (
                      <>
                        Sign in to {loginMode === "admin" ? "Workspace" : "Family Portal"}
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
             </form>

             {/* Quick Access */}
             {loginMode === "admin" && (
               <div className="mt-5 pt-5 border-t border-white/20">
                  <div className="flex items-center justify-center gap-2 mb-4 text-white/60">
                     <Users className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-wider">ARE YOU A PARENT OR STUDENT?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLoginMode("parent")}
                    className="w-full py-3 px-4 rounded-xl bg-black/40 hover:bg-black/50 text-white text-[13px] font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    Access Family Portal <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
}





