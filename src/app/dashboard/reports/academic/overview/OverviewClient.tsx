"use client";

import React from "react";
import { BarChart2, TrendingUp, TrendingDown, Users, BookOpen, Printer, Download } from "lucide-react";
import { applyFilter } from "./actions";

type OverviewData = {
  overallAverage: string;
  passRate: string;
  studentsImproved: string;
  studentsDeclining: string;
  outstanding: number;
  atRisk: number;
  trendData: { name: string; average: string }[];
  topSubjects: { name: string; average: string }[];
  totalStudents: number;
  attendanceRate: string;
};

export default function OverviewClient({ initialData }: { initialData: OverviewData }) {
  const handlePrint = () => {
    window.print();
  };

  const handleFilter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await applyFilter(formData);
    alert("Filters applied!"); // Simple feedback for demo
  };

  return (
    <div className="p-6 space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/50 p-4 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleFilter} className="flex flex-wrap gap-2 items-center">
          <select name="term" className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 bg-white">
            <option value="all">All Terms</option>
            <option value="term1">Term 1</option>
            <option value="term2">Term 2</option>
          </select>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition">
            Apply Filters
          </button>
        </form>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-4 rounded-2xl shadow-sm text-center">
           <div className="text-3xl font-black text-indigo-600 mb-1">{initialData.overallAverage}%</div>
           <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Overall Average</div>
         </div>
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-4 rounded-2xl shadow-sm text-center">
           <div className="text-3xl font-black text-emerald-600 mb-1">{initialData.passRate}%</div>
           <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Pass Rate</div>
         </div>
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-4 rounded-2xl shadow-sm text-center flex flex-col justify-center items-center">
           <div className="text-3xl font-black text-emerald-500 mb-1 flex items-center gap-1"><TrendingUp className="w-5 h-5"/> {initialData.studentsImproved}%</div>
           <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Students Improved</div>
         </div>
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 p-4 rounded-2xl shadow-sm text-center flex flex-col justify-center items-center">
           <div className="text-3xl font-black text-amber-500 mb-1 flex items-center gap-1"><TrendingDown className="w-5 h-5"/> {initialData.studentsDeclining}%</div>
           <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Students Declining</div>
         </div>
         <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl shadow-sm text-center">
           <div className="text-3xl font-black text-indigo-700 mb-1">{initialData.outstanding}</div>
           <div className="text-[10px] font-black uppercase tracking-wider text-indigo-500">Outstanding (Top)</div>
         </div>
         <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl shadow-sm text-center">
           <div className="text-3xl font-black text-rose-700 mb-1">{initialData.atRisk}</div>
           <div className="text-[10px] font-black uppercase tracking-wider text-rose-500">At-Risk Students</div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* School-wide Trend */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 shadow-sm">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
             <BarChart2 className="w-4 h-4 text-indigo-500" /> School-Wide Performance Trend
           </h3>
           <div className="h-48 flex items-end gap-4 relative border-b border-slate-200 pb-4">
              <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-[10px] font-bold text-slate-400">
                 <span>100%</span>
                 <span>75%</span>
                 <span>50%</span>
                 <span>25%</span>
              </div>
              <div className="ml-10 flex-1 flex justify-between h-full items-end gap-2">
                 {initialData.trendData.map((val, i) => (
                    <div key={i} className="flex-1 flex justify-center items-end h-full group relative">
                       <div className="absolute -top-8 bg-slate-800 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {val.average}%
                       </div>
                       <div className={`w-full max-w-[60px] rounded-t-sm transition-colors ${i === initialData.trendData.length - 1 ? 'bg-indigo-500' : 'bg-slate-300 group-hover:bg-indigo-300'}`} style={{ height: `${val.average}%` }}></div>
                    </div>
                 ))}
                 {initialData.trendData.length === 0 && (
                   <div className="w-full text-center text-sm text-slate-400 self-center">No trend data available.</div>
                 )}
              </div>
           </div>
           <div className="ml-10 flex justify-between mt-4">
              {initialData.trendData.map((term, i) => (
                 <div key={i} className={`text-[10px] font-bold text-center flex-1 ${i === initialData.trendData.length - 1 ? 'text-indigo-600' : 'text-slate-500'}`}>{term.name}</div>
              ))}
           </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-center space-y-6 shadow-sm">
           <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
             <BookOpen className="w-4 h-4 text-emerald-500" /> Top Subjects
           </h3>
           <div className="space-y-4">
              {initialData.topSubjects.map((subject, idx) => (
                <div key={idx}>
                   <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>{subject.name}</span>
                      <span>{subject.average}%</span>
                   </div>
                   <div className="w-full bg-slate-200 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${subject.average}%` }}></div></div>
                </div>
              ))}
              {initialData.topSubjects.length === 0 && (
                <div className="text-sm text-slate-400 text-center">No subject data available.</div>
              )}
           </div>

           <div className="mt-6 pt-4 border-t border-slate-200 space-y-4">
              <div>
                 <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Total Active Students</span>
                    <span>{initialData.totalStudents}</span>
                 </div>
              </div>
              <div>
                 <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Average Attendance</span>
                    <span>{initialData.attendanceRate}%</span>
                 </div>
                 <div className="w-full bg-slate-200 rounded-full h-2"><div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${initialData.attendanceRate}%` }}></div></div>
              </div>
           </div>
        </div>
      </div>

      {/* Drilldown Concept Example */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
           <Users className="w-4 h-4 text-indigo-500" /> Interactive Drill-down: Grade Performance
        </h3>
        <p className="text-sm text-slate-500 mb-6">Select a grade to drill down into class, subject, and student level performance metrics.</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">8</div>
              <div>
                <div className="font-bold text-slate-800 group-hover:text-indigo-700">Grade 8</div>
                <div className="text-xs text-slate-500 mt-0.5">240 Students • 4 Streams</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="font-black text-lg text-emerald-600">72.4%</div>
                <div className="text-[10px] uppercase font-bold text-emerald-600/70">+1.2% from last term</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-indigo-100 group-hover:border-indigo-200 transition-colors">
                <BarChart2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">7</div>
              <div>
                <div className="font-bold text-slate-800 group-hover:text-indigo-700">Grade 7</div>
                <div className="text-xs text-slate-500 mt-0.5">235 Students • 4 Streams</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="font-black text-lg text-slate-800">68.1%</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Steady</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-indigo-100 group-hover:border-indigo-200 transition-colors">
                <BarChart2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-rose-50/30 border border-rose-100 rounded-xl hover:border-rose-300 hover:shadow-md cursor-pointer transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-black">9</div>
              <div>
                <div className="font-bold text-slate-800 group-hover:text-rose-700">Grade 9</div>
                <div className="text-xs text-slate-500 mt-0.5">180 Students • 3 Streams</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="font-black text-lg text-rose-600">61.5%</div>
                <div className="text-[10px] uppercase font-bold text-rose-600/70">-4.1% from last term</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-rose-100 group-hover:border-rose-200 transition-colors">
                <BarChart2 className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
