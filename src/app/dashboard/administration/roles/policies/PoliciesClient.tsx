"use client";

import React, { useState, useTransition } from "react";
import { Search, ShieldAlert, Lock, Plus } from "lucide-react";
import { createPolicy, togglePolicyStatus } from "@/app/actions/rolesAndPermissions";

type Policy = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  scope: string;
};

export default function PoliciesClient({ initialPolicies }: { initialPolicies: Policy[] }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", scope: "" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await createPolicy(formData);
      setIsModalOpen(false);
      setFormData({ name: "", description: "", scope: "" });
    });
  };

  const handleToggle = (id: string, currentStatus: string) => {
    startTransition(async () => {
      await togglePolicyStatus(id, currentStatus);
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px] relative">
      <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
         <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search policies..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
         </div>
         <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
            disabled={isPending}
         >
            <Plus className="w-4 h-4" />
            New Policy
         </button>
      </div>

      <div className="p-6 grid grid-cols-1 gap-4">
         {initialPolicies.map((policy) => (
            <div key={policy.id} className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary-400 hover:shadow-sm transition-all group">
               <div className="flex items-start gap-4">
                  <div className={`mt-1 p-2.5 rounded-xl shrink-0 ${policy.status === 'Active' ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>
                     {policy.status === 'Active' ? <ShieldAlert className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div>
                     <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-bold text-lg ${policy.status === 'Active' ? 'text-slate-800' : 'text-slate-500'}`}>{policy.name}</h4>
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${policy.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                           {policy.status}
                        </span>
                     </div>
                     <p className={`text-sm font-medium ${policy.status === 'Active' ? 'text-slate-500' : 'text-slate-400'} max-w-2xl`}>{policy.description}</p>
                     
                     <div className="mt-3 flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Scope:</span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{policy.scope}</span>
                     </div>
                  </div>
               </div>
               
               <div className="flex items-center gap-2 md:self-end">
                  <button className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors">
                     Edit
                  </button>
                  <button 
                     onClick={() => handleToggle(policy.id, policy.status)}
                     disabled={isPending}
                     className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors border ${policy.status === 'Active' ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-100' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-100'}`}
                  >
                     {policy.status === 'Active' ? 'Disable' : 'Enable'}
                  </button>
               </div>
            </div>
         ))}
         {initialPolicies.length === 0 && (
             <div className="text-center py-10 text-slate-500 text-sm font-medium">No policies found.</div>
         )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 font-bold text-lg text-slate-800">
              Create New Policy
            </div>
            <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="e.g., MFA Requirement" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Scope</label>
                <input required type="text" value={formData.scope} onChange={e => setFormData({...formData, scope: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="e.g., All Users, Teachers" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="Describe the policy..."></textarea>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={isPending} className="px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm disabled:opacity-50">
                  {isPending ? "Saving..." : "Create Policy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
