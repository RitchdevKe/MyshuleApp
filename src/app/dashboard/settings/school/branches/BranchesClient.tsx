"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Network, Plus, Trash2, Building, CheckSquare, Square } from "lucide-react";
import { createBranch, deleteBranch } from "../actions";

const AVAILABLE_LEVELS = [
  { id: "PRE_PRIMARY", label: "Pre-Primary" },
  { id: "PRIMARY", label: "Primary" },
  { id: "JUNIOR", label: "Junior Secondary" },
  { id: "SENIOR", label: "Senior Secondary" },
];

export default function BranchesClient({ branches }: { branches: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [levelTypes, setLevelTypes] = useState<string[]>([]);

  const toggleLevel = (id: string) => {
     setLevelTypes(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  const handleAdd = () => {
    if (!name || levelTypes.length === 0) return;
    startTransition(async () => {
      await createBranch({ name, levelTypes: levelTypes as any[] });
      router.refresh();
      setShowAdd(false);
      setName("");
      setLevelTypes([]);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this branch?")) {
      startTransition(async () => {
        await deleteBranch(id);
        router.refresh();
      });
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Campuses & Branches</h3>
            <p className="text-sm font-medium text-slate-500">Manage the physical locations of your school.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Branch
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm group relative">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                <Building className="w-5 h-5" />
              </div>
              <button 
                onClick={() => handleDelete(branch.id)}
                disabled={isPending}
                className="text-slate-400 hover:text-red-500 transition-colors p-1 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h4 className="text-lg font-black text-slate-800 mb-2">{branch.name}</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {branch.levelTypes?.map((lt: string) => (
                 <span key={lt} className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded">
                   {lt.replace('_', ' ')}
                 </span>
              ))}
            </div>
          </div>
        ))}
        {branches.length === 0 && (
           <div className="col-span-full p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-medium">
              No branches found. Add your first campus!
           </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">Add New Branch</h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Branch Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Main Campus"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-primary-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Available Levels in this Branch</label>
                <div className="space-y-3">
                   {AVAILABLE_LEVELS.map(lvl => (
                      <div 
                         key={lvl.id} 
                         onClick={() => toggleLevel(lvl.id)}
                         className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${levelTypes.includes(lvl.id) ? 'bg-primary-50 border-primary-200' : 'hover:bg-slate-50 border-slate-200'}`}
                      >
                         {levelTypes.includes(lvl.id) ? <CheckSquare className="w-5 h-5 text-primary-500" /> : <Square className="w-5 h-5 text-slate-300" />}
                         <span className="font-bold text-sm">{lvl.label}</span>
                      </div>
                   ))}
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button 
                onClick={() => setShowAdd(false)}
                disabled={isPending}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleAdd}
                disabled={isPending || !name || levelTypes.length === 0}
                className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                {isPending ? "Adding..." : "Add Branch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
