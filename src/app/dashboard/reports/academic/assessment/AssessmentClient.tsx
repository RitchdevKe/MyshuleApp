"use client";

import React, { useState, useEffect } from "react";
import {
  Printer, Download, ChevronDown, Search, Star,
  TrendingUp, TrendingDown, Minus, Award, BookOpen
} from "lucide-react";
import { getAssessmentData, getAssessmentFilterOptions } from "./actions";

type MarksheetData = Awaited<ReturnType<typeof getAssessmentData>>;
type FilterOptions = Awaited<ReturnType<typeof getAssessmentFilterOptions>>;

const MAX_MARKS = 100;

function grade(avg: number): string {
  if (avg >= 80) return "A";
  if (avg >= 70) return "B";
  if (avg >= 60) return "C";
  if (avg >= 50) return "D";
  return "E";
}

function autoComment(avg: number): string {
  if (avg >= 90) return "Outstanding performance! Keep setting the benchmark.";
  if (avg >= 80) return "Excellent work — consistent and commendable effort.";
  if (avg >= 70) return "Good performance. There is room for further improvement.";
  if (avg >= 60) return "Satisfactory. Encourage more focus on weaker subjects.";
  if (avg >= 50) return "Below average. Needs dedicated support and extra tuition.";
  return "Poor performance. Immediate intervention is required.";
}

function gradeColor(g: string) {
  return { A: "text-emerald-600 bg-emerald-50", B: "text-sky-600 bg-sky-50",
           C: "text-amber-600 bg-amber-50",     D: "text-orange-600 bg-orange-50",
           E: "text-rose-600 bg-rose-50" }[g] ?? "text-slate-600 bg-slate-50";
}

