"use client";

import React, { useState, useTransition } from "react";
import { BookOpen, Plus, Search, Filter, BookKey, Beaker, Globe, Calculator, Palette, Trash2 } from "lucide-react";
import { createSubject, deleteSubject } from "@/app/actions/subjects";
import { useRouter } from "next/navigation";

export default function SubjectsClient({ subjects }: { subjects: any[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [isCoreSubject, setIsCoreSubject] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAdd = async () => {
    if (!name || !code) return;
    setLoading(true);
    startTransition(async () => {
      await createSubject({ name, code, isCoreSubject });
      setLoading(false);
      setShowAdd(false);
      setName("");
      setCode("");
      router.refresh();
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      startTransition(async () => {
        await deleteSubject(id);
        router.refresh();
      });
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
               <BookOpen className="w-5 h-5" />
            </div>
            <div>
               <h3 className="text-xl font-black text-slate-800">Curriculum & Subjects</h3>
               <p className="text-sm font-medium text-slate-500">Manage subject offerings, codes, and core/elective rules.</p>
            </div>
         </div>
         <button 
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Subject
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {subjects.map((subject) => {
            return (
               <div key={subject.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm group">
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400">
                        <BookOpen className="w-5 h-5" />
                     </div>
                     <div className="flex items-center gap-2">
                       <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${
                          subject.isCoreSubject ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                       }`}>
                          {subject.isCoreSubject ? 'Core' : 'Elective'}
                       </span>
                       <button 
                         onClick={() => handleDelete(subject.id)}
                         disabled={isPending}
                         className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                  </div>
                  
                  <h4 className="text-lg font-black text-slate-800 mb-1 group-hover:text-sky-700 transition-colors">{subject.name}</h4>
                  
                  <div className="flex items-center gap-3 mt-3">
                     <div className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600">
                        {subject.code}
                     </div>
                  </div>
               </div>
            );
         })}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">Add New Subject</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subject Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mathematics"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-sky-500 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Subject Code</label>
                <input 
                  type="text" 
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. MAT101"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-sky-500 focus:bg-white transition-all uppercase"
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isCore"
                  checked={isCoreSubject}
                  onChange={(e) => setIsCoreSubject(e.target.checked)}
                  className="w-4 h-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                />
                <label htmlFor="isCore" className="text-sm font-bold text-slate-700">This is a Core (Mandatory) Subject</label>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl">Cancel</button>
              <button onClick={handleAdd} disabled={loading || !name || !code} className="px-5 py-2.5 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-sm disabled:opacity-50">Add Subject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
