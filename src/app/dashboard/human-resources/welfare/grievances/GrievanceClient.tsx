"use client";

import React, { useState } from "react";
import { Search, Filter, MessageSquareWarning, AlertCircle, AlertTriangle, ShieldCheck, Clock, CheckCircle2, Plus, X, Trash2 } from "lucide-react";
import { createGrievance, updateGrievance, deleteGrievance } from "./actions";

export default function GrievanceClient({ initialGrievances, tenantId, stats, staffMembers }: any) {
  const [grievances, setGrievances] = useState(initialGrievances);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrievance, setEditingGrievance] = useState<any>(null);
  
  // Form state
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [staffId, setStaffId] = useState("");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Workplace Safety");
  const [severity, setSeverity] = useState("Medium");
  const [status, setStatus] = useState("Open");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setIsAnonymous(false);
    setStaffId("");
    setSubject("");
    setCategory("Workplace Safety");
    setSeverity("Medium");
    setStatus("Open");
    setEditingGrievance(null);
  };

  const openModal = (g?: any) => {
    if (g) {
      setEditingGrievance(g);
      setIsAnonymous(g.isAnonymous);
      setStaffId(g.staffId || "");
      setSubject(g.subject);
      setCategory(g.category);
      setSeverity(g.severity);
      setStatus(g.status);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = {
      isAnonymous,
      staffId: isAnonymous ? null : staffId,
      subject,
      category,
      severity,
      status,
    };

    try {
      if (editingGrievance) {
        await updateGrievance(editingGrievance.id, data);
        setGrievances(grievances.map((g: any) => g.id === editingGrievance.id ? { ...g, ...data, staff: isAnonymous ? null : staffMembers.find((s:any) => s.id === staffId) } : g));
      } else {
        await createGrievance(tenantId, data);
        // Normally we'd rely on server revalidation to refresh data, 
        // but for immediate UI feedback we could also just refresh the page.
        window.location.reload(); 
      }
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this grievance?")) return;
    try {
      await deleteGrievance(id);
      setGrievances(grievances.filter((g: any) => g.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl hidden md:block">
                 <MessageSquareWarning className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Grievance Resolution</h2>
                 <p className="text-sm font-medium text-slate-500">Track, investigate, and resolve employee complaints and workplace issues.</p>
              </div>
           </div>
           <div className="flex gap-4">
              <div className="text-center px-4 border-r border-slate-200">
                 <p className="text-2xl font-black text-slate-800">{stats.openCount}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open</p>
              </div>
              <div className="text-center px-4 border-r border-slate-200">
                 <p className="text-2xl font-black text-amber-600">{stats.investigatingCount}</p>
                 <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Investigating</p>
              </div>
              <div className="text-center px-4">
                 <p className="text-2xl font-black text-emerald-600">{stats.resolvedCount}</p>
                 <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Resolved</p>
              </div>
           </div>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search grievances..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <button 
                onClick={() => openModal()}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm"
              >
                 <Plus className="w-4 h-4" />
                 New Grievance
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">ID & Date</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Reporter</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject & Category</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Severity</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grievances.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No grievances found.
                  </td>
                </tr>
              ) : (
                grievances.map((g: any) => (
                  <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-700 text-sm">{g.id.slice(0,8)}</span>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(g.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-bold text-sm ${g.isAnonymous ? 'text-slate-400 italic' : 'text-slate-800'}`}>
                        {g.isAnonymous ? 'Anonymous' : (g.staff ? `${g.staff.firstName} ${g.staff.lastName}` : 'Unknown')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800 text-sm">{g.subject}</p>
                      <p className="text-xs text-slate-500 font-medium">{g.category}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-md ${
                        g.severity === 'High' ? 'bg-rose-50 text-rose-600' : 
                        g.severity === 'Medium' ? 'bg-amber-50 text-amber-600' : 
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {g.severity === 'High' && <AlertCircle className="w-3 h-3" />}
                        {g.severity === 'Medium' && <AlertTriangle className="w-3 h-3" />}
                        {g.severity}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                        g.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 
                        g.status === 'Investigating' ? 'bg-amber-50 text-amber-600' : 
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {g.status === 'Resolved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {g.status === 'Investigating' && <Search className="w-3.5 h-3.5" />}
                        {g.status === 'Open' && <AlertCircle className="w-3.5 h-3.5" />}
                        {g.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                       <button onClick={() => openModal(g)} className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors mr-2">Edit</button>
                       <button onClick={() => handleDelete(g.id)} className="text-sm font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4 inline"/></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800">{editingGrievance ? "Edit Grievance" : "New Grievance"}</h3>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isAnonymous} 
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  Submit Anonymously
                </label>
              </div>

              {!isAnonymous && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Staff Member</label>
                  <select 
                    value={staffId} 
                    onChange={(e) => setStaffId(e.target.value)}
                    required={!isAnonymous}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  >
                    <option value="">Select Staff...</option>
                    {staffMembers.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder="e.g. Unsafe walkway in South Wing"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  >
                    <option value="Workplace Safety">Workplace Safety</option>
                    <option value="Management/Policy">Management/Policy</option>
                    <option value="Facilities">Facilities</option>
                    <option value="Harassment">Harassment</option>
                    <option value="Finance/Payroll">Finance/Payroll</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Severity</label>
                  <select 
                    value={severity} 
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              {editingGrievance && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  >
                    <option value="Open">Open</option>
                    <option value="Investigating">Investigating</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeModal}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Grievance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
