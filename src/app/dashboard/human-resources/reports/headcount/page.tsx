"use client";

import React, { useEffect, useState } from "react";
import { Users, UserPlus, Heart, Briefcase, Filter, Download } from "lucide-react";
import { getHeadcountData } from "./actions";

export default function HeadcountPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof getHeadcountData>> | null>(null);

  useEffect(() => {
    getHeadcountData().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500 font-medium">
        Loading headcount data...
      </div>
    );
  }

  const { totalEmployees, maleCount, femaleCount, avgTenure, newHiresYTD, departments, ageDistribution } = data;

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-4 print:bg-white print:p-6 print:text-black">
      <div className="flex justify-between items-center mb-2 print:hidden">
         <h2 className="text-lg font-black text-slate-800">Headcount & Demographics Overview</h2>
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
               <Filter className="w-4 h-4" />
               Filter Period
            </button>
            <button 
               onClick={handleExportPDF}
               className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
            >
               <Download className="w-4 h-4" />
               Export PDF
            </button>
         </div>
      </div>
      
      <div className="hidden print:block text-2xl font-black mb-6 border-b pb-4">
        Headcount & Demographics Report
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 print:grid-cols-4 print:gap-4">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group print:border-slate-300 print:shadow-none">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform print:hidden"></div>
          <div className="relative z-10">
             <div className="p-2.5 bg-primary-100 text-primary-600 rounded-xl inline-block mb-4 print:border print:border-primary-200 print:bg-transparent">
                <Users className="w-5 h-5 print:text-black" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 print:text-slate-600">Total Employees</p>
             <p className="text-4xl font-black text-slate-800 print:text-black">{totalEmployees}</p>
             <p className="text-xs font-bold text-emerald-600 mt-2 flex items-center gap-1 print:text-black">Active Staff</p>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group print:border-slate-300 print:shadow-none">
          <div className="absolute right-0 top-0 w-24 h-24 bg-rose-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform print:hidden"></div>
          <div className="relative z-10">
             <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl inline-block mb-4 print:border print:border-rose-200 print:bg-transparent">
                <Heart className="w-5 h-5 print:text-black" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 print:text-slate-600">Gender Ratio (M/F)</p>
             <p className="text-4xl font-black text-slate-800 print:text-black">
                {maleCount}<span className="text-2xl text-slate-400 print:text-slate-600">/{femaleCount}</span>
             </p>
             <p className="text-xs font-bold text-slate-500 mt-2 print:text-black">Active demographics</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group print:border-slate-300 print:shadow-none">
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform print:hidden"></div>
          <div className="relative z-10">
             <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl inline-block mb-4 print:border print:border-amber-200 print:bg-transparent">
                <Briefcase className="w-5 h-5 print:text-black" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 print:text-slate-600">Average Tenure</p>
             <p className="text-4xl font-black text-slate-800 print:text-black">{avgTenure} <span className="text-lg text-slate-500 print:text-slate-600">yrs</span></p>
             <p className="text-xs font-bold text-emerald-600 mt-2 print:text-black">From hire date</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center relative overflow-hidden group print:border-slate-300 print:shadow-none">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full opacity-50 group-hover:scale-110 transition-transform print:hidden"></div>
          <div className="relative z-10">
             <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl inline-block mb-4 print:border print:border-emerald-200 print:bg-transparent">
                <UserPlus className="w-5 h-5 print:text-black" />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 print:text-slate-600">New Hires YTD</p>
             <p className="text-4xl font-black text-slate-800 print:text-black">{newHiresYTD}</p>
             <p className="text-xs font-bold text-slate-500 mt-2 print:text-black">Hired this year</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4 print:break-inside-avoid">
         {/* Headcount by Department */}
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm print:border-slate-300 print:shadow-none">
            <h3 className="text-lg font-black text-slate-800 mb-6 print:text-black">Headcount by Department</h3>
            <div className="space-y-5">
               {departments.map((dept, index) => (
                  <div key={index}>
                     <div className="flex justify-between items-end mb-2">
                        <span className="text-sm font-bold text-slate-700 print:text-black">{dept.name}</span>
                        <div className="text-right">
                           <span className="text-sm font-black text-slate-800 print:text-black">{dept.count}</span>
                           <span className="text-xs font-medium text-slate-400 ml-2 print:text-slate-600">({dept.percent}%)</span>
                        </div>
                     </div>
                     <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden print:bg-slate-200 print:border print:border-slate-300">
                        <div className={`h-full rounded-full ${dept.color} print:bg-slate-500`} style={{ width: `${dept.percent}%` }}></div>
                     </div>
                  </div>
               ))}
               {departments.length === 0 && (
                 <div className="text-sm text-slate-500 italic">No department data available.</div>
               )}
            </div>
         </div>

         {/* Age Distribution (CSS visualization) */}
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col print:border-slate-300 print:shadow-none print:break-inside-avoid">
            <h3 className="text-lg font-black text-slate-800 mb-6 print:text-black">Age Distribution</h3>
            <div className="flex-grow flex items-end justify-between gap-2 h-48 mt-4 border-b-2 border-slate-100 pb-2 print:border-slate-300">
               {ageDistribution.map((bar, i) => (
                  <div key={i} className="flex flex-col items-center justify-end w-full h-full group relative">
                     <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-800 text-white text-xs font-bold py-1 px-2 rounded transition-opacity whitespace-nowrap z-10 print:hidden">
                        {bar.count} employees
                     </div>
                     <div 
                        className="w-full max-w-[40px] bg-primary-200 hover:bg-primary-500 rounded-t-lg transition-all duration-300 print:bg-slate-300 print:border-x print:border-t print:border-slate-400"
                        style={{ height: `${bar.heightPercent}%` }}
                     >
                        <div className="hidden print:block text-center text-xs -mt-4 text-black font-bold">{bar.count > 0 ? bar.count : ''}</div>
                     </div>
                     <span className="text-[10px] font-bold text-slate-500 mt-2 print:text-black">{bar.range}</span>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
