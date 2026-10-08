"use client";

import React, { useState } from "react";
import { ShieldAlert, Search, Filter, Plus, FileText, CheckCircle2, XCircle, AlertTriangle, FileBadge, Trash2, Edit } from "lucide-react";
import { createInspection, updateInspection, deleteInspection } from "./actions";
import { useRouter } from "next/navigation";

export default function InspectionsClient({ 
  inspections, 
  facilities,
  tenantId 
}: { 
  inspections: any[]; 
  facilities: any[];
  tenantId: string;
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInspection, setEditingInspection] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    facilityId: "",
    inspector: "",
    status: "PASSED",
    notes: "",
    date: new Date().toISOString().split('T')[0],
  });

  const totalInspections = inspections.length;
  const passedInspections = inspections.filter(i => i.status === "PASSED").length;
  const failedInspections = inspections.filter(i => i.status === "FAILED").length;
  const needsAttentionInspections = inspections.filter(i => i.status === "NEEDS_ATTENTION").length;

  const filteredInspections = inspections.filter(insp => {
    const matchesSearch = 
      insp.facility?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      insp.inspector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (insp.notes && insp.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "All" || insp.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (inspection?: any) => {
    if (inspection) {
      setEditingInspection(inspection);
      setFormData({
        facilityId: inspection.facilityId,
        inspector: inspection.inspector,
        status: inspection.status,
        notes: inspection.notes || "",
        date: new Date(inspection.date).toISOString().split('T')[0],
      });
    } else {
      setEditingInspection(null);
      setFormData({
        facilityId: facilities.length > 0 ? facilities[0].id : "",
        inspector: "",
        status: "PENDING",
        notes: "",
        date: new Date().toISOString().split('T')[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingInspection(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingInspection) {
        await updateInspection(editingInspection.id, formData);
      } else {
        await createInspection(tenantId, formData);
      }
      handleCloseModal();
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this inspection?")) {
      await deleteInspection(id);
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-500">Total Inspections</span>
            <ShieldAlert className="w-5 h-5 text-primary-500" />
          </div>
          <span className="text-3xl font-black text-slate-800">{totalInspections}</span>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-500">Passed</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-3xl font-black text-emerald-600">{passedInspections}</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-500">Failed</span>
            <XCircle className="w-5 h-5 text-rose-500" />
          </div>
          <span className="text-3xl font-black text-rose-600">{failedInspections}</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-slate-500">Needs Attention</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-3xl font-black text-amber-600">{needsAttentionInspections}</span>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl hidden md:block">
                 <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Safety & Compliance Inspections</h2>
                 <p className="text-sm font-medium text-slate-500">Log regulatory audits and internal safety checks for facilities.</p>
              </div>
           </div>
           <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Log Inspection
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search inspections..." 
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex gap-2">
              <select 
                className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                 <option value="All">All Statuses</option>
                 <option value="PASSED">Passed</option>
                 <option value="FAILED">Failed</option>
                 <option value="NEEDS_ATTENTION">Needs Attention</option>
                 <option value="PENDING">Pending</option>
              </select>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Facility</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Inspector</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {filteredInspections.length === 0 ? (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">No inspections found.</td>
                   </tr>
                 ) : (
                   filteredInspections.map((insp) => (
                     <tr key={insp.id} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="py-4 px-6">
                          <span className="font-bold text-slate-800 text-sm">{insp.facility?.name || "Unknown Facility"}</span>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{insp.notes}</p>
                       </td>
                       <td className="py-4 px-6">
                          <p className="text-sm font-medium text-slate-700">{new Date(insp.date).toLocaleDateString()}</p>
                       </td>
                       <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 mb-1 text-sm">
                             <FileBadge className="w-3.5 h-3.5 text-slate-400" />
                             <span className="font-bold text-slate-700">{insp.inspector}</span>
                          </div>
                       </td>
                       <td className="py-4 px-6">
                         <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                           insp.status === 'PASSED' ? 'bg-emerald-50 text-emerald-600' : 
                           insp.status === 'NEEDS_ATTENTION' ? 'bg-amber-50 text-amber-600' : 
                           insp.status === 'FAILED' ? 'bg-rose-50 text-rose-600' :
                           'bg-slate-100 text-slate-600'
                         }`}>
                           {insp.status === 'PASSED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                           {insp.status === 'NEEDS_ATTENTION' && <AlertTriangle className="w-3.5 h-3.5" />}
                           {insp.status === 'FAILED' && <XCircle className="w-3.5 h-3.5" />}
                           {insp.status.replace("_", " ")}
                         </span>
                       </td>
                       <td className="py-4 px-6 text-right">
                          <div className="flex justify-end items-center gap-2">
                             <button onClick={() => handleOpenModal(insp)} className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors inline-flex">
                                <Edit className="w-4 h-4" />
                             </button>
                             <button onClick={() => handleDelete(insp.id)} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors inline-flex">
                                <Trash2 className="w-4 h-4" />
                             </button>
                          </div>
                       </td>
                     </tr>
                   ))
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">{editingInspection ? "Edit Inspection" : "Log Inspection"}</h3>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Facility</label>
                <select
                  required
                  value={formData.facilityId}
                  onChange={(e) => setFormData({ ...formData, facilityId: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                >
                  <option value="" disabled>Select Facility</option>
                  {facilities.map((fac) => (
                    <option key={fac.id} value={fac.id}>{fac.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Inspector</label>
                <input
                  required
                  type="text"
                  value={formData.inspector}
                  onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  placeholder="e.g. Health Ministry, John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PASSED">Passed</option>
                  <option value="FAILED">Failed</option>
                  <option value="NEEDS_ATTENTION">Needs Attention</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 h-24 resize-none"
                  placeholder="Add any details..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Inspection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
