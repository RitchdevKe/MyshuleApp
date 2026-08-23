"use client";

import React from "react";
import { Calendar, Lock, Unlock, Settings, AlertTriangle, PlayCircle } from "lucide-react";

export default function FinancialYearPage() {
  const periods = [
    { month: "January 2023", status: "Closed", locked: true },
    { month: "February 2023", status: "Closed", locked: true },
    { month: "March 2023", status: "Closed", locked: true },
    { month: "April 2023", status: "Closed", locked: true },
    { month: "May 2023", status: "Closed", locked: true },
    { month: "June 2023", status: "Closed", locked: true },
    { month: "July 2023", status: "Closed", locked: true },
    { month: "August 2023", status: "Closed", locked: true },
    { month: "September 2023", status: "Closed", locked: true },
    { month: "October 2023", status: "Open", locked: false },
    { month: "November 2023", status: "Upcoming", locked: false },
    { month: "December 2023", status: "Upcoming", locked: false },
  ];

  return (
    <div className="space-y-6">
      
      {/* Active Year Summary */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center shrink-0 border border-primary-100">
            <Calendar className="w-8 h-8 text-primary-900" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">FY 2023</h2>
            <p className="text-sm font-bold text-slate-500 mt-1">Jan 1, 2023 - Dec 31, 2023</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Settings className="w-4 h-4 text-slate-400" />
            Year Settings
          </button>
          <button className="flex items-center justify-center gap-2 px-5 py-3 bg-rose-50 text-rose-700 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all shadow-sm">
            <Lock className="w-4 h-4" />
            Close Financial Year
          </button>
        </div>
      </div>

      {/* Grid of Periods */}
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-slate-800 text-lg">Accounting Periods</h3>
            <p className="text-sm text-slate-500 font-medium">Manage period locks to prevent backdating of transactions.</p>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {periods.map((period, i) => (
              <div key={i} className={`p-5 rounded-2xl border transition-all ${
                period.status === 'Open' ? 'bg-primary-50 border-primary-200 shadow-sm shadow-primary-900/5' :
                period.status === 'Closed' ? 'bg-slate-50 border-slate-200 opacity-75' :
                'bg-white border-dashed border-slate-300'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <h4 className={`font-bold ${period.status === 'Open' ? 'text-primary-900' : 'text-slate-700'}`}>
                    {period.month}
                  </h4>
                  {period.locked ? (
                    <Lock className="w-4 h-4 text-slate-400" />
                  ) : period.status === 'Open' ? (
                    <Unlock className="w-4 h-4 text-primary-600" />
                  ) : (
                    <Calendar className="w-4 h-4 text-slate-300" />
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    period.status === 'Open' ? 'bg-primary-900 text-white' :
                    period.status === 'Closed' ? 'bg-slate-200 text-slate-600' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {period.status}
                  </span>
                  
                  {period.status === 'Open' && (
                    <button className="text-xs font-bold text-primary-700 hover:text-primary-900 flex items-center gap-1">
                      Lock <Lock className="w-3 h-3" />
                    </button>
                  )}
                  {period.status === 'Upcoming' && i > 0 && periods[i-1].status === 'Closed' && (
                     <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                      Open <PlayCircle className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-amber-50 border-t border-amber-100 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-amber-800">
            <strong>Warning:</strong> Re-opening a closed period requires Administrator approval and will invalidate previously generated reports for that period.
          </p>
        </div>
      </div>

    </div>
  );
}