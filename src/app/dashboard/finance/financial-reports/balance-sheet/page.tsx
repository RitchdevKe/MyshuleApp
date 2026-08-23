"use client";

import React, { useState } from "react";
import { BarChart2, Download, Filter, Calendar } from "lucide-react";

export default function BalanceSheetPage() {
  const [asOfDate, setAsOfDate] = useState("2026-10-31");

  return (
    <div className="space-y-8">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
            <h2 className="text-xl font-black text-slate-800">Statement of Financial Position</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Snapshot of Assets, Liabilities, and Equity.</p>
         </div>
         <div className="flex flex-wrap items-center gap-3">
             <div className="relative">
                <input 
                  type="date" 
                  value={asOfDate}
                  onChange={(e) => setAsOfDate(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer" 
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
             </div>
             <button className="p-2.5 bg-white border border-slate-200/60 rounded-xl shadow-sm text-slate-500 hover:text-primary-900 transition-colors">
                <Filter className="w-5 h-5" />
             </button>
             <button className="flex items-center gap-2 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-primary-900/20">
                <Download className="w-4 h-4" /> Export PDF
             </button>
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Assets</p>
            <p className="text-3xl font-black text-slate-800 tracking-tight">KSh 185.5M</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 inline-flex px-2 py-1 rounded-md">
               Liquidity Ratio: 1.8
            </div>
         </div>
         <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Liabilities</p>
            <p className="text-3xl font-black text-slate-800 tracking-tight">KSh 65.2M</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 inline-flex px-2 py-1 rounded-md">
               Debt-to-Equity: 0.54
            </div>
         </div>
         <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Equity</p>
            <p className="text-3xl font-black text-primary-900 tracking-tight">KSh 120.3M</p>
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 inline-flex px-2 py-1 rounded-md">
               Matches Assets - Liabilities
            </div>
         </div>
      </div>

      {/* Dual Column Layout for Balance Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* ASSETS COLUMN */}
         <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200/80 bg-slate-50/50">
               <h3 className="text-lg font-black text-slate-800 tracking-tight">Assets</h3>
            </div>
            
            <div className="flex-1 p-6 space-y-6">
               
               {/* Current Assets */}
               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">Current Assets</h4>
                  <div className="space-y-3 text-sm">
                     <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-600">Cash & Equivalents</span>
                        <span className="font-bold text-slate-800">42,500,000</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-600">Accounts Receivable</span>
                        <span className="font-bold text-slate-800">18,200,000</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-600">Inventory (Supplies)</span>
                        <span className="font-bold text-slate-800">4,100,000</span>
                     </div>
                     <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <span className="font-black text-slate-800">Total Current Assets</span>
                        <span className="font-black text-slate-800">64,800,000</span>
                     </div>
                  </div>
               </div>

               {/* Fixed Assets */}
               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">Fixed Assets</h4>
                  <div className="space-y-3 text-sm">
                     <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-600">Property & Buildings</span>
                        <span className="font-bold text-slate-800">95,000,000</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-600">Vehicles (Buses)</span>
                        <span className="font-bold text-slate-800">22,500,000</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-600">Equipment & Furniture</span>
                        <span className="font-bold text-slate-800">14,200,000</span>
                     </div>
                     <div className="flex justify-between items-center text-rose-600">
                        <span className="font-medium">Accumulated Depreciation</span>
                        <span className="font-bold">(11,000,000)</span>
                     </div>
                     <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <span className="font-black text-slate-800">Total Fixed Assets</span>
                        <span className="font-black text-slate-800">120,700,000</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-slate-200/80 bg-primary-50/50 flex justify-between items-center">
               <span className="text-lg font-black text-primary-900 uppercase tracking-wider">Total Assets</span>
               <span className="text-xl font-black text-primary-900 border-double border-b-4 border-primary-900 pb-1">185,500,000</span>
            </div>
         </div>

         {/* LIABILITIES & EQUITY COLUMN */}
         <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200/80 bg-slate-50/50">
               <h3 className="text-lg font-black text-slate-800 tracking-tight">Liabilities & Equity</h3>
            </div>
            
            <div className="flex-1 p-6 space-y-6">
               
               {/* Current Liabilities */}
               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">Current Liabilities</h4>
                  <div className="space-y-3 text-sm">
                     <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-600">Accounts Payable</span>
                        <span className="font-bold text-slate-800">12,400,000</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-600">Accrued Expenses (Payroll)</span>
                        <span className="font-bold text-slate-800">18,500,000</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-600">Short-term Debt</span>
                        <span className="font-bold text-slate-800">5,000,000</span>
                     </div>
                     <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <span className="font-black text-slate-800">Total Current Liabilities</span>
                        <span className="font-black text-slate-800">35,900,000</span>
                     </div>
                  </div>
               </div>

               {/* Long-Term Liabilities */}
               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">Long-Term Liabilities</h4>
                  <div className="space-y-3 text-sm">
                     <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-600">Long-Term Loans</span>
                        <span className="font-bold text-slate-800">29,300,000</span>
                     </div>
                     <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <span className="font-black text-slate-800">Total Long-Term Liabilities</span>
                        <span className="font-black text-slate-800">29,300,000</span>
                     </div>
                  </div>
               </div>

               {/* Equity */}
               <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-3">Equity</h4>
                  <div className="space-y-3 text-sm">
                     <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-600">Retained Earnings</span>
                        <span className="font-bold text-slate-800">107,900,000</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-600">Net Income (Current YTD)</span>
                        <span className="font-bold text-slate-800">12,400,000</span>
                     </div>
                     <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <span className="font-black text-slate-800">Total Equity</span>
                        <span className="font-black text-slate-800">120,300,000</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-6 border-t border-slate-200/80 bg-primary-50/50 flex justify-between items-center">
               <span className="text-lg font-black text-primary-900 uppercase tracking-wider">Total L & E</span>
               <span className="text-xl font-black text-primary-900 border-double border-b-4 border-primary-900 pb-1">185,500,000</span>
            </div>
         </div>

      </div>

    </div>
  );
}
