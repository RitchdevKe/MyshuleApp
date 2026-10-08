"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, Search, Plus, Calendar, MessageSquare, AlertCircle, CheckCircle2, X, Trash2, Edit } from "lucide-react";
import { createWelfareSession, updateWelfareSession, deleteWelfareSession } from "./actions";

interface Session {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  sessionDate: string;
  counselor: string;
  category: string;
  notes: string | null;
  status: string;
}

interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  grade: string;
}

export default function WelfareClient({ initialSessions, initialStudents }: { initialSessions: Session[]; initialStudents: Student[] }) {
  const [sessions, setSessions] = useState(initialSessions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setSessions(initialSessions); }, [initialSessions]);

  const [form, setForm] = useState({ studentId: "", sessionDate: "", counselor: "", category: "ACADEMIC", notes: "", status: "OPEN" });

  const openCreate = () => {
    setEditing(null);
    setForm({ studentId: "", sessionDate: new Date().toISOString().slice(0, 16), counselor: "", category: "ACADEMIC", notes: "", status: "OPEN" });
    setShowModal(true);
  };

  const openEdit = (s: Session) => {
    setEditing(s);
    setForm({ studentId: s.studentId, sessionDate: s.sessionDate.slice(0, 16), counselor: s.counselor, category: s.category, notes: s.notes || "", status: s.status });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.counselor || !form.category) return;
    setLoading(true);
    try {
      if (editing) {
        await updateWelfareSession(editing.id, form);
        setSessions(prev => prev.map(s => s.id === editing.id ? { ...s, ...form, notes: form.notes || null, studentName: s.studentName, grade: s.grade } : s));
      } else {
        if (!form.studentId) return;
        await createWelfareSession(form);
        const student = initialStudents.find(s => s.id === form.studentId);
        setSessions(prev => [{ id: `temp-${Date.now()}`, studentId: form.studentId, studentName: student?.name || "", grade: student?.grade || "", sessionDate: form.sessionDate, counselor: form.counselor, category: form.category, notes: form.notes || null, status: form.status }, ...prev]);
      }
      setShowModal(false);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this session?")) return;
    await deleteWelfareSession(id);
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const filtered = sessions.filter(s => {
    const matchSearch = !search || s.studentName.toLowerCase().includes(search.toLowerCase()) || s.counselor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      OPEN: "bg-indigo-50 text-indigo-600",
      RESOLVED: "bg-emerald-50 text-emerald-600",
      REFERRED: "bg-amber-50 text-amber-600",
    };
    return map[status] || "bg-slate-50 text-slate-600";
  };

  const categoryBadge = (cat: string) => {
    const map: Record<string, string> = {
      ACADEMIC: "bg-blue-50 text-blue-700 border-blue-200",
      BEHAVIORAL: "bg-amber-50 text-amber-700 border-amber-200",
      PERSONAL: "bg-rose-50 text-rose-700 border-rose-200",
    };
    return map[cat] || "bg-slate-50 text-slate-700 border-slate-200";
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hidden md:block"><ShieldAlert className="w-6 h-6" /></div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Student Welfare & Counseling</h2>
              <p className="text-sm font-medium text-slate-500">Track counseling sessions, psychological well-being, and welfare alerts.</p>
            </div>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
            <Plus className="w-4 h-4" /> Log Session
          </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by Student Name or Counselor..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
            <option value="All">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REFERRED">Referred</option>
          </select>
        </div>

        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Case Info</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Counselor & Date</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="py-12 text-center text-slate-400 text-sm">No welfare sessions found.</td></tr>
                )}
                {filtered.map(session => (
                  <tr key={session.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800 text-sm block mb-1">{session.studentName}</span>
                      <span className="text-[10px] font-medium text-slate-500">{session.grade}</span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-700 text-sm mb-1">{session.counselor}</p>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <Calendar className="w-3.5 h-3.5" /> {new Date(session.sessionDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-md border ${categoryBadge(session.category)}`}>{session.category}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${statusBadge(session.status)}`}>
                        {session.status === 'RESOLVED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {session.status === 'OPEN' && <Search className="w-3.5 h-3.5" />}
                        {session.status === 'REFERRED' && <AlertCircle className="w-3.5 h-3.5" />}
                        {session.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(session)} className="text-sm font-bold text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-primary-100 flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>
                        <button onClick={() => handleDelete(session.id)} className="text-sm font-bold text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
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
              <h3 className="text-lg font-black text-slate-800">{editing ? "Edit Session" : "Log New Session"}</h3>
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
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Counselor *</label>
                  <input type="text" value={form.counselor} onChange={e => setForm(p => ({ ...p, counselor: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="Counselor name" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Category *</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                    <option value="ACADEMIC">Academic</option>
                    <option value="BEHAVIORAL">Behavioral</option>
                    <option value="PERSONAL">Personal</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Session Date</label>
                  <input type="datetime-local" value={form.sessionDate} onChange={e => setForm(p => ({ ...p, sessionDate: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                    <option value="OPEN">Open</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="REFERRED">Referred</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="Session notes..." />
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
