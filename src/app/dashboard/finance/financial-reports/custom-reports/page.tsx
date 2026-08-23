"use client";

import React, { useState } from "react";
import { FileBox, Plus, Search, LayoutTemplate, MoreVertical, FileText, ChevronRight, Settings2 } from "lucide-react";

export default function CustomReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const templates = [
    { id: "REP-1", title: "Departmental Spend Analysis", desc: "Detailed breakdown of budget vs actuals grouped by department and account category.", type: "Matrix", lastRun: "2 days ago" },
    { id: "REP-2", title: "Fee Collection Deficits", desc: "List of students with outstanding balances cross-referenced with sibling discounts.", type: "List", lastRun: "Today" },
    { id: "REP-3", title: "Payroll Variance", desc: "Month-over-month comparison of total payroll costs including allowances.", type: "Comparison", lastRun: "1 week ago" },
    { id: "REP-4", title: "Vendor Payment History", desc: "Total amounts paid to external vendors grouped by category over the last year.", type: "Summary", lastRun: "3 weeks ago" },
  ];

  return (
    <div className="space-y-8">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
            <h2 className="text-xl font-black text-slate-800">Report Builder</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Create, save, and export custom financial data views.</p>
         </div>
         <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                 type="text" 
                 placeholder="Search saved reports..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900 shadow-sm" 
               />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-900/20 transition-all">
               <Plus className="w-4 h-4" /> New Report
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         
         {/* LEFT SIDEBAR: Report Configuration Panel Mockup */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm">
               <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200 text-slate-800">
                  <Settings2 className="w-5 h-5 text-primary-600" />
                  <h3 className="font-bold">Quick Build</h3>
               </div>
               
               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Data Source</label>
                     <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-primary-500">
                        <option>General Ledger</option>
                        <option>Accounts Payable</option>
                        <option>Accounts Receivable</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Date Range</label>
                     <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-primary-500">
                        <option>This Month</option>
                        <option>Last Month</option>
                        <option>Year to Date</option>
                        <option>Custom Range</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Group By</label>
                     <select className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-primary-500">
                        <option>Account Code</option>
                        <option>Department</option>
                        <option>Cost Center</option>
                     </select>
                  </div>
                  
                  <button className="w-full py-2.5 mt-2 bg-white border border-slate-200 text-primary-900 rounded-xl text-sm font-bold shadow-sm hover:bg-primary-50 hover:border-primary-200 transition-colors flex items-center justify-center gap-2">
                     Generate Preview <ChevronRight className="w-4 h-4" />
                  </button>
               </div>
            </div>
         </div>

         {/* RIGHT MAIN: Saved Templates */}
         <div className="lg:col-span-3">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Saved Reports & Templates</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {templates.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase())).map(template => (
                  <div key={template.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-primary-200 transition-all group relative flex flex-col h-full cursor-pointer">
                     
                     <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center shrink-0">
                           {template.type === 'Matrix' ? <LayoutTemplate className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                        </div>
                        <button className="p-1.5 text-slate-400 hover:text-primary-900 hover:bg-slate-50 rounded-lg transition-colors z-10" onClick={(e) => e.stopPropagation()}>
                           <MoreVertical className="w-4 h-4" />
                        </button>
                     </div>
                     
                     <h4 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-primary-900 transition-colors">{template.title}</h4>
                     <p className="text-sm text-slate-500 flex-1 leading-relaxed">{template.desc}</p>
                     
                     <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase">{template.type}</span>
                        <span className="text-xs font-medium text-slate-400">Last run: {template.lastRun}</span>
                     </div>

                  </div>
               ))}
            </div>

            {templates.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
               <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <FileBox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-700">No reports found</p>
                  <p className="text-sm text-slate-500 mt-1">Try adjusting your search term.</p>
               </div>
            )}
         </div>

      </div>
    </div>
  );
}
