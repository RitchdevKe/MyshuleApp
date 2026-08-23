/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { Users, Filter, Mail, Phone, MoreVertical, ShieldCheck, GraduationCap, Building2, UserPlus, FileText, Plus, X, Edit, Trash2 } from "lucide-react";
import { createStaff, updateStaff, deleteStaff } from "./actions";

export default function DirectoryClient({ initialStaff }: { initialStaff: any[] }) {
  const [employees, setEmployees] = useState(initialStaff);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentStaff, setCurrentStaff] = useState<any>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    jobTitle: "",
    department: "ACADEMICS",
    employeeNumber: "",
    status: "ACTIVE",
    type: "Full-Time",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    const handleOpenModal = () => {
      setModalMode("add");
      setFormData({
        firstName: "", lastName: "", email: "", phone: "",
        jobTitle: "", department: "ACADEMICS", employeeNumber: "",
        status: "ACTIVE", type: "Full-Time",
      });
      setIsModalOpen(true);
    };

    window.addEventListener("open_add_employee_modal", handleOpenModal);
    
    if (typeof window !== "undefined" && window.location.search.includes("add=true")) {
      handleOpenModal();
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return () => window.removeEventListener("open_add_employee_modal", handleOpenModal);
  }, []);

  const openAddModal = () => {
    setModalMode("add");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      jobTitle: "",
      department: "ACADEMICS",
      employeeNumber: `E${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: "ACTIVE",
      type: "Full-Time",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (staff: any) => {
    setModalMode("edit");
    setCurrentStaff(staff);
    setFormData({
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.user?.email || "",
      phone: staff.user?.phoneNumber || "",
      jobTitle: staff.jobTitle,
      department: staff.department,
      employeeNumber: staff.employeeNumber,
      status: staff.status,
      type: "Full-Time",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (modalMode === "add") {
      const res = await createStaff(formData);
      if (res.success && res.data) {
        setEmployees(prev => [...prev, { ...res.data, user: { email: formData.email, phoneNumber: formData.phone } }]);
        setIsModalOpen(false);
      } else {
        alert("Failed to add staff: " + res.error);
      }
    } else {
      const res = await updateStaff(currentStaff.id, formData);
      if (res.success && res.data) {
        setEmployees(prev => prev.map(emp => emp.id === currentStaff.id ? { ...emp, ...res.data, user: { ...emp.user, email: formData.email, phoneNumber: formData.phone } } : emp));
        setIsModalOpen(false);
      } else {
        alert("Failed to update staff: " + res.error);
      }
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    const res = await deleteStaff(id);
    if (res.success) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } else {
      alert("Failed to delete staff: " + res.error);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = (emp.firstName + " " + emp.lastName).toLowerCase().includes(search.toLowerCase()) || 
                          emp.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
                          emp.employeeNumber.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "All Departments" || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const activeCount = employees.filter(e => e.status === "ACTIVE").length;
  const leaveCount = employees.filter(e => e.status === "ON_LEAVE").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
             <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Staff</p>
            <p className="text-2xl font-black text-slate-800">{employees.length}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
             <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active</p>
            <p className="text-2xl font-black text-slate-800">{activeCount}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
             <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">On Leave</p>
            <p className="text-2xl font-black text-slate-800">{leaveCount}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
             <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contracts</p>
            <p className="text-2xl font-black text-slate-800">0<span className="text-sm text-slate-400">/mo</span></p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-4 flex flex-col md:flex-row justify-between items-center gap-4">
         <div className="flex items-center gap-2 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Search employees by name, role, or ID..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-80 px-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
            />
         </div>
         <div className="flex flex-wrap gap-2">
            <select 
              value={deptFilter}
              onChange={e => setDeptFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
            >
               <option value="All Departments">All Departments</option>
               <option value="ACADEMICS">Academics</option>
               <option value="ADMINISTRATION">Administration</option>
               <option value="TRANSPORT">Transport</option>
               <option value="KITCHEN">Kitchen</option>
               <option value="SUPPORT">Support</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
               <Filter className="w-4 h-4" />
               More Filters
            </button>
            <button onClick={openAddModal} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm">
               <Plus className="w-4 h-4" />
               Add Staff
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {filteredEmployees.map((emp) => (
            <div key={emp.id} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-xl transition-all duration-300 group">
               <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-lg shrink-0 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                        {(emp.firstName[0] || "") + (emp.lastName[0] || "")}
                     </div>
                     <div>
                        <h3 className="font-black text-lg text-slate-800">{emp.firstName} {emp.lastName}</h3>
                        <p className="text-sm font-bold text-slate-500">{emp.jobTitle}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                           <span className="text-[10px] uppercase tracking-wider font-black text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">{emp.department}</span>
                           <span className={`text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-md ${emp.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              {emp.status}
                           </span>
                        </div>
                     </div>
                  </div>
                  <div className="flex">
                    <button onClick={() => openEditModal(emp)} className="text-slate-400 hover:text-primary-900 transition-colors p-1 rounded-lg hover:bg-slate-50 tooltip-trigger" title="Edit">
                       <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDelete(emp.id)} className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-slate-50 tooltip-trigger" title="Delete">
                       <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 py-4 my-4 border-y border-slate-100">
                  <div>
                     <p className="text-xs font-bold text-slate-400 mb-1">Employee ID</p>
                     <p className="text-sm font-bold text-slate-700">{emp.employeeNumber}</p>
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 mb-1">Email</p>
                     <p className="text-sm font-bold text-slate-700 truncate" title={emp.user?.email}>{emp.user?.email || "N/A"}</p>
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 mb-1">Hired Date</p>
                     <p className="text-sm font-bold text-slate-700">{new Date(emp.hireDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                     <p className="text-xs font-bold text-slate-400 mb-1">Perf. Rating</p>
                     <p className="text-sm font-bold text-slate-700 flex items-center gap-1">
                        <span className="text-amber-400">★</span> 4.5/5.0
                     </p>
                  </div>
               </div>

               <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                     <button className="p-2 bg-slate-50 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors tooltip-trigger" title="Send Email">
                        <Mail className="w-4 h-4 text-slate-500" />
                     </button>
                     <button className="p-2 bg-slate-50 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors tooltip-trigger" title="Call">
                        <Phone className="w-4 h-4 text-slate-500" />
                     </button>
                  </div>
                  <button className="px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-primary-900/20">
                     View Profile
                  </button>
               </div>
            </div>
         ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black text-slate-800 mb-6">
              {modalMode === "add" ? "Add New Staff Member" : "Edit Staff Member"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">First Name</label>
                  <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Last Name</label>
                  <input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Email</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={modalMode === "edit"} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 disabled:opacity-50" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Phone</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Job Title</label>
                  <input type="text" required value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Department</label>
                  <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                    <option value="ACADEMICS">Academics</option>
                    <option value="ADMINISTRATION">Administration</option>
                    <option value="TRANSPORT">Transport</option>
                    <option value="KITCHEN">Kitchen</option>
                    <option value="SUPPORT">Support</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Employee ID</label>
                  <input type="text" required value={formData.employeeNumber} onChange={e => setFormData({...formData, employeeNumber: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
                </div>
                {modalMode === "edit" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                      <option value="ACTIVE">Active</option>
                      <option value="ON_LEAVE">On Leave</option>
                      <option value="RESIGNED">Resigned</option>
                      <option value="TERMINATED">Terminated</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
