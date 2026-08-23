"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Scale, AlertOctagon, FileText, Download, ShieldAlert, AlertTriangle, Edit, Trash2, Plus, X } from "lucide-react";
import { 
  getDisciplinaryActions, 
  createDisciplinaryAction, 
  updateDisciplinaryAction, 
  deleteDisciplinaryAction,
  getStaffMembers
} from "./actions";

export default function DisciplinaryPage() {
  const [infractions, setInfractions] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    staffId: "",
    offense: "",
    action: "",
    status: "Active",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [actionsRes, staffRes] = await Promise.all([
      getDisciplinaryActions(),
      getStaffMembers()
    ]);
    
    if (actionsRes.success) setInfractions(actionsRes.data);
    if (staffRes.success) setStaffList(staffRes.data);
    setLoading(false);
  };

  const handleOpenModal = (record?: any) => {
    if (record) {
      setEditingId(record.id);
      setFormData({
        staffId: record.staffId,
        offense: record.offense,
        action: record.action,
        status: record.status,
        date: new Date(record.date).toISOString().split('T')[0]
      });
    } else {
      setEditingId(null);
      setFormData({
        staffId: staffList.length > 0 ? staffList[0].id : "",
        offense: "",
        action: "",
        status: "Active",
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const res = await updateDisciplinaryAction(editingId, formData);
      if (res.success) {
        fetchData();
        handleCloseModal();
      } else {
        alert("Error updating: " + res.error);
      }
    } else {
      const res = await createDisciplinaryAction(formData);
      if (res.success) {
        fetchData();
        handleCloseModal();
      } else {
        alert("Error creating: " + res.error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this record?")) {
      const res = await deleteDisciplinaryAction(id);
      if (res.success) {
        fetchData();
      } else {
        alert("Error deleting: " + res.error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl hidden md:block">
                 <Scale className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Disciplinary Actions</h2>
                 <p className="text-sm font-medium text-slate-500">Log and manage employee infractions and corrective actions securely.</p>
              </div>
           </div>
           <button 
             onClick={() => handleOpenModal()}
             className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
           >
              <AlertOctagon className="w-4 h-4" />
              Log Infraction
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by employee or ID..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Statuses</option>
                 <option>Active</option>
                 <option>Served</option>
                 <option>Expired</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-8 text-center text-slate-500 font-medium">Loading records...</div>
          ) : infractions.length === 0 ? (
             <div className="p-8 text-center text-slate-500 font-medium">No disciplinary records found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Record ID</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Offense / Infraction</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Issued Action</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {infractions.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-700 text-sm truncate w-24 block">{record.id}</span>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">{new Date(record.date).toLocaleDateString()}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800 text-sm">
                        {record.staff ? `${record.staff.firstName} ${record.staff.lastName}` : "Unknown"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800 text-sm">{record.offense}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-md ${
                        record.action.includes('Suspension') ? 'bg-rose-50 text-rose-600' : 
                        record.action.includes('Written') ? 'bg-amber-50 text-amber-600' : 
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {record.action.includes('Suspension') && <ShieldAlert className="w-3 h-3" />}
                        {record.action.includes('Written') && <AlertTriangle className="w-3 h-3" />}
                        {record.action}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                        record.status === 'Active' ? 'bg-rose-50 text-rose-600' : 
                        record.status === 'Served' ? 'bg-blue-50 text-blue-600' : 
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenModal(record)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors tooltip-trigger" title="Edit Record">
                             <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(record.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors tooltip-trigger" title="Delete Record">
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">{editingId ? "Edit Infraction" : "Log Infraction"}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Staff Member</label>
                <select 
                  required
                  value={formData.staffId} 
                  onChange={(e) => setFormData({...formData, staffId: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="" disabled>Select a staff member</option>
                  {staffList.map(staff => (
                    <option key={staff.id} value={staff.id}>
                      {staff.firstName} {staff.lastName} ({staff.employeeNumber})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Offense / Infraction</label>
                <input 
                  type="text" 
                  required
                  value={formData.offense}
                  onChange={(e) => setFormData({...formData, offense: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Unauthorized Absence"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Issued Action</label>
                <select 
                  required
                  value={formData.action} 
                  onChange={(e) => setFormData({...formData, action: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="" disabled>Select action</option>
                  <option value="Verbal Warning">Verbal Warning</option>
                  <option value="Written Warning">Written Warning</option>
                  <option value="Suspension (1 Day)">Suspension (1 Day)</option>
                  <option value="Suspension (3 Days)">Suspension (3 Days)</option>
                  <option value="Termination">Termination</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                  <select 
                    required
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Served">Served</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-colors shadow-sm"
                >
                  {editingId ? "Update Record" : "Log Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
