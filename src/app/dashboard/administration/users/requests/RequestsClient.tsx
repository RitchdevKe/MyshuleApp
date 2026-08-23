"use client";

import React, { useTransition } from "react";
import { Search, Unlock, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import { approveRequest, rejectRequest } from "@/app/actions/userManagement";
import { useRouter } from "next/navigation";

export default function RequestsClient({ initialRequests }: { initialRequests: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleAction = async (action: 'approve' | 'reject', id: string) => {
    startTransition(async () => {
      if (action === 'approve') await approveRequest(id);
      if (action === 'reject') await rejectRequest(id);
      router.refresh();
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
      <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
         <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search requests..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
         </div>
      </div>

      <div className={`divide-y divide-slate-100 transition-opacity ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
        {initialRequests.map((req) => (
          <div key={req.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-start gap-4">
                <div className={`mt-1 p-2.5 rounded-xl ${req.priority === 'HIGH' ? 'bg-rose-50 text-rose-600' : 'bg-primary-50 text-primary-600'}`}>
                   {req.priority === 'HIGH' ? <ShieldAlert className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                </div>
                <div>
                   <h4 className="font-bold text-slate-800 mb-1">{req.request}</h4>
                   <p className="text-xs text-slate-500 mb-2">{req.reason}</p>
                   <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                      <span className="font-bold text-slate-700">{req.user?.email}</span>
                      <span className="px-2 py-0.5 bg-slate-100 rounded-md uppercase tracking-wider text-[10px] font-black">{req.user?.tenantUsers?.[0]?.role?.name || "No Role"}</span>
                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                   </div>
                </div>
             </div>
             
             <div className="flex items-center gap-2 mt-2 md:mt-0">
                {req.status === 'PENDING' ? (
                  <>
                    <button onClick={() => handleAction('approve', req.id)} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-sm transition-colors shadow-emerald-500/20">
                       <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => handleAction('reject', req.id)} className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-sm transition-colors shadow-rose-500/20">
                       <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </>
                ) : (
                  <span className={`px-3 py-1.5 text-xs font-bold rounded-lg ${req.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {req.status}
                  </span>
                )}
             </div>
          </div>
        ))}
        {initialRequests.length === 0 && (
           <div className="p-12 text-center text-slate-500 font-medium text-sm">
              No pending access requests.
           </div>
        )}
      </div>
    </div>
  );
}
