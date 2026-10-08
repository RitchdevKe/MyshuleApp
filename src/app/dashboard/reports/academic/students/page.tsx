"use client";

import React, { useState, useEffect } from "react";
import {
  Printer, Download, ChevronDown, Award, BarChart2,
  TrendingUp, Users, Search
} from "lucide-react";
import { getClasses, getTerms, getStudentsReport } from "./actions";

// ── Helpers ───────────────────────────────────────────────────────────────────
const total = (s: number[]) => s.reduce((a, b) => a + b, 0);
const avg   = (s: number[]) => s.length ? (total(s) / s.length).toFixed(1) : "0.0";
const grade = (a: number) => a >= 80 ? "A" : a >= 70 ? "B" : a >= 60 ? "C" : a >= 50 ? "D" : "E";
const scoreColor = (v: number, max = 100) => {
  const p = v / max;
  return p >= 0.8 ? "bg-emerald-50 text-emerald-700" : p >= 0.6 ? "bg-sky-50 text-sky-700" : p >= 0.5 ? "bg-amber-50 text-amber-700" : "bg-rose-50 text-rose-600";
};
const gradeColor = (g: string) =>
  ({ A: "bg-emerald-100 text-emerald-700", B: "bg-sky-100 text-sky-700",
     C: "bg-amber-100 text-amber-700",     D: "bg-orange-100 text-orange-700",
     E: "bg-rose-100 text-rose-600" }[g] ?? "");

