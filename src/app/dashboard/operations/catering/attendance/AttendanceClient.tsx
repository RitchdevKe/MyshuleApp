"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, QrCode, Plus, CheckCircle2, XCircle, X, Trash2, Edit } from "lucide-react";
import { createMealAttendance, updateMealAttendance, deleteMealAttendance } from "./actions";

interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  mealType: string;
  date: string;
  status: string;
  scanned: boolean;
}

interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  grade: string;
}

export default function AttendanceClient({ initialAttendances, initialStudents }: { initialAttendances: Attendance[]; initialStudents: Student[] }) {
  const [attendances, setAttendances] = useState(initialAttendances);
  const [search, setSearch] = useState("");
  const [mealFilter, setMealFilter] = useState("LUNCH");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setAttendances(initialAttendances); }, [initialAttendances]);

  const [form, setForm] = useState({ studentId: "", mealType: "LUNCH", date: "", status: "PRESENT", scanned: false });

  const openCreate = () => {
    setEditing(null);
    setForm({ studentId: "", mealType: mealFilter, date: new Date().toISOString().slice(0, 10), status: "PRESENT", scanned: false });
    setShowModal(true);
  };

  const openEdit = (a: Attendance) => {
    setEditing(a);
    setForm({ studentId: a.studentId, mealType: a.mealType, date: a.date.slice(0, 10), status: a.status, scanned: a.scanned });
    setShowModal(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editing) {
        await updateMealAttendance(editing.id, form);
        setAttendances(prev => prev.map(a => a.id === editing.id ? { ...a, ...form } : a));
      } else {
        if (!form.studentId) return;
        await createMealAttendance(form);
        const student = initialStudents.find(s => s.id === form.studentId);
        setAttendances(prev => [{ id: `temp-${Date.now()}`, studentId: form.studentId, studentName: student?.name || "", grade: student?.grade || "", mealType: form.mealType, date: form.date, status: form.status, scanned: form.scanned }, ...prev]);
      }
      setShowModal(false);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    await deleteMealAttendance(id);
    setAttendances(prev => prev.filter(a => a.id !== id));
  };

  const filtered = attendances.filter(a => {
    const matchSearch = !search || a.studentName.toLowerCase().includes(search.toLowerCase());
    const matchMeal = mealFilter === "ALL" || a.mealType === mealFilter;
    return matchSearch && matchMeal;
  });

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hidden md:block"><Users className="w-6 h-6" /></div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Meal Attendance</h2>
              <p className="text-sm font-medium text-slate-500">Track students served during meals.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-sm transition-all shadow-sm">
              <QrCode className="w-4 h-4" /> Scan IDs
            </button>
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" /> Add Record
            </button>
          </div>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
          </div>
          <select value={mealFilter} onChange={e => setMealFilter(e.target.value)} className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
            <option value="ALL">All Meals</option>
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="DINNER">Dinner</option>
            <option value="SNACK">Snack</option>
          </select>
        </div>

        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Meal</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="py-12 text-center text-slate-400 text-sm">No attendance records found.</td></tr>
                )}
                {filtered.map(record => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800 text-sm block mb-1">{record.studentName}</span>
                      <span className="text-[10px] font-medium text-slate-500">{record.grade}</span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-700 text-sm">{record.mealType}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">
                      {new Date(record.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {record.scanned && <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold">Scanned</span>}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${record.status === "PRESENT" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                        {record.status === "PRESENT" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(record)} className="text-sm font-bold text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-primary-100 flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>
                        <button onClick={() => handleDelete(record.id)} className="text-sm font-bold text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-800">{editing ? "Edit Record" : "Add Attendance"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              {!editing && (
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Student *</label>
                  <select value={form.studentId} onChange={e => setForm(p => ({ ...p, studentId: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                    <option value="">Select student...</option>
                    {initialStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.admissionNumber})</option>)}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Meal *</label>
                  <select value={form.mealType} onChange={e => setForm(p => ({ ...p, mealType: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                    <option value="BREAKFAST">Breakfast</option>
                    <option value="LUNCH">Lunch</option>
                    <option value="DINNER">Dinner</option>
                    <option value="SNACK">Snack</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Date *</label>
                  <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                  </select>
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={form.scanned} onChange={e => setForm(p => ({ ...p, scanned: e.target.checked }))} className="w-4 h-4 rounded border-slate-300 text-primary-900 focus:ring-primary-900" />
                    Scanned ID
                  </label>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              <button onClick={handleSave} disabled={loading} className="px-4 py-2 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl disabled:opacity-50">{loading ? "Saving..." : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
