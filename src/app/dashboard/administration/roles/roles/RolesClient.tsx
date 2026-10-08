"use client";

import React, { useState, useTransition } from "react";
import { Shield, Plus, Edit2, Trash2, ShieldAlert } from "lucide-react";
import { createRole, deleteRole, updateRole } from "@/app/actions/staff";
import { useRouter } from "next/navigation";

export default function RolesClient({ initialRoles }: { initialRoles: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [roleName, setRoleName] = useState("");
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRole, setEditRole] = useState<{id: string, name: string} | null>(null);

  const handleCreate = () => {
    if (!roleName) return;
    startTransition(async () => {
      await createRole(roleName);
      setShowModal(false);
      setRoleName("");
      router.refresh();
    });
  };

  const handleEdit = () => {
    if (!editRole || !editRole.name) return;
    startTransition(async () => {
      await updateRole(editRole.id, editRole.name);
      setShowEditModal(false);
      setEditRole(null);
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteRole(id);
      router.refresh();
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden p-6">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-xl font-black text-slate-800">System Roles</h2>
         <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-primary-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-primary-800 transition-colors">
            <Plus className="w-4 h-4" /> Add Role
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Role Directory */}
        <div className={`lg:col-span-2 space-y-4 transition-opacity ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
          {initialRoles.map((role) => {
            const isSystemDefault = ["School Owner", "Principal", "Bursar", "Teacher", "Deputy Bursar", "Transport Coordinator"].includes(role.name);
            return (
            <div key={role.id} className="bg-white border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSystemDefault ? 'bg-primary-50 text-primary-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    {role.name}
                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded ${
                      isSystemDefault ? 'bg-primary-100 text-primary-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>{isSystemDefault ? "System Default" : "Custom Role"}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-500 mt-1">
                    {role.userCount} Users
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                   onClick={() => {
                     setEditRole({ id: role.id, name: role.name });
                     setShowEditModal(true);
                   }}
                   className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors"
                 >
                   <Edit2 className="w-4 h-4" />
                 </button>
                 {!isSystemDefault && (
                    <button onClick={() => handleDelete(role.id)} className="p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                 )}
              </div>
            </div>
          )})}
          
          {initialRoles.length === 0 && (
             <div className="p-8 text-center text-slate-500 font-medium border border-dashed border-slate-300 rounded-2xl">
                No roles found.
             </div>
          )}
        </div>

        {/* Context Simulator Tool */}
        <div className="lg:col-span-1 bg-primary-900 rounded-2xl p-6 text-white shadow-lg h-fit border border-primary-800">
          <h3 className="text-sm font-black text-primary-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-secondary-500" /> Access Simulator
          </h3>
          <p className="text-xs text-primary-100 mb-6 leading-relaxed">
            Test what a user can see and do based on their assigned roles and specific contexts.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-primary-300 block mb-1">Select User</label>
              <select className="w-full bg-primary-800/50 border border-primary-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-secondary-500">
                <option>Select a user to test...</option>
              </select>
            </div>
            <button className="w-full mt-4 bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-secondary-500/20">
              Run Simulation
            </button>
          </div>
        </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">Create New Role</h3>
            </div>
            <div className="p-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Role Name</label>
              <input type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="e.g. Librarian" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-primary-500 focus:bg-white" />
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={handleCreate} disabled={!roleName || isPending} className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-sm disabled:opacity-50">Save Role</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editRole && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">Edit Role</h3>
            </div>
            <div className="p-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Role Name</label>
              <input type="text" value={editRole.name} onChange={(e) => setEditRole({...editRole, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-primary-500 focus:bg-white" />
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => { setShowEditModal(false); setEditRole(null); }} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={handleEdit} disabled={!editRole.name || isPending} className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-sm disabled:opacity-50">Update Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
