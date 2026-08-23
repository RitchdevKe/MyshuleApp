"use client";

import React from "react";
import { Plus, LayoutList } from "lucide-react";

export default function FeeStructuresPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-between items-center bg-white/40 p-4 rounded-2xl border border-white/60 backdrop-blur-md">
         <h2 className="text-lg font-bold text-slate-800">Active Fee Structures (2026 Term 2)</h2>
         <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-all shadow-sm">
            <Plus className="w-4 h-4" />
            New Structure
          </button>
      </div>

      {[
        { grade: 'Grade 1-3 (Lower Primary)', tuition: '25,000', transport: '12,000', lunch: '8,000', total: '45,000' },
        { grade: 'Grade 4-6 (Upper Primary)', tuition: '35,000', transport: '12,000', lunch: '8,000', total: '55,000' },
        { grade: 'Junior Secondary (JSS)', tuition: '45,000', transport: '15,000', lunch: '10,000', total: '70,000' },
      ].map((struct, i) => (
        <div key={i} className="bg-gradient-to-br from-white to-slate-50/80 rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
             <div className="p-3 bg-secondary-50 text-secondary-600 rounded-2xl">
                <LayoutList className="w-6 h-6" />
             </div>
             <span className="bg-secondary-100/50 text-secondary-700 text-xs font-extrabold px-3 py-1 rounded-lg border border-secondary-200">Active</span>
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-4">{struct.grade}</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
               <span className="font-semibold text-slate-500">Tuition Fee</span>
               <span className="font-bold text-slate-700">KSh {struct.tuition}</span>
            </div>
            <div className="flex justify-between text-sm">
               <span className="font-semibold text-slate-500">Transport (Optional)</span>
               <span className="font-bold text-slate-700">KSh {struct.transport}</span>
            </div>
            <div className="flex justify-between text-sm">
               <span className="font-semibold text-slate-500">Lunch (Optional)</span>
               <span className="font-bold text-slate-700">KSh {struct.lunch}</span>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-200/80 flex justify-between items-center">
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Base Total</span>
             <span className="text-xl font-black text-primary-900">KSh {struct.total}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
