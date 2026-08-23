"use client";

import React, { useState } from "react";
import { Filter, Search, MoreHorizontal, Plus, ShieldAlert, Edit, Trash2 } from "lucide-react";
import { createDisciplineCase, updateDisciplineCase, deleteDisciplineCase } from "@/app/actions/studentLife";

export default function CasesClient({ initialCases, formData }: { initialCases: any[], formData: any }) {
  const [cases, setCases] = useState(initialCases);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [severityFilter, setSeverityFilter] = useState("All Severities");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formState, setFormState] = useState({
    studentId: "",
    reportedById: "",
    incidentDate: new Date().toISOString().split("T")[0],
    severity: "MINOR",
    description: "",
    actionTaken: "",
    status: "OPEN"
  });

  const openNewModal = () => {
    setEditingCase(null);
    setFormState({
      studentId: "",
      reportedById: "",
      incidentDate: new Date().toISOString().split("T")[0],
      severity: "MINOR",
      description: "",
      actionTaken: "",
      status: "OPEN"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: any) => {
    setEditingCase(c);
    setFormState({
      studentId: c.studentId,
      reportedById: c.reportedById,
      incidentDate: new Date(c.incidentDate).toISOString().split("T")[0],
      severity: c.severity,
      description: c.description || "",
      actionTaken: c.actionTaken || "",
      status: c.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this case?")) return;
    const res = await deleteDisciplineCase(id);
    if (res.success) {
      setCases(cases.filter(c => c.id !== id));
    } else {
      alert("Error deleting case: " + res.error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (editingCase) {
      const res = await updateDisciplineCase(editingCase.id, formState);
      if (res.success) {
        setCases(cases.map(c => c.id === editingCase.id ? { ...c, ...res.data, student: formData.students.find((s: any) => s.id === formState.studentId), reportedBy: formData.staff.find((s: any) => s.id === formState.reportedById) } : c));
        setIsModalOpen(false);
      } else {
        alert("Error updating: " + res.error);
      }
    } else {
      const res = await createDisciplineCase(formState);
      if (res.success) {
        setCases([{ ...res.data, student: formData.students.find((s: any) => s.id === formState.studentId), reportedBy: formData.staff.find((s: any) => s.id === formState.reportedById) }, ...cases]);
        setIsModalOpen(false);
      } else {
        alert("Error creating: " + res.error);
      }
    }
    setIsSubmitting(false);
  };

  const filteredCases = cases.filter(c => {
    const studentName = `${c.student?.firstName || ""} ${c.student?.lastName || ""}`.toLowerCase();
    const searchMatch = studentName.includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    let statusMatch = true;
    if (statusFilter !== "All Statuses") {
      statusMatch = c.status.toLowerCase() === statusFilter.toLowerCase();
    }
    
    let severityMatch = true;
    if (severityFilter !== "All Severities") {
      severityMatch = c.severity.toLowerCase() === severityFilter.toLowerCase();
    }
    
    return searchMatch && statusMatch && severityMatch;
  });

  return (
    <div className="p-8 space-y-6 bg-white/30 backdrop-blur-md rounded-3xl min-h-[600px] relative">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 p-4 rounded-2xl border border-white/60 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Case Management</h2>
            <p className="text-xs font-bold text-slate-500">Track and resolve discipline incidents</p>
          </div>
        </div>
        <button onClick={openNewModal} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> New Case
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white/40 p-4 rounded-2xl border border-white/60 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search student or case ID..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option>All Statuses</option>
            <option>Open</option>
            <option>Resolved</option>
          </select>
          <select 
            value={severityFilter} 
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option>All Severities</option>
            <option>Minor</option>
            <option>Moderate</option>
            <option>Severe</option>
          </select>
        </div>
      </div>

      {/* Cases List */}
      <div className="bg-white/80 border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200/60">
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Case ID / Date</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Student</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Incident Type</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Severity</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {filteredCases.map((c, i) => {
                const isHigh = c.severity === 'SEVERE';
                const isMedium = c.severity === 'MODERATE';
                const severityLabel = isHigh ? 'High' : isMedium ? 'Medium' : 'Low';
                const studentClass = c.student?.enrollments?.[0]?.class?.name || "N/A";
                
                return (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-700">{c.id.split('-')[0] + '-' + c.id.substring(0,6)}</div>
                    <div className="text-xs text-slate-500 font-medium">{new Date(c.incidentDate).toLocaleDateString()}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold text-slate-700">{c.student?.firstName} {c.student?.lastName}</div>
                    <div className="text-xs text-slate-500 font-medium">{studentClass}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-slate-700 max-w-[150px] truncate">{c.description}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">By {c.reportedBy?.firstName} {c.reportedBy?.lastName}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                      isHigh ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-[0_0_8px_rgba(244,63,94,0.15)]' :
                      isMedium ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isHigh ? 'bg-rose-500' :
                        isMedium ? 'bg-amber-500' :
                        'bg-slate-400'
                      }`}></span>
                      {severityLabel}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border rounded shadow-sm ${
                      c.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      c.status === 'OPEN' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                      'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEditModal(c)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-sm">
                    No cases found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-4">{editingCase ? "Edit Case" : "New Case"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student</label>
                <select 
                  required
                  value={formState.studentId}
                  onChange={e => setFormState({...formState, studentId: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                >
                  <option value="">Select Student</option>
                  {formData.students.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reported By</label>
                <select 
                  required
                  value={formState.reportedById}
                  onChange={e => setFormState({...formState, reportedById: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                >
                  <option value="">Select Staff</option>
                  {formData.staff.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Incident Date</label>
                  <input 
                    type="date"
                    required
                    value={formState.incidentDate}
                    onChange={e => setFormState({...formState, incidentDate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Severity</label>
                  <select 
                    value={formState.severity}
                    onChange={e => setFormState({...formState, severity: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  >
                    <option value="MINOR">Minor</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="SEVERE">Severe</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea 
                  required
                  value={formState.description}
                  onChange={e => setFormState({...formState, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none min-h-[80px]"
                  placeholder="Describe the incident..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Action Taken</label>
                <textarea 
                  value={formState.actionTaken}
                  onChange={e => setFormState({...formState, actionTaken: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none min-h-[60px]"
                  placeholder="Action taken (optional)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <select 
                  value={formState.status}
                  onChange={e => setFormState({...formState, status: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                >
                  <option value="OPEN">Open</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Case"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
