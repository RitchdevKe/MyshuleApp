"use client";

import React, { useState, useTransition } from "react";
import { Users, Plus, Shield, Briefcase, Mail, CheckCircle2 } from "lucide-react";
import { createStaff, suspendStaff, updateStaff } from "@/app/actions/staff";
import { changeUserRole } from "@/app/actions/userManagement";
import { useRouter } from "next/navigation";

export default function StaffClient({ staffMembers, roles }: { staffMembers: any[], roles: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState<"ACADEMIC" | "ADMINISTRATION" | "FINANCE" | "SUPPORT">("ACADEMIC");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [roleId, setRoleId] = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [editStaffId, setEditStaffId] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAdd = () => {
    if (!firstName || !lastName || !email || !roleId) return;
    startTransition(async () => {
      await createStaff({ firstName, lastName, email, jobTitle, department, employeeNumber, roleId });
      setShowAdd(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setJobTitle("");
      setEmployeeNumber("");
      setRoleId("");
      triggerToast("Staff member created successfully");
      router.refresh();
    });
  };

  const openEdit = (staff: any) => {
    setEditStaffId(staff.id);
    setFirstName(staff.firstName);
    setLastName(staff.lastName);
    setEmail(staff.user?.email || "");
    setJobTitle(staff.jobTitle);
    setDepartment(staff.department);
    setEmployeeNumber(staff.employeeNumber);
    setRoleId(staff.user?.tenantUsers?.[0]?.roleId || "");
    setShowEdit(true);
  };

  const handleEdit = () => {
    if (!firstName || !lastName) return;
    startTransition(async () => {
      await updateStaff(editStaffId, { firstName, lastName, jobTitle, department, employeeNumber });
      if (roleId) {
         // handle role update if we had user access, but mostly updateStaff deals with staff.
         // user email update is complex, skipping email update for now
         // update role via changeUserRole if role changed
         const staff = staffMembers.find(s => s.id === editStaffId);
         if (staff?.userId && staff.user?.tenantUsers?.[0]?.roleId !== roleId) {
            await changeUserRole(staff.userId, roleId);
         }
      }
      setShowEdit(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setJobTitle("");
      setEmployeeNumber("");
      setRoleId("");
      triggerToast("Staff member updated successfully");
      router.refresh();
    });
  };

  const handleSuspend = (id: string) => {
    startTransition(async () => {
      await suspendStaff(id);
      triggerToast("Staff member suspended");
      router.refresh();
    });
  };

  const handleRoleChange = (userId: string, newRoleId: string) => {
    if (!userId || !newRoleId) return;
    startTransition(async () => {
      await changeUserRole(userId, newRoleId);
      triggerToast("User role updated successfully");
      router.refresh();
    });
  };

  return (
    <div className="p-6 md:p-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-bold">{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Staff Directory</h3>
            <p className="text-sm font-medium text-slate-500">Manage employee accounts and role assignments.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      <div className={`bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm transition-opacity ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 pl-6">Staff Member</th>
                <th className="p-4">Department</th>
                <th className="p-4">System Role</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staffMembers.map((staff) => {
                const currentRoleId = staff.user?.tenantUsers?.[0]?.roleId || "";
                
                return (
                <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                        {staff.firstName[0]}{staff.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{staff.firstName} {staff.lastName}</p>
                        <p className="text-xs font-medium text-slate-500">{staff.user?.email}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{staff.employeeNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-700">{staff.jobTitle}</p>
                    <p className="text-xs font-medium text-slate-500">{staff.department}</p>
                  </td>
                  <td className="p-4">
                    <select 
                       value={currentRoleId}
                       onChange={(e) => handleRoleChange(staff.userId, e.target.value)}
                       disabled={!staff.userId}
                       className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                       <option value="">No Role</option>
                       {roles.map((r: any) => (
                         <option key={r.id} value={r.id}>{r.name}</option>
                       ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      staff.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                     <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => openEdit(staff)}
                         className="text-xs font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                       >
                         Edit
                       </button>
                       {staff.status === 'ACTIVE' && (
                         <button 
                           onClick={() => handleSuspend(staff.id)}
                           className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                         >
                           Suspend
                         </button>
                       )}
                     </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
        {staffMembers.length === 0 && (
          <div className="p-12 text-center text-slate-500 font-medium">
            No staff members found. Add one to get started.
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">Add Staff Member</h3>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Employee Number</label>
                  <input type="text" value={employeeNumber} onChange={(e) => setEmployeeNumber(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Job Title</label>
                  <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Math Teacher" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
                  <select value={department} onChange={(e) => setDepartment(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white">
                    <option value="ACADEMIC">Academic</option>
                    <option value="ADMINISTRATION">Administration</option>
                    <option value="FINANCE">Finance</option>
                    <option value="SUPPORT">Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">System Role</label>
                  <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white">
                    <option value="">Select a Role...</option>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>

            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={handleAdd} disabled={isPending || !firstName || !email || !roleId} className="px-5 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm disabled:opacity-50">Create Staff Profile</button>
            </div>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">Edit Staff Member</h3>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">First Name</label>
                  <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Last Name</label>
                  <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input type="email" value={email} disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Employee Number</label>
                  <input type="text" value={employeeNumber} onChange={(e) => setEmployeeNumber(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Job Title</label>
                  <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Math Teacher" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
                  <select value={department} onChange={(e) => setDepartment(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white">
                    <option value="ACADEMIC">Academic</option>
                    <option value="ADMINISTRATION">Administration</option>
                    <option value="FINANCE">Finance</option>
                    <option value="SUPPORT">Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">System Role</label>
                  <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:bg-white">
                    <option value="">Select a Role...</option>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>

            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowEdit(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={handleEdit} disabled={isPending || !firstName} className="px-5 py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm disabled:opacity-50">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
