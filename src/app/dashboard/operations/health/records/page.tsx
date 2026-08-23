"use client";

import React from "react";
import { FileText, Search, Filter, Plus, User, AlertTriangle, ShieldCheck, HeartPulse } from "lucide-react";

export default function MedicalRecordsPage() {
  const records = [
    { id: "MED-REC-01", student: "Emily Chen", grade: "Grade 10", bloodType: "O+", condition: "Asthma", severity: "High", lastCheckup: "Aug 01, 2024", allergies: "Peanuts" },
    { id: "MED-REC-02", student: "David Kim", grade: "Grade 8", bloodType: "A+", condition: "None", severity: "None", lastCheckup: "Jul 15, 2024", allergies: "None" },
    { id: "MED-REC-03", student: "Sarah Williams", grade: "Grade 12", bloodType: "B-", condition: "Diabetes Type 1", severity: "High", lastCheckup: "Aug 10, 2024", allergies: "None" },
    { id: "MED-REC-04", student: "Michael Johnson", grade: "Grade 9", bloodType: "O-", condition: "Mild Eczema", severity: "Low", lastCheckup: "Jun 22, 2024", allergies: "Dust Mites" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl hidden md:block">
                 <FileText className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Medical Records</h2>
                 <p className="text-sm font-medium text-slate-500">Manage student health profiles, allergies, and chronic conditions.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              New Record
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Student Name or ID..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Severities</option>
                 <option>High Risk</option>
                 <option>Medium Risk</option>
                 <option>Low Risk</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Info</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Type</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Conditions & Allergies</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Checkup</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {records.map((record) => (
                   <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-slate-400" />
                           </div>
                           <div>
                              <span className="font-bold text-slate-800 text-sm leading-tight block mb-0.5">{record.student}</span>
                              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                 <span>{record.id}</span>
                                 <span>•</span>
                                 <span>{record.grade}</span>
                              </div>
                           </div>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-50 text-rose-600 font-black text-sm border border-rose-100">
                           {record.bloodType}
                        </span>
                     </td>
                     <td className="py-4 px-6">
                        <div className="space-y-1.5">
                           <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded border ${
                                 record.severity === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                                 record.severity === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                 record.severity === 'Low' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                 'bg-slate-50 text-slate-600 border-slate-200'
                              }`}>
                                 {record.condition}
                              </span>
                           </div>
                           {record.allergies !== 'None' && (
                              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                                 <AlertTriangle className="w-3 h-3" /> Allergies: {record.allergies}
                              </div>
                           )}
                           {record.allergies === 'None' && record.condition === 'None' && (
                              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                                 <ShieldCheck className="w-3 h-3" /> No known conditions
                              </div>
                           )}
                        </div>
                     </td>
                     <td className="py-4 px-6">
                       <p className="text-sm font-medium text-slate-700">{record.lastCheckup}</p>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <button className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-primary-100 flex items-center gap-1 ml-auto">
                           <HeartPulse className="w-3.5 h-3.5" /> Full Profile
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
