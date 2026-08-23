"use client";

import React, { useState } from "react";
import { Download, Search, ShieldCheck, AlertTriangle, CheckCircle, FileText, Activity } from "lucide-react";

export default function CompliancePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const complianceLogs = [
    { id: "LOG-2026-142", category: "Health & Safety", title: "Fire Drill Evacuation (Term 1)", date: "2026-09-12", status: "Passed", auditor: "Nairobi Fire Dept" },
    { id: "LOG-2026-141", category: "Regulatory", title: "MoE Termly Returns Submission", date: "2026-09-05", status: "Passed", auditor: "Ministry of Education" },
    { id: "LOG-2026-140", category: "Health & Safety", title: "Kitchen Hygiene Inspection", date: "2026-08-28", status: "Action Required", auditor: "County Health" },
    { id: "LOG-2026-139", category: "Infrastructure", title: "School Bus Fleet Roadworthiness", date: "2026-08-15", status: "Passed", auditor: "NTSA" },
    { id: "LOG-2026-138", category: "Academic", title: "KNEC Center Verification", date: "2026-08-01", status: "Passed", auditor: "KNEC Board" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Compliance & Safety</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Track regulatory compliance, safety drills, and inspection logs.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm">
          <Download className="w-4 h-4" /> Export Compliance Report
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/80 backdrop-blur-xl border border-emerald-200/60 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
               </div>
               <h3 className="text-xs font-black uppercase tracking-wider text-emerald-700">Overall Compliance Status</h3>
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">98.5%</div>
            <p className="text-xs font-bold text-emerald-600">Meets regulatory standards</p>
         </div>

         <div className="bg-white/80 backdrop-blur-xl border border-amber-200/60 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
               </div>
               <h3 className="text-xs font-black uppercase tracking-wider text-amber-700">Pending Actions</h3>
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">3</div>
            <p className="text-xs font-bold text-amber-600">Require attention within 14 days</p>
         </div>

         <div className="bg-white/80 backdrop-blur-xl border border-blue-200/60 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
               </div>
               <h3 className="text-xs font-black uppercase tracking-wider text-blue-700">Recent Inspections</h3>
            </div>
            <div className="text-3xl font-black text-slate-800 mb-1">12</div>
            <p className="text-xs font-bold text-blue-600">Logged in the last 90 days</p>
         </div>
      </div>

      {/* Compliance Log Table */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
         <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Inspection & Audit Logs</h3>
            <div className="relative w-full sm:w-72">
               <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
               <input 
                  type="text" 
                  placeholder="Search logs..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-900 focus:ring-1 focus:ring-primary-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
               <thead>
                  <tr className="bg-white border-b border-slate-100">
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Log ID & Title</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date Logged</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Auditor/Authority</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                     <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Certificate</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {complianceLogs.map((log, idx) => (
                     <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6">
                           <div className="font-bold text-sm text-slate-800">{log.title}</div>
                           <div className="text-xs font-medium text-slate-500 mt-0.5">{log.id}</div>
                        </td>
                        <td className="py-4 px-6">
                           <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md bg-slate-100 text-slate-600">
                              {log.category}
                           </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-slate-600">{log.date}</td>
                        <td className="py-4 px-6 text-sm font-medium text-slate-800">{log.auditor}</td>
                        <td className="py-4 px-6">
                           <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md ${
                              log.status === 'Passed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                           }`}>
                              {log.status === 'Passed' ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                              {log.status}
                           </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                           <button className="p-1.5 text-slate-400 hover:text-primary-600 bg-white border border-slate-200 hover:border-primary-300 rounded shadow-sm transition-colors ml-auto" title="View Document">
                              <FileText className="w-4 h-4" />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
