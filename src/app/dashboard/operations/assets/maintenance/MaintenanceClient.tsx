"use client";

import React, { useState } from "react";
import { Wrench, Search, Filter, Calendar, AlertCircle, Clock, CheckCircle2, ChevronRight, Plus, X, Edit2, Trash2 } from "lucide-react";
import { createMaintenanceRecord, deleteMaintenanceRecord, updateMaintenanceRecord } from "./actions";

export default function MaintenanceClient({ records, assets }: { records: any[], assets: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state
  const [assetId, setAssetId] = useState("");
  const [type, setType] = useState("PREVENTIVE");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [date, setDate] = useState("");
  const [performedBy, setPerformedBy] = useState("");
  const [status, setStatus] = useState("SCHEDULED");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredRecords = records.filter(record => 
    record.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    record.asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.performedBy && record.performedBy.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalMaintenance = records.length;
  const completedMaintenance = records.filter(r => r.status === "COMPLETED").length;
  const inProgressMaintenance = records.filter(r => r.status === "IN_PROGRESS").length;
  const scheduledMaintenance = records.filter(r => r.status === "SCHEDULED").length;

  const handleOpenCreate = () => {
    setEditingId(null);
    setAssetId("");
    setType("PREVENTIVE");
    setDescription("");
    setCost("");
    setDate("");
    setPerformedBy("");
    setStatus("SCHEDULED");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (record: any) => {
    setEditingId(record.id);
    setAssetId(record.assetId);
    setType(record.type);
    setDescription(record.description);
    setCost(record.cost.toString());
    setDate(new Date(record.date).toISOString().split('T')[0]);
    setPerformedBy(record.performedBy || "");
    setStatus(record.status);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      await deleteMaintenanceRecord(id);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId || !description || !date) return;
    
    try {
      setIsSubmitting(true);
      const data = {
        assetId,
        type,
        description,
        cost: parseFloat(cost) || 0,
        date: new Date(date),
        status,
        performedBy,
      };

      if (editingId) {
        await updateMaintenanceRecord(editingId, data);
      } else {
        await createMaintenanceRecord(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Records</p>
            <p className="text-2xl font-bold text-slate-800">{totalMaintenance}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Completed</p>
            <p className="text-2xl font-bold text-slate-800">{completedMaintenance}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">In Progress</p>
            <p className="text-2xl font-bold text-slate-800">{inProgressMaintenance}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Scheduled</p>
            <p className="text-2xl font-bold text-slate-800">{scheduledMaintenance}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl hidden md:block">
                 <Wrench className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Preventative Maintenance</h2>
                 <p className="text-sm font-medium text-slate-500">Schedule and track routine maintenance for facilities and assets.</p>
              </div>
           </div>
           <button 
             onClick={handleOpenCreate}
             className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
           >
              <Plus className="w-4 h-4" />
              Create Schedule
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by Asset, Task, or Assignee..." 
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Calendar className="w-4 h-4" />
                 This Month
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Type & Cost</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Asset & Task</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Timing & Assignee</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {filteredRecords.length > 0 ? filteredRecords.map((schedule) => (
                   <tr key={schedule.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${
                            schedule.type === 'PREVENTIVE' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                            {schedule.type}
                        </span>
                        <div className="mt-1 font-medium text-sm text-slate-600">
                           KES {schedule.cost?.toLocaleString() || 0}
                        </div>
                     </td>
                     <td className="py-4 px-6">
                       <p className="font-bold text-slate-800 text-sm">{schedule.asset.name}</p>
                       <p className="text-xs font-medium text-slate-500 mt-0.5">{schedule.description}</p>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-2 mb-1">
                           <Calendar className="w-3.5 h-3.5 text-slate-400" />
                           <span className="text-sm font-bold text-slate-700">
                              {new Date(schedule.date).toLocaleDateString()}
                           </span>
                        </div>
                        {schedule.performedBy && (
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Assigned: {schedule.performedBy}</p>
                        )}
                     </td>
                     <td className="py-4 px-6">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                         schedule.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 
                         schedule.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' : 
                         'bg-slate-100 text-slate-600'
                       }`}>
                         {schedule.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                         {schedule.status === 'IN_PROGRESS' && <Clock className="w-3.5 h-3.5" />}
                         {schedule.status === 'SCHEDULED' && <Calendar className="w-3.5 h-3.5" />}
                         {schedule.status.replace("_", " ")}
                       </span>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                              onClick={() => handleOpenEdit(schedule)}
                              className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-flex"
                              title="Edit"
                           >
                              <Edit2 className="w-4 h-4" />
                           </button>
                           <button 
                              onClick={() => handleDelete(schedule.id)}
                              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors inline-flex"
                              title="Delete"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </td>
                   </tr>
                 )) : (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-slate-500 text-sm">
                       No maintenance records found.
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">{editingId ? 'Edit Maintenance' : 'Schedule Maintenance'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Asset</label>
                <select 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={assetId}
                  onChange={(e) => setAssetId(e.target.value)}
                  required
                >
                  <option value="">Select Asset</option>
                  {assets.map(asset => (
                    <option key={asset.id} value={asset.id}>{asset.name} ({asset.assetTag})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                  <select 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    <option value="PREVENTIVE">Preventive</option>
                    <option value="CORRECTIVE">Corrective</option>
                  </select>
                </div>
                {editingId && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                    <select 
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                    >
                      <option value="SCHEDULED">Scheduled</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Task Description</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Quarterly Oil & Filter Change"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Estimated Cost</label>
                  <input 
                    type="number" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. 5000"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Assignee (Optional)</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Michael Ochieng"
                  value={performedBy}
                  onChange={(e) => setPerformedBy(e.target.value)}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
