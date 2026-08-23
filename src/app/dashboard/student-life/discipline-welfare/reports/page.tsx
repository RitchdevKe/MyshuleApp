"use client";

import React, { useState, useEffect } from "react";
import { Download, Filter, FileText, Calendar, PieChart, Loader2 } from "lucide-react";
import { getIncidentStats } from "./actions";

export default function DisciplineReportsPage() {
  const [reportType, setReportType] = useState("Incident Summary");
  const [dateRange, setDateRange] = useState("Term 1 (Sep - Dec)");
  
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      const data = await getIncidentStats();
      setStats(data);
      setLoading(false);
    }
    loadStats();
  }, [reportType, dateRange]); // re-fetch when filters change (mock)

  const handleExport = () => {
    alert("Exporting PDF...");
  };

  return (
    <div className="p-8 space-y-8 bg-white/30 backdrop-blur-md rounded-3xl min-h-[600px]">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/60 p-6 rounded-3xl border border-white/60 shadow-sm">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Generate Reports</h2>
              <p className="text-xs font-bold text-slate-500">Export discipline and welfare data</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1">Report Type</label>
              <select 
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option>Incident Summary</option>
                <option>Student Welfare Watchlist</option>
                <option>Intervention Efficacy</option>
                <option>Demographic Analysis</option>
              </select>
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 ml-1">Date Range</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  className="w-full pl-9 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option>Term 1 (Sep - Dec)</option>
                  <option>Term 2 (Jan - Apr)</option>
                  <option>Term 3 (May - Jul)</option>
                  <option>Last 30 Days</option>
                  <option>Custom Range...</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-indigo-700 bg-indigo-50 rounded-xl border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-sm">
            <Filter className="w-4 h-4" /> More Filters
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-800">{reportType}</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">{dateRange} • Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
            <PieChart className="w-6 h-6 text-slate-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col justify-center">
                <p className="text-sm font-bold text-slate-500 mb-1">Total Incidents</p>
                <p className="text-3xl font-black text-slate-800">{stats?.total || 0}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col justify-center">
                <p className="text-sm font-bold text-slate-500 mb-1">Resolved</p>
                <p className="text-3xl font-black text-emerald-600">{stats?.resolved || 0}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col justify-center">
                <p className="text-sm font-bold text-slate-500 mb-1">Severe Cases</p>
                <p className="text-3xl font-black text-rose-600">{stats?.severe || 0}</p>
              </div>
            </div>

            <div className="h-64 bg-slate-50 rounded-3xl border border-slate-100 p-6 flex items-end justify-around pb-12 relative overflow-hidden">
              <div className="absolute top-6 left-6 text-sm font-bold text-slate-500">Trend Analysis</div>
              {stats?.trends?.map((val: number, i: number) => {
                const max = Math.max(...(stats.trends || [1]), 1);
                const height = Math.max((val / max) * 100, 10);
                return (
                  <div key={i} className="group relative w-12 flex items-end justify-center h-full">
                    <div 
                      className="w-full bg-indigo-500 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-600" 
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="absolute -top-8 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {val}
                    </div>
                  </div>
                );
              })}
            </div>

            {reportType === "Incident Summary" && stats?.recentIncidents?.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Recent Incidents</h4>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <tr>
                        <th className="px-6 py-4 font-bold">Date</th>
                        <th className="px-6 py-4 font-bold">Student</th>
                        <th className="px-6 py-4 font-bold">Severity</th>
                        <th className="px-6 py-4 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stats.recentIncidents.map((inc: any) => (
                        <tr key={inc.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-medium text-slate-700">
                            {new Date(inc.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-800">
                            {inc.studentName}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                              inc.severity === 'SEVERE' ? 'bg-rose-100 text-rose-700' :
                              inc.severity === 'MODERATE' ? 'bg-amber-100 text-amber-700' :
                              'bg-emerald-100 text-emerald-700'
                            }`}>
                              {inc.severity}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                              inc.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {inc.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {reportType !== "Incident Summary" && (
              <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200">
                <p className="text-slate-500 font-medium">
                  Detailed preview for <span className="font-bold text-slate-700">{reportType}</span> is currently aggregated based on the selected date range.
                  Use the Export button to download the full report.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
