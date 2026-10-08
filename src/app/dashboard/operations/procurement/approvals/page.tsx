import React from "react";
import { CheckCircle2, XCircle, AlertCircle, FileText, Download } from "lucide-react";
import { getPendingApprovals, getApprovalStats, approveRequest, rejectRequest } from "./actions";

export default async function ApprovalsPage() {
  const approvals = await getPendingApprovals();
  const stats = await getApprovalStats();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Approval</p>
            <p className="text-3xl font-black text-amber-600">{stats.pending}</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Approved</p>
            <p className="text-3xl font-black text-emerald-600">{stats.approved}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Rejected</p>
            <p className="text-3xl font-black text-rose-600">{stats.rejected}</p>
          </div>
          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
         <h2 className="text-lg font-black text-slate-800">Pending Your Approval</h2>
         <p className="text-sm font-bold text-slate-500">You have {stats.pending} requests awaiting authorization.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {approvals.map((req) => {
            const budgetImpact = req.amount > 20000 ? 'Critical' : req.amount > 5000 ? 'High' : 'Low';
            const withinBudget = req.amount <= 20000;

            return (
               <div key={req.id} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col md:flex-row">
                  
                  {/* Info Section */}
                  <div className="p-6 md:w-2/3 border-b md:border-b-0 md:border-r border-slate-200/60 flex flex-col justify-between">
                     <div>
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{req.department || 'General'}</p>
                              <h3 className="text-xl font-black text-slate-800">{req.description}</h3>
                           </div>
                           <div className="text-right">
                              <p className="text-2xl font-black text-primary-600">${req.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Request ID</p>
                              <p className="text-sm font-bold text-slate-700">{req.requestNumber}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Requester</p>
                              <p className="text-sm font-bold text-slate-700">{req.requestedBy}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Submitted</p>
                              <p className="text-sm font-bold text-slate-700">{new Date(req.createdAt).toLocaleDateString()}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Budget Impact</p>
                              <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${
                                 budgetImpact === 'Critical' ? 'bg-rose-50 text-rose-600' :
                                 budgetImpact === 'High' ? 'bg-amber-50 text-amber-600' :
                                 'bg-emerald-50 text-emerald-600'
                              }`}>{budgetImpact}</span>
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
                     <div className={`p-4 rounded-2xl border ${withinBudget ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                        <div className="flex gap-3">
                           <AlertCircle className={`w-5 h-5 shrink-0 ${withinBudget ? 'text-emerald-600' : 'text-rose-600'}`} />
                           <div>
                              <p className={`text-sm font-bold ${withinBudget ? 'text-emerald-800' : 'text-rose-800'}`}>
                                 {withinBudget ? 'Within Q3 Budget Allocation' : 'Exceeds Q3 Budget Allocation'}
                              </p>
                              <p className={`text-xs font-medium mt-1 ${withinBudget ? 'text-emerald-600' : 'text-rose-600'}`}>
                                 {withinBudget ? 'This request can be accommodated within the current department budget.' : 'Approving this will require a budget override or reallocation.'}
                              </p>
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex flex-col gap-2 mt-2">
                        <form action={approveRequest.bind(null, req.id)}>
                           <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-600/20">
                              <CheckCircle2 className="w-4 h-4" /> Approve Request
                           </button>
                        </form>
                        <form action={rejectRequest.bind(null, req.id)}>
                           <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 rounded-xl font-bold text-sm transition-all shadow-sm">
                              <XCircle className="w-4 h-4" /> Reject & Return
                           </button>
                        </form>
                     </div>
                  </div>
               </div>
            );
         })}
         
         {approvals.length === 0 && (
           <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-12 border border-slate-200/80 shadow-sm text-center">
             <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
             <h3 className="text-xl font-black text-slate-800">All caught up!</h3>
             <p className="text-slate-500 font-medium mt-2">There are no pending purchase requests awaiting your approval.</p>
           </div>
         )}
      </div>
    </div>
  );
}
