"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, MoreHorizontal, CheckCircle2, TrendingUp, Users, Activity, BarChart3, Edit2, Trash2, X } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getStudentsAndSubjects } from "./actions";

export type AchievementLevel = "Exceeding Expectation" | "Meeting Expectation" | "Approaching Expectation" | "Below Expectation";

export interface CbcRecord {
  id: string;
  studentId: string;
  name: string;
  strand: string;
  subStrand: string;
  indicator: string;
  level: AchievementLevel;
  date: string;
}

const initialMockData: CbcRecord[] = [
  { id: "1", studentId: "STD-001", name: "John Kamau", strand: "Mathematics", subStrand: "Fractions", indicator: "Identifies fractions correctly", level: "Exceeding Expectation", date: "2026-08-01" },
  { id: "2", studentId: "STD-002", name: "Mary Wanjiku", strand: "Language", subStrand: "Reading", indicator: "Reads simple words fluently", level: "Meeting Expectation", date: "2026-08-02" },
  { id: "3", studentId: "STD-003", name: "David Ochieng", strand: "Environment", subStrand: "Weather", indicator: "Identifies weather symbols", level: "Approaching Expectation", date: "2026-08-03" },
  { id: "4", studentId: "STD-004", name: "Sarah Mutiso", strand: "Mathematics", subStrand: "Addition", indicator: "Adds 2-digit numbers", level: "Exceeding Expectation", date: "2026-08-05" },
];

export default function CbcPage() {
  const [cbcData, setCbcData] = useState<CbcRecord[]>(initialMockData);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CbcRecord>>({});

  useEffect(() => {
    async function load() {
      const res = await getStudentsAndSubjects();
      if (res.success) {
        setStudents(res.students || []);
        setSubjects(res.subjects || []);
      }
    }
    load();
  }, []);

  const getLevelStyle = (level: string) => {
    switch (level) {
      case "Exceeding Expectation": return "bg-emerald-100/80 text-emerald-700 border-emerald-200";
      case "Meeting Expectation": return "bg-blue-100/80 text-blue-700 border-blue-200";
      case "Approaching Expectation": return "bg-amber-100/80 text-amber-700 border-amber-200";
      case "Below Expectation": return "bg-rose-100/80 text-rose-700 border-rose-200";
      default: return "bg-slate-100/80 text-slate-700 border-slate-200";
    }
  };

  const handleOpenModal = (record?: CbcRecord) => {
    if (record) {
      setEditingId(record.id);
      setFormData(record);
    } else {
      setEditingId(null);
      setFormData({ level: "Meeting Expectation", date: new Date().toISOString().split('T')[0] });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setCbcData(cbcData.filter(d => d.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.strand) return;

    const student = students.find(s => s.id === formData.studentId);
    const subject = subjects.find(s => s.name === formData.strand);
    const nameToSave = student ? `${student.firstName} ${student.lastName}` : formData.name || "Unknown";

    if (editingId) {
      setCbcData(cbcData.map(d => d.id === editingId ? { ...d, ...formData, name: nameToSave } as CbcRecord : d));
    } else {
      const newRecord: CbcRecord = {
        id: Math.random().toString(36).substring(7),
        studentId: formData.studentId,
        name: nameToSave,
        strand: formData.strand || "",
        subStrand: formData.subStrand || "",
        indicator: formData.indicator || "",
        level: (formData.level as AchievementLevel) || "Meeting Expectation",
        date: formData.date || new Date().toISOString().split('T')[0],
      };
      setCbcData([newRecord, ...cbcData]);
    }
    setIsModalOpen(false);
  };

  const totalAssessments = cbcData.length;
  const exceedingCount = cbcData.filter(d => d.level === "Exceeding Expectation").length;
  const meetingCount = cbcData.filter(d => d.level === "Meeting Expectation").length;
  const approachingCount = cbcData.filter(d => d.level === "Approaching Expectation").length;
  const belowCount = cbcData.filter(d => d.level === "Below Expectation").length;

  const exceedingPct = totalAssessments ? Math.round((exceedingCount / totalAssessments) * 100) : 0;
  const meetingPct = totalAssessments ? Math.round((meetingCount / totalAssessments) * 100) : 0;
  const approachingPct = totalAssessments ? Math.round((approachingCount / totalAssessments) * 100) : 0;
  const belowPct = totalAssessments ? Math.round((belowCount / totalAssessments) * 100) : 0;

  const chartData = [
    { name: 'Exceeding', value: exceedingPct, color: '#10b981' },
    { name: 'Meeting', value: meetingPct, color: '#3b82f6' },
    { name: 'Approaching', value: approachingPct, color: '#f59e0b' },
    { name: 'Below', value: belowPct, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-primary-900 to-primary-800 p-6 rounded-3xl border border-primary-800 shadow-lg text-white relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/10">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <p className="text-primary-100 font-bold mb-1 relative z-10">Total Assessments</p>
          <h3 className="text-3xl font-black tracking-tight relative z-10">{totalAssessments}</h3>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-1.5 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5" /> Exceeding
            </span>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Exceeding Expectation</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">{exceedingPct}%</h3>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Meeting Expectation</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">{meetingPct}%</h3>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Requires Attention</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10">{approachingPct + belowPct}%</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Table Area */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[400px]">
          {/* Toolbar */}
          <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search students..." 
                className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <select className="px-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                <option>Grade 4 North</option>
                <option>Grade 4 South</option>
              </select>
              <button 
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> Record
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200/60 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Strand</th>
                  <th className="px-6 py-4">Achievement Level</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60">
                {cbcData.map((row) => (
                  <tr key={row.id} className="hover:bg-white/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{row.name}</span>
                        <span className="text-xs font-bold text-slate-400">{row.studentId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{row.strand}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{row.subStrand}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${getLevelStyle(row.level)}`}>
                        {row.level === "Exceeding Expectation" && <CheckCircle2 className="w-3 h-3" />}
                        {row.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(row)} className="p-1.5 text-slate-400 hover:text-primary-900 hover:bg-slate-100 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(row.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {cbcData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No assessment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-lg p-6 flex flex-col h-[400px] lg:h-auto">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Cohort Dist.</h3>
              <p className="text-xs font-bold text-slate-400 mt-1">Overall Achievement Levels</p>
            </div>
          </div>
          <div className="flex-1 w-full h-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} width={80} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 800 }}
                  formatter={(value: any) => [`${value}%`, 'Percentage']}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Modal for Record Addition/Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit Assessment" : "Record Assessment"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Student</label>
                <select
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  value={formData.studentId || ""}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                >
                  <option value="">Select a student...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Strand (Subject)</label>
                <select
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  value={formData.strand || ""}
                  onChange={(e) => setFormData({ ...formData, strand: e.target.value })}
                >
                  <option value="">Select a strand...</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Sub-strand</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Fractions"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  value={formData.subStrand || ""}
                  onChange={(e) => setFormData({ ...formData, subStrand: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Achievement Level</label>
                <select
                  required
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  value={formData.level || "Meeting Expectation"}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value as AchievementLevel })}
                >
                  <option value="Exceeding Expectation">Exceeding Expectation</option>
                  <option value="Meeting Expectation">Meeting Expectation</option>
                  <option value="Approaching Expectation">Approaching Expectation</option>
                  <option value="Below Expectation">Below Expectation</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-colors"
                >
                  {editingId ? "Update Record" : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}