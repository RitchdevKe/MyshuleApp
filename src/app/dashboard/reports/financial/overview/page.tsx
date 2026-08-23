"use client";
import React from "react";

export default function FinancialOverviewTab() {
  return (
    <div className="p-6 space-y-8">
      
      {/* KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
         <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl shadow-sm">
           <div className="text-[10px] font-black uppercase tracking-wider text-emerald-600 mb-1">Revenue</div>
           <div className="text-2xl font-black text-emerald-800">84.6M</div>
         </div>
         <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl shadow-sm">
           <div className="text-[10px] font-black uppercase tracking-wider text-rose-600 mb-1">Expenses</div>
           <div className="text-2xl font-black text-rose-800">51.2M</div>
         </div>
         <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl shadow-sm">
           <div className="text-[10px] font-black uppercase tracking-wider text-indigo-600 mb-1">Net Position</div>
           <div className="text-2xl font-black text-indigo-800">33.4M</div>
         </div>
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-4 rounded-2xl shadow-sm">
           <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Fees Collected</div>
           <div className="text-2xl font-black text-slate-800">72.8M</div>
         </div>
         <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl shadow-sm">
           <div className="text-[10px] font-black uppercase tracking-wider text-amber-600 mb-1">Outstanding Fees</div>
           <div className="text-2xl font-black text-amber-800">11.4M</div>
         </div>
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-4 rounded-2xl shadow-sm">
           <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Collection Rate</div>
           <div className="text-2xl font-black text-slate-800">86%</div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Aging Report */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Fee Arrears Aging</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl shadow-sm hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all">
              <span className="font-bold text-slate-700 text-sm">0-30 days</span>
              <span className="font-black text-emerald-600">KSh 2.1M</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl shadow-sm hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all">
              <span className="font-bold text-slate-700 text-sm">31-60 days</span>
              <span className="font-black text-amber-500">KSh 1.4M</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl shadow-sm hover:border-emerald-300 hover:shadow-md cursor-pointer transition-all">
              <span className="font-bold text-slate-700 text-sm">61-90 days</span>
              <span className="font-black text-rose-500">KSh 0.8M</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-200 rounded-xl shadow-sm hover:border-rose-300 hover:shadow-md cursor-pointer transition-all">
              <span className="font-bold text-rose-700 text-sm">90+ days</span>
              <span className="font-black text-rose-700">KSh 1.7M</span>
            </div>
          </div>
        </div>

        {/* Variance Intelligence */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Budget Variances</h3>
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-xl border border-rose-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Transport</h4>
                  <div className="text-xs text-slate-500 mt-1 flex gap-4">
                    <span>Budget: <strong className="text-slate-700">4.0M</strong></span>
                    <span>Actual: <strong className="text-rose-600">4.8M</strong></span>
                  </div>
                </div>
                <div className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-black flex items-center gap-1">
                  +20% ⚠
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Library</h4>
                  <div className="text-xs text-slate-500 mt-1 flex gap-4">
                    <span>Budget: <strong className="text-slate-700">1.2M</strong></span>
                    <span>Actual: <strong className="text-emerald-600">1.1M</strong></span>
                  </div>
                </div>
                <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 rounded text-xs font-black flex items-center gap-1">
                  -8%
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
