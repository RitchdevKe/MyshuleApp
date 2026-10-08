"use client";

import React, { useState } from "react";
import { Search, Filter, Plus, Calendar, AlertTriangle, Users, MailCheck, Megaphone, Trash2, X } from "lucide-react";
import { createAnnouncement, deleteAnnouncement } from "./actions";

interface Announcement {
  id: string;
  title: string;
  content: string;
  audience: string;
  targetClassName: string | null;
  date: string;
  status: string;
  author: string;
  reach: string;
}

interface ClassOption {
  id: string;
  name: string;
}

export default function AnnouncementsClient({ initialAnnouncements, classes }: { initialAnnouncements: Announcement[]; classes: ClassOption[] }) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    targetAudience: "ALL" as any,
    targetClassId: "",
  });

  const handleCreate = async () => {
    if (!form.title || !form.content) return;
    setLoading(true);
    try {
      await createAnnouncement(form);
      window.location.reload(); // Simple reload to get new list
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    await deleteAnnouncement(id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const filtered = announcements.filter(a => 
    !search || a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Header Actions */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search announcements..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2 w-full md:w-auto">
              <button className="p-2 bg-white border border-slate-200/60 rounded-xl text-slate-500 hover:text-slate-700 transition-colors">
                 <Filter className="w-5 h-5" />
              </button>
              <button onClick={() => setShowModal(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
                 <Plus className="w-4 h-4" />
                 New Broadcast
              </button>
           </div>
        </div>

        {/* Announcements List */}
        <div className="p-0">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50">
                       <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Announcement</th>
                       <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Audience</th>
                       <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status & Date</th>
                       <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Reach</th>
                       <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {filtered.map((ann) => (
                       <tr key={ann.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="py-4 px-6">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                                   <Megaphone className="w-4 h-4" />
                                </div>
                                <div>
                                   <span className="font-bold text-slate-800 text-sm block mb-1">{ann.title}</span>
                                   <span className="text-xs font-medium text-slate-500 line-clamp-1">{ann.content}</span>
                                </div>
                             </div>
                          </td>
                          <td className="py-4 px-6">
                             <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-slate-400" />
                                <span className="font-bold text-slate-700 text-sm">
                                  {ann.audience.replace(/_/g, ' ')}
                                  {ann.targetClassName && ` - ${ann.targetClassName}`}
                                </span>
                             </div>
                          </td>
                          <td className="py-4 px-6">
                             <div className="flex flex-col gap-1">
                                <span className={`inline-flex items-center w-fit px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${ann.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                   {ann.status}
                                </span>
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                   <Calendar className="w-3 h-3" />
                                   {new Date(ann.date).toLocaleDateString()}
                                </div>
                             </div>
                          </td>
                          <td className="py-4 px-6">
                             <div className="flex items-center gap-2">
                                <MailCheck className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm font-bold text-slate-700">{ann.reach}</span>
                             </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                             <button onClick={() => handleDelete(ann.id)} className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors">
                               <Trash2 className="w-4 h-4" />
                             </button>
                          </td>
                       </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={5} className="py-8 text-center text-slate-500">No announcements found.</td></tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-black text-slate-800">New Broadcast</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">Audience *</label>
                <select value={form.targetAudience} onChange={e => setForm(p => ({ ...p, targetAudience: e.target.value as any }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm">
                  <option value="ALL">All Users</option>
                  <option value="STAFF_ONLY">Staff Only</option>
                  <option value="STUDENTS_ONLY">Students Only</option>
                  <option value="PARENTS_ONLY">Parents Only</option>
                  <option value="MANAGEMENT_ONLY">Management Only</option>
                  <option value="SPECIFIC_CLASS">Specific Class</option>
                </select>
              </div>
              {form.targetAudience === "SPECIFIC_CLASS" && (
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Select Class *</label>
                  <select value={form.targetClassId} onChange={e => setForm(p => ({ ...p, targetClassId: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm">
                    <option value="">Select a class...</option>
                    {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">Content *</label>
                <textarea rows={4} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" />
              </div>
            </div>
            <div className="p-5 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl">Cancel</button>
              <button onClick={handleCreate} disabled={loading} className="px-4 py-2 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl disabled:opacity-50">{loading ? "Sending..." : "Send Broadcast"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
