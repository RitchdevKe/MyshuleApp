"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Sparkles, GraduationCap, Users, BookOpen } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate a network request
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div 
      className="min-h-screen w-full flex bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')",
      }}
    >
      {/* Dynamic Background Overlays */}
      <div className="absolute inset-y-0 left-0 w-full md:w-3/5 lg:w-1/2 bg-gradient-to-r from-primary-950 via-primary-900/90 to-transparent z-0"></div>
      <div className="absolute inset-0 bg-primary-900/40 backdrop-blur-[2px] z-0 md:hidden"></div>
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-500/20 blur-[100px] z-0 animate-pulse mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-indigo-500/20 blur-[100px] z-0 animate-pulse mix-blend-screen pointer-events-none" style={{ animationDelay: '2s' }}></div>

      {/* Main Container */}
      <div className="relative z-10 w-full flex flex-col md:flex-row min-h-screen">
        
        {/* Left Content (Hidden on mobile) */}
        <div className="hidden md:flex w-full md:w-3/5 lg:w-1/2 flex-col justify-center px-8 lg:px-16 py-8">
          <div className="mb-8 flex items-center gap-3 transform transition-all hover:scale-105 origin-left">
             <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md shadow-lg shadow-white/5">
                <GraduationCap className="w-6 h-6 text-white" />
             </div>
             <div>
               <p className="text-secondary-400 text-[9px] font-black tracking-[0.2em] mb-0.5">POWERED BY</p>
               <h2 className="text-white text-xl font-black tracking-wide">ZIRA ANALYTICS</h2>
             </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-5 drop-shadow-lg">
            The intelligence<br/>platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-amber-300">smart<br/>schools.</span>
          </h1>

          <p className="text-primary-100 text-base max-w-md leading-relaxed mb-8 font-medium drop-shadow-md">
            Unify academic operations, fee collection, and parent communications into one seamless, powerful experience.
          </p>

          <div className="flex flex-wrap gap-3">
             {[
               { icon: Users, text: "Student Analytics" },
               { icon: BookOpen, text: "Curriculum" },
               { icon: Sparkles, text: "Smart Reporting" },
               { icon: GraduationCap, text: "Parent Portal" }
             ].map((feature, idx) => (
               <span key={idx} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 bg-white/5 text-white shadow-sm backdrop-blur-md hover:bg-white/10 hover:-translate-y-0.5 transition-all cursor-default">
                 <feature.icon className="w-4 h-4 text-secondary-400" />
                 <span className="text-xs font-bold tracking-wide">{feature.text}</span>
               </span>
             ))}
          </div>
        </div>

        {/* Right Content (Login Card) */}
        <div className="w-full md:w-2/5 lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-transparent">
          <div className="w-full max-w-[360px] bg-white/10 backdrop-blur-2xl rounded-3xl p-6 lg:p-8 border border-white/20 shadow-2xl relative group">
             
             {/* Glow effect on hover */}
             <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-secondary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

             {/* Header */}
             <div className="flex flex-col items-center mb-6">
                <div className="h-12 w-12 rounded-2xl border border-white/20 bg-white/10 flex items-center justify-center mb-4 shadow-inner">
                   <GraduationCap className="w-6 h-6 text-secondary-400" />
                </div>
                <h3 className="text-secondary-400 text-[9px] font-black tracking-[0.2em] mb-1.5 uppercase">MY SHULE APP</h3>
                <h2 className="text-white text-2xl font-black mb-1.5 tracking-tight">Welcome back</h2>
                <p className="text-primary-100 text-xs font-medium">Sign in to your administration portal</p>
             </div>

             {/* Form */}
             <form className="space-y-5" onSubmit={handleLogin}>
                <div className="group/input">
                  <label className="block text-[11px] font-bold text-white/70 mb-2 uppercase tracking-wider group-focus-within/input:text-secondary-400 transition-colors">Email or Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-white/40 group-focus-within/input:text-secondary-400 transition-colors" />
                    </div>
                    <input
                      type="text"
                      required
                      className="block w-full pl-11 pr-4 py-2.5 border border-white/10 rounded-2xl bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-secondary-500/50 focus:border-secondary-500 focus:bg-white/10 text-sm font-medium transition-all shadow-inner"
                      placeholder="admin@zira.analytics"
                    />
                  </div>
                </div>

                <div className="group/input">
                  <div className="flex justify-between items-center mb-2">
                     <label className="block text-[11px] font-bold text-white/70 uppercase tracking-wider group-focus-within/input:text-secondary-400 transition-colors">Password</label>
                     <a href="#" className="text-[11px] font-bold text-secondary-400 hover:text-secondary-300 transition-colors">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-white/40 group-focus-within/input:text-secondary-400 transition-colors" />
                    </div>
                    <input
                      type="password"
                      required
                      className="block w-full pl-11 pr-4 py-2.5 border border-white/10 rounded-2xl bg-white/5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-secondary-500/50 focus:border-secondary-500 focus:bg-white/10 text-sm tracking-widest font-medium transition-all shadow-inner"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-3 py-3.5 px-4 rounded-2xl shadow-lg shadow-secondary-500/20 text-sm font-black text-white bg-secondary-500 hover:bg-secondary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 focus:ring-offset-primary-900 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group/btn"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Authenticating...
                      </span>
                    ) : (
                      <>
                        Sign in to Workspace
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
             </form>

             {/* Quick Access */}
             <div className="mt-6 pt-5 border-t border-white/10">
                <div className="flex items-center justify-center gap-2 mb-3 text-white/50">
                   <Users className="w-3.5 h-3.5" />
                   <span className="text-[9px] font-black uppercase tracking-widest">Are you a parent or student?</span>
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-[11px] font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  Access Family Portal <ArrowRight className="w-3.5 h-3.5" />
                </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

