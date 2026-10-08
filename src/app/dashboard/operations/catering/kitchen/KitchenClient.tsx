"use client";

import React, { useState, useEffect } from "react";
import { ChefHat, Plus, Search, Calendar, X, Trash2, Edit, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { createKitchenTask, updateKitchenTask, deleteKitchenTask } from "./actions";

interface Task { id: string; title: string; description: string | null; assignedTo: string | null; dueDate: string; status: string; }

export default function KitchenClient({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setTasks(initialTasks); }, [initialTasks]);

  const [form, setForm] = useState({ title: "", description: "", assignedTo: "", dueDate: "", status: "PENDING" });

  const openCreate = () => { setEditing(null); setForm({ title: "", description: "", assignedTo: "", dueDate: new Date().toISOString().slice(0, 16), status: "PENDING" }); setShowModal(true); };
  const openEdit = (t: Task) => { setEditing(t); setForm({ title: t.title, description: t.description || "", assignedTo: t.assignedTo || "", dueDate: t.dueDate.slice(0, 16), status: t.status }); setShowModal(true); };

  const handleSave = async () => {
    if (!form.title || !form.dueDate) return;
    setLoading(true);
    try {
      if (editing) {
        await updateKitchenTask(editing.id, form);
        setTasks(prev => prev.map(t => t.id === editing.id ? { ...t, ...form, description: form.description || null, assignedTo: form.assignedTo || null } : t));
      } else {
        await createKitchenTask(form);
        setTasks(prev => [...prev, { id: `temp-${Date.now()}`, ...form, description: form.description || null, assignedTo: form.assignedTo || null }]);
      }
      setShowModal(false);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => { if (!confirm("Delete this task?")) return; await deleteKitchenTask(id); setTasks(prev => prev.filter(t => t.id !== id)); };

  const filtered = tasks.filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || (t.assignedTo || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusBadge = (s: string) => ({ PENDING: "bg-amber-50 text-amber-600", IN_PROGRESS: "bg-blue-50 text-blue-600", COMPLETED: "bg-emerald-50 text-emerald-600" }[s] || "bg-slate-50 text-slate-600");

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl hidden md:block"><ChefHat className="w-6 h-6" /></div>
            <div>
              <h2 className="text-lg font-black text-slate-800">Kitchen Tasks</h2>
              <p className="text-sm font-medium text-slate-500">Manage kitchen prep, cooking, and cleanup tasks.</p>
            </div>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"><Plus className="w-4 h-4" /> New Task</button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
            <option value="All">All Statuses</option><option value="PENDING">Pending</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Task</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned To</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 && <tr><td colSpan={5} className="py-12 text-center text-slate-400 text-sm">No tasks found.</td></tr>}
                {filtered.map(task => (
                  <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800 text-sm">{task.title}</p>
                      {task.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.description}</p>}
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-600">{task.assignedTo || "—"}</td>
                    <td className="py-4 px-6"><div className="flex items-center gap-1.5 text-sm font-bold text-slate-700"><Calendar className="w-3.5 h-3.5 text-slate-400" />{new Date(task.dueDate).toLocaleDateString()}</div></td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${statusBadge(task.status)}`}>
                        {task.status === "COMPLETED" && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {task.status === "PENDING" && <Clock className="w-3.5 h-3.5" />}
                        {task.status === "IN_PROGRESS" && <AlertCircle className="w-3.5 h-3.5" />}
                        {task.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(task)} className="text-sm font-bold text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-primary-100 flex items-center gap-1"><Edit className="w-3.5 h-3.5" /> Edit</button>
                        <button onClick={() => handleDelete(task.id)} className="text-sm font-bold text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
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
              <h3 className="text-lg font-black text-slate-800">{editing ? "Edit Task" : "New Task"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="text-sm font-bold text-slate-700 mb-1 block">Title *</label><input type="text" value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" /></div>
              <div><label className="text-sm font-bold text-slate-700 mb-1 block">Description</label><textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-bold text-slate-700 mb-1 block">Assigned To</label><input type="text" value={form.assignedTo} onChange={e => setForm(p => ({...p, assignedTo: e.target.value}))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" /></div>
                <div><label className="text-sm font-bold text-slate-700 mb-1 block">Due Date *</label><input type="datetime-local" value={form.dueDate} onChange={e => setForm(p => ({...p, dueDate: e.target.value}))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" /></div>
              </div>
              <div><label className="text-sm font-bold text-slate-700 mb-1 block">Status</label><select value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"><option value="PENDING">Pending</option><option value="IN_PROGRESS">In Progress</option><option value="COMPLETED">Completed</option></select></div>
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
