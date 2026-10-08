"use client";

import React, { useState, useTransition, useCallback } from "react";
import {
  Printer, Download, ChevronDown, Search, Star,
  TrendingUp, TrendingDown, Award, BookOpen
} from "lucide-react";
import type { AssessmentData, FilterOptions } from "./actions";

// ── Helpers ───────────────────────────────────────────────────────────────────
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
function scoreColor(score: number, max: number) {
  const pct = score / max;
  if (pct >= 0.8) return "text-emerald-700";
  if (pct >= 0.6) return "text-sky-700";
  if (pct >= 0.5) return "text-amber-700";
  return "text-rose-700";
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  initialData: AssessmentData;
  filterOptions: FilterOptions;
  onFilter: (filters: { classId?: string; termId?: string }) => Promise<AssessmentData>;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MarksheetClient({ initialData, filterOptions, onFilter }: Props) {
  const [data, setData] = useState<AssessmentData>(initialData);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedTermId, setSelectedTermId] = useState("");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  const applyFilter = useCallback(
    (classId: string, termId: string) => {
      startTransition(async () => {
        const filters: { classId?: string; termId?: string } = {};
        if (classId) filters.classId = classId;
        if (termId) filters.termId = termId;
        const result = await onFilter(filters);
        setData(result);
      });
    },
    [onFilter]
  );

  const handleClassChange = (val: string) => {
    setSelectedClassId(val);
    applyFilter(val, selectedTermId);
  };
  const handleTermChange = (val: string) => {
    setSelectedTermId(val);
    applyFilter(selectedClassId, val);
  };

  // Client-side search filtering
  const students = data.students.filter(
    (s) =>
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admNo.toLowerCase().includes(search.toLowerCase())
  );

  // Stats computed from real data
  const totalStudents = students.length;
  const maxPerSubject = data.maxMarks;
  const maxTotal = data.subjects.length * maxPerSubject;
  const classAvg =
    totalStudents > 0
      ? (students.reduce((sum, s) => sum + s.avg, 0) / totalStudents).toFixed(1)
      : "0";
  const highest = totalStudents > 0 ? Math.max(...students.map((s) => s.total)) : 0;
  const lowest = totalStudents > 0 ? Math.min(...students.map((s) => s.total)) : 0;

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 rounded-2xl p-5 text-white shadow-lg print:shadow-none print:rounded-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-white/50">Academic Reports</p>
            <h1 className="text-2xl font-black mt-0.5">Marksheet</h1>
            <p className="text-sm text-white/60 mt-1">Individual student subject scores, totals, rank &amp; auto-generated remarks</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 print:hidden">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-black bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-black bg-secondary-500 hover:bg-secondary-400 rounded-xl transition-colors shadow-md"
            >
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-2 print:hidden">
          {/* Class Filter */}
          <div className="relative">
            <select
              value={selectedClassId}
              onChange={(e) => handleClassChange(e.target.value)}
              disabled={isPending}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-black bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-secondary-400 transition-all disabled:opacity-50"
            >
              <option value="" className="text-slate-800">All Classes</option>
              {filterOptions.classes.map((c) => (
                <option key={c.id} value={c.id} className="text-slate-800">{c.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/60 pointer-events-none" />
          </div>
          {/* Term Filter */}
          <div className="relative">
            <select
              value={selectedTermId}
              onChange={(e) => handleTermChange(e.target.value)}
              disabled={isPending}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-black bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-secondary-400 transition-all disabled:opacity-50"
            >
              <option value="" className="text-slate-800">All Terms</option>
              {filterOptions.terms.map((t) => (
                <option key={t.id} value={t.id} className="text-slate-800">
                  {t.name} – {t.academicYearName}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/60 pointer-events-none" />
          </div>
          {isPending && (
            <span className="text-xs text-white/60 self-center animate-pulse">Loading…</span>
          )}
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Students",  value: totalStudents,                          icon: BookOpen,    color: "text-primary-700 bg-primary-50 border-primary-100" },
          { label: "Class Avg", value: `${classAvg}%`,                         icon: Star,        color: "text-secondary-700 bg-secondary-50 border-secondary-100" },
          { label: "Highest",   value: maxTotal > 0 ? `${highest} / ${maxTotal}` : "—", icon: TrendingUp,  color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
          { label: "Lowest",    value: maxTotal > 0 ? `${lowest} / ${maxTotal}`  : "—", icon: TrendingDown, color: "text-rose-700 bg-rose-50 border-rose-100" },
        ].map((s) => {
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
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden print:shadow-none print:border-0">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 print:hidden">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student…"
              className="w-full pl-9 pr-4 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
            />
          </div>
          <p className="text-xs font-bold text-slate-400 ml-auto">
            {students.length} students · {data.className} · {data.termName}
          </p>
        </div>

        {/* Scrollable table */}
        <div className="overflow-x-auto">
          {students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <BookOpen className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm font-bold">No exam results found</p>
              <p className="text-xs mt-1">Try adjusting the class or term filters.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider sticky left-0 bg-primary-900 z-10 w-8">#</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider sticky left-8 bg-primary-900 z-10 min-w-[180px]">Student</th>
                  {data.subjects.map((s) => (
                    <th key={s} className="px-3 py-3 text-[10px] font-black uppercase tracking-wider text-center min-w-[70px]">{s}</th>
                  ))}
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-center bg-primary-800">Total</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-center bg-primary-800">Avg</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-center bg-primary-800">Grade</th>
                  <th className="px-4 py-3 text-[10px] font-black uppercase tracking-wider min-w-[220px] bg-primary-800">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((s, idx) => {
                  const g = grade(s.avg);
                  const gc = gradeColor(g);
                  const comment = autoComment(s.avg);
                  return (
                    <tr key={s.admNo} className={`hover:bg-primary-50/30 transition-colors ${idx === 0 ? "bg-amber-50/60" : ""}`}>
                      {/* Rank */}
                      <td className="px-4 py-3 sticky left-0 bg-white z-10">
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
                      {s.scores.map((sc, si) => (
                        <td
                          key={si}
                          className={`px-3 py-3 text-center text-sm font-black ${sc.score !== null ? scoreColor(sc.score, maxPerSubject) : "text-slate-300"}`}
                        >
                          {sc.score !== null ? sc.score : "—"}
                        </td>
                      ))}
                      {/* Total */}
                      <td className="px-4 py-3 text-center font-black text-slate-800">{s.total}</td>
                      {/* Avg */}
                      <td className="px-4 py-3 text-center font-black text-slate-600">{s.avg}</td>
                      {/* Grade */}
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${gc}`}>{g}</span>
                      </td>
                      {/* Remarks */}
                      <td className="px-4 py-3 text-xs font-bold text-slate-500 italic">{comment}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-400">
          <span className="font-bold">
            {data.className} · {data.termName}
          </span>
          <span className="font-black text-primary-800">MyShule Academic Reports</span>
        </div>
      </div>
    </div>
  );
}
