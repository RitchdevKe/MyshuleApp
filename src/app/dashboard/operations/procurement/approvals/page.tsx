"use client";

import React from "react";
import { CheckCircle2, XCircle, AlertCircle, FileText, Download } from "lucide-react";

export default function ApprovalsPage() {
  const approvals = [
    { id: "PR-2024-1042", department: "IT & Technology", item: "MacBook Pro M3 (x5)", cost: "$12,500.00", requester: "David Kim", date: "Aug 11, 2024", budgetImpact: "High", withinBudget: true },
    { id: "PR-2024-1038", department: "Management", item: "Executive Chair Replacement", cost: "$600.00", requester: "Sarah Palmer", date: "Aug 02, 2024", budgetImpact: "Low", withinBudget: true },
    { id: "PR-2024-1044", department: "Operations", item: "New Delivery Van", cost: "$45,000.00", requester: "Michael Ochieng", date: "Aug 11, 2024", budgetImpact: "Critical", withinBudget: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
         <h2 className="text-lg font-black text-slate-800">Pending Your Approval</h2>
         <p className="text-sm font-bold text-slate-500">You have 3 requests awaiting authorization.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {approvals.map((req) => (
            <div key={req.id} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col md:flex-row">
               
               {/* Info Section */}
               <div className="p-6 md:w-2/3 border-b md:border-b-0 md:border-r border-slate-200/60 flex flex-col justify-between">
                  <div>
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{req.department}</p>
                           <h3 className="text-xl font-black text-slate-800">{req.item}</h3>
                        </div>
                        <div className="text-right">
                           <p className="text-2xl font-black text-primary-600">{req.cost}</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Request ID</p>
                           <p className="text-sm font-bold text-slate-700">{req.id}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Requester</p>
                           <p className="text-sm font-bold text-slate-700">{req.requester}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Submitted</p>
                           <p className="text-sm font-bold text-slate-700">{req.date}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Budget Impact</p>
                           <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${
                              req.budgetImpact === 'Critical' ? 'bg-rose-50 text-rose-600' :
                              req.budgetImpact === 'High' ? 'bg-amber-50 text-amber-600' :
                              'bg-emerald-50 text-emerald-600'
                           }`}>{req.budgetImpact}</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-4">
                     <button className="flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors">
                        <FileText className="w-4 h-4" /> View Full Request Details
                     </button>
                     <button className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors">
                        <Download className="w-4 h-4" /> Attached Quotes (3)
                     </button>
                  </div>
               </div>

               {/* Action Section */}
               <div className="p-6 md:w-1/3 bg-slate-50/50 flex flex-col justify-center gap-4">
                  <div className={`p-4 rounded-2xl border ${req.withinBudget ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                     <div className="flex gap-3">
                        <AlertCircle className={`w-5 h-5 shrink-0 ${req.withinBudget ? 'text-emerald-600' : 'text-rose-600'}`} />
                        <div>
                           <p className={`text-sm font-bold ${req.withinBudget ? 'text-emerald-800' : 'text-rose-800'}`}>
                              {req.withinBudget ? 'Within Q3 Budget Allocation' : 'Exceeds Q3 Budget Allocation'}
                           </p>
                           <p className={`text-xs font-medium mt-1 ${req.withinBudget ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {req.withinBudget ? 'This request can be accommodated within the current department budget.' : 'Approving this will require a budget override or reallocation.'}
                           </p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 mt-2">
                     <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-600/20">
                        <CheckCircle2 className="w-4 h-4" /> Approve Request
                     </button>
                     <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl font-bold text-sm transition-all shadow-sm">
                        <XCircle className="w-4 h-4" /> Reject & Return
                     </button>
                  </div>
               </div>

            </div>
         ))}
      </div>
    </div>
  );
}
