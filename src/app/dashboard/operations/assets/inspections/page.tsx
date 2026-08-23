"use client";

import React from "react";
import { ShieldAlert, Search, Filter, Plus, FileText, CheckCircle2, XCircle, AlertTriangle, FileBadge } from "lucide-react";

export default function InspectionsPage() {
  const inspections = [
    { id: "INSP-2024-055", title: "Annual Fire Safety Audit", category: "Safety", location: "Entire Campus", inspector: "City Fire Dept", date: "Aug 05, 2024", score: "92%", status: "Passed", issues: 1 },
    { id: "INSP-2024-054", title: "Health & Sanitation Check", category: "Compliance", location: "Cafeteria & Kitchens", inspector: "Ministry of Health", date: "Jul 28, 2024", score: "85%", status: "Passed with Conditions", issues: 3 },
    { id: "INSP-2024-053", title: "Structural Integrity Assessment", category: "Infrastructure", location: "Sports Complex", inspector: "Eng. Robert O.", date: "Jul 15, 2024", score: "60%", status: "Failed", issues: 5 },
    { id: "INSP-2024-052", title: "Termite & Pest Control", category: "Maintenance", location: "Main Library", inspector: "PestAway Ltd", date: "Jul 10, 2024", score: "100%", status: "Passed", issues: 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl hidden md:block">
                 <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Safety & Compliance Inspections</h2>
                 <p className="text-sm font-medium text-slate-500">Log regulatory audits and internal safety checks for facilities.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Log Inspection
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Title, Category, or Inspector..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Categories</option>
                 <option>Safety</option>
                 <option>Compliance</option>
                 <option>Infrastructure</option>
                 <option>Maintenance</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Date Range
              </button>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Audit Details</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Location & Date</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Inspector & Score</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Result</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Report</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {inspections.map((insp) => (
                   <tr key={insp.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm">{insp.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{insp.id}</span>
                           <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                           <span className="text-xs font-medium text-slate-500">{insp.category}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <p className="font-bold text-slate-700 text-sm">{insp.location}</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{insp.date}</p>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 mb-1 text-sm">
                           <FileBadge className="w-3.5 h-3.5 text-slate-400" />
                           <span className="font-bold text-slate-700">{insp.inspector}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Score: {insp.score}</p>
                     </td>
                     <td className="py-4 px-6">
                       <div className="flex flex-col items-start gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                            insp.status === 'Passed' ? 'bg-emerald-50 text-emerald-600' : 
                            insp.status === 'Passed with Conditions' ? 'bg-amber-50 text-amber-600' : 
                            'bg-rose-50 text-rose-600'
                          }`}>
                            {insp.status === 'Passed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {insp.status === 'Passed with Conditions' && <AlertTriangle className="w-3.5 h-3.5" />}
                            {insp.status === 'Failed' && <XCircle className="w-3.5 h-3.5" />}
                            {insp.status}
                          </span>
                          {insp.issues > 0 && (
                             <span className="text-[10px] font-bold text-rose-600 ml-1">{insp.issues} flag(s) raised</span>
                          )}
                       </div>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <button className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors inline-flex">
                           <FileText className="w-5 h-5" />
                        </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}
