"use client";

import React, { useState, useEffect } from "react";
import { Heart, Search, Plus, Calendar, Clock, Activity, CornerUpLeft, CheckCircle2, X, Trash2, Edit } from "lucide-react";
import { createClinicVisit, updateClinicVisit, deleteClinicVisit } from "./actions";

interface Visit {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  visitDate: string;
  reason: string;
  diagnosis: string | null;
  treatment: string | null;
  handledBy: string | null;
  status: string;
}

interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  grade: string;
}

export default function VisitsClient({ initialVisits, initialStudents }: { initialVisits: Visit[]; initialStudents: Student[] }) {
  const [visits, setVisits] = useState(initialVisits);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setVisits(initialVisits); }, [initialVisits]);

  const [form, setForm] = useState({ studentId: "", visitDate: "", reason: "", diagnosis: "", treatment: "", handledBy: "", status: "PENDING" });

  const openCreate = () => {
    setEditing(null);
    setForm({ studentId: "", visitDate: new Date().toISOString().slice(0, 16), reason: "", diagnosis: "", treatment: "", handledBy: "", status: "PENDING" });
    setShowModal(true);
  };

  const openEdit = (v: Visit) => {
    setEditing(v);
    setForm({ studentId: v.studentId, visitDate: v.visitDate.slice(0, 16), reason: v.reason, diagnosis: v.diagnosis || "", treatment: v.treatment || "", handledBy: v.handledBy || "", status: v.status });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.reason) return;
    setLoading(true);
    try {
      if (editing) {
        await updateClinicVisit(editing.id, form);
        setVisits(prev => prev.map(v => v.id === editing.id ? { ...v, ...form, studentName: v.studentName, grade: v.grade } : v));
      } else {
        if (!form.studentId) return;
        await createClinicVisit(form);
        const student = initialStudents.find(s => s.id === form.studentId);
        setVisits(prev => [{ id: `temp-${Date.now()}`, studentId: form.studentId, studentName: student?.name || "", grade: student?.grade || "", visitDate: form.visitDate, reason: form.reason, diagnosis: form.diagnosis || null, treatment: form.treatment || null, handledBy: form.handledBy || null, status: form.status }, ...prev]);
      }
      setShowModal(false);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this visit?")) return;
    await deleteClinicVisit(id);
    setVisits(prev => prev.filter(v => v.id !== id));
  };

  const filtered = visits.filter(v => {
    const matchSearch = !search || v.studentName.toLowerCase().includes(search.toLowerCase()) || v.reason.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      COMPLETED: "bg-emerald-50 text-emerald-600",
      PENDING: "bg-amber-50 text-amber-600",
      REFERRED: "bg-rose-50 text-rose-600",
    };
    return map[status] || "bg-slate-50 text-slate-600";
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl hidden md:block"><Heart className="w-6 h-6" /></div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Clinic Visits Log</h2>
              <p className="text-sm font-medium text-slate-500">Track daily student visits, symptoms, and administered treatments.</p>
            </div>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
            <Plus className="w-4 h-4" /> Log New Visit
          </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by Student Name or Symptom..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
            <option value="All">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="REFERRED">Referred</option>
          </select>
        </div>

        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Visit Info</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Symptom & Treatment</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="py-12 text-center text-slate-400 text-sm">No visits found.</td></tr>
                )}
                {filtered.map(visit => (
                  <tr key={visit.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800 text-sm block mb-1">{visit.studentName}</span>
                      <span className="text-[10px] font-medium text-slate-500">{visit.grade}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(visit.visitDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-0.5">
                        <Clock className="w-3.5 h-3.5" /> {new Date(visit.visitDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-700 text-sm mb-0.5">Symptom: <span className="text-primary-700">{visit.reason}</span></p>
                      {visit.treatment && <p className="text-xs text-slate-500 line-clamp-1">Rx: {visit.treatment}</p>}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${statusBadge(visit.status)}`}>
                        {visit.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {visit.status === 'PENDING' && <Activity className="w-3.5 h-3.5" />}
                        {visit.status === 'REFERRED' && <CornerUpLeft className="w-3.5 h-3.5" />}
                        {visit.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(visit)} className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-primary-100 flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>
                        <button onClick={() => handleDelete(visit.id)} className="text-sm font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
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
              <h3 className="text-lg font-black text-slate-800">{editing ? "Edit Visit" : "Log New Visit"}</h3>
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
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">Visit Date</label>
                <input type="datetime-local" value={form.visitDate} onChange={e => setForm(p => ({ ...p, visitDate: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">Reason / Symptom *</label>
                <input type="text" value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="e.g. Headache, Stomach Pain" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Diagnosis</label>
                  <input type="text" value={form.diagnosis} onChange={e => setForm(p => ({ ...p, diagnosis: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Treatment</label>
                  <input type="text" value={form.treatment} onChange={e => setForm(p => ({ ...p, treatment: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Handled By</label>
                  <input type="text" value={form.handledBy} onChange={e => setForm(p => ({ ...p, handledBy: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="Nurse / Doctor name" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                    <option value="PENDING">Pending</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="REFERRED">Referred</option>
                  </select>
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
