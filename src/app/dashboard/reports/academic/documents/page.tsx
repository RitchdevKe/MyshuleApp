"use client";
import React from "react";
import { FileText, Printer, CheckCircle, Clock, Download, Settings } from "lucide-react";

export default function AcademicDocumentsTab() {
  const documentBatches = [
    { name: "Grade 8 Term 2 Report Cards", type: "Report Card", count: 240, status: "completed", date: "Today, 08:30 AM" },
    { name: "Form 4 Leaving Certificates", type: "Certificate", count: 180, status: "completed", date: "Yesterday, 14:15 PM" },
    { name: "Grade 7 Term 2 Transcripts", type: "Transcript", count: 235, status: "processing", date: "In Progress" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-lg font-black text-slate-800">Document Generation</h2>
            <p className="text-sm text-slate-500">Bulk generate, print, and manage academic documents.</p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
         
         {/* Generation Action Cards */}
         <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl shadow-sm text-center group cursor-pointer hover:bg-indigo-100 transition-colors">
            <div className="w-16 h-16 bg-white text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
               <FileText className="w-8 h-8" />
            </div>
            <h3 className="font-black text-slate-800">Report Cards</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Generate end-of-term reports.</p>
            <button className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-white border border-indigo-200 px-4 py-2 rounded-lg group-hover:shadow-sm transition-all">Generate Batch</button>
         </div>

         <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl shadow-sm text-center group cursor-pointer hover:bg-emerald-100 transition-colors">
            <div className="w-16 h-16 bg-white text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
               <Printer className="w-8 h-8" />
            </div>
            <h3 className="font-black text-slate-800">Transcripts</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Print official academic transcripts.</p>
            <button className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-white border border-emerald-200 px-4 py-2 rounded-lg group-hover:shadow-sm transition-all">Generate Batch</button>
         </div>

         <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl shadow-sm text-center group cursor-pointer hover:bg-amber-100 transition-colors">
            <div className="w-16 h-16 bg-white text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
               <Settings className="w-8 h-8" />
            </div>
            <h3 className="font-black text-slate-800">Certificates</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Issue leaving and merit certificates.</p>
            <button className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-white border border-amber-200 px-4 py-2 rounded-lg group-hover:shadow-sm transition-all">Generate Batch</button>
         </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
         <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
               <h3 className="font-black text-slate-800">Recent Generation Batches</h3>
               <p className="text-xs text-slate-500 mt-1">Monitor the status of your bulk document generation jobs.</p>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Batch Name</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Document Type</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Record Count</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {documentBatches.map((batch, i) => (
                     <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4">
                           <div className="font-bold text-slate-800 text-sm">{batch.name}</div>
                           <div className="text-[10px] text-slate-500 font-medium">{batch.date}</div>
                        </td>
                        <td className="p-4 text-sm font-medium text-slate-600">{batch.type}</td>
                        <td className="p-4 text-center text-sm font-black text-slate-700">{batch.count}</td>
                        <td className="p-4 text-center">
                           {batch.status === 'completed' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider rounded border border-emerald-100">
                                 <CheckCircle className="w-3 h-3" /> Completed
                              </span>
                           ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded border border-amber-100">
                                 <Clock className="w-3 h-3" /> Processing (45%)
                              </span>
                           )}
                        </td>
                        <td className="p-4 text-right">
                           <button 
                              className={`text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 ml-auto transition-all ${
                                 batch.status === 'completed' 
                                 ? 'bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200' 
                                 : 'bg-slate-50 border border-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                              disabled={batch.status !== 'completed'}
                           >
                              <Download className="w-3 h-3"/> Download ZIP
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
