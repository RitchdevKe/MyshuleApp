import React from 'react';
import { ShieldAlert, ChevronLeft, Mail, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';

interface UnauthorizedAccessProps {
  role?: string;
  module?: string;
  onBack?: () => void;
}

export function UnauthorizedAccess({ role = 'Staff', module = 'Finance', onBack }: UnauthorizedAccessProps) {
  const requestAccess = () => {
    toast.success("Access request sent to School Administrator.");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] shadow-2xl overflow-hidden"
      >
        <div className="bg-slate-50 p-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center border border-rose-100">
               <Lock className="w-12 h-12 text-rose-500" />
            </div>
            <div className="absolute -right-2 -bottom-2 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-slate-100">
               <ShieldAlert className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="p-10 text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-sans uppercase">Access Restrained</h2>
            <p className="text-slate-500 text-lg font-bold leading-relaxed">
              Your current profile level (<span className="text-[var(--color-secondary)] uppercase">{role}</span>) does not have sufficient clearance to view the <span className="font-bold text-slate-700">{module}</span> module dashboard.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-[15px] font-bold text-slate-400 uppercase tracking-wide leading-loose">
             Only authorized personnel can access this page. Please contact administration if you believe this is an error.
          </div>

          <div className="flex flex-col gap-3">
            <button
               onClick={requestAccess}
               className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase text-[16px] tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 active:scale-95"
            >
               <Mail className="w-4 h-4" /> Request Higher Clearance
            </button>
            
            {onBack && (
              <button
                onClick={onBack}
                className="w-full py-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold uppercase text-[16px] tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Safety
              </button>
            )}
          </div>
        </div>

        <div className="h-1.5 bg-gradient-to-r from-rose-500 via-[var(--color-secondary)] to-amber-500 w-full" />
      </motion.div>
    </div>
  );
}