function subjectStats(rows: any[], si: number) {
  const scores = rows.map(r => r.scores[si] || 0);
  if (scores.length === 0) return { max: 0, min: 0, avg: "0.0" };
  return { max: Math.max(...scores), min: Math.min(...scores), avg: (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1) };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function BroadsheetPage() {
  const [classes, setClasses] = useState<string[]>([]);
  const [terms, setTerms] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial filters
  useEffect(() => {
    async function loadFilters() {
      try {
        const [cls, trms] = await Promise.all([getClasses(), getTerms()]);
        
        // Add defaults if DB is empty
        const finalCls = cls.length > 0 ? cls : ["Grade 4 East", "Grade 4 West"];
        const finalTrms = trms.length > 0 ? trms : ["Term 1 – 2026", "Term 2 – 2026", "Term 3 – 2026"];
        
        setClasses(finalCls);
        setTerms(finalTrms);
        if (finalCls.length > 0) setSelectedClass(finalCls[0]);
        if (finalTrms.length > 0) setSelectedTerm(finalTrms[0]);
      } catch (error) {
        console.error("Failed to load filters", error);
      }
    }
    loadFilters();
  }, []);

  // Fetch report data when filters change
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { data, subjects: subj } = await getStudentsReport(selectedClass, selectedTerm);
        // If data is empty, maybe provide some mock data for UI demo purposes if DB is empty?
        // Let's stick to real DB data even if empty.
        setStudents(data);
        setSubjects(subj);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    }
    
    // Always fetch, but only if selectedClass and selectedTerm are defined
    if (selectedClass !== "" || selectedTerm !== "") {
      loadData();
    }
  }, [selectedClass, selectedTerm]);

  const raw = students;

  // Rank + filter
  const ranked = raw
    .map(s => ({ ...s, total: total(s.scores), avg: parseFloat(avg(s.scores)) }))
    .sort((a, b) => b.total - a.total)
    .map((s, i) => ({ ...s, rank: i + 1 }))
    .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.admNo.toLowerCase().includes(search.toLowerCase()));

  const classAvg = raw.length > 0 ? (raw.reduce((sum, s) => sum + parseFloat(avg(s.scores)), 0) / raw.length).toFixed(1) : "0.0";
  const passes   = raw.filter(s => parseFloat(avg(s.scores)) >= 50).length;
  const girls    = raw.filter(s => s.gender === "F").length;
  const boys     = raw.filter(s => s.gender === "M").length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 print:p-0 print:m-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-violet-700 rounded-2xl p-5 text-white shadow-lg print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-white/50">Academic Reports</p>
            <h1 className="text-2xl font-black mt-0.5">Broadsheet</h1>
            <p className="text-sm text-white/60 mt-1">Full-class performance grid — all students × all subjects for a term</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-2 text-xs font-black bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-2 text-xs font-black bg-white text-indigo-700 hover:bg-white/90 rounded-xl transition-colors shadow-md">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: "Class",   value: selectedClass, setter: setSelectedClass, options: classes },
            { label: "Term",    value: selectedTerm,  setter: setSelectedTerm,  options: terms },
          ].map(f => (
            <div key={f.label} className="relative">
              <select
                value={f.value}
                onChange={e => f.setter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-xs font-black bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              >
                {f.options.map(o => <option key={o} value={o} className="text-slate-800">{o}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/60 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
        {[
          { label: "Total Students", value: raw.length,  color: "text-indigo-700 bg-indigo-50 border-indigo-100", icon: Users },
          { label: "Class Avg %",   value: classAvg,    color: "text-violet-700 bg-violet-50 border-violet-100", icon: BarChart2 },
          { label: "Passes (≥50%)", value: `${passes} / ${raw.length}`, color: "text-emerald-700 bg-emerald-50 border-emerald-100", icon: TrendingUp },
          { label: "G ♀ / B ♂",    value: `${girls} / ${boys}`,        color: "text-sky-700 bg-sky-50 border-sky-100",             icon: Award },
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden print:border-none print:shadow-none print:rounded-none">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 print:hidden">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search student…"
              className="w-full pl-9 pr-4 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>
          <p className="text-xs font-bold text-slate-400 ml-auto">{ranked.length} of {raw.length} students · {selectedClass} · {selectedTerm}</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm font-bold">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm print:text-xs">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-700 to-violet-700 text-white print:bg-slate-200 print:text-slate-800">
                  <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider sticky left-0 bg-indigo-700 print:bg-slate-200 z-10 w-8">#</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider sticky left-8 bg-indigo-700 print:bg-slate-200 z-10 min-w-[180px]">Student</th>
                  <th className="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-center w-6">G</th>
                  {subjects.map(s => (
                    <th key={s} className="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-center min-w-[64px]">{s}</th>
                  ))}
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-center bg-indigo-800 print:bg-slate-300 min-w-[60px]">Total</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-center bg-indigo-800 print:bg-slate-300 min-w-[50px]">Avg</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-center bg-indigo-800 print:bg-slate-300 min-w-[50px]">Grd</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-center bg-indigo-800 print:bg-slate-300 min-w-[50px]">Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ranked.length === 0 ? (
                  <tr>
                    <td colSpan={8 + subjects.length} className="px-4 py-8 text-center text-slate-400 font-bold text-sm">
                      No students found for this class and term.
                    </td>
                  </tr>
                ) : (
                  ranked.map((s, idx) => {
                    const g  = grade(s.avg);
                    const gc = gradeColor(g);
                    return (
                      <tr key={s.admNo} className={`hover:bg-indigo-50/20 transition-colors ${idx === 0 ? "bg-amber-50/40" : ""}`}>
                        <td className="px-3 py-2.5 sticky left-0 bg-white z-10">
                          {idx === 0 ? <Award className="w-4 h-4 text-amber-500" /> : <span className="text-xs font-black text-slate-300">{s.rank}</span>}
                        </td>
                        <td className="px-4 py-2.5 sticky left-8 bg-white z-10">
                          <p className="font-black text-slate-800 text-xs">{s.name}</p>
                          <p className="text-[10px] font-black text-indigo-400 print:text-slate-500">{s.admNo}</p>
                        </td>
                        <td className="px-3 py-2.5 text-center text-[10px] font-black text-slate-400">{s.gender}</td>
                        {s.scores.map((sc: number, si: number) => (
                          <td key={si} className={`px-3 py-2.5 text-center text-xs font-black rounded-sm print:bg-transparent ${scoreColor(sc)}`}>{sc}</td>
                        ))}
                        <td className="px-4 py-2.5 text-center font-black text-slate-800 text-sm">{s.total}</td>
                        <td className="px-4 py-2.5 text-center font-black text-slate-600 text-sm">{s.avg}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black print:bg-transparent print:text-slate-800 ${gc}`}>{g}</span>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`text-xs font-black ${idx === 0 ? "text-amber-500" : "text-slate-400"}`}>{s.rank}</span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* Subject averages footer row */}
              {ranked.length > 0 && (
                <tfoot>
                  <tr className="bg-slate-50 border-t-2 border-slate-200">
                    <td colSpan={3} className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-slate-500 sticky left-0 bg-slate-50 z-10">Subject Avg</td>
                    {subjects.map((_, si) => {
                      const st = subjectStats(raw, si);
                      return (
                        <td key={si} className="px-3 py-3 text-center">
                          <p className="text-xs font-black text-indigo-700 print:text-slate-800">{st.avg}</p>
                          <p className="text-[9px] text-emerald-600 print:text-slate-600">↑{st.max}</p>
                          <p className="text-[9px] text-rose-500 print:text-slate-600">↓{st.min}</p>
                        </td>
                      );
                    })}
                    <td colSpan={4} />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}

        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold">{selectedClass} · {selectedTerm}</span>
          <span className="font-black text-indigo-700 print:text-slate-800">MyShule Academic Reports</span>
        </div>
      </div>
    </div>
  );
}
