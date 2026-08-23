"use client";

import React from "react";
import { Download, Filter, Target, Clock, ArrowRight } from "lucide-react";

export default function OperationsPage() {
  const admissionsFunnel = [
    { stage: "Inquiries (Web/Walk-in)", count: 1250, conversion: null },
    { stage: "Applications Submitted", count: 850, conversion: 68 },
    { stage: "Interviews/Assessments", count: 620, conversion: 73 },
    { stage: "Offers Extended", count: 450, conversion: 72 },
    { stage: "Enrolled", count: 380, conversion: 84 },
  ];

  const adminTasks = [
    { task: "Student Registration", avgTime: "12 mins", target: "15 mins", status: "optimal" },
    { task: "Fee Clearance", avgTime: "4 mins", target: "5 mins", status: "optimal" },
    { task: "Transcript Generation", avgTime: "24 hrs", target: "12 hrs", status: "suboptimal" },
    { task: "ID Card Issuance", avgTime: "48 hrs", target: "24 hrs", status: "suboptimal" },
    { task: "Leave Approval", avgTime: "6 hrs", target: "8 hrs", status: "optimal" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800">Operations & Admissions</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Track admission funnels and administrative processing efficiency.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex-1 sm:flex-none">
            <Filter className="w-4 h-4" /> Filter Term
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm flex-1 sm:flex-none">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Admissions Funnel */}
         <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">Admissions Funnel (Term 1, 2026)</h3>
            <p className="text-xs font-medium text-slate-500 mb-6">Tracking prospective student journey from inquiry to enrollment.</p>
            
            <div className="space-y-4">
               {admissionsFunnel.map((stage, i) => (
                  <div key={i} className="flex flex-col relative">
                     {/* Conversion Arrow (except for first item) */}
                     {i > 0 && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-full z-10 shadow-sm text-[10px] font-bold text-slate-500">
                           <ArrowRight className="w-3 h-3 text-emerald-500" /> {stage.conversion}% conversion
                        </div>
                     )}
                     
                     <div className="flex items-center gap-4 w-full">
                        <div className="w-32 text-right">
                           <div className="text-xs font-bold text-slate-600">{stage.stage}</div>
                        </div>
                        <div className="flex-1 bg-slate-100 rounded-full h-8 flex items-center relative overflow-hidden group">
                           {/* Simulated Funnel Width */}
                           <div 
                              className={`h-full transition-all flex items-center justify-end pr-4 ${
                                 i === 0 ? 'bg-indigo-200' :
                                 i === 1 ? 'bg-indigo-300' :
                                 i === 2 ? 'bg-indigo-400' :
                                 i === 3 ? 'bg-indigo-500' :
                                 'bg-indigo-600 text-white'
                              }`} 
                              style={{ width: `${(stage.count / admissionsFunnel[0].count) * 100}%` }}
                           >
                              <span className={`text-xs font-black ${i === 4 ? 'text-white' : 'text-indigo-900'}`}>{stage.count}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center bg-slate-50 p-4 rounded-xl">
               <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Overall Conversion Rate</div>
                  <div className="text-2xl font-black text-indigo-700">30.4%</div>
               </div>
               <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Cost per Acquisition (Est)</div>
                  <div className="text-xl font-bold text-slate-800">KSh 4,200</div>
               </div>
            </div>
         </div>

         {/* Admin Processing Times */}
         <div className="space-y-6">
            <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-6">
               <div className="flex justify-between items-center mb-6">
                  <div>
                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Administrative Processing KPIs</h3>
                     <p className="text-xs font-medium text-slate-500 mt-1">Average time taken vs internal SLA targets.</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                     <Clock className="w-5 h-5" />
                  </div>
               </div>

               <div className="space-y-4">
                  {adminTasks.map((task, i) => (
                     <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                        <div className="flex-1">
                           <div className="font-bold text-sm text-slate-800">{task.task}</div>
                           <div className="flex items-center gap-2 mt-1">
                              <Target className="w-3 h-3 text-slate-400" />
                              <span className="text-[10px] font-bold text-slate-500 uppercase">Target: {task.target}</span>
                           </div>
                        </div>
                        <div className="text-right flex items-center gap-4">
                           <div className={`font-black text-lg ${task.status === 'optimal' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {task.avgTime}
                           </div>
                           <div className={`w-2 h-2 rounded-full ${task.status === 'optimal' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-center shadow-sm">
                  <div className="text-3xl font-black text-emerald-700 mb-1">94%</div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800">SLA Compliance</div>
               </div>
               <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-center shadow-sm">
                  <div className="text-3xl font-black text-blue-700 mb-1">1,240</div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-blue-800">Tickets Resolved (MTD)</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
