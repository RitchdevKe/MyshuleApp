"use client";

import React, { useState, useEffect } from "react";
import { Search, AlertTriangle, ShieldCheck, Clock, Download, Award, ShieldAlert, Plus, Edit2, Trash2, X } from "lucide-react";
import { getStaffOptions } from "./actions";

type Certification = {
  id: string;
  employeeId?: string;
  employee: string;
  type: string;
  status: "Active" | "Expiring Soon" | "Expired";
  expires: string;
  lastRenewed: string;
};

type StaffOption = {
  id: string;
  name: string;
  title: string;
};

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([
    { id: "CERT-001", employee: "John Smith", type: "Health & Safety (OSHA)", status: "Active", expires: "2025-12-31", lastRenewed: "2024-01-15" },
    { id: "CERT-002", employee: "Emily Chen", type: "Pediatric First Aid", status: "Expiring Soon", expires: "2024-09-10", lastRenewed: "2022-09-10" },
    { id: "CERT-003", employee: "Sarah Connor", type: "Advanced Child Protection", status: "Active", expires: "2026-03-22", lastRenewed: "2024-03-22" },
    { id: "CERT-004", employee: "David Kim", type: "Food Handling License", status: "Expired", expires: "2024-07-01", lastRenewed: "2023-07-01" },
    { id: "CERT-005", employee: "Michael Ochieng", type: "ITIL Foundation", status: "Active", expires: "2099-12-31", lastRenewed: "2021-11-05" },
  ]);

  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    type: "",
    status: "Active" as Certification["status"],
    expires: "",
    lastRenewed: ""
  });

  useEffect(() => {
    async function fetchStaff() {
      const options = await getStaffOptions();
      setStaffOptions(options);
    }
    fetchStaff();
  }, []);

  // Compute actual status based on expires date for display accuracy in a real system,
  // but since we allow manual status selection, we'll use the selected status for calculating counts.
  
  // Calculate summary stats
  const activeCount = certifications.filter(c => c.status === "Active").length;
  const expiringSoonCount = certifications.filter(c => c.status === "Expiring Soon").length;
  const expiredCount = certifications.filter(c => c.status === "Expired").length;

  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch = cert.employee.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cert.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Statuses" || cert.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenModal = (cert?: Certification) => {
    if (cert) {
      setEditingId(cert.id);
      setFormData({
        employeeId: cert.employeeId || "",
        employeeName: cert.employee,
        type: cert.type,
        status: cert.status,
        expires: cert.expires,
        lastRenewed: cert.lastRenewed
      });
    } else {
      setEditingId(null);
      setFormData({
        employeeId: "",
        employeeName: "",
        type: "",
        status: "Active",
        expires: "",
        lastRenewed: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-calculate status if we wanted to, but we'll stick to form data
    
    let empName = formData.employeeName;
    if (formData.employeeId) {
      const foundStaff = staffOptions.find(s => s.id === formData.employeeId);
      if (foundStaff) empName = foundStaff.name;
    }

    if (editingId) {
      setCertifications(prev => prev.map(c => c.id === editingId ? {
        ...c,
        employeeId: formData.employeeId,
        employee: empName,
        type: formData.type,
        status: formData.status,
        expires: formData.expires,
        lastRenewed: formData.lastRenewed
      } : c));
    } else {
      setCertifications(prev => [{
        id: `CERT-${Math.floor(Math.random() * 10000)}`,
        employeeId: formData.employeeId,
        employee: empName,
        type: formData.type,
        status: formData.status,
        expires: formData.expires,
        lastRenewed: formData.lastRenewed
      }, ...prev]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this certification?")) {
      setCertifications(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <ShieldCheck className="w-6 h-6" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fully Compliant</p>
               <p className="text-2xl font-black text-slate-800">{activeCount}</p>
             </div>
           </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Clock className="w-6 h-6" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expiring Soon</p>
               <p className="text-2xl font-black text-slate-800">{expiringSoonCount}</p>
             </div>
           </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                <ShieldAlert className="w-6 h-6" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expired</p>
               <p className="text-2xl font-black text-slate-800">{expiredCount}</p>
             </div>
           </div>
           {expiredCount > 0 && (
             <button className="text-sm font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors">Alert All</button>
           )}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by employee or certification..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
              />
           </div>
           <div className="flex gap-2">
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
              >
                 <option>All Statuses</option>
                 <option>Active</option>
                 <option>Expiring Soon</option>
                 <option>Expired</option>
              </select>
              <button 
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm"
              >
                 <Plus className="w-4 h-4" />
                 Add Certification
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Certification Type</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Renewed</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Expiration Date</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCertifications.length > 0 ? (
                filteredCertifications.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-800 text-sm">{cert.employee}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                         <Award className="w-4 h-4 text-slate-400" />
                         <span className="font-bold text-slate-800 text-sm">{cert.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-slate-500">{cert.lastRenewed}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-sm font-bold ${cert.status === 'Expired' ? 'text-rose-600' : cert.status === 'Expiring Soon' ? 'text-amber-600' : 'text-slate-800'}`}>
                         {cert.expires === "2099-12-31" ? "Never" : cert.expires}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                        cert.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                        cert.status === 'Expiring Soon' ? 'bg-amber-50 text-amber-600' : 
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {cert.status === 'Active' && <ShieldCheck className="w-3.5 h-3.5" />}
                        {cert.status === 'Expiring Soon' && <AlertTriangle className="w-3.5 h-3.5" />}
                        {cert.status === 'Expired' && <ShieldAlert className="w-3.5 h-3.5" />}
                        {cert.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={() => handleOpenModal(cert)}
                           className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors tooltip-trigger" 
                           title="Edit Certification"
                         >
                            <Edit2 className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => handleDelete(cert.id)}
                           className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors tooltip-trigger" 
                           title="Delete Certification"
                         >
                            <Trash2 className="w-4 h-4" />
                         </button>
                         <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors tooltip-trigger" title="Download Document">
                            <Download className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No certifications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Certification" : "Add Certification"}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Employee</label>
                {staffOptions.length > 0 ? (
                  <select
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  >
                    <option value="" disabled>Select Staff Member...</option>
                    {staffOptions.map(staff => (
                      <option key={staff.id} value={staff.id}>{staff.name} - {staff.title}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="E.g. John Smith"
                    value={formData.employeeName}
                    onChange={(e) => setFormData({...formData, employeeName: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Certification Type</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Pediatric First Aid"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Last Renewed</label>
                  <input
                    type="date"
                    required
                    value={formData.lastRenewed}
                    onChange={(e) => setFormData({...formData, lastRenewed: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Expiration Date</label>
                  <input
                    type="date"
                    required
                    value={formData.expires === "2099-12-31" ? "" : formData.expires}
                    onChange={(e) => setFormData({...formData, expires: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Status</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as Certification["status"]})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                >
                  <option value="Active">Active</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-sm"
                >
                  {editingId ? "Save Changes" : "Add Certification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
