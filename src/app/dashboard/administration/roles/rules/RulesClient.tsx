"use client";

import React, { useState, useTransition } from "react";
import { Search, Plus, ArrowRight } from "lucide-react";
import { createRule, toggleRuleStatus } from "@/app/actions/rolesAndPermissions";

type Rule = {
  id: string;
  action: string;
  trigger: string;
  approver: string;
  status: string;
};

export default function RulesClient({ initialRules }: { initialRules: Rule[] }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ trigger: "", action: "", approver: "" });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await createRule(formData);
      setIsModalOpen(false);
      setFormData({ trigger: "", action: "", approver: "" });
    });
  };

  const handleToggle = (id: string, currentStatus: string) => {
    startTransition(async () => {
      await toggleRuleStatus(id, currentStatus);
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px] relative">
      <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
         <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search rules..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
         </div>
         <button 
            onClick={() => setIsModalOpen(true)}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
         >
            <Plus className="w-4 h-4" />
            Create Rule
         </button>
      </div>

      <div className="p-6">
         <div className="grid grid-cols-1 gap-4">
            {initialRules.map((rule) => (
               <div key={rule.id} className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary-400 hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-2 sm:gap-6 w-full max-w-2xl flex-wrap sm:flex-nowrap">
                     <div className="w-full sm:w-1/3 mb-2 sm:mb-0">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">If (Trigger)</div>
                        <div className="font-bold text-sm text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 truncate">{rule.trigger}</div>
                     </div>
                     <div className="hidden sm:flex flex-col items-center justify-center shrink-0 w-16 md:w-24">
                        <span className="text-[10px] font-black uppercase tracking-wider text-primary-600 mb-1">Requests</span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-slate-300" />
                     </div>
                     <div className="w-full sm:w-1/3 mb-2 sm:mb-0">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Action</div>
                        <div className="font-bold text-sm text-slate-800 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 truncate">{rule.action}</div>
                     </div>
                     <div className="hidden sm:flex flex-col items-center justify-center shrink-0 w-16 md:w-24">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 mb-1">Then</span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-slate-300" />
                     </div>
                     <div className="w-full sm:w-1/3">
                        <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Requires Approval</div>
                        <div className="font-bold text-sm text-primary-700 bg-primary-50 px-3 py-2 rounded-lg border border-primary-100 truncate">{rule.approver}</div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4 md:mt-0">
                     <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md ${rule.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {rule.status}
                     </span>
                     <button 
                        onClick={() => handleToggle(rule.id, rule.status)}
                        disabled={isPending}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors border ${rule.status === 'Active' ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-100' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-100'}`}
                     >
                        {rule.status === 'Active' ? 'Disable' : 'Enable'}
                     </button>
                  </div>
               </div>
            ))}
            {initialRules.length === 0 && (
                <div className="text-center py-10 text-slate-500 text-sm font-medium">No rules found.</div>
            )}
         </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-5 border-b border-slate-100 font-bold text-lg text-slate-800">
              Create New Rule
            </div>
            <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Trigger (Who)</label>
                <input required type="text" value={formData.trigger} onChange={e => setFormData({...formData, trigger: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="e.g., Teacher, Bursar" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Action (What)</label>
                <input required type="text" value={formData.action} onChange={e => setFormData({...formData, action: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="e.g., Final Grade Modification" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Approver (Then)</label>
                <input required type="text" value={formData.approver} onChange={e => setFormData({...formData, approver: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="e.g., Principal, School Board" />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={isPending} className="px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm disabled:opacity-50">
                  {isPending ? "Saving..." : "Create Rule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
