"use client";

import React from "react";
import { PieChart, TrendingUp, AlertTriangle, ArrowRight, DownloadCloud, ChevronDown } from "lucide-react";

export default function BudgetOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Filters and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">FY 2026/2027 Overview</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">High-level view of institution-wide budget utilization.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative">
             <select className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                <option>Financial Year 26/27</option>
                <option>Financial Year 25/26</option>
             </select>
             <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button className="p-2 bg-white border border-slate-200/60 rounded-xl shadow-sm text-slate-500 hover:text-primary-900 transition-colors">
            <DownloadCloud className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* Total Budget */}
         <div className="bg-gradient-to-br from-primary-900 to-primary-800 p-6 rounded-3xl border border-primary-700 shadow-lg shadow-primary-900/20 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-110 transition-transform duration-500">
               <PieChart className="w-32 h-32" />
            </div>
            <div className="relative z-10">
               <div className="w-10 h-10 bg-primary-800 text-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <PieChart className="w-5 h-5" />
               </div>
               <p className="text-xs font-bold text-primary-200 uppercase tracking-wider mb-1">Approved Budget</p>
               <p className="text-3xl font-black text-white tracking-tight">KSh 150M</p>
               <p className="text-xs font-bold text-primary-300 mt-2 flex items-center gap-1">
                  Across 8 Departments
               </p>
            </div>
         </div>

         {/* Spent to Date */}
         <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
               <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-5 h-5" />
               </div>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Utilized</p>
               <div className="flex items-end gap-2">
                  <p className="text-3xl font-black text-slate-800 tracking-tight">KSh 45M</p>
                  <p className="text-sm font-bold text-slate-400 mb-1">(30%)</p>
               </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-4">
               <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-2 text-right">On track for Q1</p>
         </div>

         {/* Over Budget Alert */}
         <div className="bg-rose-50/80 backdrop-blur-lg p-6 rounded-3xl border border-rose-100 shadow-sm flex flex-col justify-between cursor-pointer hover:border-rose-200 transition-colors">
            <div>
               <div className="w-10 h-10 bg-rose-200/50 text-rose-700 rounded-xl flex items-center justify-center mb-4">
                  <AlertTriangle className="w-5 h-5" />
               </div>
               <p className="text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">Over-Utilized</p>
               <p className="text-3xl font-black text-rose-900 tracking-tight">2 <span className="text-sm font-medium text-rose-700">Departments</span></p>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-rose-700 mt-4 group">
               Review variances <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Chart Mockup Area */}
         <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
               <div>
                  <h3 className="font-bold text-slate-800">Budget vs Actuals by Quarter</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1">Cumulative utilization trend</p>
               </div>
               <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-300"></div> Budget</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary-600"></div> Actual</div>
               </div>
            </div>
            
            {/* CSS Mockup Chart */}
            <div className="flex-1 border-b border-l border-slate-200 relative pt-4 pl-4 flex items-end justify-between px-6 pb-2">
               {/* Y-Axis Grid Lines */}
               <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="w-full h-px bg-slate-100"></div>
                  <div className="w-full h-px bg-slate-100"></div>
                  <div className="w-full h-px bg-slate-100"></div>
                  <div className="w-full h-px bg-slate-100"></div>
                  <div className="w-full h-px bg-slate-200"></div> {/* Baseline */}
               </div>

               {/* Bars */}
               {[
                  { actual: 30, budget: 40, label: "Q1" },
                  { actual: 65, budget: 80, label: "Q2 (Proj)" },
                  { actual: 0, budget: 115, label: "Q3" },
                  { actual: 0, budget: 150, label: "Q4" },
               ].map((data, idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center gap-2 w-20">
                     <div className="flex items-end gap-1 h-48 w-full justify-center group cursor-pointer">
                        {/* Budget Bar */}
                        <div className="w-6 bg-slate-200 rounded-t-md transition-all group-hover:bg-slate-300" style={{ height: `${(data.budget/150)*100}%` }}></div>
                        {/* Actual Bar */}
                        {data.actual > 0 && (
                           <div className="w-6 bg-primary-600 rounded-t-md transition-all group-hover:bg-primary-500 shadow-md" style={{ height: `${(data.actual/150)*100}%` }}></div>
                        )}
                     </div>
                     <span className="text-xs font-bold text-slate-500 mt-2">{data.label}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Quick Breakdown */}
         <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col h-[400px]">
            <h3 className="font-bold text-slate-800 mb-6">Top Spending Departments</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 hide-scrollbar">
               {[
                  { name: "Academic Resources", spent: "18.5M", budget: "40.0M", pct: 46, status: "normal" },
                  { name: "Administration", spent: "12.0M", budget: "35.0M", pct: 34, status: "normal" },
                  { name: "Infrastructure", spent: "9.2M", budget: "10.0M", pct: 92, status: "warning" },
                  { name: "Transport", spent: "5.3M", budget: "15.0M", pct: 35, status: "normal" },
               ].map((dept, idx) => (
                  <div key={idx}>
                     <div className="flex justify-between items-end mb-2">
                        <div>
                           <p className="text-sm font-bold text-slate-700">{dept.name}</p>
                           <p className={`text-[10px] font-bold uppercase tracking-wider ${dept.status === 'warning' ? 'text-amber-600' : 'text-slate-500'}`}>
                              {dept.pct}% Utilized
                           </p>
                        </div>
                        <p className="text-sm font-black text-slate-800">{dept.spent} <span className="text-xs font-semibold text-slate-400">/ {dept.budget}</span></p>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${dept.status === 'warning' ? 'bg-amber-500' : 'bg-primary-500'}`} style={{ width: `${dept.pct}%` }}></div>
                     </div>
                  </div>
               ))}
            </div>
            <button className="w-full mt-4 py-2.5 text-sm font-bold text-primary-900 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors">
               View All Departments
            </button>
         </div>

      </div>
    </div>
  );
}
