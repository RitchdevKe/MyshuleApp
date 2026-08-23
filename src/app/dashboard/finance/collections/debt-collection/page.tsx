"use client";

import React from "react";
import { AlertOctagon, ShieldAlert } from "lucide-react";

export default function DebtCollectionPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {/* Aging Buckets */}
         <div className="bg-rose-50/50 backdrop-blur-md p-5 rounded-3xl border border-rose-100 shadow-sm">
            <p className="text-xs font-black text-rose-500 uppercase tracking-wider mb-1">Total Arrears</p>
            <p className="text-2xl font-black text-rose-700">KSh 1.2M</p>
         </div>
         <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">0 - 30 Days</p>
            <p className="text-2xl font-black text-slate-800">KSh 400K</p>
         </div>
         <div className="bg-white/60 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">31 - 60 Days</p>
            <p className="text-2xl font-black text-slate-800">KSh 500K</p>
         </div>
         <div className="bg-rose-600 backdrop-blur-md p-5 rounded-3xl border border-rose-500 shadow-sm text-white">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-xs font-bold text-rose-200 uppercase tracking-wider mb-1">90+ Days (Critical)</p>
                  <p className="text-2xl font-black">KSh 300K</p>
               </div>
               <ShieldAlert className="w-6 h-6 text-rose-300 opacity-50" />
            </div>
         </div>
      </div>

      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
         <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Debt Recovery Actions</h3>
            <button className="px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm shadow-sm transition-colors">
               Send Batch Reminders
            </button>
         </div>
         <div className="p-8 text-center text-slate-500">
            <AlertOctagon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h4 className="font-bold text-slate-700 mb-2">Automated Debt Reminders</h4>
            <p className="text-sm max-w-sm mx-auto">Set up automated SMS and Email reminders based on aging buckets (e.g. send gentle reminder at 15 days past due).</p>
         </div>
      </div>
    </div>
  );
}
