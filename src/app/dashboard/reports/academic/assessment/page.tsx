"use client";

import React, { useState } from "react";
import {
  Printer, Download, ChevronDown, Search, Star,
  TrendingUp, TrendingDown, Minus, Award, BookOpen
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────
const SUBJECTS = ["Math", "English", "Kiswahili", "Science", "SST", "CRE", "Creative Arts"];
const MAX_MARKS = 100;

interface StudentMark {
  admNo: string;
  name: string;
  gender: "M" | "F";
  scores: number[];           // one per subject
  prevTotal: number;          // previous term total for trend
  comment?: string;
}

const STUDENTS: StudentMark[] = [
  { admNo: "2026-G4-001", name: "Mercy Wanjiru",    gender: "F", scores: [88, 76, 72, 84, 78, 90, 85], prevTotal: 558 },
  { admNo: "2026-G4-002", name: "Kevin Kiprop",      gender: "M", scores: [92, 88, 80, 90, 86, 78, 82], prevTotal: 590 },
  { admNo: "2026-G4-003", name: "Esther Achieng",    gender: "F", scores: [65, 70, 68, 60, 72, 74, 66], prevTotal: 480 },
  { admNo: "2026-G4-004", name: "Brian Mutua",       gender: "M", scores: [78, 82, 75, 80, 70, 68, 74], prevTotal: 530 },
  { admNo: "2026-G4-005", name: "Faith Njeri",        gender: "F", scores: [95, 91, 88, 93, 90, 96, 92], prevTotal: 630 },
  { admNo: "2026-G4-006", name: "Dennis Omondi",     gender: "M", scores: [55, 60, 58, 52, 65, 62, 57], prevTotal: 410 },
  { admNo: "2026-G4-007", name: "Joy Wangari",        gender: "F", scores: [82, 79, 77, 81, 76, 80, 78], prevTotal: 545 },
  { admNo: "2026-G4-008", name: "Samuel Kimani",     gender: "M", scores: [70, 66, 72, 68, 74, 70, 68], prevTotal: 490 },
];

const GRADES = ["Grade 1","Grade 2","Grade 3","Grade 4","Grade 5","Grade 6","Grade 7"];
const TERMS  = ["Term 1 – 2026","Term 2 – 2026","Term 3 – 2026"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function total(scores: number[]) { return scores.reduce((a, b) => a + b, 0); }
function mean(scores: number[])  { return (total(scores) / scores.length).toFixed(1); }
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

// Rank students by total (desc)
function rank(students: StudentMark[]): (StudentMark & { rank: number; total: number; avg: number })[] {
  return students
    .map(s => ({ ...s, total: total(s.scores), avg: parseFloat(mean(s.scores)) }))
    .sort((a, b) => b.total - a.total)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MarksheetPage() {
  const [selectedGrade, setSelectedGrade] = useState("Grade 4");
  const [selectedTerm,  setSelectedTerm]  = useState("Term 1 – 2026");
  const [search,        setSearch]        = useState("");

  const ranked = rank(STUDENTS).filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.admNo.toLowerCase().includes(search.toLowerCase())
  );

  const classAvg = (STUDENTS.reduce((sum, s) => sum + parseFloat(mean(s.scores)), 0) / STUDENTS.length).toFixed(1);
  const highest  = Math.max(...ranked.map(s => s.total));
  const lowest   = Math.min(...ranked.map(s => s.total));

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-white/50">Academic Reports</p>
            <h1 className="text-2xl font-black mt-0.5">Marksheet</h1>
            <p className="text-sm text-white/60 mt-1">Individual student subject scores, totals, rank &amp; auto-generated remarks</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-black bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-black bg-secondary-500 hover:bg-secondary-400 rounded-xl transition-colors shadow-md">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: "Grade", value: selectedGrade, setter: setSelectedGrade, options: GRADES },
            { label: "Term",  value: selectedTerm,  setter: setSelectedTerm,  options: TERMS  },
          ].map(f => (
            <div key={f.label} className="relative">
              <select
                value={f.value}
                onChange={e => f.setter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 text-xs font-black bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-secondary-400 transition-all"
              >
                {f.options.map(o => <option key={o} value={o} className="text-slate-800">{o}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/60 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Students",    value: ranked.length,                  icon: BookOpen,    color: "text-primary-700 bg-primary-50 border-primary-100" },
          { label: "Class Avg",   value: `${classAvg}%`,                 icon: Star,        color: "text-secondary-700 bg-secondary-50 border-secondary-100" },
          { label: "Highest",     value: `${highest} / ${SUBJECTS.length * MAX_MARKS}`, icon: TrendingUp,  color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
          { label: "Lowest",      value: `${lowest} / ${SUBJECTS.length * MAX_MARKS}`,  icon: TrendingDown, color: "text-rose-700 bg-rose-50 border-rose-100" },
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
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search student…"
              className="w-full pl-9 pr-4 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
            />
          </div>
          <p className="text-xs font-bold text-slate-400 ml-auto">{ranked.length} students · {selectedGrade} · {selectedTerm}</p>
        </div>

        {/* Scrollable table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider sticky left-0 bg-primary-900 z-10 w-8">#</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider sticky left-8 bg-primary-900 z-10 min-w-[180px]">Student</th>
                {SUBJECTS.map(s => (
                  <th key={s} className="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-center min-w-[70px]">{s}</th>
                ))}
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-center bg-primary-800">Total</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-center bg-primary-800">Avg</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-center bg-primary-800">Grade</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-center bg-primary-800">Trend</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider min-w-[220px] bg-primary-800">Remarks</th>
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
                  <tr key={s.admNo} className={`hover:bg-primary-50/30 transition-colors ${idx === 0 ? "bg-amber-50/60" : ""}`}>
                    {/* Rank */}
                    <td className="px-4 py-3 sticky left-0 bg-white group-hover:bg-primary-50/30 z-10">
                      {idx === 0 ? (
                        <Award className="w-4 h-4 text-amber-500" />
                      ) : (
                        <span className="text-xs font-black text-slate-400">{s.rank}</span>
                      )}
                    </td>
                    {/* Student */}
                    <td className="px-4 py-3 sticky left-8 bg-white z-10">
                      <p className="font-black text-slate-800 text-sm">{s.name}</p>
                      <p className="text-[10px] font-black text-primary-500">{s.admNo}</p>
                    </td>
                    {/* Subject scores */}
                    {s.scores.map((sc, si) => {
                      const pct = sc / MAX_MARKS;
                      const color = pct >= 0.8 ? "text-emerald-700" : pct >= 0.6 ? "text-sky-700" : pct >= 0.5 ? "text-amber-700" : "text-rose-700";
                      return (
                        <td key={si} className={`px-3 py-3 text-center text-sm font-black ${color}`}>{sc}</td>
                      );
                    })}
                    {/* Total */}
                    <td className="px-4 py-3 text-center font-black text-slate-800">{s.total}</td>
                    {/* Avg */}
                    <td className="px-4 py-3 text-center font-black text-slate-600">{avg}</td>
                    {/* Grade */}
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${gc}`}>{g}</span>
                    </td>
                    {/* Trend */}
                    <td className="px-4 py-3 text-center">
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
                    <td className="px-4 py-3 text-xs font-bold text-slate-500 italic">{comment}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold">
            {selectedGrade} · {selectedTerm} · Class Teacher: <span className="text-slate-600">J.M. Waweru</span>
          </span>
          <span className="font-black text-primary-800">MyShule Academic Reports</span>
        </div>
      </div>
    </div>
  );
}
