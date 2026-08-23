"use client";

import React, { useState, useTransition } from "react";
import { Search, Users, Plus, Edit, Trash2 } from "lucide-react";
import { createGroup, deleteGroup } from "@/app/actions/userManagement";
import { useRouter } from "next/navigation";

export default function GroupsClient({ initialGroups }: { initialGroups: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!name) return;
    await createGroup({ name, description });
    setShowModal(false);
    setName("");
    setDescription("");
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      await deleteGroup(id);
      router.refresh();
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
      <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
         <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search groups..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
         </div>
         <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
            <Plus className="w-4 h-4" />
            Create Group
         </button>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
         {initialGroups.map((group) => (
            <div key={group.id} className={`border border-slate-200 p-5 rounded-2xl transition-all group ${isPending ? 'opacity-50 pointer-events-none' : 'hover:border-primary-400 hover:shadow-md'}`}>
               <div className="flex justify-between items-start mb-3">
                  <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600">
                     <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                     Group
                  </span>
               </div>
               <h4 className="font-bold text-slate-800 text-lg mb-1">{group.name}</h4>
               <p className="text-sm text-slate-500 font-medium mb-4">{group.description || "No description provided."}</p>
               
               <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-600">
                     <span className="text-primary-600">{group._count?.members || 0}</span> Members
                  </div>
                  <div className="flex gap-2">
                     <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                     </button>
                     <button onClick={() => handleDelete(group.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>
         ))}
         {initialGroups.length === 0 && (
           <div className="col-span-1 md:col-span-2 p-12 text-center text-slate-500 font-medium">
             No groups found. Create one to get started.
           </div>
         )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">Create New Group</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Group Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-primary-500 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-primary-500 focus:bg-white"></textarea>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={handleCreate} disabled={!name} className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-sm disabled:opacity-50">Save Group</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