export default function AssessmentClient() {
  const [data, setData] = useState<MarksheetData | null>(null);
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function init() {
      const [initData, initFilters] = await Promise.all([
        getAssessmentData(),
        getAssessmentFilterOptions()
      ]);
      setData(initData);
      setFilters(initFilters);
      
      // select first by default
      if (initFilters.terms.length > 0) setSelectedTerm(initFilters.terms[0].id);
      if (initFilters.classes.length > 0) setSelectedClass(initFilters.classes[0].id);
      
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (!loading && selectedTerm && selectedClass) {
       getAssessmentData(selectedTerm, selectedClass).then(setData);
    }
  }, [selectedTerm, selectedClass]);

  if (loading || !data || !filters) {
    return <div className="p-6 text-center text-slate-500">Loading marksheet data...</div>;
  }

  const students = data.students;
  const subjects = data.subjects;

  // Rank students by total (desc)
  const ranked = students
    .sort((a, b) => b.total - a.total)
    .map((s, i) => ({ ...s, rank: i + 1 }))
    .filter(s =>
      !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.admNo.toLowerCase().includes(search.toLowerCase())
    );

  const classAvg = ranked.length > 0 ? (ranked.reduce((sum, s) => sum + s.avg, 0) / ranked.length).toFixed(1) : "0.0";
  const highest = ranked.length > 0 ? Math.max(...ranked.map(s => s.total)) : 0;
  const lowest = ranked.length > 0 ? Math.min(...ranked.map(s => s.total)) : 0;

  return (
    <div className="space-y-4 p-6">
      {/* Header card */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 rounded-2xl p-5 text-white shadow-lg print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-white/50">Academic Reports</p>
            <h1 className="text-2xl font-black mt-0.5">Marksheet</h1>
            <p className="text-sm text-white/60 mt-1">Individual student subject scores, totals, rank &amp; auto-generated remarks</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 text-xs font-black bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 text-xs font-black bg-secondary-500 hover:bg-secondary-400 rounded-xl transition-colors shadow-md">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
           <div className="relative">
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-xs font-black bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-secondary-400 transition-all"
              >
                {filters.classes.map(c => <option key={c.id} value={c.id} className="text-slate-800">{c.name}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/60 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={selectedTerm}
                onChange={e => setSelectedTerm(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-xs font-black bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-secondary-400 transition-all"
              >
                {filters.terms.map(t => <option key={t.id} value={t.id} className="text-slate-800">{t.name}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/60 pointer-events-none" />
            </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:hidden">
        {[
          { label: "Students",    value: ranked.length,                  icon: BookOpen,    color: "text-primary-700 bg-primary-50 border-primary-100" },
          { label: "Class Avg",   value: `${classAvg}%`,                 icon: Star,        color: "text-secondary-700 bg-secondary-50 border-secondary-100" },
          { label: "Highest",     value: `${highest} / ${subjects.length * MAX_MARKS}`, icon: TrendingUp,  color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
          { label: "Lowest",      value: `${lowest} / ${subjects.length * MAX_MARKS}`,  icon: TrendingDown, color: "text-rose-700 bg-rose-50 border-rose-100" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`flex items-center gap-3 p-3.5 rounded-xl border ${s.color}`}>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider opacity-60">{s.label}</p>
                <p className="text-lg font-black">{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 print:hidden">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search student…"
              className="w-full pl-9 pr-4 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
            />
          </div>
          <p className="text-xs font-bold text-slate-400 ml-auto">{ranked.length} students</p>
        </div>

        {/* Scrollable table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-primary-900 to-primary-800 text-white print:text-black print:bg-none print:border-b">
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider sticky left-0 bg-primary-900 print:bg-white z-10 w-8">#</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider sticky left-8 bg-primary-900 print:bg-white z-10 min-w-[180px]">Student</th>
                {subjects.map(s => (
                  <th key={s} className="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-center min-w-[70px]">{s}</th>
                ))}
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-center bg-primary-800 print:bg-white">Total</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-center bg-primary-800 print:bg-white">Avg</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-center bg-primary-800 print:bg-white">Grade</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-center bg-primary-800 print:bg-white print:hidden">Trend</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider min-w-[220px] bg-primary-800 print:bg-white">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ranked.map((s, idx) => {
                const avg     = s.avg;
                const g       = grade(avg);
                const diff    = s.total - s.prevTotal;
                const gc      = gradeColor(g);
                const comment = autoComment(avg);
                return (
                  <tr key={s.admNo} className={`hover:bg-primary-50/30 transition-colors ${idx === 0 ? "bg-amber-50/60 print:bg-transparent" : ""}`}>
                    {/* Rank */}
                    <td className="px-4 py-3 sticky left-0 bg-white group-hover:bg-primary-50/30 z-10 print:bg-white">
                      {idx === 0 ? (
                        <Award className="w-4 h-4 text-amber-500 print:hidden" />
                      ) : (
                        <span className="text-xs font-black text-slate-400">{s.rank}</span>
                      )}
                      <span className="hidden print:inline text-xs font-black">{s.rank}</span>
                    </td>
                    {/* Student */}
                    <td className="px-4 py-3 sticky left-8 bg-white z-10 print:bg-white">
                      <p className="font-black text-slate-800 text-sm">{s.name}</p>
                      <p className="text-[10px] font-black text-primary-500 print:text-slate-500">{s.admNo}</p>
                    </td>
                    {/* Subject scores */}
                    {s.scores.map((sc, si) => {
                      const pct = subjects.length > 0 ? sc / MAX_MARKS : 0;
                      const color = pct >= 0.8 ? "text-emerald-700" : pct >= 0.6 ? "text-sky-700" : pct >= 0.5 ? "text-amber-700" : "text-rose-700";
                      return (
                        <td key={si} className={`px-3 py-3 text-center text-sm font-black ${color} print:text-black`}>{sc}</td>
                      );
                    })}
                    {/* Total */}
                    <td className="px-4 py-3 text-center font-black text-slate-800">{s.total}</td>
                    {/* Avg */}
                    <td className="px-4 py-3 text-center font-black text-slate-600">{avg}</td>
                    {/* Grade */}
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${gc} print:bg-transparent print:text-black`}>{g}</span>
                    </td>
                    {/* Trend */}
                    <td className="px-4 py-3 text-center print:hidden">
                      {diff > 0 ? (
                        <span className="flex items-center justify-center gap-1 text-emerald-600 text-xs font-black">
                          <TrendingUp className="w-3.5 h-3.5" />+{diff}
                        </span>
                      ) : diff < 0 ? (
                        <span className="flex items-center justify-center gap-1 text-rose-500 text-xs font-black">
                          <TrendingDown className="w-3.5 h-3.5" />{diff}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1 text-slate-400 text-xs font-black">
                          <Minus className="w-3.5 h-3.5" />0
                        </span>
                      )}
                    </td>
                    {/* Auto-generated remarks */}
                    <td className="px-4 py-3 text-xs font-bold text-slate-500 italic print:text-black">{comment}</td>
                  </tr>
                );
              })}
              {ranked.length === 0 && (
                 <tr>
                    <td colSpan={8 + subjects.length} className="px-4 py-8 text-center text-slate-500 font-bold">
                       No assessment data found for this class and term.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
