"use client";

import React, { useState } from "react";
import { Download, TrendingUp, Users, Vote } from "lucide-react";

export default function ReportsClient({ initialStats }: { initialStats: { totalStudents: number; disciplinaryIncidents: number } }) {
  const [turnoutRange, setTurnoutRange] = useState("3");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("PDF Exported successfully! (Simulated)");
    }, 1000);
  };

  const metrics = [
    { label: "Overall Election Turnout", value: "78%", trend: "+5%", positive: true },
    { label: "Leadership Diversity", value: "45%", trend: "+12%", positive: true },
    { label: "Total Students", value: initialStats.totalStudents?.toString() || "0", trend: "+2%", positive: true },
    { label: "Disciplinary Incidents", value: initialStats.disciplinaryIncidents?.toString() || "0", trend: "-1", positive: true },
  ];

  const turnoutData3 = [60, 65, 78];
  const turnoutData5 = [50, 55, 60, 65, 78];

  const activeTurnoutData = turnoutRange === "3" ? turnoutData3 : turnoutData5;
  const startYear = turnoutRange === "3" ? 2024 : 2022;

  const demographics = [
    { label: "Grade 11", pct: 45, color: "bg-emerald-500" },
    { label: "Grade 10", pct: 35, color: "bg-teal-500" },
    { label: "Grade 9", pct: 20, color: "bg-cyan-500" },
  ];

  return (
    <>
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-black text-slate-800">Leadership Analytics</h2>
          <p className="text-sm text-slate-500 font-medium">Data-driven insights into student leadership performance.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> {isExporting ? "Exporting..." : "Export PDF"}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{metric.label}</div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-black text-slate-800">{metric.value}</div>
              <div className={`text-xs font-bold flex items-center gap-1 ${metric.positive ? 'text-green-600' : 'text-rose-600'}`}>
                 <TrendingUp className="w-3.5 h-3.5" /> {metric.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts / Data Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Election Turnout Trends */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Vote className="w-5 h-5 text-indigo-500" /> Election Turnout Trends
              </h3>
              <select 
                value={turnoutRange}
                onChange={(e) => setTurnoutRange(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow cursor-pointer"
              >
                 <option value="3">Last 3 Years</option>
                 <option value="5">Last 5 Years</option>
              </select>
           </div>
           <div className="h-48 flex items-end justify-between gap-2 px-4">
              {activeTurnoutData.map((h, i) => (
                <div key={i} className="w-full flex flex-col justify-end items-center gap-2 h-full">
                  <div className="w-full bg-indigo-100 rounded-t-lg relative group h-full flex items-end">
                     <div className="w-full bg-indigo-500 rounded-t-lg transition-all duration-500" style={{ height: `${h}%` }}></div>
                     <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded whitespace-nowrap transition-opacity">
                       {h}%
                     </div>
                  </div>
                  <div className="text-xs font-bold text-slate-500">{startYear + i}</div>
                </div>
              ))}
           </div>
        </div>

        {/* Demographics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" /> Grade Representation
              </h3>
           </div>
           <div className="flex-1 flex flex-col justify-center gap-4">
              {demographics.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="text-slate-800">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`${item.color} h-2 rounded-full transition-all duration-1000`} style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </>
  );
}
