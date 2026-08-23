"use client";

import React, { useState, useTransition } from "react";
import { HeartPulse, Plus, Search, Filter, ShieldPlus, Users, Activity, ExternalLink, X, Edit, Trash } from "lucide-react";
import { createBenefit, updateBenefit, deleteBenefit } from "./actions";

interface Benefit {
  id: string;
  title: string;
  provider: string;
  type: string;
  limit: string;
  status: string;
}

export default function BenefitsClient({ tenantId, initialBenefits }: { tenantId: string, initialBenefits: Benefit[] }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null);
  const [formData, setFormData] = useState<Partial<Benefit>>({});

  const handleOpenModal = (benefit?: Benefit) => {
    if (benefit) {
      setEditingBenefit(benefit);
      setFormData(benefit);
    } else {
      setEditingBenefit(null);
      setFormData({ type: "Health", status: "Active" });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (editingBenefit) {
        await updateBenefit(editingBenefit.id, formData);
      } else {
        await createBenefit(tenantId, formData);
      }
      setIsModalOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this benefit?")) {
      startTransition(async () => {
        await deleteBenefit(id);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
             <ShieldPlus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Health Plans</p>
            <p className="text-2xl font-black text-slate-800">
              {initialBenefits.filter(b => b.type === "Health" && b.status === "Active").length}
            </p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
             <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wellness Programs</p>
            <p className="text-2xl font-black text-slate-800">
              {initialBenefits.filter(b => b.type === "Wellness").length}
            </p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
             <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled Staff</p>
            <p className="text-2xl font-black text-slate-800">0</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
         <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search benefits..." className="w-full md:w-80 pl-9 pr-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900 shadow-sm" />
         </div>
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
               <Filter className="w-4 h-4" />
               Filter
            </button>
            <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
               <Plus className="w-4 h-4" />
               New Benefit
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
         {initialBenefits.map((benefit) => {
            const Icon = benefit.type === 'Health' ? ShieldPlus : Activity;
            const bgClass = benefit.type === 'Health' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600';

            return (
               <div key={benefit.id} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-xl transition-all duration-300 group flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${bgClass}`}>
                           <Icon className="w-6 h-6" />
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${bgClass}`}>
                                 {benefit.type}
                              </span>
                           </div>
                           <h3 className="font-black text-lg text-slate-800 leading-tight">{benefit.title}</h3>
                           <p className="text-xs font-bold text-slate-400 mt-0.5">Provider: <span className="text-slate-600">{benefit.provider}</span></p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                         <button onClick={() => handleOpenModal(benefit)} className="text-slate-400 hover:text-primary-600 transition-colors"><Edit className="w-4 h-4" /></button>
                         <button onClick={() => handleDelete(benefit.id)} className="text-slate-400 hover:text-rose-600 transition-colors"><Trash className="w-4 h-4" /></button>
                     </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-2xl p-4 mb-4 flex-grow flex justify-between items-center">
                     <div>
                        <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Coverage / Limit</p>
                        <p className="font-bold text-slate-700 text-sm">{benefit.limit}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Enrolled</p>
                        <div className="flex items-center justify-end gap-1 font-black text-slate-800">
                           <Users className="w-3.5 h-3.5 text-primary-500" />
                           0
                        </div>
                     </div>
                  </div>
               </div>
            );
         })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">{editingBenefit ? "Edit Benefit" : "New Benefit"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                <input required type="text" value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Provider</label>
                  <input required type="text" value={formData.provider || ""} onChange={e => setFormData({...formData, provider: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type</label>
                  <select required value={formData.type || "Health"} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900">
                    <option>Health</option>
                    <option>Wellness</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Coverage / Limit</label>
                  <input required type="text" value={formData.limit || ""} onChange={e => setFormData({...formData, limit: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                  <select required value={formData.status || "Active"} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={isPending} className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-sm shadow-primary-900/20 transition-all">{isPending ? "Saving..." : "Save Benefit"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
