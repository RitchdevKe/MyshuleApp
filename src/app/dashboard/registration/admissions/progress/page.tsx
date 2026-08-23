'use client';

import React, { useState, useEffect } from "react";
import {
  Search, Plus, ChevronLeft, ChevronRight,
  TrendingUp, TrendingDown, GraduationCap, CheckCircle2,
  Clock, Edit2, Trash2, X
} from "lucide-react";
import { getStudentProgress } from "@/app/actions/progress";

const statusConfig: Record<string, { pill: string; icon: React.ElementType }> = {
  Promoted: { pill: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  Pending:  { pill: "bg-amber-50 text-amber-700 border-amber-200",       icon: Clock },
  Repeat:   { pill: "bg-rose-50 text-rose-700 border-rose-200",          icon: TrendingDown },
};

const gradeColor = (avg: string) => {
  if (avg.startsWith("A")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (avg.startsWith("B")) return "bg-sky-50 text-sky-700 border-sky-200";
  if (avg.startsWith("C")) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
};

export default function ProgressPage() {
  const [search, setSearch]     = useState("");
  const [statusF, setStatusF]   = useState("All");
  const [term, setTerm]         = useState("All");
  const [progressData, setProgressData] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<Record<string, unknown> | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    from: "",
    to: "",
    score: 0,
    avg: "C",
    status: "Pending",
    term: "Term 1"
  });

  useEffect(() => {
    getStudentProgress().then(res => {
      if (res.success) {
        const mapped = res.data.map((s: Record<string, unknown>) => {
          const report = (s.reportCards as unknown[])?.[0] as Record<string, unknown> | undefined;
          const enrollment = (s.enrollments as unknown[])?.[0] as Record<string, unknown> | undefined;
          let status = "Pending";
          
          if (report) {
            const overallGrade = report.overallGrade as string | undefined;
            if (overallGrade && ["A", "B", "C"].some((g: string) => overallGrade.includes(g))) {
              status = "Promoted";
            } else if (overallGrade && ["D", "E"].some((g: string) => overallGrade.includes(g))) {
              status = "Repeat";
            }
          }

          const studentClass = enrollment?.class as Record<string, unknown> | undefined;
          const exam = report?.exam as Record<string, unknown> | undefined;
          const termObj = exam?.term as Record<string, unknown> | undefined;

          return {
            id: (s.admissionNumber as string) || (s.id as string),
            name: `${s.firstName as string} ${s.lastName as string}`,
            initials: `${(s.firstName as string)?.[0] || ""}${(s.lastName as string)?.[0] || ""}`.toUpperCase(),
            from: (studentClass?.name as string) || "Unassigned",
            to: status === "Promoted" ? "Next Class" : (status === "Repeat" ? ((studentClass?.name as string) || "Unassigned") : "TBD"),
            avg: (report?.overallGrade as string) || "N/A",
            score: typeof report?.averageScore === 'number' ? Math.round(report.averageScore) : 0,
            status,
            term: (termObj?.name as string) || "No exams yet"
          };
        });
        setProgressData(mapped);
      }
      setLoading(false);
    });
  }, []);

  const handleOpenModal = (record?: Record<string, unknown>) => {
    if (record) {
      setCurrentRecord(record);
      setFormData({
        name: record.name as string,
        id: record.id as string,
        from: record.from as string,
        to: record.to as string,
        score: record.score as number,
        avg: record.avg as string,
        status: record.status as string,
        term: record.term as string
      });
    } else {
      setCurrentRecord(null);
      setFormData({
        name: "",
        id: `STU-${Math.floor(Math.random() * 10000)}`,
        from: "",
        to: "",
        score: 0,
        avg: "C",
        status: "Pending",
        term: "Term 1"
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return;

    const initials = formData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    if (currentRecord) {
      // Update
      setProgressData(prev => prev.map(r => r.id === currentRecord.id ? { ...r, ...formData, initials } : r));
    } else {
      // Add
      setProgressData(prev => [{ ...formData, initials }, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this progress record?")) {
      setProgressData(prev => prev.filter(r => r.id !== id));
    }
  };

  const filtered = progressData.filter(r => {
    const matchSearch = !search || (r.name as string).toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusF === "All" || r.status === statusF;
    const matchTerm = term === "All" || r.term === term;
    return matchSearch && matchStatus && matchTerm;
  });

  const counts = {
    Promoted: progressData.filter(r => r.status === "Promoted").length,
    Pending:  progressData.filter(r => r.status === "Pending").length,
    Repeat:   progressData.filter(r => r.status === "Repeat").length,
  };

  const terms = ["All", ...Array.from(new Set(progressData.map(r => r.term as string)))];

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Promoted Students", value: counts.Promoted, icon: TrendingUp,   color: "from-emerald-500 to-teal-600" },
          { label: "Pending Reviews",   value: counts.Pending,  icon: Clock,         color: "from-amber-500 to-orange-500" },
          { label: "Repeating Class",   value: counts.Repeat,   icon: TrendingDown, color: "from-rose-500 to-red-600" },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-4 text-white shadow-md flex items-center gap-3 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 z-10">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="z-10">
                <p className="text-white/80 text-xs font-black uppercase tracking-wider">{c.label}</p>
                <p className="text-2xl font-black mt-0.5 leading-none">{c.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 bg-white/80 flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white w-72 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={term}
              onChange={e => setTerm(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {terms.map(t => <option key={t as string} value={t as string}>{t as string}</option>)}
            </select>

            <select
              value={statusF}
              onChange={e => setStatusF(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {["All", "Promoted", "Pending", "Repeat"].map(st => <option key={st} value={st}>{st === "All" ? "All Statuses" : st}</option>)}
            </select>

            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Record
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm font-bold">Loading...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Grade</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Score / Avg</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Decision</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Grade</th>
                  <th className="px-5 py-4 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(r => {
                  const cfg = statusConfig[r.status] || statusConfig['Pending'];
                  const Icon = cfg.icon;
                  const gColor = gradeColor(r.avg);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-black shadow-sm bg-primary-600 flex-shrink-0`}>
                            {r.initials}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-800 leading-tight">{r.name}</p>
                            <p className="text-[10px] font-bold text-slate-400">{r.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                          {r.from}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-end gap-1">
                            <span className="text-lg font-black text-slate-800 leading-none">{r.score}</span>
                            <span className="text-[10px] font-bold text-slate-400 mb-0.5">/100</span>
                          </div>
                          {r.avg !== "N/A" && (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${gColor}`}>
                              {r.avg}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-black ${cfg.pill}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                          {r.to}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenModal(r)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-500 text-sm font-bold">
                      No progress records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">
                {currentRecord ? "Edit Progress Record" : "Add Progress Record"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Student Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Current Grade</label>
                  <input
                    type="text"
                    value={formData.from}
                    onChange={e => setFormData({ ...formData, from: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Grade 10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Next Grade</label>
                  <input
                    type="text"
                    value={formData.to}
                    onChange={e => setFormData({ ...formData, to: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Grade 11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Score (0-100)</label>
                  <input
                    type="number"
                    value={formData.score}
                    onChange={e => setFormData({ ...formData, score: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Average Grade</label>
                  <select
                    value={formData.avg}
                    onChange={e => setFormData({ ...formData, avg: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Decision</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Promoted">Promoted</option>
                    <option value="Pending">Pending</option>
                    <option value="Repeat">Repeat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Term</label>
                  <input
                    type="text"
                    value={formData.term}
                    onChange={e => setFormData({ ...formData, term: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Term 1"
                  />
                </div>
              </div>

            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name}
                className="px-4 py-2 text-sm font-bold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
