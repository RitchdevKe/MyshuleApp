"use client";

import React from "react";
import { Activity, Download } from "lucide-react";

export default function LeaveBalancesPage() {
  return (
    <div className="space-y-6">
       <div className="flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
             <Download className="w-4 h-4" />
             Export Balances
          </button>
       </div>
       <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
         <Activity className="w-16 h-16 text-slate-300 mb-4" />
         <h3 className="font-bold text-slate-700 mb-2">Leave Balances Overview</h3>
         <p className="text-sm text-slate-500 max-w-sm mx-auto">A matrix of all employees and their remaining leave balances across different categories will appear here.</p>
       </div>
    </div>
  );
}
